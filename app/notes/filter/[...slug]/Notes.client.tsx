"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import css from "./Notes.client.module.css";

type Props = {
  tag?: string;
};

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useMemo(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search, 400);

  const perPage = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { page, perPage, search: debouncedSearch, tag }],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch, tag }),
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p className={css.status}>Loading...</p>}
      {isError && <p className={css.status}>Error loading notes</p>}

      {!isLoading && !isError && <NotesList notes={notes} />}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
