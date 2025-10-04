import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchNotes, FetchNotesParams } from '../../lib/api';
import TanStackProvider from '../../components/TanStackProvider/TanStackProvider';
import NotesClient from './Notes.client';

interface NotesPageProps {
  searchParams?: { page?: string; search?: string } | Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage(props: NotesPageProps) {
  
  const sp = await props.searchParams;
  const page = Number(sp?.page ?? 1);
  const perPage = 10;
  const search = sp?.search ?? '';

  const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, FetchNotesParams];
      return fetchNotes(params);
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanStackProvider dehydratedState={dehydratedState}>
      <NotesClient />
    </TanStackProvider>
  );
}
