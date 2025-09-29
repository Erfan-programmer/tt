"use client";
import React, { useState } from "react";
import { LuRotateCw } from "react-icons/lu";
import ImageMagnifire from "../ImageMagnifire";
import Image from "next/image";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { FaTrash } from "react-icons/fa";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { useParams } from "next/navigation";

interface DocumentItem {
  id: number;
  client_id: number;
  type: "passport" | "national_id" | "driver_license";
  url: string;
  status: string;
  verified_by: number | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  verifier: string | null;
}

export default function AdminVerificationStepBox({
  data,
}: {
  data: DocumentItem;
}) {
  const [rotation, setRotation] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [status, setStatus] = useState<DocumentItem["status"]>(data.status);
  const [loading, setLoading] = useState(false);
  const { fetchUserInfo } = useUserDocuments();
  const params = useParams();

  const rotateClockwise = () => setRotation((prev) => prev + 90);
  const rotateCounterClockwise = () => setRotation((prev) => prev - 90);

  const handleVerify = async (
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    setLoading(true);
    try {
      const payload: any = {
        type: data.type,
        status: newStatus,
      };
      if (newStatus === "rejected") {
        payload.reject_reason = rejectReason;
      }

      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/documents/${data.id}/verify`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setStatus(newStatus);
        setShowRejectModal(false);
        setRejectReason("");
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/documents/${data.id}/delete/${params?.id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        fetchUserInfo(Number(params?.id));
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  return (
    <div className="admin-verification-step-box flex flex-col">
      <div className="flex flex-col items-center justify-center border-[2px] relative rounded-[.5rem] overflow-hidden border-[#383C47] w-[100%] sm:w-[90%] mx-auto h-64">
        <button
          onClick={handleDeleteDocument}
          className="absolute top-0 p-1 right-0 z-[9999]"
        >
          <FaTrash className="text-red-400" size={24} />
        </button>
        <div className="verification-image flex items-center justify-between gap-4 ">
          <button
            onClick={rotateCounterClockwise}
            className="flex items-center justify-center translate-x-4"
          >
            <LuRotateCw className="text-[#275EDF] text-2xl scale-x-[-1]" />
          </button>

          <Image
            width={400}
            height={400}
            src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${data.url}`}
            className="max-w-60 w-60 max-h-52 object-cover rounded-xl transition-transform duration-300"
            alt={data.type}
            style={{ transform: `rotate(${rotation}deg)` }}
          />

          <button
            onClick={rotateClockwise}
            className="flex items-center justify-center -translate-x-4"
          >
            <LuRotateCw className="text-[#275EDF] text-2xl" />
          </button>
        </div>
      </div>

      <p className="text-center mt-2 text-sm text-gray-400">
        Type: {data.type} | Status:{" "}
        <span
          className={
            status === "approved"
              ? "text-green-500"
              : status === "rejected"
              ? "text-red-500"
              : "text-yellow-500"
          }
        >
          {status}
        </span>
      </p>

      <div className="flex flex-col gap-2 w-[90%] mx-auto mt-4">
        {status === "pending" && (
          <>
            <button
              className="titan-btn !rounded-[.5rem]"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
            <button
              disabled={loading}
              className="bg-[#1CC700] py-2 text-white !rounded-[.5rem] disabled:opacity-50"
              onClick={() => handleVerify("approved")}
            >
              {loading ? "Processing..." : "Approve"}
            </button>
            <button
              disabled={loading}
              className="bg-[#FF6060] py-2 text-white !rounded-[.5rem] disabled:opacity-50"
              onClick={() => setShowRejectModal(true)}
            >
              Reject
            </button>
          </>
        )}

        {status === "approved" && (
          <>
            <button
              disabled={loading}
              className="bg-[#FF6060] py-2 text-white !rounded-[.5rem] disabled:opacity-50"
              onClick={() => setShowRejectModal(true)}
            >
              Reject
            </button>
            <button
              disabled={loading}
              className="bg-[#FACC15] py-2 text-black !rounded-[.5rem] disabled:opacity-50"
              onClick={() => handleVerify("pending")}
            >
              {loading ? "Processing..." : "Set Pending"}
            </button>
          </>
        )}

        {status === "rejected" && (
          <>
            <button
              disabled={loading}
              className="bg-[#1CC700] py-2 text-white !rounded-[.5rem] disabled:opacity-50"
              onClick={() => handleVerify("approved")}
            >
              {loading ? "Processing..." : "Approve"}
            </button>
            <button
              disabled={loading}
              className="bg-[#FACC15] py-2 text-black !rounded-[.5rem] disabled:opacity-50"
              onClick={() => handleVerify("pending")}
            >
              {loading ? "Processing..." : "Set Pending"}
            </button>
          </>
        )}
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 bg-black/40  bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreview(false);
          }}
        >
          <div className="relative bg-[var(--admin-bg-main)] p-4 rounded-lg w-[90%] max-w-3xl max-h-[80vh] flex flex-col items-center overflow-auto">
            <button
              className="absolute top-2 right-2 text-xl text-gray-700"
              onClick={() => setShowPreview(false)}
            >
              ✖
            </button>

            <div
              style={{ transform: `rotate(${rotation}deg)` }}
              className="w-full flex items-center justify-center"
            >
              <ImageMagnifire
                imageUrl={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${data.url}`}
              />
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/40  bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[10000]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRejectModal(false);
          }}
        >
          <div className="relative bg-[var(--admin-bg-main)] p-6 rounded-lg w-[90%] max-w-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Reason for Rejection
            </h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-32 p-2 rounded border border-gray-500 bg-[var(--admin-bg-secondary)] text-white focus:outline-none"
            />
            <div className="flex gap-4 mt-4">
              <button
                disabled={loading}
                className="bg-[#FF6060] py-2 px-4 rounded text-white disabled:opacity-50"
                onClick={() => handleVerify("rejected")}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="bg-gray-500 py-2 px-4 rounded text-white"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
