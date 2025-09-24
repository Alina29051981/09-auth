import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

type PaginationProps = {
  totalNumberOfPages: number; 
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ totalNumberOfPages, currentPage, onPageChange }) => {
  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={totalNumberOfPages} 
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel={'<'}
      nextLabel={'>'}
    />
  );
};

export default Pagination;
