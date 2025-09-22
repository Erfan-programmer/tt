"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface GenderSelectDropdownRef {
  getSelectedValue: () => string;
  resetSelection: () => void;
}

interface GenderSelectDropdownProps {
  label?: string;
  options?: string[];
}

const GENDER_OPTIONS_DEFAULT = ["Male", "Female", "Other"];

const GenderSelectDropdown = forwardRef<
  GenderSelectDropdownRef,
  GenderSelectDropdownProps
>(({ label = "Gender", options = GENDER_OPTIONS_DEFAULT }, ref) => {
  const [selected, setSelected] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selected,
    resetSelection: () => setSelected(""),
  }));

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
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
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <label className="text-white mb-2 text-md font-medium">{label}</label>
      <div
        className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected || `Select ${label}`}</span>
        <span
          className={`transition-transform text-white text-xl ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-[#1F2937] border border-[#555] rounded-[.5rem] shadow-lg"
          >
            {options.map((opt) => (
              <div
                key={opt}
                className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer text-white"
                onClick={() => handleSelect(opt)}
              >
                <span className={`${selected === opt ? "font-semibold" : ""}`}>
                  {opt}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

GenderSelectDropdown.displayName = "GenderSelectDropdown";

export default GenderSelectDropdown;
