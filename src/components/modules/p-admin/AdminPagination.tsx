"use client";
import React from "react";

interface AdminPaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({ currentPage, lastPage, onPageChange }: AdminPaginationProps) {
  const pages = [];
  for (let i = 1; i <= lastPage; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-2 mt-4 text-white">
      <button className="px-4 py-1 border rounded disabled:opacity-50" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      {pages.map(p => (
        <button key={p} className={`px-4 py-1 border rounded ${p === currentPage ? "bg-blue-500 text-white" : ""}`} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button className="px-4 py-1 border rounded disabled:opacity-50" disabled={currentPage >= lastPage} onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  );
}
