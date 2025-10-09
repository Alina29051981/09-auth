'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export interface NotePreviewData {
  id: string;
  title: string;
  content: string;
  tag?: string;
  createdAt?: string;
}

interface NotePreviewProps {
  note: NotePreviewData;
}

const NotePreview: React.FC<NotePreviewProps> = ({ note }) => {
  const router = useRouter();

  const handleViewDetails = () => {
router.push(`/@modal/(.)notes/${note.id}`);

  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8 }}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={handleViewDetails}>View Details</button>
    </div>
  );
};

export default NotePreview;
