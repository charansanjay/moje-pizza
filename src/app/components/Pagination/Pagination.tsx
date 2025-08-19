import styles from './Pagination.module.css';

import React from 'react';

import { scrollToTop } from '../../utils/scrollToTop.ts';

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageChange(Number(e.target.value));
    scrollToTop();
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => {
          onPageChange(currentPage - 1);
          scrollToTop();
        }}
        disabled={isFirstPage}
      >
        Previous
      </button>

      <div className={styles.pageSelector}>
        <span>Page</span>
        <select
        data-testid='select_pagination'
          value={currentPage}
          onChange={handlePageSelect}
          className={styles.select}
          size={1} // Makes it scrollable
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <span>of {totalPages}</span>
      </div>

      <button
        className={styles.button}
        onClick={() => {
          onPageChange(currentPage + 1);
          scrollToTop();
        }}
        disabled={isLastPage}
      >
        Next
      </button>
    </div>
  );
};
