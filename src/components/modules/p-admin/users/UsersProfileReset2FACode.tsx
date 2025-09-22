"use client";
import React, { useState } from "react";
import AdminTemplateBox from "../AdminTemplateBox";
import CustomAdminInput from "../CustomAdminInput";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { useParams } from "next/navigation";
import { apiRequest } from "@/libs/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";

export default function UsersProfileReset2FACode() {
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [admin2FACode, setAdmin2FACode] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUserInfo, userInfo } = useUserDocuments();
  const params: any = useParams();
  const id = params?.id;

  const handleSave = async () => {
    if (!penaltyAmount || !admin2FACode) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const payload = {
      penalty_amount: penaltyAmount,
      admin_2fa_code: admin2FACode,
    };
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/resetUser2faCode/${userInfo?.tid}`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("2FA reset successfully!");
        fetchUserInfo(id);
      } else {
        toast.error(res.message || "Failed to reset 2FA");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminTemplateBox title="Reset 2FA">
      <ToastContainer position="top-center" autoClose={3000} />

      <CustomAdminInput
        title="Penalty Amount Fee"
        value={penaltyAmount}
        onChange={setPenaltyAmount}
        type="text"
      />
      <CustomAdminInput
        title="Admin 2FA Code"
        value={admin2FACode}
        onChange={setAdmin2FACode}
        type="password"
      />

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="titan-btn bg-[#1CC700] text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </AdminTemplateBox>
  );
}
