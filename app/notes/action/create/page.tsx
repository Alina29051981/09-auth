import NoteForm from '../../../../components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata = {
  title: 'Create Note - NoteHub',
  description: 'Create a new note in NoteHub',
  url: 'https://08-zustand-seven-iota.vercel.app/notes/action/create',
  openGraph: {
    title: 'Create Note - NoteHub',
    description: 'Create a new note in NoteHub',
    url: 'https://08-zustand-seven-iota.vercel.app/notes/action/create',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      type: 'website',
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
