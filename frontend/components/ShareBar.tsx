"use client";

import { useState } from "react";
import { Copy, Check, ThumbsUp, MessageSquare } from "lucide-react";
import { XIcon, LinkedinIcon } from "./Icons";
import { recordShare, upvoteRoast } from "@/lib/api";
import { RoastOutput } from "@/lib/types";

type ShareBarProps = {
  roastId: string;
  roast: RoastOutput;
  repoName?: string;
};

export function ShareBar({ roastId, roast }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/roast/${roastId}`
      : `https://roastmystack.dev/roast/${roastId}`;

  const tweetText = `AI just destroyed my tech stack with zero mercy 🔥\n\n"${roast.headline}"\n\nRoast Score: ${roast.roastScore}/100 [Archetype: ${roast.archetypeEmoji} ${roast.archetype}]\n\nGet roasted here:`;

  const handleTwitterShare = () => {
    recordShare(roastId);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = () => {
    recordShare(roastId);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleRedditShare = () => {
    recordShare(roastId);
    const title = `AI roasted my tech stack: "${roast.headline}" (${roast.roastScore}/100)`;
    const url = `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      recordShare(roastId);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    setHasUpvoted(true);
    setUpvotes((prev) => prev + 1);
    await upvoteRoast(roastId);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/70 p-4 shadow-md dark:shadow-xl backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center gap-2">
        <button
          onClick={handleUpvote}
          disabled={hasUpvoted}
          className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
            hasUpvoted
              ? "border-orange-500/50 bg-orange-500/20 text-orange-600 dark:text-orange-400"
              : "border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/30 hover:text-black dark:hover:text-white"
          }`}
        >
          <ThumbsUp
            className={`size-3.5 ${hasUpvoted ? "fill-orange-500 dark:fill-orange-400" : ""}`}
          />
          <span>{hasUpvoted ? "Upvoted!" : "Savage"}</span>
          {upvotes > 0 && (
            <span className="ml-1 text-orange-500">+{upvotes}</span>
          )}
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all hover:border-zinc-400 dark:hover:border-white/20 hover:text-black dark:hover:text-white"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">
                Link Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-1 hidden text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:inline">
          Share your shame:
        </span>

        <button
          onClick={handleTwitterShare}
          className="flex size-9 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 transition-all hover:bg-sky-500/20"
          title="Share to X (Twitter)"
        >
          <XIcon className="size-4" />
        </button>

        <button
          onClick={handleLinkedInShare}
          className="flex size-9 items-center justify-center rounded-lg border border-blue-600/30 bg-blue-600/10 text-blue-600 dark:text-blue-400 transition-all hover:bg-blue-600/20"
          title="Share to LinkedIn"
        >
          <LinkedinIcon className="size-4" />
        </button>

        <button
          onClick={handleRedditShare}
          className="flex size-9 items-center justify-center rounded-lg border border-orange-600/30 bg-orange-600/10 text-orange-600 dark:text-orange-400 transition-all hover:bg-orange-600/20"
          title="Share to r/ProgrammerHumor"
        >
          <MessageSquare className="size-4" />
        </button>
      </div>
    </div>
  );
}
