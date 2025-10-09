import type { ReactNode } from 'react';
import css from './LayoutNotes.module.css';

export default function FilterLayout({
  children,
  sidebar,
  modal,
}: {
  children: ReactNode;
  sidebar: ReactNode; 
  modal?: ReactNode;  
}) {
  return (
    <div className={css.wrapper}>
            {sidebar && <aside className={css.sidebar}>{sidebar}</aside>}

      <main className={css.main}>
        {children}
      </main>

      {modal && (
        <div className={css.modalWrapper}>
          {modal} 
        </div>
      )}
    </div>
  );
}
