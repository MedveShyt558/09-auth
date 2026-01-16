"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.client.module.css";

type Props = { id: string };

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

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
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <button type="button" className={css.closeBtn} onClick={() => router.back()}>
          Close
        </button>

        <h2 className={css.title}>{data.title}</h2>
        <p className={css.content}>{data.content}</p>
        <p className={css.tag}>{data.tag}</p>

        {data.createdAt && (
          <p className={css.date}>{new Date(data.createdAt).toLocaleString()}</p>
        )}
      </div>
    </Modal>
  );
}
