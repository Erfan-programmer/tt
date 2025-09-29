import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface PositionOption {
  id: string;
  label: string;
  abbreviations: string[];
}

const positionOptions: PositionOption[] = [
  {
    id: "Contract Free",
    label: "Contract Free",
    abbreviations: ["c", "free", "contract"],
  },
  {
    id: "Investor",
    label: "Investor",
    abbreviations: ["in", "investor", "invester", "inve"],
  },
  {
    id: "Marketer",
    label: "Marketer",
    abbreviations: ["m", "marketer", "Marke", "Markter"],
  },
];

interface PositionSelectProps {
  className?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  hasLeftContractFree?: boolean;
  disabledOptions?: string[];
}

export default function PositionSelect({
  label,
  value,
  required,
  onChange,
  className = "",
  disabled = false,
  hasLeftContractFree = false,
  disabledOptions = [],
}: PositionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = positionOptions?.filter((option) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (option.label.toLowerCase().includes(searchTermLower)) return true;
    return option.abbreviations.some((abbr) =>
      abbr.toLowerCase().includes(searchTermLower)
    );
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

  return (
    <div
      className={`custom-input-form relative ${className}`}
      ref={dropdownRef}
    >
      <label className="sponsor-label flex justify-start items-start gap-2">
        {required && <FaStar className="text-[#FF6060] w-3 h-2 mt-1 text-2xl" />}
        <span className="text-[var(--main-background)] dark:text-white text-md">
          {label}
        </span>
      </label>

      {/* input box */}
      <div
        className={`titan-input-custom-container text-[var(--main-background)] dark:text-white rounded-[1.5rem] cursor-pointer mt-2 border-standard hover:border-[var(--primary-color)] transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } flex items-center justify-between px-4`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {/* Value text */}
        <div className="flex-1 flex justify-between items-center gap-2">
          <span className="text-[var(--main-background)] dark:text-white text-lg">
            {value || "Select position"}
          </span>
          {/* Icon left */}
          <IoIosArrowDown
            className={`w-8 h-8 text-[var(--main-background)] dark:text-white transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 right-0 z-50 mt-2"
          >
            <div className="bg-[#f9f9fe] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden shadow-xl">
              {/* search box */}
              <div className="p-3 border-b-2 border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#ffff] dark:bg-[#192879] text-[var(--main-background)] dark:text-white px-4 py-2 pr-10 rounded-lg outline-none"
                    placeholder="Search position..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-background)] dark:text-white w-5 h-5" />
                </div>
              </div>

              {/* options */}
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-[var(--main-background)] dark:text-white">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isContractFreeDisabled =
                      option.id.toLowerCase() === "contract free" &&
                      (hasLeftContractFree ||
                        value.toLowerCase() === "contract free");

                    const isInDisabledOptions = disabledOptions
                      ?.map((d) => d.toLowerCase())
                      .includes(option.id.toLowerCase());

                    const isDisabled =
                      isContractFreeDisabled || isInDisabledOptions;

                    return (
                      <div
                        key={option.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-[#ffff] dark:hover:bg-[#192879] transition-colors ${
                          value === option.id
                            ? "bg-[#ffff] dark:bg-[#192879]"
                            : ""
                        } flex items-center gap-3 ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={(e) => {
                          if (isDisabled) return;
                          e.stopPropagation();
                          onChange(option.id);
                          setSearchTerm("");
                          setIsOpen(false);
                        }}
                        tabIndex={isDisabled ? -1 : 0}
                        aria-disabled={isDisabled}
                      >
                        <span className="text-[var(--main-background)] dark:text-white">
                          {option.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
