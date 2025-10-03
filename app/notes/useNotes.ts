import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote, FetchNotesParams, FetchNotesResponse } from '../../lib/api';
import { Note, CreateNoteDTO } from '../../lib/types/note';

export const useNotes = (params: FetchNotesParams) => {
  return useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', params.page, params.perPage, params.search],
    queryFn: () => fetchNotes(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};

export const useCreateNote = (params?: FetchNotesParams) => {
  const qc = useQueryClient();
  return useMutation<Note, Error, CreateNoteDTO>({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['notes', params?.page ?? 1, params?.perPage ?? 10, params?.search ?? ''],
      });
    },
  });
};

export const useDeleteNote = (params?: FetchNotesParams) => {
  const qc = useQueryClient();
  return useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['notes', params?.page ?? 1, params?.perPage ?? 10, params?.search ?? ''],
      });
    },
  });
};
