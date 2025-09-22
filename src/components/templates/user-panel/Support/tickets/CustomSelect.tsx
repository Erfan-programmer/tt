import { useState, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export interface CustomSelectOption {
  id: string;
  label: string;
  abbreviations?: string[];
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
  placeholder = "Select...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options?.filter((option) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (option.label.toLowerCase().includes(searchTermLower)) {
      return true;
    }
    if (option.abbreviations) {
      return option.abbreviations.some((abbr) =>
        abbr.toLowerCase().includes(searchTermLower)
      );
    }
    return false;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div
      className={`custom-input-form relative mt-4 ${className}`}
      ref={dropdownRef}
    >
      <label className="sponsor-label flex justify-start items-start gap-2 mt-4">
        {required && <FaStar className="text-[#FF6060] w-3 h-3 mt-1" />}
        <span className="text-[var(--main-background)] dark:text-white text-lg">
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
          <span
            className={`text-[var(--main-background)] dark:text-white  ${
              !selectedOption && "text-gray-400"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1" // اضافه شده position: absolute
          >
            <div className="bg-[#d9d9d9] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden shadow-lg">
              <div className="p-3 border-b-2 border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#ffff] placeholder:text-gray-400 dark:bg-[#192879] text-[var(--main-background)] dark:text-white px-4 py-2 pr-10 rounded-lg outline-none"
                    placeholder="Search..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-background)] dark:text-white w-5 h-5" />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar dark:bg-[#0f163a]">
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
