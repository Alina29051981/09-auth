import TagsMenu from '../TagsMenu/TagsMenu';
import Link from 'next/link';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" >
        NoteHub
      </Link>
      <Link href="/notes/filter/All" className={css.navLink}>Notes</Link>
      <nav className={css.navigation}>
                              <TagsMenu />
                </nav>
    </header>
  );
  
}

