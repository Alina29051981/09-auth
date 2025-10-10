import NotesClient from './Notes.client';
import { NOTE_TAGS, type NoteTag } from '../../../../types/note';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import '../../../globals.css';

interface NotesPageProps {
  params: { slug: string[] };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = params;

  const filterTag: NoteTag | 'All' =
    !slug || slug.length === 0 || slug[0] === 'All'
      ? 'All'
      : NOTE_TAGS.includes(slug[0] as NoteTag)
      ? (slug[0] as NoteTag)
      : 'All';

  const queryClient = new QueryClient();

   await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', filterTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 5,
        tag: filterTag === 'All' ? undefined : filterTag,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <NotesClient filterTag={filterTag} dehydratedState={dehydratedState} />
  );
}
