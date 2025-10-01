"use client";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React, { useState } from "react";
import { FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import AdminToggleSwitch from "@/components/Ui/AdminToggleSwitch/AdminToggleSwitch";

export interface Ticket {
  id: number;
  client_id: number;
  department_id: number;
  subject: string;
  status: string;
  priority: "Low" | "Medium" | "High";
  last_reply_at: string;
  created_at: string;
  updated_at: string;
  client: {
    id: number;
    tid: number;
    has_ticket_cooldown: boolean;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
  };
  department: {
    id: number;
    name: string;
  };
  replies: {
    id: number;
    message: string;
    created_at: string;
  }[];
}

interface TicketListProps {
  tickets: Ticket[];
  refetch: () => void;
}

export default function TicketList({ tickets, refetch }: TicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [closeModal, setCloseModal] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCloseTicket = async (ticketId: number) => {
    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/tickets/${ticketId}/close`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Ticket closed successfully!");
        setCloseModal(null);
        refetch();
      } else {
        toast.error(res.message || "this ticket already closed");
      }
    } catch (err: any) {
      toast.error(
        "Failed to close ticket: " + (err?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCanSend = async (ticketId: number, value: boolean) => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/toggleTicketCooldown/${ticketId}`,
        "POST",
        { enabled: value },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Updated successfully");
        refetch();
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch (err: any) {
      toast.error("Update failed: " + (err?.message || "Unknown error"));
    }
  };

  const columns: TableColumn<Ticket>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Subject", field: "subject" },
    {
      title: "Full Name",
      field: "client",
      render: (_, row) => `${row.client.first_name} ${row.client.last_name}`,
    },
    { title: "Priority", field: "priority" },
    {
      title: "Status",
      field: "status",
      render: (_, value) => {
        let color = "gray";
        switch (value?.status?.toLowerCase()) {
          case "open":
            color = "text-green-400";
            break;
          case "client_reply":
            color = "text-blue-400";
            break;
          case "admin_reply":
            color = "text-orange-400";
            break;
          case "closed":
            color = "text-red-400";
            break;
          default:
            color = "text-gray-400";
        }
        return (
          <span style={{ color, fontWeight: "bold" }}>{value.status}</span>
        );
      },
    },
    {
      title: "Can Send Messages",
      field: "client",
      render: (_, row) => (
        <AdminToggleSwitch
          checked={row.client.has_ticket_cooldown}
          onChange={(val: boolean) => {
            handleToggleCanSend(row.client.id, val);
          }}
        />
      ),
    },
    {
      title: "Department",
      field: "department",
      render: (_, row) => row.department.name,
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-1 rounded text-blue-500"
            onClick={() => setSelectedTicket(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-blue-500"
            onClick={() => router.push(`tickets-receive/${row.id}`)}
          >
            <FaEdit />
          </button>
          <button
            className="p-1 rounded text-red-500"
            onClick={() => setCloseModal(row)}
            title="Close Ticket"
          >
            <FaTimes />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<Ticket> columns={columns} data={tickets} />
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              className="bg-[#1F2028] p-6 rounded-md w-96 relative text-white shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
              <p>
                <strong>TID:</strong> {selectedTicket.client.tid}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedTicket.client.first_name}{" "}
                {selectedTicket.client.last_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedTicket.client.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedTicket.status}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTicket.priority}
              </p>
              <p>
                <strong>Subject:</strong> {selectedTicket.subject}
              </p>
              <p>
                <strong>Department:</strong> {selectedTicket.department.name}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {closeModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCloseModal(null)}
          >
            <motion.div
              className="bg-[#1F2028] p-6 rounded-md w-80 relative text-white shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4">Confirm Close Ticket</h2>
              <p>
                Are you sure you want to close ticket{" "}
                <strong>{closeModal.subject}</strong>?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setCloseModal(null)}
                  className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCloseTicket(closeModal.id)}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Closing..." : "Close Ticket"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
