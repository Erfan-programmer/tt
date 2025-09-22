"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast , ToastContainer } from "react-toastify";

type Option = { label: string; value: string };

interface AdminExportBoxProps {
  title?: string;
  exportOptions?: Option[];
  currencyOptions?: Option[];
}

export default function AdminExportBox({
  title = "Export Options",
  exportOptions = [
    { label: "CSV", value: "csv" },
    { label: "JSON", value: "json" },
  ],
  currencyOptions = [
    { label: "USD ($)", value: "usd" },
    { label: "EUR (€)", value: "eur" },
    { label: "GBP (£)", value: "gbp" },
    { label: "USDT (₮)", value: "usdt" },
  ],
}: AdminExportBoxProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const [selectedExport, setSelectedExport] = useState<Option>(exportOptions[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<Option>(currencyOptions[0]);
  const [filterValue, setFilterValue] = useState<string>("");


  const exportRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async () => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals/export`,
        "POST",
        { exportFormat: selectedExport.value, currencyFormat: selectedCurrency.value, filter: filterValue },
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success(res.message || "Download started!");
      }
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    }
  };

  const handleSendAll = async () => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals/approveBulk`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success(res.message || "All withdrawals approved!");
      } else {
        toast.error(res.message || "Failed to approve");
      }
    } catch (err: any) {
      toast.error(err.message || "Error");
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="admin-transaction-search-box-container w-full mx-auto mt-8">
      {title && <p className="text-white mb-2 font-semibold">{title}</p>}

      <div className="admin-transaction-search-box-content border-2 border-[#383C47] rounded-xl p-4 sm:p-6 flex flex-wrap xl:flex-nowrap items-start sm:items-center justify-start md:justify-between gap-4 bg-[#111827]">
        
        {/* Filter input */}
        <div className="flex flex-col w-full sm:w-64">
          <label className="text-white mb-2 font-medium">Filter</label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full border border-[#555] rounded p-2 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type filter..."
          />
        </div>

        {/* Export & Currency dropdowns */}
        <div className="flex items-center gap-4 w-fit flex-wrap">
          {/* Export dropdown */}
          <div className="relative w-full sm:w-48" ref={exportRef}>
            <label className="text-white mb-2 font-medium">Export Format</label>
            <div
              className="flex justify-between items-center p-2 rounded border border-[#555] bg-transparent text-white cursor-pointer"
              onClick={() => { setExportOpen(o => !o); setCurrencyOpen(false); }}
            >
              <span>{selectedExport.label}</span>
              <span className={`transition-transform ${exportOpen ? "rotate-180" : ""}`}>▼</span>
            </div>
            <AnimatePresence>
              {exportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded overflow-hidden shadow-lg"
                >
                  {exportOptions.map(opt => (
                    <div
                      key={opt.value}
                      className="px-4 py-2 cursor-pointer text-white hover:bg-[#275EDF]"
                      onClick={() => { setSelectedExport(opt); setExportOpen(false); }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Currency dropdown */}
          <div className="relative w-full sm:w-48" ref={currencyRef}>
            <label className="text-white mb-2 font-medium">Currency Format</label>
            <div
              className="flex justify-between items-center p-2 rounded border border-[#555] bg-transparent text-white cursor-pointer"
              onClick={() => { setCurrencyOpen(o => !o); setExportOpen(false); }}
            >
              <span>{selectedCurrency.label}</span>
              <span className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`}>▼</span>
            </div>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded overflow-hidden shadow-lg"
                >
                  {currencyOptions.map(opt => (
                    <div
                      key={opt.value}
                      className="px-4 py-2 cursor-pointer text-white hover:bg-[#275EDF]"
                      onClick={() => { setSelectedCurrency(opt); setCurrencyOpen(false); }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full flex-wrap xl:flex-nowrap sm:w-auto mt-6">
          <button onClick={handleDownload} className="titan-btn !rounded-md flex-1 sm:flex-none">
            Download
          </button>
          <button onClick={handleSendAll} className="admin-titan-cancel !rounded-md flex-1 sm:flex-none">
            Send All
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
