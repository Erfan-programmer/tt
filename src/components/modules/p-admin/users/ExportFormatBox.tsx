"use client";
import React, { useState, useRef, useEffect } from "react";
import { VscTriangleDown } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";

interface SearchFilterOption {
  label: string;
  value: string;
  placeholder?: string;
}

const filterOptions: SearchFilterOption[] = [
  { label: "Wallet Type", value: "wallet_type", placeholder: "Select wallet type" },
];

interface ExportFormatBoxProps {
  onSearch?: (filter: string, value: string) => void;
  onClear?: () => void;
}

export default function ExportFormatBox({  onClear }: ExportFormatBoxProps) {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const [inputValue, setInputValue] = useState("usdt"); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDLList = async () => {
  try {
    const token = localStorage.getItem("token");
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/exportCancellationHistory?${selectedFilter.value}=${inputValue}`;

    const res = await apiRequest<any>(endpoint, "GET", undefined, {
      Authorization: `Bearer ${token}`,
    });

    if (res.success && res.data) {
      let url: string | undefined;

      if (typeof res.data === "string") url = res.data;
      else if (res.data.url) url = res.data.url;

      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `export_${selectedFilter.value}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("File downloaded successfully!");
      } else {
        const blobRes = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blob = await blobRes.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `export_${selectedFilter.value}.csv`; 
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(blobUrl);
        toast.success("File downloaded successfully!");
      }
    } else {
      toast.error(res.message || "Failed to download file.");
    }
  } catch (err: any) {
    toast.error(err.message || "Error occurred while downloading.");
  }
};


  const handleClear = () => {
    setSelectedFilter(filterOptions[0]);
    setInputValue("usdt");
    onClear?.();
  };

  return (
    <div className="admin-transaction-search-box-container w-full mx-auto mt-10">
      <div className="admin-transaction-search-box-content border-2 border-[#383C47] rounded-xl p-4 sm:p-6 flex flex-wrap xl:flex-nowrap items-start sm:items-center justify-start md:justify-between gap-4 bg-[#111827]">
        <div className="flex items-center gap-4 w-fit flex-wrap">
          {/* Dropdown */}
          <div className="relative w-full sm:w-64" ref={dropdownRef}>
            <label className="text-white mb-2 text-md font-medium">
              Select Wallet Type
            </label>
            <div
              className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{inputValue.toUpperCase()}</span>
              <VscTriangleDown
                className={`transition-transform text-white text-xl ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
                >
                  {["usdt", "btc", "eth"].map((wallet) => (
                    <div
                      key={wallet}
                      className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                      onClick={() => {
                        setInputValue(wallet);
                        setDropdownOpen(false);
                      }}
                    >
                      {wallet.toUpperCase()}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full flex-wrap xl:flex-nowrap sm:w-auto mt-6">
          <button
            onClick={handleDLList}
            className="titan-btn !rounded-md flex-1 sm:flex-none"
          >
            DL List
          </button>
          <button
            onClick={handleClear}
            className="bg-[#D7FE63] px-[3rem] py-[.5rem] !rounded-md flex-1 sm:flex-none"
          >
            Send All
          </button>
        </div>
      </div>
    </div>
  );
}
