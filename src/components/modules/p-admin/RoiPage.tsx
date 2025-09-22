"use client";
import React, { useEffect, useState } from "react";
import LineTitle from "./LineTitle";
import AddRoiForm from "./AddRoiForm";
import RoiListHistory, { RoiStatement } from "./RoiListHistory";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../EncryptData/SavedEncryptData";
import Pagination from "../UserPanel/Pagination/Pagination";


export interface RoiMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface RoiResponse {
  success: boolean;
  message: string;
  data: RoiStatement[];
  meta: RoiMeta;
  errors: null | Record<string, any>;
}

// --- Component ---
export default function RoiPage() {
  const [showLineTitle, setShowLineTile] = useState({
    profit_loss: true,
  });

  const [statements, setStatements] = useState<RoiStatement[]>([]);
  const [meta, setMeta] = useState<RoiMeta | null>(null);
  const [page, setPage] = useState(1); 

  const fetchRoiStatements = async (pageNumber: number = 1) => {
    const token = loadEncryptedData()?.token;

    const response = await apiRequest<RoiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/roi/statements?page=${pageNumber}`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (response.success) {
      setStatements(response.data.data);
      setMeta(response.data.meta);
    }
  };

  useEffect(() => {
    fetchRoiStatements(page);
  }, [page]);

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            profit_loss: !showLineTitle.profit_loss,
          }));
        }}
        title="Profit & Loss"
      />

      {showLineTitle.profit_loss && (
        <AnimationTemplate>
          <AddRoiForm  refetch={fetchRoiStatements}/>

          <RoiListHistory
            data={statements}
 
          />

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="flex justify-center items-center mt-4">
              <Pagination
                count={meta.last_page} 
                page={page} 
                onChange={(_, value) => setPage(value)} 
              />
            </div>
          )}
        </AnimationTemplate>
      )}
    </>
  );
}
