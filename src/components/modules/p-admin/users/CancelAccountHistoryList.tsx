"use client";
import React, { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { CancelRequest } from "./CancelAccountPage";
import { toast, ToastContainer } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface Props {
  requests?: CancelRequest[];
  refetch: () => void;
}

export default function CancelRequestTable({ requests = [], refetch }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<CancelRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleEditClick = (req: CancelRequest, type: "view" | "edit") => {
    setSelectedRequest(req);
    setRejectReason("");
    setShowTextarea(false);
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setRejectReason("");
    setShowTextarea(false);
    setModalType(null);
    setIsApproving(false);
    setIsRejecting(false);
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedRequest) return;

    if (action === "reject" && !rejectReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }

    if (action === "approve") setIsApproving(true);
    else setIsRejecting(true);

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
        refetch();
      } else {
        toast.error(res.message || "Error performing action.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error performing action.");
    } finally {
      setIsApproving(false);
      setIsRejecting(false);
    }
  };

  const columns: TableColumn<CancelRequest>[] = [
    { title: "Date", field: "date" },
    { title: "Name", field: "name" },
    { title: "User ID", field: "t_id" },
    { title: "Email", field: "email" },
    { title: "Mobile", field: "phone" },
    { title: "Position", field: "position" },
    {
      title: "Deposit",
      field: "deposit",
      render: (_, row) => <span>{formatToTwoDecimals(row.deposit)}</span>,
    },
    {
      title: "Balance",
      field: "balance",
      render: (_, row) => <span>{formatToTwoDecimals(row.balance)}</span>,
    },
    {
      title: "Income",
      field: "income",
      render: (_, row) => <span>{formatToTwoDecimals(row.balance)}</span>,
    },
    { title: "Cancel Reason", field: "cancel_reason" },
    { title: "Penalty", field: "penalty" },
    { title: "To be Received", field: "to_be_received" },
    { title: "Wallet Type", field: "wallet_type" },
    { title: "Wallet Address", field: "wallet_address" },
    { title: "Cancel Date", field: "cancel_date" },
    { title: "TXID", field: "txid" },
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
          {/* <button
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            onClick={() => handleEditClick(row, "view")}
          >
            <FaEye />
          </button> */}
          <button
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            onClick={() => handleEditClick(row, "edit")}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <AdminDynamicTable<CancelRequest> columns={columns} data={requests} title="Cancel History"/>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-[400px] shadow-xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">
              {modalType === "view"
                ? "Cancel Request Details"
                : "Review Cancel Request"}
            </h2>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-semibold">User:</span>{" "}
                {selectedRequest.name} (ID: {selectedRequest.t_id})
              </p>
              <p>
                <span className="font-semibold">Deposit:</span>{" "}
                {selectedRequest.deposit}
              </p>
              <p>
                <span className="font-semibold">To be Received:</span>{" "}
                {selectedRequest.to_be_received}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {selectedRequest.date}
              </p>
              <p>
                <span className="font-semibold">Document:</span>{" "}
                <a
                  href={selectedRequest.cancel_doc_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View/Download
                </a>
              </p>
            </div>

            {modalType === "edit" && (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  <button
                    className="bg-green-600 hover:bg-green-500 text-white py-2 rounded transition-colors disabled:opacity-50"
                    onClick={() => handleAction("approve")}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>

                  <button
                    className="bg-red-600 hover:bg-red-500 text-white py-2 rounded transition-colors disabled:opacity-50"
                    onClick={() => setShowTextarea(true)}
                    disabled={isApproving || isRejecting}
                  >
                    {isRejecting ? "Processing..." : "Reject"}
                  </button>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    showTextarea ? "max-h-40 mb-4" : "max-h-0"
                  }`}
                >
                  {showTextarea && (
                    <>
                      <textarea
                        className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded focus:outline-none focus:border-blue-500"
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                      />

                      <button
                        className="mt-2 w-full bg-red-500 hover:bg-red-400 py-2 rounded text-white transition-colors disabled:opacity-50"
                        onClick={() => handleAction("reject")}
                        disabled={isRejecting || isApproving}
                      >
                        {isRejecting ? "Rejecting..." : "Submit Rejection"}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            <button
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-white transition-colors"
              onClick={handleCloseModal}
              disabled={isApproving || isRejecting}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
