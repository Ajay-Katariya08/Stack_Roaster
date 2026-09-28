import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { RoastCard } from "@/components/RoastCard";
import { fetchRoastById } from "@/lib/api";
import { Flame, ArrowLeft, Trophy } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const record = await fetchRoastById(id);

  if (!record) {
    return {
      title: "Roast Not Found | Roast My Stack",
      description: "This stack roast does not exist.",
    };
  }

  const headline = record.roast.headline;
  const score = record.roast.roastScore;
  const archetype = record.roast.archetype;
  const emoji = record.roast.archetypeEmoji;

  const ogUrl = `/api/og?score=${score}&archetype=${encodeURIComponent(archetype)}&emoji=${encodeURIComponent(emoji)}&headline=${encodeURIComponent(headline)}`;

  return {
    title: `Roast Score: ${score}/100 - ${archetype} | Roast My Stack`,
    description: headline,
    openGraph: {
      title: `Roasted My Tech Stack (${score}/100)`,
      description: headline,
      url: `/roast/${id}`,
      type: "website",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: headline,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Roasted My Tech Stack (${score}/100)`,
      description: headline,
      images: [ogUrl],
    },
  };
}

export default async function RoastDetailPage({ params }: PageProps) {
  const { id } = await params;
  const record = await fetchRoastById(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />

      <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-10 sm:px-6">
        <div className="mb-6 flex w-full max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Roast Your Own Stack
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/hall-of-fame?highlight=${id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <Trophy className="size-3.5" />
              <span>Hall of Flame</span>
            </Link>
            <span className="text-xs text-zinc-500 font-mono">
              ID: {id.slice(0, 8)}
            </span>
          </div>
        </div>

        <RoastCard roastId={id} stack={record.stackData} roast={record.roast} />

        <div className="mt-12 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Think your stack is better?
          </h3>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Submit your GitHub repository or package.json to test your developer
            ego.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110"
          >
            <Flame className="size-4" />
            Get Your Stack Roasted
          </Link>
        </div>
      </main>
    </div>
  );
}
