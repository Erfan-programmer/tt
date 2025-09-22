"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VscTriangleDown } from "react-icons/vsc";
import { apiRequest } from "@/libs/api";

interface Category {
  id: string;
  title: string;
}

interface BlogCategoriesResponse {
  data: Category[];
  lastPage: number;
}

interface CategoryDropdownProps {
  selectedCategoryId: string;
  initialTitle?: string;
  onChange: (id: string, title: string) => void;
  readonly?: boolean;
}

export default function CategoryDropdown({
  selectedCategoryId,
  initialTitle,
  onChange,
  readonly = false,
}: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async (pageNum: number = 1) => {
    if (loading || (lastPage && pageNum > lastPage)) return;
    setLoading(true);
    const res = await apiRequest<BlogCategoriesResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/blogCategory?page=${pageNum}`
    );
    setLoading(false);
    if (res.success && res.data) {
      setCategories((prev) =>
        pageNum === 1 ? res.data.data : [...prev, ...(res.data?.data || [])]
      );
      setLastPage(res.data.lastPage);
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = () => {
    if (readonly) return;
    setDropdownOpen((prev) => !prev);

    if (!dropdownOpen && categories.length === 0) {
      setPage(1);
      fetchCategories(1);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (readonly) return;
    const target = e.currentTarget;
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 5 &&
      page < lastPage &&
      !loading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCategories(nextPage);
    }
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-white mb-2 text-md font-medium">Category</label>
      <div
        className={`flex justify-between items-center p-2 px-2 mt-2 border-[1px] border-[#383C47] bg-[#1f1f1f] rounded-xl cursor-pointer text-md text-white ${
          readonly ? "cursor-not-allowed opacity-70" : ""
        }`}
        onClick={handleDropdownClick}
      >
        <span>
          {selectedCategory?.title || initialTitle || "Select Category"}
        </span>
        <VscTriangleDown
          className={`transition-transform text-white text-xl mt-2 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {dropdownOpen && !readonly && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            onScroll={handleScroll}
            className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-[#1F2937] border border-[#555] rounded-[.5rem] shadow-lg"
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                onClick={() => {
                  onChange(category.id, category.title);
                  setDropdownOpen(false);
                }}
              >
                {category.title}
              </div>
            ))}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
