"use client";
import React, { useState } from "react";
import AdminTemplateBox from "../AdminTemplateBox";
import CustomAdminInput from "../CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { useParams } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function UsersProfileEmailChange() {
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUserInfo } = useUserDocuments();
  const params: any = useParams();
  const id = params?.id;
  const handleSave = async () => {
    if (!newEmail || !code) {
      toast("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      if (!token) {
        toast("Token not found");
        return;
      }

      const body = {
        new_email: newEmail,
        code: code,
      };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/userChangeEmail/${id}`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Email successfully changed!");
        setNewEmail("");
        setCode("");
        fetchUserInfo(id);
      } else {
        toast.error(res.message || "Failed to change email");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
      <AdminTemplateBox title="Reset Email">
        <CustomAdminInput
          title="New Email"
          value={newEmail}
          onChange={setNewEmail}
          type="email"
        />
        <CustomAdminInput
          title="Admin 2FA Code"
          value={code}
          onChange={setCode}
          type="text"
        />

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="titan-btn bg-[#1CC700] text-white hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </AdminTemplateBox>
    </>
  );
}
