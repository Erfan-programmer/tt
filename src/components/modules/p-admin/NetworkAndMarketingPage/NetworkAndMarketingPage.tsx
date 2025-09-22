"use client";
import React, { useEffect, useState } from "react";
import LineTitle from "../LineTitle";
import AdminTemplateBox from "../AdminTemplateBox";
import CustomAdminInput from "../CustomAdminInput";
import CreateNewRankForm from "./CreateNewRankForm";
import RanksListHistory from "./RanksListHistory";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../UserPanel/Pagination/Pagination";

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Rank {
  id: number;
  name: string;
  level: number;
  min_sales_volume: number;
  prize_description: string | null;
  required_downline_rank_id: number | null;
  required_downline_rank_count: number;
  rewards: string | null;
  tournament_prize_amount: string;
  created_at: string;
  updated_at: string;
  icon_path: string | null;
  description: string | null;
}

interface RanksApiResponse {
  data: {
    success: boolean;
    message: string;
    data: Rank[];
    meta: Meta;
    errors: any;
  };
}

export default function NetworkAndMarketingPage() {
  const [twoFaCode, setTwoFaCode] = useState("");
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [level, setLevel] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSave = async () => {
    if (!level) return toast.error("Please enter a valid level");
    if (!twoFaCode) return toast.error("Please enter 2FA code");

    setSaving(true);
    try {
      const token = loadEncryptedData()?.token;
      if (!token) return toast.error("User token not found");

      const res = await apiRequest<RanksApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/updateAnnualMaxLevelDepth`,
        "POST",
        { level, twoFaCode },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(
          res.message || "Annual Sales Level updated successfully!"
        );
        setLevel("");
        setTwoFaCode("");
        fetchAllRanks(currentPage);
      } else {
        toast.error(res.message || "Failed to update Annual Sales Level");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  const fetchAllRanks = async (page: number = 1) => {
    try {
      setLoadingRanks(true);
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ranks?page=${page}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res?.success) {
        const response = res as RanksApiResponse;
        setRanks(response.data.data);
        setMeta(response.data.meta);
        setCurrentPage(response.data.meta.current_page);
      } else {
        console.error("Failed to fetch ranks", res?.message);
      }
    } catch (err) {
      console.error("Error fetching ranks:", err);
    } finally {
      setLoadingRanks(false);
    }
  };

  useEffect(() => {
    fetchAllRanks(currentPage);
  }, [currentPage]);

  return (
    <>
      <LineTitle onClick={() => {}} title="Ranks" />
      <ToastContainer />
      <AdminTemplateBox title="Annual sales Level">
        <CustomAdminInput
          title="Enter Annual Sales Level"
          value={level}
          onChange={setLevel}
        />
        <CustomAdminInput
          title="2FA Code"
          value={twoFaCode}
          onChange={setTwoFaCode}
          type="text"
        />
        <button
          className={`titan-btn mt-8 w-fit !px-[5rem] ${
            saving ? "bg-gray-500 cursor-not-allowed" : ""
          }`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </AdminTemplateBox>

      <CreateNewRankForm refetch={fetchAllRanks} />

      {/* Pagination */}

      <RanksListHistory
        ranks={ranks}
        loading={loadingRanks}
        refetch={fetchAllRanks}
      />
      {meta && (
        <div className="flex justify-center items-center">
          <Pagination
            count={Math.ceil(meta.total / meta.per_page)}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
          />
        </div>
      )}
    </>
  );
}
