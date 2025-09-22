"use client";
import React, { useState } from "react";
import CustomAdminInput from "./CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TypeDropdown } from "./users/TypeDropdown";

interface RoiFormData {
  id: number;
  amount: string;
  percentage: string;
  type: "profit" | "loss" | "";
  date: string;
  commission: string;
  twoFaCode: string;
}
interface AddRoiProps {
  refetch: () => void;
}

export default function AddRoiForm({ refetch }: AddRoiProps) {
  const [roiData, setRoiData] = useState<RoiFormData[]>([
    {
      id: 1,
      amount: "",
      percentage: "",
      type: "",
      date: "",
      commission: "",
      twoFaCode: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    id: number,
    field: keyof RoiFormData,
    value: string
  ) => {
    setRoiData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };


  const handlePreview = async (item: RoiFormData) => {
    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      const value_type: "amount" | "percentage" = item.amount ? "amount" : "percentage";
      const value: string = item.amount || item.percentage || "";
      let month = 0;
      let year = 0;
      if (item.date) {
        const dateObj = new Date(item.date);
        month = dateObj.getMonth() + 1;
        year = dateObj.getFullYear();
      }
      const body = {
        value_type,
        value,
        type: item.type,
        month,
        year,
        twoFaCode: item.twoFaCode,
      };
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/roi/preview`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Preview generated successfully");
        handleChange(item.id, "commission", String(res.data.data.total_commission_payable));
      } else {
        toast.error(res.message || "Failed to generate preview");
      }
    } catch (err: any) {
      toast.error(err.message || "Error while previewing");
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async (item: RoiFormData) => {
    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      let month = 0;
      let year = 0;
      if (item.date) {
        const dateObj = new Date(item.date);
        month = dateObj.getMonth() + 1;
        year = dateObj.getFullYear();
      }
      const body = {
        percentage: item.percentage,
        month,
        year,
      };
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/roi/distribute`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Distribution successful");
        refetch();
      } else {
        toast.error(res.message || "Failed to distribute ROI");
      }
    } catch (err: any) {
      toast.error(err.message || "Error while distributing ROI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="add-roi-form space-y-4">
        {roiData.map((item) => (
          <div
            key={item.id}
            className="border-[2px] border-[#383C47] p-6 flex items-end gap-4 flex-wrap"
          >
            <CustomAdminInput
              title="Amount"
              value={item.amount}
              onChange={(val) => handleChange(item.id, "amount", val)}
            />
            <CustomAdminInput
              title="Percentage"
              value={item.percentage}
              onChange={(val) => handleChange(item.id, "percentage", val)}
            />
            <div className="w-48">
              <label className="block font-medium text-white mb-2">Type</label>
              <TypeDropdown
                value={item.type}
                onChange={(val) => handleChange(item.id, "type", val)}
              />
            </div>
            <CustomAdminInput
              title="Date"
              type="date"
              value={item.date}
              onChange={(val) => handleChange(item.id, "date", val)}
            />
            <CustomAdminInput
              title="Commission Calculator"
              value={item.commission}
              onChange={(val) => handleChange(item.id, "commission", val)}
            />
            <CustomAdminInput
              title="2FA Code"
              value={item.twoFaCode}
              onChange={(val) => handleChange(item.id, "twoFaCode", val)}
            />
            <button
              onClick={() => handlePreview(item)}
              disabled={loading}
              className="titan-btn"
            >
              {loading ? "Loading..." : "Preview"}
            </button>
            <button
              onClick={() => handleDistribute(item)}
              disabled={loading}
              className="titan-btn"
            >
              {loading ? "Loading..." : "Distribute"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
