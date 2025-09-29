"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { FaStar } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";
import { apiRequest } from "@/libs/api";
import Flag from "react-world-flags";

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
  meta?: any;
  errors?: any;
}

interface CountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  defaultCountry?: Country;
  refElement?: any;
}

export default function AdminCountrySelect({
  label,
  value,
  onChange,
  required = false,
  className = "",
  defaultCountry,
  refElement,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedHandler = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val), 500),
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
        setLoading(true);
        const url = debouncedSearch
          ? `${process.env.NEXT_PUBLIC_API_URL}/v1/showCountryByName?name=${debouncedSearch}`
          : `${process.env.NEXT_PUBLIC_API_URL}/v1/countries`;
        const res = await apiRequest<ApiResponse<Country[]>>(url);
        if (res.success) {
          const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
          setCountries(dataArray as Country[]);
        } else {
          console.error(res.message);
          setCountries([]); 
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, [debouncedSearch]); 

  useEffect(() => {
    if (defaultCountry) {
      onChange(String(defaultCountry.id));
    }
  }, [defaultCountry, onChange]);

  useEffect(() => {
    if (refElement) {
      refElement.current = {
        openMenu: () => setIsOpen(true),
      };
    }
  }, [refElement]);

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

  const selectedCountry = useMemo(() => {
    return (
      countries.find((c) => String(c.id) === value) || defaultCountry || null
    );
  }, [value, countries, defaultCountry]);

  return (
    <div
      className={`custom-input-form relative ${className}`}
      ref={dropdownRef}
    >
      <label className="sponsor-label flex justify-start items-start gap-2">
        {required && <FaStar className="text-[#FF6060] w-3 h-2 mt-1" />}
        <span className="text-gray-300 text-xs">
          {label}
        </span>
      </label>

      {/* Dropdown container */}
      <div
        className="flex justify-between items-center px-3 py-2 rounded-[.5rem] border-[1px] border-[#585966] bg-transparent text-white cursor-pointer mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-1">
          {selectedCountry && (
            <Flag code={selectedCountry.code} className="w-6 h-4 rounded-sm" />
          )}
          <span className="flex-1 text-sm">
            {selectedCountry?.name ||
              (loading ? "Loading..." : "Select a country")}
          </span>
        </div>
        <span
          className={`transition-transform text-white text-xl ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      {/* Dropdown list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden absolute z-[100] w-full"
          >
            <div className="bg-[#0f163a] border border-[#585966] rounded-[1rem] overflow-hidden">
              <div className="p-1 border-b border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#192879] text-white rounded-lg px-3 py-1.5 pl-9 outline-none text-sm placeholder:text-gray-400"
                  />
                  <IoSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {loading && debouncedSearch !== "" ? (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Searching...
                  </div>
                ) : countries.length === 0 && debouncedSearch !== "" ? (
                  <div className="px-4 py-2 text-white h-[100px] flex items-center justify-center text-sm">
                    No matching countries found.
                  </div>
                ) : (
                  countries.map((country) => (
                    <div
                      key={country.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-[#192879] transition-colors flex items-center gap-3 ${
                        value === String(country.id)
                          ? "bg-[#192879]" // Keep the selected style consistent
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(String(country.id));
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <Flag
                        code={country.code}
                        className="w-6 h-4 rounded-sm"
                      />
                      <span className="text-white text-sm">
                        {country.name}
                      </span>
                      <span className="text-gray-400 text-[.8rem] ml-auto">
                        {country.dial_code}
                      </span>
                    </div>
                  ))
                )}
                 {loading && debouncedSearch === "" && (
                     <div className="px-4 py-2 text-gray-500 text-sm">
                       Loading countries...
                     </div>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}