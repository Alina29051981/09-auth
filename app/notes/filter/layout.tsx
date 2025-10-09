// app/notes/filter/layout.tsx
import css from './@sidebar/SidebarNotes.module.css';

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <div
      className={css.container}
      style={{
        display: 'flex',       
        height: '100vh',        
        gap: 16,               
      }}
    >
    
      <div
        className={css.sidebar}
        style={{
          flex: '0 0 250px',   
          background: '#333',
          padding: 16,
          overflowY: 'auto',
          borderRight: '1px solid #ddd',
        }}
      >
        {sidebar}
      </div>

          <div
        className={css.content}
        style={{
          flex: 1,             
          padding: 16,
          overflowY: 'auto',
          background: '#fff',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default NotesLayout;
