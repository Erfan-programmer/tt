"use client";
import React, { useState, useEffect } from "react";
import CustomAdminInput from "./CustomAdminInput";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../EncryptData/SavedEncryptData";
import DepositWalletsTable from "./DepositWalletsTable";
import DepositCryptosTable from "./DepositCryptosTable";
import { Crypto } from "@/types/p-admin/Message";
import Pagination from "../UserPanel/Pagination/Pagination";
import Image from "next/image";

interface DepositWalletForm {
  id: number | string;
  title: string;
  address: string;
  description: string;
  symbol: string;
  icon?: File | null;
  preview?: string;
}

interface WithdrawWalletForm {
  id: number | string;
  title: string;
  network: string;
  address?: string;
  description: string;
  symbol: string;
  icon?: File | null;
  preview?: string;
}


export interface WalletListResponse {
  success: boolean;
  message: string;
  data: Wallet[];
}

export type Wallet  = {
  id: number;
  title: string;
  address: string;
  symbol: string;
  description: string;
  icon_path?: string | File;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CryptoListResponse {
  success: boolean;
  message: string;
  data: Crypto[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function InternalWalletSection() {
  // ----------------- Deposit -----------------
  const [depositWallets, setDepositWallets] = useState<DepositWalletForm[]>([
    { id: 1, title: "", address: "", description: "", icon: null, preview: "" , symbol:"" },
  ]);

  const handleDepositChange = (
    id: number | string,
    field: keyof DepositWalletForm,
    value: any
  ) => {
    setDepositWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, [field]: value } : wallet
      )
    );
  };

  const handleDepositIconUpload = (id: number | string, file: File) => {
    const preview = URL.createObjectURL(file);
    setDepositWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, icon: file, preview } : wallet
      )
    );
  };

  const addDepositWallet = () => {
    setDepositWallets((prev) => [
      ...prev,
      {
        id: `deposit-${Date.now()}`,
        title: "",
        address: "",
        description: "",
        symbol: "",
        icon: null,
        preview: "",
      },
    ]);
  };

  const removeDepositWallet = (id: number | string) => {
    setDepositWallets((prev) => prev?.filter((wallet) => wallet.id !== id));
  };

  const [loading, setLoading] = useState<boolean>(false);
  const saveDepositWallets = async () => {
    setLoading(true);
    const token = loadEncryptedData()?.token;
    const formData = new FormData();
    depositWallets.forEach((w, i) => {
      formData.append(`wallets[${i}][title]`, w.title);
      formData.append(`wallets[${i}][address]`, w.address);
      formData.append(`wallets[${i}][description]`, w.description);
      formData.append(`wallets[${i}][symbol]`, w.symbol);
      if (w.icon) formData.append(`wallets[${i}][icon]`, w.icon);
    });

    const res = await apiRequest<WalletListResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createWallet`,
      "POST",
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (res.success) {
      toast.success(res.message || "Deposit wallets saved successfully!");
      setDepositWallets([
        {
          id: 1,
          title: "",
          address: "",
          description: "", 
          symbol: "", 
          icon: null,
          preview: "",
        },
      ]);
      setLoading(false);
      fetchWallets();
    } else {
      toast.error("Error saving deposit wallets: " + res.message);
    setLoading(false);

    }
  };

  // ----------------- Withdraw -----------------
  const [withdrawWallets, setWithdrawWallets] = useState<WithdrawWalletForm[]>([
    {
      id: 1,
      title: "",
      network: "",
      address: "",
      description: "",
      symbol: "",
      icon: null,
      preview: "",
    },
  ]);
  const handleWithdrawChange = (
    id: number | string,
    field: keyof WithdrawWalletForm,
    value: any
  ) => {
    setWithdrawWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, [field]: value } : wallet
      )
    );
  };

  const handleWithdrawIconUpload = (id: number | string, file: File) => {
    const preview = URL.createObjectURL(file);
    setWithdrawWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, icon: file, preview } : wallet
      )
    );
  };

  const addWithdrawWallet = () => {
    setWithdrawWallets((prev) => [
      ...prev,
      {
        id: `withdraw-${Date.now()}`,
        title: "",
        network: "",
        symbol: "",
        address: "",
        description: "",
        icon: null,
        preview: "",
      },
    ]);
  };

  const removeDepositIcon = (id: number | string) => {
    setDepositWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, icon: null, preview: "" } : w))
    );
  };

  const removeWithdrawIcon = (id: number | string) => {
    setWithdrawWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, icon: null, preview: "" } : w))
    );
  };

  const removeWithdrawWallet = (id: number | string) => {
    setWithdrawWallets((prev) => prev?.filter((wallet) => wallet.id !== id));
  };

  const saveWithdrawWallets = async () => {
    const formData = new FormData();
    withdrawWallets.forEach((w, i) => {
      formData.append(`cryptos[${i}][title]`, w.title);
      formData.append(`cryptos[${i}][network]`, w.network);
      formData.append(`cryptos[${i}][network]`, w.network);
      formData.append(`cryptos[${i}][description]`, `${w.description}`);
      if (w.icon) {
        formData.append(`cryptos[${i}][icon]`, w.icon);
      }
    });
    const token = loadEncryptedData()?.token;

    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createCrypto`,
      "POST",
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (res.success) {
      toast.success(res.message || "Withdraw cryptos saved successfully!");
      setWithdrawWallets([
        {
          id: 1,
          title: "",
          network: "",
          address: "",
          symbol: "",
          description: "",
          icon: null,
          preview: "",
        },
      ]);

      fetchCryptos();
    } else {
      toast.error("Error saving withdraw cryptos: " + res.message);
    }
  };

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  const [walletPage, setWalletPage] = useState(1);
  const [walletPerPage] = useState(10);
  const [walletTotal, setWalletTotal] = useState(1);


  const fetchWallets = async (page: number = 1) => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<WalletListResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/wallets?page=${page}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setWallets(res.data.data || []);
        if ((res as any).meta) setWalletTotal((res as any).meta.total);
      } else toast.error("Error fetching wallets: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching wallets: " + err.message);
    }
  };
  const fetchCryptos = async (page: number = 1) => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<CryptoListResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/cryptos?page=${page}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setCryptos(res.data.data || []);
      } else toast.error("Error fetching cryptos: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching cryptos: " + err.message);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchCryptos();
  }, []);
  const handleWalletPageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setWalletPage(newPage);
    fetchWallets(newPage);
  };

  const CircleUploader = ({
    id,
    section, // "deposit" | "withdraw"
    preview,
    onUpload,
    onRemove,
  }: {
    id: number | string;
    section: "deposit" | "withdraw";
    preview?: string;
    onUpload: (id: number | string, file: File) => void;
    onRemove: (id: number | string) => void;
  }) => (
    <div className="relative flex items-center">
      <label
        htmlFor={`${section}-upload-${id}`}
        className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden bg-[#2a2a2a]"
      >
        {preview ? (
          <Image
            width={400}
            height={400}
            src={preview}
            alt="icon preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">Upload</span>
        )}
      </label>
      <input
        id={`${section}-upload-${id}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(id, e.target.files[0])}
      />
      {preview && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center text-xs"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
  const isDepositValid = depositWallets.every(
    (w) => w.title && w.address && w.description
  );

  const isWithdrawValid = withdrawWallets.every((w) => w.title && w.network);

  return (
    <div className="internal-wallet-container">
      <div className="deposit-wallets mt-8">
        <p className="text-white text-lg font-semibold">Deposit Wallets</p>
        <div className="border-2 space-y-4 mt-2 mb-6 border-[#383C47] rounded-xl p-6">
          <AnimatePresence>
            {depositWallets.length > 0 ? (
              depositWallets.map((wallet) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-4 items-end"
                >
                  <CustomAdminInput
                    title="Title"
                    value={wallet.title}
                    onChange={(val) =>
                      handleDepositChange(wallet.id, "title", val)
                    }
                  />
                  <CustomAdminInput
                    title="Address"
                    value={wallet.address}
                    onChange={(val) =>
                      handleDepositChange(wallet.id, "address", val)
                    }
                  />
                  <CustomAdminInput
                    title="Description"
                    value={wallet.description}
                    onChange={(val) =>
                      handleDepositChange(wallet.id, "description", val)
                    }
                  />
                  <CustomAdminInput
                    title="Symbol"
                    value={wallet.symbol}
                    onChange={(val) =>
                      handleDepositChange(wallet.id, "symbol", val)
                    }
                  />

                  <CircleUploader
                    section="deposit"
                    id={wallet.id}
                    preview={wallet.preview}
                    onUpload={handleDepositIconUpload}
                    onRemove={removeDepositIcon}
                  />
                  <div
                    className="flex items-end cursor-pointer text-red-500"
                    onClick={() => removeDepositWallet(wallet.id)}
                  >
                    <FaTrash size={20} />
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No deposit wallets yet</p>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <button
              onClick={addDepositWallet}
              className="flex items-center gap-2 text-white"
            >
              <FaPlus /> Add more
            </button>
            <button
              onClick={saveDepositWallets}
              disabled={!isDepositValid || loading}
              className={`titan-btn p-2 ${
                !isDepositValid || loading
                  ? "!bg-gray-400 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? "Sending ...." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* -------- Withdraw Section -------- */}

      <DepositWalletsTable wallets={wallets} fetchWallets={fetchWallets} />
      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(walletTotal / walletPerPage)}
          page={walletPage}
          onChange={handleWalletPageChange}
        />
      </div>
      <div className="withdraw-crypto mt-8">
        <p className="text-white text-lg font-semibold">Withdraw Crypto</p>
        <div className="border-2 space-y-4 mt-2 mb-6 border-[#383C47] rounded-xl p-6">
          <AnimatePresence>
            {withdrawWallets.length > 0 ? (
              withdrawWallets.map((wallet) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-4 items-end"
                >
                  <CustomAdminInput
                    title="Title"
                    value={wallet.title}
                    onChange={(val) =>
                      handleWithdrawChange(wallet.id, "title", val)
                    }
                  />
                  <CustomAdminInput
                    title="Network"
                    value={wallet.network}
                    onChange={(val) =>
                      handleWithdrawChange(wallet.id, "network", val)
                    }
                  />
                  <CustomAdminInput
                    title="Description"
                    value={wallet.description}
                    onChange={(val) =>
                      handleWithdrawChange(wallet.id, "description", val)
                    }
                  />

                  <CircleUploader
                    section="withdraw"
                    id={wallet.id}
                    preview={wallet.preview}
                    onUpload={handleWithdrawIconUpload}
                    onRemove={removeWithdrawIcon}
                  />
                  <div
                    className="flex items-end cursor-pointer text-red-500"
                    onClick={() => removeWithdrawWallet(wallet.id)}
                  >
                    <FaTrash size={20} />
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No withdraw wallets yet</p>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <button
              onClick={addWithdrawWallet}
              className="flex items-center gap-2 text-white"
            >
              <FaPlus /> Add more
            </button>
            <button
              onClick={saveWithdrawWallets}
              disabled={!isWithdrawValid}
              className={`titan-btn p-2 ${
                !isWithdrawValid ? "!bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <DepositCryptosTable cryptos={cryptos} fetchCryptos={fetchCryptos} />
      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(walletTotal / walletPerPage)}
          page={1}
          onChange={handleWalletPageChange}
        />
      </div>
    </div>
  );
}
