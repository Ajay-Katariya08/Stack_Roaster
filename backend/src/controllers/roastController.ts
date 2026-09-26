import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Roast } from "../models/Roast";
import { fetchRepoStack, parseGitHubUrl } from "../services/github";
import { generateRoast } from "../services/llm";
import { parsePackageJson, parseRawStack } from "../services/parser";
import type { ParsedStack } from "../types";

const memoryRoasts: any[] = [];
export async function createRoast(req: Request, res: Response): Promise<void> {
  try {
    const { githubUrl, code, inputType } = req.body;

    let stackData: ParsedStack;

    if (inputType === "github" || (githubUrl && !code)) {
      if (!githubUrl) {
        res.status(400).json({ error: "Missing GitHub repository URL" });
        return;
      }
      const parsed = parseGitHubUrl(githubUrl);
      if (!parsed) {
        res.status(400).json({ error: "Invalid GitHub URL format" });
        return;
      }
      stackData = await fetchRepoStack(parsed.owner, parsed.repo);
    } else {
      if (!code || typeof code !== "string") {
        res.status(400).json({ error: "Missing code or package.json content" });
        return;
      }
      try {
        stackData = parsePackageJson(code);
      } catch {
        stackData = parseRawStack(code);
      }
    }

    const roast = await generateRoast(stackData);

    let savedRoastId: string = new mongoose.Types.ObjectId().toString();
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await (Roast as any).create({
          inputType: inputType || (githubUrl ? "github" : "paste"),
          githubUrl: githubUrl || undefined,
          stackData,
          roast,
        });
        savedRoastId = (doc as any)._id.toString();
      } catch (dbErr: any) {
        console.warn("DB save warning:", dbErr?.message);
      }
    }

    const memoryItem = {
      _id: savedRoastId,
      id: savedRoastId,
      inputType: inputType || (githubUrl ? "github" : "paste"),
      githubUrl: githubUrl || undefined,
      stackData,
      roast,
      shareCount: 0,
      viewCount: 0,
      upvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryRoasts.unshift(memoryItem);

    res.status(201).json({
      id: savedRoastId,
      stackData,
      roast,
    });
  } catch (err: any) {
    console.error("Roast Generation Error:", err?.message || err);
    res.status(500).json({
      error: "Failed to generate roast",
      message: err?.message || "Unknown error",
    });
  }
}

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalRoasts = await Roast.countDocuments();
      const agg = await Roast.aggregate([
        {
          $group: {
            _id: null,
            totalUpvotes: { $sum: "$upvotes" },
            totalViews: { $sum: "$viewCount" },
          },
        },
      ]);

      if (totalRoasts > 0) {
        res.json({
          totalRoasts,
          totalUpvotes: agg[0]?.totalUpvotes || 0,
          totalViews: agg[0]?.totalViews || 0,
        });
        return;
      }
    }

    const totalRoasts = memoryRoasts.length;
    const totalUpvotes = memoryRoasts.reduce(
      (acc, r) => acc + (r.upvotes || 0),
      0,
    );
    const totalViews = memoryRoasts.reduce(
      (acc, r) => acc + (r.viewCount || 0),
      0,
    );
    res.json({ totalRoasts, totalUpvotes, totalViews });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

export async function getRoastById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ error: "Invalid roast ID" });
      return;
    }

    if (
      mongoose.connection.readyState === 1 &&
      mongoose.Types.ObjectId.isValid(id)
    ) {
      const doc = await (Roast as any)
        .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
        .lean();

      if (doc) {
        res.json(doc);
        return;
      }
    }

    const item = memoryRoasts.find((r) => r._id === id || r.id === id);
    if (!item) {
      res.status(404).json({ error: "Roast not found" });
      return;
    }

    item.viewCount = (item.viewCount || 0) + 1;
    res.json(item);
  } catch {
    res.status(500).json({ error: "Failed to retrieve roast" });
  }
}

export async function getTopRoasts(req: Request, res: Response): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      const limit = Math.min(Number(req.query.limit) || 18, 50);
      const roasts = await (Roast as any)
        .find()
        .sort({ upvotes: -1, shareCount: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      if (roasts.length > 0) {
        res.json({ roasts });
        return;
      }
    }

    const sorted = [...memoryRoasts].sort(
      (a, b) => (b.upvotes || 0) - (a.upvotes || 0),
    );
    res.json({ roasts: sorted.slice(0, 18) });
  } catch {
    res.status(500).json({ error: "Failed to fetch top roasts" });
  }
}

export async function upvoteRoast(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ error: "Invalid roast ID" });
      return;
    }

    if (
      mongoose.connection.readyState === 1 &&
      mongoose.Types.ObjectId.isValid(id)
    ) {
      const doc = await (Roast as any)
        .findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true })
        .lean();

      if (doc) {
        res.json({ upvotes: (doc as any).upvotes });
        return;
      }
    }

    const item = memoryRoasts.find((r) => r._id === id || r.id === id);
    if (!item) {
      res.status(404).json({ error: "Roast not found" });
      return;
    }

    item.upvotes = (item.upvotes || 0) + 1;
    res.json({ upvotes: item.upvotes });
  } catch {
    res.status(500).json({ error: "Failed to upvote" });
  }
}

export async function incrementShare(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ error: "Invalid roast ID" });
      return;
    }

    if (
      mongoose.connection.readyState === 1 &&
      mongoose.Types.ObjectId.isValid(id)
    ) {
      const doc = await (Roast as any)
        .findByIdAndUpdate(id, { $inc: { shareCount: 1 } }, { new: true })
        .lean();

      if (doc) {
        res.json({ shareCount: (doc as any)?.shareCount || 0 });
        return;
      }
    }

    const item = memoryRoasts.find((r) => r._id === id || r.id === id);
    if (!item) {
      res.status(404).json({ error: "Roast not found" });
      return;
    }

    item.shareCount = (item.shareCount || 0) + 1;
    res.json({ shareCount: item.shareCount });
  } catch {
    res.status(500).json({ error: "Failed to record share" });
  }
}
