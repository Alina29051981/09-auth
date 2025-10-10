import { fetchNoteById } from '../../../../lib/api';
import NotePreviewClient from './NotePreview.client';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
import styles from './NotePreview.module.css';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

  export default async function NotePage({ params }: NotePageProps) {
 const { id } = await params; 

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <div className={styles.wrapper}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotePreviewClient />
      </HydrationBoundary>
    </div>
  );
}
