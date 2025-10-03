'use client';

import { useRouter } from 'next/navigation';
import NoteDetailsClient from './NoteDetails.client';
import * as React from 'react';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>; 
}

export default function NoteDetailsPage({ params: paramsPromise }: NoteDetailsPageProps) {
   const params = React.use(paramsPromise);
  const { id } = params;

  const router = useRouter();

  return (
    <NoteDetailsClient
      id={id}
      onClose={() => router.push('/notes')}
    />
  );
}
