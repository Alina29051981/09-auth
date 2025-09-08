import React, { useTransition } from 'react';
import styles from './SearchBar.module.css';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

async function searchAction(formData: FormData) {
  const query = formData.get('query')?.toString().trim() ?? '';
  return query; 
}

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const [isPending, startTransition] = useTransition();

   const handleAction = async (formData: FormData) => {
    const query = await searchAction(formData);

    if (!query) {
      toast('Please enter your search query.');
      return;
    }

    startTransition(() => {
      onSubmit(query);
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleAction}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
         <button className={styles.button} type="submit" disabled={isPending}>
  Search
</button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;