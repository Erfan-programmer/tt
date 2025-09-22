"use client";
import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { FaCheck, FaExclamation } from "react-icons/fa";

interface TitanModalFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  // Use the 'validation' prop for all validation rules, including regex and messages.
  validation?: RegisterOptions;
}

export default function TitanModalField({
  name,
  label,
  placeholder,
  type = "text",
  // Remove regex and errorMessage from destructuring
  validation = {},
}: TitanModalFieldProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  // Type assertion is still needed for a clean error message
  const fieldError = errors[name]?.message as string | undefined;

  const showStatus = value && value.trim().length > 0;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-white font-medium">
        {label}
      </label>
      <div
        className={`flex items-center justify-between gap-1 relative rounded-xl bg-gray-800 text-white border ${
          showStatus
            ? fieldError
              ? "border-[#FF6060]"
              : "border-[#00CB08]"
            : "border-gray-600"
        }`}
      >
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          // Pass the entire validation object directly
          {...register(name, validation)}
          className="p-2 bg-transparent focus:border-none focus:outline-none flex-1 placeholder:text-[#7E7E7E]"
        />
        {showStatus && (
          <span
            className={`text-white flex justify-center rounded-full p-1 items-center text-lg mr-2 ${
              fieldError ? "bg-[#FF6060]" : "bg-[#00CB08]"
            }`}
          >
            {fieldError ? <FaExclamation /> : <FaCheck />}
          </span>
        )}
      </div>
      {fieldError && <span className="text-red-400 text-sm">{fieldError}</span>}
    </div>
  );
}
