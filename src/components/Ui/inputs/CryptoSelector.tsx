"use client";

import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import Image from "next/image";

interface CryptoOption {
  id: string;
  title: string;
  description?: string;
  icon_path: string;
  symbol: string;
}

interface CryptoSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyChange?: (title: string) => void;
  required?: boolean;
  className?: string;
  showStar?: boolean;
}

export default function CryptoSelector({
  label,
  value,
  onChange,
  onKeyChange,
  className = "",
  required = false,
  showStar = false,
}: CryptoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cryptoList, setCryptoList] = useState<CryptoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        setLoading(true);
        const token = loadUserData()?.access_token;
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/cryptoCurrencies`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );
        const data: CryptoOption[] = (res?.data?.data || []).map((item: any) => ({
          id: String(item.id),
          title: item.title,
          symbol: item.symbol,
          icon_path: item.icon_path,
        }));
        setCryptoList(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load cryptocurrencies");
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (cryptoList.length > 0 && !value) {
      const firstOption = cryptoList[0];
      onChange(firstOption.symbol);
      if (onKeyChange) onKeyChange(firstOption.title);
    }
  }, [cryptoList, value, onChange, onKeyChange]);

  const filteredOptions = cryptoList?.filter((option) => {
    const searchTermLower = searchTerm.toLowerCase();
    return option.title?.toLowerCase().includes(searchTermLower) || option.symbol?.toLowerCase().includes(searchTermLower);
  });

  const selectedOption = cryptoList.find((option) => option.symbol === value);
  const displayLabel = selectedOption?.title || "Select Crypto";

  return (
    <div className={`custom-input-form relative ${className}`} ref={dropdownRef}>
      <label className="sponsor-label flex justify-start items-start gap-2 mb-2 !text-md">
        {showStar && required && <FaStar className="text-[#FF6060] w-3 h-3 mt-2" />}
        <span className="text-[var(--main-background)] dark:text-white text-md">{label}</span>
      </label>

      {loading ? (
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-[1.5rem]" />
      ) : error ? (
        <div className="text-red-500 py-2">{error}</div>
      ) : (
        <>
          <div
            className={`titan-input-custom-container text-[var(--main-background)] dark:text-white rounded-[1.5rem] cursor-pointer border-standard`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[var(--main-background)] dark:text-white">{displayLabel}</span>
            </div>
            <IoIosArrowDown
              className={`w-6 h-6 text-[var(--main-background)] dark:text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 right-0 z-50 mt-1"
              >
                <div className="bg-[#D9D9D9] dark:bg-[#0f163a] border-2 border-[#585966] rounded-[1rem] overflow-hidden shadow-lg">
                  <div className="p-3 border-b-2 border-[#585966]">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#ffff] dark:bg-[#192879] text-[var(--main-background)] dark:text-white px-4 py-2 pr-10 rounded-lg outline-none"
                        placeholder="Search crypto..."
                        onClick={(e) => e.stopPropagation()}
                      />
                      <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--main-background)] dark:text-white w-5 h-5" />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredOptions.length === 0 ? (
                      <div
                        key="usdt"
                        className="px-4 py-2 cursor-pointer hover:bg-[#f9f9fe] dark:hover:bg-[#192879] transition-colors flex items-center gap-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange("USDT");
                          if (onKeyChange) onKeyChange("USDT");
                          setSearchTerm("");
                          setIsOpen(false);
                        }}
                      >
                        <span className="text-[var(--main-background)] dark:text-white">USDT</span>
                      </div>
                    ) : (
                      filteredOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`px-4 py-2 cursor-pointer hover:bg-[#f9f9fe] dark:hover:bg-[#192879] transition-colors flex items-center gap-3 ${
                            selectedOption?.id === option.id ? "bg-[#f9f9fe] dark:bg-[#192879]" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(option.symbol); 
                            if (onKeyChange) onKeyChange(option.symbol);
                            setSearchTerm("");
                            setIsOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              width={24}
                              height={24}
                              alt={option.title}
                              src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${option.icon_path}`}
                            />
                            <span className="text-[var(--main-background)] dark:text-white">{option.title}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
