"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NotePreview.module.css";

type Props = { id: string };

export default function NotePreview({ id }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (!id) return <p className={css.loading}>Loading...</p>;
  if (isLoading) return <p className={css.loading}>Loading...</p>;
  if (isError || !data) return <p className={css.error}>Error loading note</p>;

  return (
    <div className={css.container}>
      <h2 className={css.title}>{data.title}</h2>
      <p className={css.content}>{data.content}</p>
      <p className={css.tag}>{data.tag}</p>
    </div>
  );
}
