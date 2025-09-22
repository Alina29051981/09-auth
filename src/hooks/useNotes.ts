import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotes,
  createNote,
  deleteNote,
  FetchNotesParams,
  FetchNotesResponse,
  CreateNoteDTO,
} from '../services/noteService';
import { Note } from '../types/note';

export const useNotes = (params: FetchNotesParams) => {
  return useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', params.page, params.perPage, params.search],
    queryFn: () => fetchNotes(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: undefined,
  });
};

export const useCreateNote = () => {
  const qc = useQueryClient();

  return useMutation<Note, Error, CreateNoteDTO>({
    mutationFn: createNote,
    onSuccess: () => {
  
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteNote = () => {
  const qc = useQueryClient();

  return useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
    
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
