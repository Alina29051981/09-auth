import { use } from 'react';
import { useRouter } from 'next/navigation';
import NoteDetailsClient from './NoteDetails.client';
import { type Metadata } from 'next';
import { getNoteById } from '../../../lib/api';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const note = await getNoteById(params.id);
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
        },],
      type: 'article',
    },
  };
}

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = use(params); 
  const router = useRouter();

  return (
    <NoteDetailsClient
      noteId={id}
      onClose={() => router.push('/notes/filter/All')}
    />
  );
}
