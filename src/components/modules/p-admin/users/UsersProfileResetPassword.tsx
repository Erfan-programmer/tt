"use client";
import React, { useState } from "react";
import AdminTemplateBox from "../AdminTemplateBox";
import CustomAdminInput from "../CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { useParams } from "next/navigation";

export default function UsersProfileResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const params: any = useParams();
  const id = params?.id;
  const { fetchUserInfo } = useUserDocuments();
  const handleSave = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password!");
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
        new_password: newPassword,
        code: twoFaCode || null,
      };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/userResetPassword/${id}`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Password successfully changed!");
        setNewPassword("");
        fetchUserInfo(id);
        setTwoFaCode("");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPassword("");
    setTwoFaCode("");
  };

  return (
    <AdminTemplateBox title="Reset Password">
      <CustomAdminInput
        title="New Password"
        value={newPassword}
        onChange={setNewPassword}
        type="password"
      />
      <CustomAdminInput
        title="2FA Code"
        value={twoFaCode}
        onChange={setTwoFaCode}
        type="password"
      />

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="titan-btn bg-[#1CC700] text-white hover:opacity-90 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="titan-cancel-btn bg-[#FF6060] text-white hover:opacity-90 transition"
        >
          Cancel
        </button>
      </div>
    </AdminTemplateBox>
  );
}
