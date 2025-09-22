"use client";
import React, { useState } from "react";
import AdminTemplateBox from "../AdminTemplateBox";
import CustomAdminInput from "../CustomAdminInput";
import { useParams } from "next/navigation";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersFinanceCommission() {
  const [amount, setAmount] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { id }: any = params;
  const { fetchUserInfo } = useUserDocuments();

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
        user_id: id,
        amount: numericAmount,
        type,
        code: twoFaCode || null,
      };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/transferCommission/2`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(`Amount ${type}d successfully!`);
        setAmount("");
        setTwoFaCode("");
        fetchUserInfo(id);
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
    <AdminTemplateBox title="Commission">
      <CustomAdminInput title="Amount" value={amount} onChange={setAmount} />
      <CustomAdminInput
        title="2FA Code"
        value={twoFaCode}
        onChange={setTwoFaCode}
        type="text"
      />

      <div className="flex items-center gap-4 mt-8 flex-wrap justify-center sm:justify-start">
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
