"use client";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InternalWalletSection from "@/components/modules/p-admin/InternalWalletSection";
import { toast, ToastContainer } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";

interface Wallet {
  id: number;
  title: string;
  status: boolean;
}

export default function WalletConfigPages() {
  const [walletConfig, setWalletConfig] = useState<Wallet[]>([
    { id: 1, title: "Internal Wallets", status: true },
    { id: 2, title: "Payments gate way", status: false },
  ]);

  useEffect(() => {
    const token = loadEncryptedData()?.token;
    const fetchWalletConfig = async () => {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/getPaymentMode`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success && response.data) {
        const mode:any = response.data; 
        console.log("mode =>" , mode)
        setWalletConfig((prev) =>
          prev.map((wallet) => {
            if (mode.data === "wallet") {
              return {
                ...wallet,
                status: wallet.title.toLowerCase().includes("wallet"),
              };
            }
            if (mode.data === "gateway") {
              return {
                ...wallet,
                status: wallet.title.toLowerCase().includes("gate"),
              };
            }
            return wallet;
          })
        );
      }
    };

    fetchWalletConfig();
  }, []);

  const [showLineTitle, setShowLineTile] = useState({
    wallet_config: true,
  });

  const [loading, setLoading] = useState(false);

  const selectWallet = (id: number) => {
    setWalletConfig((prev) =>
      prev.map((wallet) => ({
        ...wallet,
        status: wallet.id === id,
      }))
    );
  };

  const saveWalletConfigHandler = async () => {
    const selected = walletConfig.find((w) => w.status);
    if (!selected) return;

    const payment_mode = selected.title.toLowerCase().includes("wallet")
      ? "wallet"
      : "gateway";

    setLoading(true);
    const token = loadEncryptedData()?.token;

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/changePaymentMode`,
        "POST",
        { payment_mode },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success) {
        toast.success("Payment mode updated successfully!");
      } else {
        toast.error("Error: " + res.message);
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            wallet_config: !prev.wallet_config,
          }));
        }}
        title="Wallet Address Config"
      />
      <ToastContainer />
      {showLineTitle.wallet_config && (
        <AnimationTemplate>
          <div className="wallet-option-choose-container mt-4">
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="flex items-center gap-4">
                {walletConfig.map((wallet) => (
                  <div
                    key={wallet.id}
                    onClick={() => selectWallet(wallet.id)}
                    className={`flex items-center gap-2 justify-between px-3 py-2 border-[1px] border-[#383C47] rounded-[.5rem] cursor-pointer transition-colors`}
                  >
                    <div className="w-6 h-6 rounded-full border-[2px] border-[#383C47] flex items-center justify-center p-[1px] bg-white">
                      <AnimatePresence>
                        {wallet.status && (
                          <motion.div
                            key="active"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                              duration: 0.3,
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                            }}
                            className="w-full h-full rounded-full bg-[#1CC700]"
                          ></motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="text-white">{wallet.title}</span>
                  </div>
                ))}
              </div>

              <button
                className={`titan-btn ${loading ? "!bg-gray-400" : ""}`}
                onClick={saveWalletConfigHandler}
              >
                {loading ? "sending..." : "Save Config"}
              </button>
            </div>
          </div>
        </AnimationTemplate>
      )}

      <InternalWalletSection />
    </>
  );
}
