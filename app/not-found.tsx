import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "The page you are looking for does not exist",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "The page you are looking for does not exist",
    url: "https://notehub.vercel.app/404",
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

export default function NotFound() {
  return (
    <main>
      <h1>404 - Page not found</h1>
      <Link href="/">Go home</Link>
    </main>
  );
}
