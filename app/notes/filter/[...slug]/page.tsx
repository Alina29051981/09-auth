import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes, FetchNotesParams } from '../../../../lib/api';
import NotesClient from './Notes.client';
import styles from './Notes.module.css';
import { NoteTag } from '../../../../types/note';

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ page?: string; search?: string }>;
}

export default async function NotesFilterPage({ params, searchParams }: NotesFilterPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  // Отримуємо тег з URL, за замовчуванням 'All'
  const tag = slug?.[0] ?? 'All';

  // Type guard для перевірки валідності тегу
  function isValidTag(t: string): t is 'All' | NoteTag {
    return ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'].includes(t);
  }

  const filterTag: 'All' | NoteTag = isValidTag(tag) ? tag : 'All';

  // Параметри пагінації і пошуку
  const page = Number(sp?.page ?? 1);
  const perPage = 10;
  const search = sp?.search ?? '';

  // Prefetch даних на сервері
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag: filterTag, page, perPage, search }],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, FetchNotesParams];
      return fetchNotes(params);
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={styles.wrapper}>
      <HydrationBoundary state={dehydratedState}>
        <NotesClient filterTag={filterTag} />
      </HydrationBoundary>
    </div>
  );
}
