"use client";
import React, { useState, useRef } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "../../AdminTable";
import { Dialog } from "@headlessui/react";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import CustomAdminInput from "../../CustomAdminInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import DashboardHaederMessage from "./DashboardHaederMessage";
import Image from "next/image";

export interface HeaderMessage {
  id: number;
  title: string;
  message: string;
  image: string;
  color_start: string;
  color_end: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface DashboardHeaderMessageListProps {
  headerMessages: HeaderMessage[];
  refetch: () => void;
}

export default function DashboardHeaderMessageList({
  headerMessages,
  refetch,
}: DashboardHeaderMessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<HeaderMessage | null>(
    null
  );
  const [editMessage, setEditMessage] = useState<HeaderMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeaderMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [colorStart, setColorStart] = useState<string>("#FF7B00");
  const [colorEnd, setColorEnd] = useState<string>("#FFB800");
  const token = loadEncryptedData()?.token;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (
      !editMessage ||
      !editMessage.title ||
      !editMessage.message ||
      !selectedDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", editMessage.title);
    data.append("message_content", editMessage.message);
    data.append("color_start", colorStart);
    data.append("color_end", colorEnd);
    data.append("published_at", selectedDate.toISOString());
    if (file) data.append("image", file);

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateHeaderMessage/${editMessage.id}`,
        "POST",
        data,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Updated successfully");
        setEditMessage(null);
        setFile(null);
        setSelectedDate(null);
        refetch();
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteHeaderMessage/${id}`,
        "DELETE",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setIsSubmitting(false);
      setDeleteTarget(null);
    }
  };

  const columns: TableColumn<HeaderMessage>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Title", field: "title" },
    {
      title: "Message",
      field: "message",
      render: (_v, row) => (
        <div
          dangerouslySetInnerHTML={{ __html: row.message }}
          className="whitespace-pre-wrap max-w-xs overflow-hidden text-ellipsis"
        />
      ),
    },
    {
      title: "Image",
      field: "image",
      render: (_v, row) => (
        <Image
          width={400}
          height={400}
          src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${row.image}`}
          alt=""
          className="w-12 h-12 object-contain rounded"
        />
      ),
    },
    {
      title: "Published At",
      field: "published_at",
      render: (_v, row) => {
        const date = new Date(row.published_at);
        return date.toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Color Start",
      field: "color_start",
      render: (_v, row) => (
        <div
          className="w-16 h-8 rounded mx-auto"
          style={{ backgroundColor: row.color_start }}
        />
      ),
    },
    {
      title: "Color End",
      field: "color_end",
      render: (_v, row) => (
        <div
          className="w-16 h-8 rounded mx-auto"
          style={{ backgroundColor: row.color_end }}
        />
      ),
    },
    {
      title: "Action",
      field: "id",
      render: (_v, row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => setSelectedMessage(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-blue-500"
            onClick={() => {
              setEditMessage(row);
              setSelectedDate(new Date(row.published_at));
              setColorStart(row.color_start);
              setColorEnd(row.color_end);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="p-1 rounded text-red-500"
            onClick={() => setDeleteTarget(row)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<HeaderMessage>
        columns={columns}
        data={headerMessages}
      />

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="fixed inset-0 bg-black/40  bg-opacity-50 flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-xl w-[80%] max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardHaederMessage
                title={selectedMessage.title}
                message={selectedMessage.message}
                image={selectedMessage.image}
                color_start={selectedMessage.color_start}
                color_end={selectedMessage.color_end}
                published_at={selectedMessage.published_at}
              />
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Dialog */}
      <Dialog
        open={!!editMessage}
        onClose={() => setEditMessage(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
            <Dialog.Title className="text-white text-lg font-semibold">
              Edit Header Message
            </Dialog.Title>
            <CustomAdminInput
              title="Title"
              value={editMessage?.title || ""}
              onChange={(val) =>
                editMessage && setEditMessage({ ...editMessage, title: val })
              }
            />
            <div className="flex flex-col">
              <label className="text-white mb-1">Message</label>
              <textarea
                className="w-full p-2 rounded-md border border-gray-600 bg-transparent text-white"
                value={editMessage?.message || ""}
                onChange={(e) =>
                  editMessage &&
                  setEditMessage({ ...editMessage, message: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col">
                <span className="text-white mb-1">Color Start</span>
                <input
                  type="color"
                  value={colorStart}
                  onChange={(e) => setColorStart(e.target.value)}
                  className="w-20 h-8 p-0 border-0"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white mb-1">Color End</span>
                <input
                  type="color"
                  value={colorEnd}
                  onChange={(e) => setColorEnd(e.target.value)}
                  className="w-20 h-8 p-0 border-0"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-white mb-1">Published At</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                className="w-full p-2 rounded-md text-white border border-gray-600 bg-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-white mb-1">Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-32 border border-gray-600 rounded cursor-pointer flex items-center justify-center text-white relative overflow-hidden"
              >
                {(editMessage?.image || file) && (
                  <div
                    className="absolute left-1 top-1 p-1 bg-black/40 bg-opacity-50 rounded-full z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setEditMessage({ ...editMessage!, image: "" });
                    }}
                  >
                    <FaTrash className="text-red-400" />
                  </div>
                )}
                {file ? (
                  <Image
                    width={400}
                    height={400}
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : editMessage?.image ? (
                  <Image
                    width={400}
                    height={400}
                    src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${editMessage.image}`}
                    alt="Header"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span>Upload Image</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setEditMessage(null)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-blue-600 text-white rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4">
            <Dialog.Title className="text-white text-lg font-semibold">
              Confirm Delete
            </Dialog.Title>
            <p className="text-white">
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
