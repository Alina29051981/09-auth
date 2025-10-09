'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import NoteDetailsClient from './NoteDetails.client';

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
