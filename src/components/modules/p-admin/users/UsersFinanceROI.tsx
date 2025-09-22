"use client";
import React, { useState } from "react";
import CustomAdminInput from "../CustomAdminInput";
import { Checkbox } from "@mui/material";
import { useParams } from "next/navigation";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserDocuments } from "@/contextApi/DocumentContext";

export default function UsersFinanceROI() {
  const params = useParams();
  const { id }: any = params;
  const { fetchUserInfo } = useUserDocuments()

  const [amount, setAmount] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [commissionIncluded, setCommissionIncluded] = useState(true);
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
        user_id: id,
        amount: numericAmount,
        type,
        send_commission: commissionIncluded,
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
        fetchUserInfo(id)
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
    <div className="admin-template-box my-4">
      <p className="text-white">ROI</p>
      <div className="flex items-center flex-wrap mt-1 gap-4 p-4 border-[2px] border-[#383C47] rounded-lg">
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
      </div>

      <div className="flex items-center mt-4">
        <Checkbox
          checked={commissionIncluded}
          onChange={(e) => setCommissionIncluded(e.target.checked)}
          sx={{
            color: "#275EDF",
            "&.Mui-checked": { color: "#275EDF" },
          }}
        />
        <span
          className="text-white select-none cursor-pointer"
          onClick={() => setCommissionIncluded(!commissionIncluded)}
        >
          Commission include
        </span>
      </div>
    </div>
  );
}
