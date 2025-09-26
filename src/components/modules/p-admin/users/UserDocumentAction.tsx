"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VscTriangleDown } from "react-icons/vsc";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useUserDocuments } from "@/contextApi/DocumentContext";

export default function UserDocumentAction() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const id = params?.id;
  const { documents, fetchUserInfo } = useUserDocuments();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState({ label: "Accept All", value: "approved" });

  const filterOptions = [
    { label: "Accept All", value: "approved" },
    { label: "Reject All", value: "rejected" },
    { label: "Pending All", value: "pending" },
  ];

  const handleSubmit = async () => {
    if (!documents || documents.length === 0) return;
    const uniqueTypes = Array.from(new Set(documents.map(doc => doc.type)));
    if (uniqueTypes.length > 1) {
      toast.error("Documents have different types. Cannot submit together.");
      return;
    }
    if (selectedAction.value === "rejected") {
      setShowRejectModal(true);
      return;
    }
    await submitAction(selectedAction?.value, uniqueTypes[0]);
  };

  const submitAction = async (status:string, type: string) => {
    setLoading(true);
    try {
      const token = loadEncryptedData()?.token;
      const payload: any = { status, type };
      if (status === "rejected") payload.reject_reason = rejectReason;

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/documents/verifyAll/${id}`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Documents updated successfully");
        setShowRejectModal(false);
        setRejectReason("");
        fetchUserInfo(Number(id));
      } else {
        toast.error(res.message || "Failed to update documents");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("API error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-transaction-search-box-content border-2 my-8 border-[#383C47] rounded-xl p-4 sm:p-6 flex flex-wrap xl:flex-nowrap items-start sm:items-center justify-start gap-4 bg-[#111827]">
      <div className="relative w-full sm:w-64" ref={dropdownRef}>
        <label className="text-white mb-2 text-md font-medium">Select Your Action</label>
        <div
          className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{selectedAction.label}</span>
          <VscTriangleDown
            className={`transition-transform text-white text-xl ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </div>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
            >
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                  onClick={() => {
                    setSelectedAction(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2 w-full sm:w-auto mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="titan-btn !rounded-md flex-1 sm:flex-none disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black/40  bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[10000]"
          onClick={(e) => { if (e.target === e.currentTarget) setShowRejectModal(false); }}
        >
          <div className="relative bg-[var(--admin-bg-main)] p-6 rounded-lg w-[90%] max-w-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-white">Reason for Rejection</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-32 p-2 rounded border border-gray-500 bg-[var(--admin-bg-secondary)] text-white focus:outline-none"
            />
            <div className="flex gap-4 mt-4">
              <button
                disabled={loading || !rejectReason}
                className="bg-[#FF6060] py-2 px-4 rounded text-white disabled:opacity-50"
                onClick={() => submitAction("rejected", documents[0].type)}
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
