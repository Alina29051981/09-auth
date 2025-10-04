import React from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import css from './Pagination.module.css';
interface PaginationProps {
  totalNumberOfPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalNumberOfPages,
  currentPage,
  onPageChange,
}) => {
   const handlePageChange: ReactPaginateProps['onPageChange'] = (selectedItem) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={totalNumberOfPages}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel={'<'}
      nextLabel={'>'}
    />
  );
};

export default Pagination;
