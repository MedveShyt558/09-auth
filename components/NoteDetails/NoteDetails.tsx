import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

type Props = {
  note: Note;
};

export default function NoteDetails({ note }: Props) {
  return (
    <article className={css.container}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      <p className={css.tag}>{note.tag}</p>
    </article>
  );
}
