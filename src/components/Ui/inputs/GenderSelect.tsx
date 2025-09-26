"use client";

import { useState, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

interface GenderOption {
  id: string;
  label: string;
  abbreviations: string[];
}

const genderOptions: GenderOption[] = [
  {
    id: "male",
    label: "Male",
    abbreviations: ["m", "male", "man", "men"],
  },
  {
    id: "female",
    label: "Female",
    abbreviations: ["f", "female", "woman", "women"],
  },
  {
    id: "other",
    label: "Prefer not to say",
    abbreviations: ["ns", "not specified", "prefer not to say"],
  },
];

interface GenderSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export default function GenderSelect({
  label,
  value,
  onChange,
  required = false,
  className = "",
}: GenderSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const filteredOptions = genderOptions?.filter((option) => {
    const searchTermLower = searchTerm.toLowerCase();

    if (option.label.toLowerCase().includes(searchTermLower)) {
      return true;
    }

    return option.abbreviations.some((abbr) =>
      abbr.toLowerCase().includes(searchTermLower)
    );
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const selectedOption = genderOptions.find((option) => option.id === value);

  return (
    <div
      className={`custom-input-form relative ${className}`}
      ref={dropdownRef}
    >
      <label className="sponsor-label flex justify-start items-start gap-2">
        {required && <FaStar className="text-[#FF6060] w-3 h-3 mt-1" />}
        <span className="text-gray-600 dark:text-gray-300 text-xs">
          {label}
        </span>
      </label>

      <div
        className={`titan-input-custom-container text-[var(--main-background)] dark:text-white rounded-[1.5rem] cursor-pointer mt-2 ${
          isFocused || isOpen
            ? "titan-input-custom-container-focus"
            : "border-standard"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[var(--main-background)] dark:text-white">
            {selectedOption ? selectedOption.label : "Select gender"}
          </span>
        </div>
        <IoIosArrowDown
          className={`w-6 h-6 text-[var(--main-background)] dark:text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 mt-2 z-50"
          >
            <div className="bg-[#d9d9d9] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden shadow-lg">
              <div className="p-3 border-b-2 border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#ffff] dark:bg-[#192879] text-[var(--main-background)] dark:text-white px-4 py-2 pr-10 rounded-lg placeholder:dark:text-gray-400 outline-none"
                    placeholder="Search gender..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-background)] dark:text-white w-5 h-5" />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto dark:bg-[#0f163a] custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-[var(--main-background)] dark:text-white">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-[#ffff] dark:bg-[#0f163a] dark:hover:bg-[#192879] transition-colors ${
                        value === option.id
                          ? "bg-[#ffff] dark:bg-[#192879]"
                          : ""
                      } flex items-center gap-3`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(option.id);
                        setSearchTerm("");
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-[var(--main-background)] dark:text-white">
                        {option.label}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
