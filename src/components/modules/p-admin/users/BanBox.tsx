"use client";
import React, { useState, useEffect } from "react";
import AdminToggleSwitch from "@/components/Ui/AdminToggleSwitch/AdminToggleSwitch";
import CustomAdminInput from "../CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { useParams } from "next/navigation";

interface BanBoxProps {
  title: string;
  checked: boolean;
  apiPathBan: string;
  apiPathUnban: string;
  buttonText?: string;
  getBody?: (isChecked: boolean, code: string) => any;
}

export default function BanBox({
  title,
  checked,
  apiPathBan,
  apiPathUnban,
  buttonText = "Submit",
  getBody,
}: BanBoxProps) {
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  const [twoFaCode, setTwoFaCode] = useState<string>("");
  const { userInfo, fetchUserInfo } = useUserDocuments();
  const params = useParams();
  const id: any = params?.id;

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleSubmit = async () => {
    if (!userInfo?.tid) {
      toast.error("User TID not found");
      return;
    }

    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      if (!token) {
        toast.error("Token not found");
        return;
      }

      const apiPath = isChecked ? apiPathBan : apiPathUnban;

      const body = getBody
        ? getBody(isChecked, twoFaCode)
        : { code: twoFaCode || null };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}${apiPath}/${userInfo.tid}`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(
          res.message ||
            `${title} ${isChecked ? "enabled" : "disabled"} successfully`
        );
        fetchUserInfo(id);
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-information-switch border border-[#383C47] rounded-[.5rem] p-3">
      <div className="flex items-center w-full justify-between">
        <span className="text-white">{title}</span>
        <AdminToggleSwitch
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <CustomAdminInput
          title="2FA Code"
          value={twoFaCode}
          onChange={setTwoFaCode}
          type="text"
        />
        <button
          className="titan-btn mx-auto"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : buttonText}
        </button>
      </div>
    </div>
  );
}
