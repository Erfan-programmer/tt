"use client";
import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface CustomAdminInputProps {
  title: string;
  value: string;
  readOnly?: boolean;
  onChange: (val: string) => void;
  type?: "text" | "date" | "email" | "tel" | "password";
}

export default function CustomAdminInput({
  title,
  value,
  onChange,
  readOnly,
  type = "text",
}: CustomAdminInputProps) {
  const [selected, setSelected] = useState<Date | undefined>(
    value && type === "date" ? new Date(value) : undefined
  );
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelected(date);
      onChange(date.toISOString());
      setOpen(false);
    }
  };

  const today = new Date();

  return (
    <div className="custom-admin-input w-full sm:w-auto sm:min-w-40 flex flex-col relative" ref={wrapperRef}>
      <span className="text-white mb-1">{title}</span>
      {type === "date" ? (
        <>
          <input
            readOnly={readOnly}
            value={selected ? selected.toLocaleDateString() : ""}
            onClick={() => setOpen(!open)}
            placeholder="Select date..."
            className="border-[1px] border-[#383C47] bg-[#1f1f1f] text-white rounded-xl p-2 w-full cursor-pointer"
          />
          {open && (
            <div className="absolute z-50 mt-1 bg-[#1f1f1f] border border-[#383C47] text-white rounded-xl shadow-lg p-2">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                disabled={{ before: today }}
                footer={selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
              />
            </div>
          )}
        </>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${title}...`}
          readOnly={readOnly}
          className="border-[1px] mt-1 border-[#383C47] p-2 px-2 bg-transparent rounded-xl text-white placeholder:text-gray-300"
        />
      )}
    </div>
  );
}
