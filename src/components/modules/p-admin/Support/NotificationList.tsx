"use client";
import React, { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";

export interface Notification {
  id: string;
  notifiable_id: number;
  message: string;
  created_at: string;
  updated_at: string;
}

interface NotificationListProps {
  notifications: Notification[];
  refetch: () => void;
}

export default function NotificationList({
  notifications,
  refetch,
}: NotificationListProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [editMessage, setEditMessage] = useState("");

  const openEditModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setEditMessage(notification.message);
    setEditModalOpen(true);
  };

  const openDeleteModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setDeleteModalOpen(true);
  };
   const token = loadEncryptedData()?.token
  const handleEdit = async () => {
    if (!selectedNotification) return;
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateNotifications/${selectedNotification.id}`,
        "POST",
        { message: editMessage },
        { Authorization: `Bearer ${token}` }
      );
      if (response.success) {
        toast.success(response.message || "Notification updated successfully");
        setEditModalOpen(false);
        setSelectedNotification(null);
        refetch();
      } else {
        toast.error(response.error as any || "Failed to update notification");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notification");
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteNotifications/${selectedNotification.id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (response.success) {
        toast.success(response.message || "Notification deleted successfully");
        setDeleteModalOpen(false);
        setSelectedNotification(null);
        refetch();
      } else {
        toast.error(response.error as any || "Failed to delete notification");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateStr));

  const columns: TableColumn<Notification>[] = [
    { title: "ID", field: "id" },
    { title: "Message", field: "message" },
    { title: "User ID", field: "notifiable_id" },
    { title: "Created At", field: "created_at", render: (_, row) => formatDate(row.created_at) },
    { title: "Updated At", field: "updated_at", render: (_, row) => formatDate(row.updated_at) },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button className="p-1 rounded text-[#6A6A6A]" >
            <FaEye />
          </button>
          <button className="p-1 rounded text-[#6A6A6A]" onClick={() => openEditModal(row)}>
            <FaEdit />
          </button>
          <button className="p-1 rounded text-red-500" onClick={() => openDeleteModal(row)}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<Notification> columns={columns} data={notifications} />

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && selectedNotification && (
          <motion.div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#1E1E2F] p-6 rounded-lg w-[400px] relative"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <h2 className="text-white font-semibold text-lg mb-4">Edit Notification</h2>
              <textarea
                className="w-full p-2 rounded border border-gray-600 bg-transparent text-white focus:outline-none"
                rows={4}
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button className="px-4 py-2 bg-[#FF7B00] text-white rounded" onClick={handleEdit}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && selectedNotification && (
          <motion.div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#1E1E2F] p-6 rounded-lg w-[400px] relative"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <h2 className="text-white font-semibold text-lg mb-4">Delete Notification</h2>
              <p className="text-white mb-4">Are you sure you want to delete this notification?</p>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
