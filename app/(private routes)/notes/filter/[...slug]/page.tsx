import type { Metadata } from "next";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const safeSlug = slug ?? ["all"];
  const category = safeSlug[0] === "all" ? "all notes" : safeSlug[0];

  return {
    title: `Notes: ${category} | NoteHub`,
    description: `Browse notes filtered by ${category}`,
    openGraph: {
      title: `Notes: ${category} | NoteHub`,
      description: `Browse notes filtered by ${category}`,
      url: `https://notehub.vercel.app/notes/filter/${safeSlug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const safeSlug = slug ?? ["all"];
  const tag = safeSlug[0] === "all" ? undefined : safeSlug[0];

  return <NotesClient tag={tag} />;
}
