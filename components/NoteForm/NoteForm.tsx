'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '../../lib/noteStore';
import { NOTE_TAGS } from '../../types/note';
import css from './NoteForm.module.css';
import { createNote } from '../../lib/api';
import toast from 'react-hot-toast';

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value } as Partial<typeof draft>);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createNote(draft);
      toast.success('Note created successfully!');
      clearDraft();
      router.back();
    } catch {
      toast.error('Failed to create note');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form
      className={css.form}
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
      }}
    >
     
      <div className={css.formGroup} style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="title" style={{ fontSize: '18px', marginBottom: '4px' }}>Title</label>
        <input
          id="title"
          name="title"
          value={draft.title}
          onChange={handleChange}
          required
          style={{ fontSize: '16px', padding: '8px', width: '100%' }}
        />
      </div>

      <div className={css.formGroup} style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="content" style={{ fontSize: '18px', marginBottom: '4px' }}>Content</label>
        <textarea
          id="content"
          name="content"
          value={draft.content}
          onChange={handleChange}
          style={{ fontSize: '16px', padding: '8px', width: '100%', height: '120px' }}
        />
      </div>

      <div className={css.formGroup} style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="tag" style={{ fontSize: '18px', marginBottom: '4px' }}>Tag</label>
        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          style={{ fontSize: '16px', padding: '8px', width: '100%' }}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions} style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          style={{ fontSize: '16px', padding: '8px 16px' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          style={{ fontSize: '16px', padding: '8px 16px' }}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
