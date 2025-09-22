"use client";
import React, { useState } from "react";
import AdminTemplateBox from "../AdminTemplateBox";
import CustomAdminInput from "../CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersFinanceTWallet() {
  const [amount, setAmount] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (type: "increase" | "decrease") => {
    const numericAmount = parseFloat(amount) || 0;
    if (!numericAmount) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      if (!token) {
        toast.error("Token not found");
        return;
      }

      const body = {
        amount: numericAmount,
        type,
        code: twoFaCode || null,
      };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/transferTWallet/2`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(`T-Wallet ${type}d successfully!`);
        setAmount("");
        setTwoFaCode("");
      } else {
        toast.error(res.message || "Failed to process request");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminTemplateBox title="T-Wallet">
      <CustomAdminInput title="Amount" value={amount} onChange={setAmount} />
      <CustomAdminInput
        title="2FA Code"
        value={twoFaCode}
        onChange={setTwoFaCode}
        type="text"
      />

      <div className="flex items-center gap-4 mt-8 justify-center sm:justify-start flex-wrap">
        <button
          onClick={() => handleTransfer("increase")}
          disabled={loading}
          className="py-[.5rem] px-[3rem] rounded-[.5rem] bg-[#1CC700] text-white hover:opacity-90 transition"
        >
          {loading ? "Processing..." : "Increase"}
        </button>
        <button
          onClick={() => handleTransfer("decrease")}
          disabled={loading}
          className="py-[.5rem] px-[3rem] rounded-[.5rem] bg-[#FF6060] text-white hover:opacity-90 transition"
        >
          {loading ? "Processing..." : "Decrease"}
        </button>
      </div>
    </AdminTemplateBox>
  );
}
