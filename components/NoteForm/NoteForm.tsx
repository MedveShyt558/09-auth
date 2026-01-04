"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  useEffect(() => {
    if (!draft) {
      setDraft({ title: "", content: "", tag: "Todo" });
    }
  }, [draft, setDraft]);

  const handleSubmit = async (formData: FormData) => {
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    await createNote({ title, content, tag });

    clearDraft();
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
    router.back();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <input
        className={css.input}
        name="title"
        value={draft.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />

      <textarea
        className={css.textarea}
        name="content"
        value={draft.content}
        onChange={handleChange}
        placeholder="Content"
        required
      />

      <select className={css.select} name="tag" value={draft.tag} onChange={handleChange}>
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Idea">Idea</option>
      </select>

      <div className={css.actions}>
        <button type="submit" className={css.submit}>
          Create
        </button>

        <button type="button" className={css.cancel} onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
