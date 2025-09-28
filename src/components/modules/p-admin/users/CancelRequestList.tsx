"use client";
import React, { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { CancelRequest } from "./CancelAccountPage";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface Props {
  requests?: CancelRequest[];
  refetch: () => void; 
}

export default function CancelRequestList({ requests = [], refetch }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<CancelRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = (request: CancelRequest) => {
    setSelectedRequest(request);
    setRejectReason("");
    setShowTextarea(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setRejectReason("");
    setShowTextarea(false);
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedRequest) return;

    if (action === "reject" && !rejectReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        action === "approve"
          ? `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/cancellations/${selectedRequest.id}/approve`
          : `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/cancellations/${selectedRequest.id}/reject`;

      const body = action === "reject" ? { reason: rejectReason } : undefined;

      const res = await apiRequest<any>(endpoint, "POST", body, {
        Authorization: `Bearer ${token}`,
      });

      if (res.success) {
        toast.success(`Request ${action}d successfully!`);
        handleCloseModal();
        refetch(); // refresh table
      } else {
        toast.error(res.message || "Error performing action.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error performing action.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: TableColumn<CancelRequest>[] = [
    { title: "Date", field: "date" },
    { title: "Name", field: "name" },
    { title: "User ID", field: "t_id" },
    { title: "Deposit", field: "deposit" , render : (_ , row) =>  <span>{formatToTwoDecimals(row.deposit)}</span>},
    { title: "To be Received", field: "to_be_received" },
    {
      title: "Status",
      field: "status",
      render: (value: any) => {
        const color =
          value === "approved"
            ? "#A8FFAE"
            : value === "rejected"
            ? "#FF6060"
            : "#FED563";
        return <span style={{ color, fontWeight: 600 }}>{value}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <a
            href={row.cancel_doc_url}
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          >
            <FaEye />
          </a>
          <button
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            onClick={() => handleEditClick(row)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<CancelRequest> columns={columns} data={requests} title={`Cancel Request Count: ${requests.length}`}/>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-[400px] shadow-xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Review Cancel Request</h2>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-semibold">User:</span> {selectedRequest.name} (ID:{" "}
                {selectedRequest.t_id})
              </p>
              <p>
                <span className="font-semibold">Deposit:</span> {selectedRequest.deposit}
              </p>
              <p>
                <span className="font-semibold">To be Received:</span>{" "}
                {selectedRequest.to_be_received}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {selectedRequest.date}
              </p>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <button
                className="bg-green-600 hover:bg-green-500 text-white py-2 rounded transition-colors disabled:opacity-50"
                onClick={() => handleAction("approve")}
                disabled={isSubmitting}
              >
                Approve
              </button>

              <button
                className="bg-red-600 hover:bg-red-500 text-white py-2 rounded transition-colors disabled:opacity-50"
                onClick={() => setShowTextarea(true)}
                disabled={isSubmitting}
              >
                Reject
              </button>
            </div>

            {/* Textarea appears only if reject clicked */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showTextarea ? "max-h-40 mb-4" : "max-h-0"
              }`}
            >
              {showTextarea && (
                <textarea
                  className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded resize-none transition-colors"
                  placeholder="Enter rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
              )}
              {showTextarea && (
                <button
                  className="mt-2 w-full bg-red-500 hover:bg-red-400 py-2 rounded text-white transition-colors disabled:opacity-50"
                  onClick={() => handleAction("reject")}
                  disabled={isSubmitting}
                >
                  Submit Rejection
                </button>
              )}
            </div>

            <button
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-white transition-colors"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
