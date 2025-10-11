import Link from 'next/link';
import styles from './SidebarNotes.module.css';
import { type NoteTag } from '../../../../types/note';

interface SidebarNotesProps {
  activeTag?: NoteTag | 'All';
}

const TAGS_LIST: (NoteTag | 'All')[] = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function SidebarNotes({ activeTag = 'All' }: SidebarNotesProps) {
  return (
    <nav className={styles.sidebar} aria-label="Notes Tags">
      <ul className={styles.menuList}>
        {TAGS_LIST.map((tag) => (
          <li key={tag} className={styles.menuItem}>
            <Link
              href={`/notes/filter/${tag}`}
              className={`${styles.menuLink} ${activeTag === tag ? styles.active : ''}`}
            >
              {tag === 'All' ? 'All Notes' : tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
