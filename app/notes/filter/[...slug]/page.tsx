import type { Metadata } from "next";
import NotesClient from "./Notes.client";

type Props = {
  params?: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params?.slug ?? ["all"];
  const category = slug[0] === "all" ? "all notes" : slug[0];

  return {
    title: `Notes: ${category} | NoteHub`,
    description: `Browse notes filtered by ${category}`,
    openGraph: {
      title: `Notes: ${category} | NoteHub`,
      description: `Browse notes filtered by ${category}`,
      url: `https://notehub.vercel.app/notes/filter/${slug.join("/")}`,
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

export default function FilteredNotesPage({ params }: Props) {
  const slug = params?.slug ?? ["all"];
  const category = slug[0] === "all" ? undefined : slug[0];
  return <NotesClient tag={category} />;
}
