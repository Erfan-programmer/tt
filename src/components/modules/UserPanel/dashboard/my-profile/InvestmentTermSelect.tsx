import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

interface InvestmentTermSelectProps {
  className?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  options: string[];
}

export default function InvestmentTermSelect({
  className = "",
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  options
}: InvestmentTermSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options?.filter(option => {
    const searchTermLower = searchTerm.toLowerCase();
    return option.toLowerCase().includes(searchTermLower);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-input-form ${className}`} ref={dropdownRef}>
      <label className="sponsor-label flex justify-start items-start gap-2">
        {required && <FaStar className="text-[#FF6060] w-3 h-3 mt-1" />}
        <span className="text-[var(--main-background)] dark:text-white text-md">{label}</span>
      </label>
      
      <div
        className={`titan-input-custom-container text-[var(--main-background)] dark:text-white rounded-[1.5rem] cursor-pointer mt-2 ${
          isFocused || isOpen ? "titan-input-custom-container-focus" : "border-standard"
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-2 flex-1">
          <span className="text-[var(--main-background)] dark:text-white text-lg">
            {value || "Select investment term"}
          </span>
          <span className="text-[var(--main-background)] dark:text-white opacity-50">
            {disabled ? "Not editable" : "Click to select"}
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
            className="mt-2 overflow-hidden"
          >
            <div className="bg-[#f9f9fe] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden">
              <div className="p-3 border-b-2 border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#ffff] dark:bg-[#192879] text-[var(--main-background)] dark:text-white px-4 py-2 pr-10 rounded-lg outline-none"
                    placeholder="Search investment term..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-background)] dark:text-white w-5 h-5" />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-[var(--main-background)] dark:text-white">No options found</div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-[#ffff] dark:hover:bg-[#192879] transition-colors ${
                        value === option ? "bg-[#ffff] dark:bg-[#192879]" : ""
                      } flex items-center gap-3`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(option);
                        setSearchTerm("");
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-[var(--main-background)] dark:text-white">{option}</span>
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