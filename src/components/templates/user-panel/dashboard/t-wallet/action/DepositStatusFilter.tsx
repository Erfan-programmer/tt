"use client";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const statusOptions = [
  { id: "all", label: "All Transactions", abbreviations: ["all", "transaction", "all transactions"] },
  { id: "paid", label: "Paid", abbreviations: ["paid", "success", "done", "completed"] },
  { id: "unpaid", label: "Unpaid", abbreviations: ["unpaid", "pending", "wait", "not paid"] },
  { id: "expired", label: "Expired", abbreviations: ["expired", "timeout", "expire"] },
];

interface DepositStatusFilterProps {
  value?: string;
  onChange: (val: string) => void;
}

export default function DepositStatusFilter({ value = "all", onChange }: DepositStatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = statusOptions?.filter((option) => {
    const searchTermLower = searchTerm.toLowerCase();
    return option.label.toLowerCase().includes(searchTermLower)
      || option.abbreviations.some((abbr) => abbr.toLowerCase().includes(searchTermLower));
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = statusOptions.find((option) => option.id === value) || statusOptions[0];

  return (
    <div className="custom-input-form min-w-[20vw] w-full sm:w-fit relative" ref={dropdownRef}>
      <div
        className={`titan-input-custom-container text-[var(--dark-color)] dark:text-white rounded-[1.5rem] cursor-pointer mt-2 ${
          isOpen ? "titan-input-custom-container-focus" : "border-standard"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[var(--dark-color)] dark:text-white">{selectedOption.label}</span>
        </div>
        <IoIosArrowDown
          className={`w-6 h-6 text-[var(--dark-color)] dark:text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 right-0 mt-1 z-50"
          >
            <div className="bg-[#d9d9d9] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
              <div className="p-3 border-b-2 border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#ffff] dark:bg-[#192879] text-[var(--dark-color)] dark:text-white px-4 py-2 pr-10 rounded-lg outline-none"
                    placeholder="Search status..."
                    onClick={(e) => { e.stopPropagation(); return null; }}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--dark-color)] dark:text-white w-5 h-5" />
                </div>
              </div>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-[var(--dark-color)] dark:text-white">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-[#ffff] dark:hover:bg-[#192879] transition-colors ${
                      value === option.id ? "bg-[#ffff] dark:bg-[#192879]" : ""
                    } flex items-center gap-3`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(option.id);
                      setSearchTerm("");
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-[var(--dark-color)] dark:text-white">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
