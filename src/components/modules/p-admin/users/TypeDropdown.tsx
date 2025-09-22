"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TypeDropdownProps {
  value: "profit" | "loss" | "";
  onChange: (val: "profit" | "loss") => void;
}

export const TypeDropdown: React.FC<TypeDropdownProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: Array<"profit" | "loss"> = ["profit", "loss"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: "profit" | "loss") => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        className="w-full border-[2px] border-[var(--admin-border-color)] text-white px-4 py-2 rounded-[.5rem] bg-transparent flex justify-between"
        onClick={() => setOpen(prev => !prev)}
      >
        {value || "Select Type"}
        <span>▼</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 mt-2 w-full bg-[#1E1E2F] border-[2px] border-[var(--admin-border-color)] rounded-[.5rem] shadow-lg overflow-hidden"
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`p-2 hover:bg-[#2C2C3A] cursor-pointer text-white ${
                  value === opt ? "bg-[#2C2C3A]" : ""
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
