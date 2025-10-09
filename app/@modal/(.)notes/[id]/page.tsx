'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../../../components/Modal/Modal';
import NotePreview from '../../../../components/NotePreview/NotePreview';
import { fetchNoteById } from '../../../../lib/api';
import { Note } from '../../../../types/note';

interface NoteModalPageProps {
  params: { slug: string[] };
}

export default function NoteModalPage({ params }: NoteModalPageProps) {
  const { slug } = params;
  const noteId = slug[0];

  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (noteId) fetchNoteById(noteId).then(setNote);
  }, [noteId]);

  const handleClose = () => router.back();

  if (!note) return null;

  return (
    <Modal onClose={handleClose}>
      <NotePreview note={note} />
    </Modal>
  );
}
