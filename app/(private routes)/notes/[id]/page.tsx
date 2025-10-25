import type { Metadata } from 'next';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '../../../../lib/api/serverApi';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const note = await fetchNoteById(params.id);

  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 100),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://09-auth-rho-two.vercel.app/notes/${params.id}`,
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

export default function NotePage({ params }: PageProps) {
  return <NoteDetailsClient noteId={params.id} />;
}
