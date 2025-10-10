'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Modal from '../../../../components/Modal/Modal';
import { fetchNoteById } from '../../../../lib/api';
import styles from './NotePreview.module.css';

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (isError) return <p className={styles.error}>Something went wrong. {error?.message}</p>;
  if (isLoading) return <p className={styles.loading}>Loading note...</p>;

  return (
    <Modal onClose={handleClose}>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.header}>
            <h2>{data?.title}</h2>
          </div>
          <p className={styles.content}>{data?.content}</p>
          <p className={styles.date}>Created date: {data?.createdAt}</p>
          <button className={styles.backBtn} onClick={handleClose}>
            Go back
          </button>
        </div>
      </div>
    </Modal>
  );
}
