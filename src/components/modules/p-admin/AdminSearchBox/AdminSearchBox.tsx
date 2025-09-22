"use client";
import React, { useState, useRef, useEffect } from "react";
import { VscTriangleDown } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import CustomAdminInput from "../CustomAdminInput";

interface SearchFilterOption {
  label: string;
  value: string;
  placeholder?: string;
}

interface AdminSearchBoxProps {
  title?: string;
  filterOptions: SearchFilterOption[];
  onSearch: (filterValue: string, inputValue: string) => void;
  onClear?: () => void;
}

export default function AdminSearchBox({
  title,
  filterOptions,
  onSearch,
  onClear,
}: AdminSearchBoxProps) {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleSearch = () => onSearch(selectedFilter.value, inputValue);
  const handleClear = () => {
    setSelectedFilter(filterOptions[0]);
    setInputValue("");
    onClear?.();
  };

  const isSearchDisabled = !selectedFilter || inputValue.trim() === "";

  return (
    <div className="admin-transaction-search-box-container w-full mx-auto mt-10">
      {title && <p className="text-white mb-2 font-semibold">{title}</p>}
      <div className="admin-transaction-search-box-content border-2 border-[#383C47] rounded-xl p-4 sm:p-6 flex flex-wrap xl:flex-nowrap items-start sm:items-center justify-start md:justify-between gap-4 ">
        <div className="flex items-center gap-4 w-full flex-wrap">
          {/* Dropdown */}
          <div className="relative w-full sm:w-64" ref={dropdownRef}>
            <label className="text-white mb-2 text-md font-medium">Select Filter</label>
            <div
              className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{selectedFilter.label}</span>
              <VscTriangleDown className={`transition-transform text-white text-xl ${dropdownOpen ? "rotate-180" : ""}`} />
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
                >
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                      onClick={() => {
                        setSelectedFilter(option);
                        setDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className=" w-full sm:w-auto xl:w-72">
            <CustomAdminInput
              title={selectedFilter.placeholder || "Enter Value"}
              value={inputValue}
              onChange={setInputValue}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full flex-wrap xl:flex-nowrap sm:w-auto mt-6">
          <button
            onClick={handleSearch}
            className={`titan-btn !rounded-md flex-1 sm:flex-none ${isSearchDisabled ? "opacity-50 !bg-gray-400 cursor-not-allowed" : ""}`}
            disabled={isSearchDisabled}
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className=" bg-[#D7FE63] px-[3rem] py-[.5rem] !rounded-md flex-1 sm:flex-none"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
