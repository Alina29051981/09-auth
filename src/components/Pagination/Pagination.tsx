import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

type Props = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const PaginationComp: React.FC<Props> = ({ pageCount, currentPage, onPageChange }) => {
  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={pageCount}
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel={'<'}
      nextLabel={'>'}
    />
  );
};

export default PaginationComp;
