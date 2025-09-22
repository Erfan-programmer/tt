"use client";

import React, { useState, useRef, ReactNode } from "react";
import { FaStar } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ValidationRule {
  validate: (value: string) => boolean;
  errorMessage: string;
}

interface CustomInputProps {
  label: ReactNode;
  value: string;
  readOnly: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  showStar?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
  type?: string;
  hasError?: boolean;
  errorMessage?: string;
  name?: string;
  validateLatinOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  customValidation?: ValidationRule;
  validationType?: "tid" | "password" | "faCode" | "text";
  onlyNumber?: boolean;
}

export default function CustomInput({
  label,
  value,
  readOnly,
  onChange,
  showStar,
  onBlur,
  name,
  placeholder = "",
  required = false,
  className = "",
  type = "text",
  hasError = false,
  errorMessage = "",
  validateLatinOnly = false,
  minLength,
  maxLength,
  customValidation,
  validationType,
  onlyNumber = false,
}: CustomInputProps) {
  // Ensure value is always a string
  const safeValue = value || "";
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string>("");
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containsNonEnglishLetter = (value: string): boolean => {
    return /[^\x00-\x7F]/.test(value);
  };
  const validateAlphabetOnly = (value: string): boolean => {
    return !containsNonEnglishLetter(value);
  };

  const validateInput = (value: string) => {
    if (required && !value) {
      setLocalError("This field is required");
      return;
    }

    if (validateLatinOnly && value && !validateAlphabetOnly(value)) {
      setLocalError("Only English alphabetic characters are allowed");
      return;
    }

    // Email validation
    if (type === "email" && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setLocalError("Please enter a valid email address");
        return;
      }
      // Check if it's a Gmail address
      if (!value.toLowerCase().endsWith("@gmail.com")) {
        setLocalError(
          "Please enter a valid Gmail address (e.g., user@gmail.com)"
        );
        return;
      }
    }

    if (customValidation) {
      const isValid = customValidation.validate(value);
      if (!isValid) {
        setLocalError(customValidation.errorMessage);
        return;
      }
    }

    setLocalError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (validateLatinOnly && newValue && containsNonEnglishLetter(newValue)) {
      setLocalError("Only English alphabetic characters are allowed");
      return;
    } else {
      setLocalError("");
    }

    onChange(newValue);

    // Only validate email if the field has been touched or has a value
    if (type === "email" && (newValue.length > 0 || isFocused)) {
      validateInput(newValue);
    } else if (type !== "email") {
      validateInput(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      setIsFocused(false);
      return;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isPersian = /[\u0600-\u06FF]/.test(e.key);
    const isDigit = /\d/.test(e.key);
    if (onlyNumber) {
      if (isPersian) {
        setLocalError("type only latin numbers");
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setLocalError(""), 1000);
        e.preventDefault();
        return;
      }
      if (!isDigit) {
        setLocalError("just type numbers");
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setLocalError(""), 1000);
        e.preventDefault();
        return;
      }
    } else if (validationType === "password") {
      if (isPersian) {
        setLocalError("You cannot type Persian/Arabic characters.");
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setLocalError(""), 1000);
        e.preventDefault();
        return;
      }
    } else {
      if (isPersian) {
        setLocalError("You can type latin characters only.");
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setLocalError(""), 1000);
        e.preventDefault();
        return;
      }
    }
  };

  const showError = !readOnly && (hasError || localError);
  const errorText = errorMessage || localError;

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className={`custom-input-form ${className}`}>
      <label className="sponsor-label flex justify-start items-start gap-2">
        {showStar && required && (
          <FaStar className="text-[#FF6060] w-3 h-3 mt-1" />
        )}
        {typeof label === "string" ? (
          <span
            className="text-[var(--main-background)] dark:text-white text-md w-full"
            dangerouslySetInnerHTML={{ __html: label }}
          ></span>
        ) : (
          <span className="text-[var(--main-background)] dark:text-white text-md w-full">
            {label}
          </span>
        )}
      </label>
      <label
        className={`titan-input-custom-container text-[var(--main-background)] dark:text-white mt-2 rounded-[1.5rem] ${
          readOnly
            ? "border-standard opacity-70"
            : showError
            ? "border-[#FF6060]"
            : safeValue.trim().length
            ? "border-success"
            : "border-standard"
        } ${
          isFocused && !readOnly ? "titan-input-custom-container-focus" : ""
        }`}
        onFocus={() => !readOnly && setIsFocused(true)}
        onBlur={handleBlur}
        role="textbox"
        aria-label={`${label} input`}
      >
        <input
          readOnly={readOnly}
          type={inputType}
          value={safeValue}
          name={name}
          onChange={handleInputChange}
          className={`titan-input-custom w-full border-none outline-none bg-transparent !text-[var(--main-background)] dark:!text-white dark:placeholder:!text-gray-400 placeholder:!text-gray-600 text-sm ${
            readOnly ? "cursor-not-allowed" : ""
          }`}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          aria-label={
            typeof label === "string"
              ? `Enter your ${label.toLowerCase()}`
              : "Input field"
          }
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyPress}
        />
        {/* Password visibility toggle */}
        {isPasswordType && !readOnly && (
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              setShowPassword((v) => !v);
            }}
            className="mr-4 text-xl text-gray-400 hover:text-[var(--primary-color)] focus:outline-none bg-transparent"
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        {!readOnly &&
          (showError ? (
            <IoMdCloseCircle
              className={`${
                !readOnly ? "opacity-100" : "opacity-0"
              } w-7 h-7 text-[#FF6060]`}
            />
          ) : (
            safeValue.trim().length > 0 && (
              <FaCheckCircle
                className={`${
                  !readOnly ? "opacity-100" : "opacity-0"
                } w-7 h-7w-7 h-7 text-[#00CB08] transition-opacity duration-300`}
              />
            )
          ))}
      </label>
      {showError && errorText && (
        <span className="text-[#FF6060] text-sm mt-1 block">{errorText}</span>
      )}
    </div>
  );
}
