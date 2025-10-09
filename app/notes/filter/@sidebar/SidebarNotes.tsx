'use client';

import Link from 'next/link';
import css from './SidebarNotes.module.css';
import { NOTE_TAGS, type NoteTag } from '../../../../types/note';

interface SidebarNotesProps {
  activeTag?: NoteTag | 'All';
}

export default function SidebarNotes({ activeTag }: SidebarNotesProps) {
  return (
    <nav className={css.sidebar} aria-label="Notes Tags">
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link
            href="/notes/filter/All"
            className={`${css.menuLink} ${activeTag === 'All' ? css.active : ''}`}
          >
            All
          </Link>
        </li>

        {NOTE_TAGS.map(tag => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={`/notes/filter/${tag}`}
              className={`${css.menuLink} ${activeTag === tag ? css.active : ''}`}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
