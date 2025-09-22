"use client"
import React from 'react';
import { Pagination as MUIPagination, PaginationItem } from '@mui/material';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import './Pagination.css';

const NextButton = () => (
  <div className="flex items-center justify-center gap-2">
    <span className="text-white transition-colors duration-300">Next</span>
    <FaArrowRight className="w-5 h-5 text-[var(--primary-color)] transition-colors duration-300" />
  </div>
);

const BackButton = () => (
  <div className="flex items-center justify-center gap-2">
    <FaArrowLeft className="w-5 h-5 text-[var(--primary-color)] transition-colors duration-300" />
    <span className="text-white transition-colors duration-300">Back</span>
  </div>
);

interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function Pagination({ count, page, onChange }: PaginationProps) {
  return (
    <div className="pagination-container">
      <MUIPagination
        count={count}
        page={page}
        onChange={onChange}
        showFirstButton={false}
        showLastButton={false}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: BackButton,
              next: NextButton,
            }}
            {...item}
            className={item.type === 'previous' || item.type === 'next' ? 'pagination-btn' : ''}
          />
        )}
      />
    </div>
  );
} 