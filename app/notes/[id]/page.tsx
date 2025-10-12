import { useRouter } from 'next/navigation';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '../../../lib/api';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const note = await fetchNoteById(params.id);

  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 100),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://08-zustand-seven-iota.vercel.app/notes/${params.id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
  };
}

interface NoteDetailsPageProps {
  params: { id: string };
}

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const router = useRouter();

  return (
    <NoteDetailsClient
      noteId={params.id}
      onClose={() => router.push('/notes/filter/All')}
    />
  );
}
