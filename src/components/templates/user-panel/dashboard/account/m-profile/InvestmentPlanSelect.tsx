"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useAuth } from "@/contextApi/AuthContext";

interface Option {
  id: number | string;
  name: string;
}

interface InvestmentPlanSelectProps {
  className?: string;
  label: string;
  value: number | string | null;
  onChange: (value: any) => void;
  required?: boolean;
  disabled?: boolean;
  apiUrl: string;
}

export default function InvestmentPlanSelect({
  className = "",
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  apiUrl,
}: InvestmentPlanSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = loadUserData()?.access_token;

const selectedOption = options.find((opt) => String(opt.id) === String(value)) || null;

  const {user} = useAuth()
  const filteredOptions = searchTerm
    ? options?.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const fetchOptions = async () => {
    if (options.length > 0) return;
    setLoading(true);
    try {
      const res = await apiRequest<{ data: Option[] }>(
        apiUrl,
        "GET",
        undefined,
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      if (res.success && Array.isArray(res.data.data)) {
        setOptions(res.data.data);
      } else {
        toast.error(res.message || "Failed to fetch options");
      }
    } catch (err) {
      toast.error("Error while fetching options");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) fetchOptions();
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
        <span className="text-[var(--dark-color)] dark:text-white text-md">
          {label}
        </span>
      </label>

      <div
        className={`titan-input-custom-container text-[var(--dark-color)] dark:text-white rounded-[1.5rem] cursor-pointer mt-2 ${
          isOpen ? "titan-input-custom-container-focus" : "border-standard"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleToggleDropdown}
      >
        <div className="flex items-center justify-between gap-2 flex-1">
          <span className="text-[var(--dark-color)] dark:text-white text-lg">
            {selectedOption?.name ? selectedOption.name : (user ? user?.plan?.name : "Select investment term")}
          </span>
        </div>
        <IoIosArrowDown
          className={`w-6 h-6 text-[var(--dark-color)] dark:text-white transition-transform duration-300 ${
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
            className="absolute left-0 right-0 mt-2 z-[9999]"
          >
            <div className="bg-[#f9f9fe] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden">
              <div className="p-3 border-b-2 border-[#585966]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#ffff] dark:bg-[#192879] text-[var(--dark-color)] dark:text-white px-4 py-2 pr-10 rounded-lg outline-none"
                    placeholder="Search investment term..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--dark-color)] dark:text-white w-5 h-5" />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="px-4 py-2 text-[var(--dark-color)] dark:text-white">
                    Loading...
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-4 py-2 text-[var(--dark-color)] dark:text-white">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-[#ffff] dark:hover:bg-[#192879] transition-colors ${
                        String(value) === String(option.id)
                          ? "bg-[#ffff] dark:bg-[#192879]"
                          : ""
                      } flex items-center gap-3`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(option);
                        setSearchTerm("");
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-[var(--dark-color)] dark:text-white">
                        {option.name}
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
