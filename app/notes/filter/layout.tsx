import styles from './[...slug]/LayoutNotes.module.css';

interface NotesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarWidth?: string | number; 
  gap?: string | number;          
  height?: string | number;       
  sidebarBg?: string;             
  contentBg?: string;             
}

const NotesLayout = ({
  children,
  sidebar,
  sidebarWidth = '250px',
  gap = 16,
  height = '100vh',
  sidebarBg = '#333',
  contentBg = '#fff',
}: NotesLayoutProps) => {
  return (
    <section
      className={styles.container}
      style={{
        display: 'flex',
        gap,
        height,
      }}
    >
      <aside
        className={styles.sidebar}
        style={{
          flex: `0 0 ${sidebarWidth}`,
          background: sidebarBg,
          padding: 16,
          overflowY: 'auto',
          borderRight: '1px solid #ddd',
        }}
      >
        {sidebar}
      </aside>

      <div
        className={styles.notesWrapper}
        style={{
          flex: 1,
          padding: 16,
          overflowY: 'auto',
          background: contentBg,
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default NotesLayout;
