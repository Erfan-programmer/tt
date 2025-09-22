// AdminPhoneInput.tsx
"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { debounce } from "lodash";
import Flag from "react-world-flags";
import { apiRequest } from "@/libs/api";

interface Country {
  id: number;
  name: string;
  code: string;
  dial_code: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  onPrefixChange?: (country: Country) => void;
  initialDialCode?: string;
}

export default function AdminPhoneInput({
  label,
  value,
  onChange,
  required = false,
  className = "",
  onPrefixChange,
  initialDialCode,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ debounce فقط یکبار ساخته میشه
  const debouncedHandler = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedHandler(searchTerm);
    return () => {
      debouncedHandler.cancel();
    };
  }, [searchTerm, debouncedHandler]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const url = debouncedSearch
          ? `${process.env.NEXT_PUBLIC_API_URL}/v1/showCountryByCode?code=${debouncedSearch}`
          : `${process.env.NEXT_PUBLIC_API_URL}/v1/countries`;

        const res = await apiRequest<ApiResponse<Country[]>>(url);
        if (res.success) {
          setCountries(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCountries();
  }, [debouncedSearch]);

  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      const initial =
        countries.find(
          (c) => Number(c.dial_code) === Number(initialDialCode)
        ) || countries[0];
      setSelectedCountry(initial);
      onPrefixChange?.(initial);
    }
  }, [countries, selectedCountry, initialDialCode, onPrefixChange]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    onPrefixChange?.(country);
  };

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
        {required && <FaStar className="text-[#FF6060] w-3 h-3 mt-1" />}
        <span className="text-[var(--main-background)] dark:text-white text-sm">
          {label}
        </span>
      </label>

      <div className="flex flex-col-reverse sm:flex-row gap-2 mt-2 items-stretch z-[100]">
        <div className="relative w-52">
          <div
            className="titan-input-custom-container text-[var(--main-background)] dark:text-white rounded-[.5rem] cursor-pointer flex items-center justify-between px-2 py-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-1 text-white">
              {selectedCountry && (
                <Flag
                  code={selectedCountry.code}
                  className="w-5 h-3 rounded-sm"
                />
              )}
              <span>{selectedCountry?.dial_code}</span>
            </div>
            <IoIosArrowDown
              className={`w-3 h-3 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0f163a] border border-gray-300 dark:border-gray-700 rounded mt-1 max-h-60 overflow-y-auto z-[100]">
              <div className="relative p-1">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border-b border-gray-300 bg-gray-800 text-white dark:border-gray-700 outline-none text-sm rounded-sm"
                />
              </div>

              {countries.map((country) => (
                <div
                  key={country.id}
                  className="px-3 py-2 cursor-pointer text-white dark:hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => handleCountrySelect(country)}
                >
                  <Flag code={country.code} className="w-5 h-3 rounded-sm" />
                  <span>{country.dial_code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter phone number"
          className="flex-1 w-full sm:w-auto titan-input-custom-container rounded-[.5rem] px-4 py-2 border border-dashed border-gray-400 dark:border-gray-600 text-[var(--main-background)] dark:text-white"
        />
      </div>
    </div>
  );
}
