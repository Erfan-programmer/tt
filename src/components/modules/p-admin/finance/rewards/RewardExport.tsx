"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

type Option = {
  label: string;
  value: string;
  icon?: string;
  network?: string;
};

interface AdminExportBoxProps {
  title?: string;
}

type ExportType = {
  success: boolean;
  message: string;
  data: [
    {
      id: number;
      title: string;
      network: string;
      description: string;
      icon_path: string;
    }
  ];
  meta: null;
  errors: null;
};

export default function AdminExportBox({
  title = "Select your List Currency format",
}: AdminExportBoxProps) {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [download, setDownLoad] = useState(false);
  const [sendAll, setDendAll] = useState(false);
  const [currencies, setCurrencies] = useState<Option[]>([]);

  const [selectedCurrency, setSelectedCurrency] = useState<Option | null>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(e.target as Node)
      ) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currencyOpen) return;

    const fetchCurrencies = async () => {
      try {
        const token = loadEncryptedData()?.token;
        const res = await apiRequest<{ data: ExportType }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/cryptoCurrencies`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res?.data && Array.isArray(res.data.data)) {
          const options: Option[] = res.data.data.map((c) => ({
            label: c.title,
            value: c.title.toLowerCase(),
            icon: c.icon_path,
            network: c.network,
          }));
          setCurrencies(options);
          if (!selectedCurrency && options.length > 0)
            setSelectedCurrency(options[0]);
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load currencies");
      }
    };

    fetchCurrencies();
  }, [currencyOpen, selectedCurrency]);

  const handleDownload = async () => {
    if (!selectedCurrency || !selectedCurrency.network) return;
    setDownLoad(true);
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/unclaimedPrizeDownloadCsv?wallet_type=${selectedCurrency.network}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setDownLoad(false);

        toast.success(res.message || "Download started!");
      } else {
        setDownLoad(false);
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    }
  };

  const handleSendAll = async () => {
    setDendAll(true);
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/sendAllUnclaimedPrize`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setDendAll(false);

        toast.success(res.message || "All withdrawals approved!");
      } else {
        setDendAll(false);
        toast.error(res.message || "Failed to approve");
      }
    } catch (err: any) {
      toast.error(err.message || "Error occurred");
    }
  };

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="w-full mx-auto mt-8">
        {title && <p className="text-white mb-2 font-semibold">{title}</p>}
        <div className="border-2 border-[#383C47] rounded-xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 bg-[#111827]">
          <div className="relative w-full sm:w-48" ref={currencyRef}>
            <label className="text-white mb-2 font-medium">
              Currency Format
            </label>
            <div
              className="flex justify-between items-center p-2 rounded border border-[#555] bg-transparent text-white cursor-pointer"
              onClick={() => setCurrencyOpen((o) => !o)}
            >
              <span>{selectedCurrency?.label || "Select currency"}</span>
              <span
                className={`transition-transform ${
                  currencyOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded overflow-hidden shadow-lg max-h-60 overflow-y-auto"
                >
                  {currencies.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer text-white hover:bg-[#275EDF]"
                      onClick={() => {
                        setSelectedCurrency(opt);
                        setCurrencyOpen(false);
                      }}
                    >
                      {opt.icon && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${opt.icon}`}
                          alt={opt.label}
                          width={100}
                          height={100}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <span>{opt.label}</span>
                    </div>
                  ))}
                  {currencies.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">
                      No currencies available
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-2 w-full flex-wrap sm:w-auto mt-6">
            <button
              onClick={handleDownload}
              className={`titan-btn ${
                download ? "!bg-gray-400" : ""
              } !rounded-md flex-1 sm:flex-none px-4 py-2`}
            >
              {download ? "Downloading ..." : "Download"}
            </button>
            <button
              onClick={handleSendAll}
              className={`admin-titan-cancel ${
                sendAll ? "!bg-gray-400" : ""
              } !rounded-md flex-1 sm:flex-none px-4 py-2`}
            >
              {sendAll ? "sending ..." : "Send All"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
