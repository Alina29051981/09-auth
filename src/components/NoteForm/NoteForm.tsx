import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { useCreateNote } from '../../hooks/useNotes';
import { NoteTag, NOTE_TAGS } from '../../types/note';
import { useQueryClient } from '@tanstack/react-query';

const schema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required('Required'),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>().oneOf(NOTE_TAGS).required('Required'),
});

export interface NoteFormProps {
  onClose?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const createMut = useCreateNote();

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as NoteTag }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        createMut.mutate(values, {
          onSuccess: () => {
           
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose?.();
            setSubmitting(false);
          },
          onError: (err) => {
            console.error(err);
            setSubmitting(false);
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <div className={css.error}><ErrorMessage name="title" /></div>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <div className={css.error}><ErrorMessage name="content" /></div>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {NOTE_TAGS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </Field>
            <div className={css.error}><ErrorMessage name="tag" /></div>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={() => onClose?.()}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting || createMut.isPending}>
              {createMut.isPending ? 'Saving...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
