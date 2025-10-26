import fetchNotes from '../../../../../lib/api/serverApi';
import NotesClient from './Notes.client';
import styles from './NotesPage.module.css';
import { NoteTag } from '../../../../../types/note';
import { type Metadata } from 'next';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params; 

  const [filter, readableFilter] =
    Array.isArray(slug) && slug.length > 0
      ? [slug.join('/'), slug.join(' ')]
      : ['All', 'All'];

  return {
    title: `Notes - ${readableFilter}`,
    description: `Filtered notes by ${readableFilter}`,
    openGraph: {
      title: `Notes - ${readableFilter}`,
      description: `Filtered notes by ${readableFilter}`,
      type: 'article',
      url: `https://09-auth-rho-two.vercel.app/notes/filter/${filter}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      siteName: '09-auth',
    },
  };
}

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ page?: string; search?: string }>;
}

export default async function NotesFilterPage({
  params,
  searchParams,
}: NotesFilterPageProps) {
  
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};

  const tag = slug?.[0] ?? 'All';

  function isValidTag(t: string): t is 'All' | NoteTag {
    return ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'].includes(t);
  }

  const filterTag: 'All' | NoteTag = isValidTag(tag) ? tag : 'All';
  const page = Number(sp?.page ?? 1);
  const perPage = 10;
  const search = sp?.search ?? '';

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag: filterTag, page, perPage, search }],
    queryFn: () =>
      fetchNotes(search, page, filterTag === 'All' ? undefined : filterTag),
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
