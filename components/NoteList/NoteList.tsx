"use client";

import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.refresh();
    },
  });
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <div className={css.footer}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.tag}>{note.tag}</p>
          </div>

          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <button
              type="button"
              className={css.link}
              onClick={() => router.push(`/notes/${note.id}`)}
            >
              View details
            </button>

            <button
              type="button"
              className={css.button}
              disabled={isPending}
              onClick={() => mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
