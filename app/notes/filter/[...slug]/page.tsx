import NotesClient from './Notes.client';
import { NOTE_TAGS, type NoteTag } from '../../../../types/note';
import '../../../globals.css'; 


type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

    let filterTag: NoteTag | 'All';
  if (!slug || slug.length === 0 || slug[0] === 'All') {
    filterTag = 'All';
  } else if (NOTE_TAGS.includes(slug[0] as NoteTag)) {
    filterTag = slug[0] as NoteTag;
  } else {
    filterTag = 'All';
  }

  return <div className="body">
             <NotesClient filterTag={filterTag} />
    </div>;
}
