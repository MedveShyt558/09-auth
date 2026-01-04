"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number; 
  totalPages: number;
  onPageChange: (page: number) => void; 
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={(event) => onPageChange(event.selected + 1)}
      nextLabel="Next"
      previousLabel="Prev"
      breakLabel="..."
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
