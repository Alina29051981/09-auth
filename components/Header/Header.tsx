import Link from 'next/link';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <nav className={css.navigation}>
        <Link href="/" className={css.navLink}>Home</Link>
        <Link href="/notes/filter/All" className={css.navLink}>Notes</Link>
      </nav>
    </header>
  );
}
