import type { Metadata } from "next";
import NotePreview from "@/components/NotePreview/NotePreview";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Note details | NoteHub",
    description: "View note details",
    openGraph: {
      title: "Note details | NoteHub",
      description: "View note details",
      url: `https://notehub.vercel.app/notes/${id}`,
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

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  return <NotePreview id={id} />;
}
