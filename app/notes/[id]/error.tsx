'use client';
import { useEffect } from 'react';

export default function NoteDetailsError({ error }: { error: Error }) {
  useEffect(() => console.error(error), [error]);
  return <p>Could not fetch note details. {error.message}</p>;
}
