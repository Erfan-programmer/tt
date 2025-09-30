"use client";
import { FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import AdminDynamicTable, { TableColumn } from "../../AdminTable";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

export interface UnClaimerDataType {
  id: number;
  client_id: number;
  rank_id: number;
  prize_description: string;
  cash_value: string;
  type: string;
  status: string;
  client: {
    tid: number;
  };
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_address: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  shipping_phone: string | null;
  wallet_address: string | null;
  currency: string | null;
  identification_document_path: string | null;
  created_at: string;
}

export interface UnClaimerResponse {
  success: boolean;
  message: string;
  data: UnClaimerDataType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  errors: null;
}

export default function CashAwardRecipientList({
  recipients,
  refetch,
}: {
  refetch: () => void;
  recipients: UnClaimerDataType[];
}) {
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState<UnClaimerDataType | null>(null);
  const [editData, setEditData] = useState<UnClaimerDataType | null>(null);
  const token = loadEncryptedData()?.token;
  const auth = useMemo(() => {
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const handleApprove = async (id: number) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/approveUnclaimedPrize/${id}`,
        "POST",
        undefined,
        auth
      );
      if (res.success) {
        toast.success("Approved successfully!");
        setViewData(null);
        refetch();
      } else {
        toast.error(res.message || "Approval failed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/rejectUnclaimedPrize/${id}`,
        "POST",
        undefined,
        auth
      );
      if (res.success) {
        toast.success("Rejected successfully!");
        setViewData(null);
        refetch();
      } else {
        toast.error(res.message || "Rejection failed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<UnClaimerDataType>[] = [
    { title: "ID", field: "id", render: (_value, _row, index) => index },
    {
      title: "Date",
      field: "created_at",
      render: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "User",
      field: "client",
      render: (_value, row) => row.client?.tid || "-",
    },
    { title: "Rank", field: "rank_id" },
    { title: "Prize", field: "prize_description" },
    { title: "currency", field: "currency" },
    { title: "Wallet Type", field: "type" },
    { title: "Wallet Address", field: "wallet_address" },
    {
      title: "Status",
      field: "status",
      render: (value: any) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === "approved"
              ? "text-green-400 "
              : value === "pending"
              ? "text-yellow-400"
              : "text-red-400 "
          }`}
        >
          {value || "-"}
        </span>
      ),
    },
    {
      title: "Action",
      field: "id",
      render: (_value, row: UnClaimerDataType) => (
        <div className="flex items-center">
          <button
            className="px-3 py-1  text-white rounded transition"
            onClick={() => setViewData(row)}
          >
            <FaEye />
          </button>
          <button
            className="px-3 py-1  text-white rounded transition"
            onClick={() => setEditData(row)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<UnClaimerDataType>
        columns={columns}
        data={recipients}
        title="Award Recipients"
        loading={loading}
      />
      {viewData && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setViewData(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 p-6 rounded-xl w-[500px] space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setViewData(null)}
              >
                <FaTimes />
              </button>
              <p className="text-white text-lg font-semibold">
                Recipient Details
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong>ID:</strong> {viewData.id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(viewData.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>User:</strong> {viewData.client?.tid}
                </p>
                <p>
                  <strong>Rank:</strong> {viewData.rank_id}
                </p>
                <p>
                  <strong>Prize:</strong> {viewData.prize_description}
                </p>
                <p>
                  <strong>Wallet Type:</strong> {viewData.type}
                </p>
                <p>
                  <strong>Wallet Address:</strong> {viewData.wallet_address}
                </p>
                <p>
                  <strong>Status:</strong> {viewData.status}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {editData && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setEditData(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 p-6 rounded-xl w-[500px] space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setEditData(null)}
              >
                <FaTimes />
              </button>
              <p className="text-white text-lg font-semibold">
                Recipient Details
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong>ID:</strong> {editData.id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(editData.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>User:</strong> {editData.client?.tid}
                </p>
                <p>
                  <strong>Rank:</strong> {editData.rank_id}
                </p>
                <p>
                  <strong>Prize:</strong> {editData.prize_description}
                </p>
                <p>
                  <strong>Wallet Type:</strong> {editData.type}
                </p>
                <p>
                  <strong>Wallet Address:</strong> {editData.wallet_address}
                </p>
                <p>
                  <strong>Status:</strong> {editData.status}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-green-600 rounded text-white"
                  onClick={() => handleApprove(editData.id)}
                  disabled={loading}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 bg-red-600 rounded text-white"
                  onClick={() => handleReject(editData.id)}
                  disabled={loading}
                >
                  Reject
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                  onClick={() => setEditData(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
