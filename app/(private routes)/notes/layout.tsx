import type { ReactNode } from "react";
import Link from "next/link";
import css from "./LayoutNotes.module.css";

type Props = {
  children: ReactNode;
};

export default function NotesLayout({ children }: Props) {
  return (
    <section className={css.section}>
      <aside className={css.sidebar}>
        <nav className={css.nav}>
          <Link href="/notes/filter/all" className={css.link}>
            All
          </Link>
          <Link href="/notes/filter/todo" className={css.link}>
            Todo
          </Link>
          <Link href="/notes/filter/work" className={css.link}>
            Work
          </Link>
          <Link href="/notes/filter/personal" className={css.link}>
            Personal
          </Link>
          <Link href="/notes/filter/idea" className={css.link}>
            Idea
          </Link>
        </nav>
      </aside>
      <div className={css.content}>{children}</div>
    </section>
  );
}
