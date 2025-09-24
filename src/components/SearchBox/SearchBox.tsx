import React from 'react';
import css from './SearchBox.module.css';

export interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}



const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => (
  <input
    className={css.input}
    type="text"
    placeholder="Search notes"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchBox;
