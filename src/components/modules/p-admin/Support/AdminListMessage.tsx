"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface Announcement {
  id: string;
  title: string;
  message_content: string;
  image_path?: string;
  published_at: string;
  type?: string;
  [key: string]: any;
}

export default function AdminListMessage() {
  const [messages, setMessages] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Announcement | null>(
    null
  );
  const [showModal, setShowModal] = useState<"view" | "edit" | "delete" | null>(
    null
  );



  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<{ data: Announcement[] }>(
        `${BASE_URL}/v1/admin/getAnnouncements`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) setMessages(res.data?.data ?? []);
      else console.error("Error fetching announcements:", res.message);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setMessages , BASE_URL]);

  useEffect(() => {
    fetchMessages();
  }, [BASE_URL, fetchMessages]);

  const handleDelete = async (id: string) => {
    const token = loadEncryptedData()?.token;
    const res = await apiRequest<any>(
      `${BASE_URL}/v1/admin/deleteAnnouncements/${id}`,
      "DELETE",
      undefined,
      { Authorization: `Bearer ${token}` }
    );
    if (res.success) {
      toast.success("Deleted successfully!");
      setShowModal(null);
      fetchMessages();
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  // const handleEditSubmit = async () => {
  //   if (!selectedMessage) return;
  //   const token = loadEncryptedData()?.token;
  //   const form = new FormData();
  //   form.append("title", editData.title || selectedMessage.title);
  //   form.append(
  //     "message_content",
  //     editData.message_content || selectedMessage.message_content
  //   );
  //   if (editImage instanceof File) form.append("image", editImage);
  //   const res = await apiRequest<any>(
  //     `${BASE_URL}/v1/admin/updateAnnouncements/${selectedMessage.id}`,
  //     "POST",
  //     form,
  //     { Authorization: `Bearer ${token}` }
  //   );
  //   if (res.success) {
  //     toast.success("Updated successfully!");
  //     setShowModal(null);
  //     fetchMessages();
  //   } else {
  //     toast.error(res.message || "Update failed");
  //   }
  // };

  const router = useRouter();



  return (
    <div className="admin-list-message space-y-4">
      <ToastContainer />
      {loading && <p className="text-white">Loading messages...</p>}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className="border-[2px] rounded-[.5rem] border-[#383C47] px-4 py-4 relative"
        >
          <div
            className={`absolute right-2 top-2  px-4 rounded-[.5rem] ${
              msg.type === "special"
                ? "bg-[#d1d5db54]"
                : msg.type === "dashboard"
                ? "bg-[#60a5fa6b] "
                : "bg-[#f8717196]"
            }`}
          >
            <span className="text-white text-sm">{msg.type}</span>
          </div>
          <div className="flex items-start gap-4">
            {msg.image_path && (
              <div className="border-[2px] border-[#4A4A4A] rounded-[.5rem] w-40 h-40 overflow-hidden">
                <Image
                  width={160}
                  height={160}
                  src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${msg.image_path}`}
                  className="object-cover h-full w-full"
                  alt={msg.title}
                />
              </div>
            )}

            <div className="admin-list-message-bio flex-1">
              <h2 className="text-[#FFCC00]">{msg.title || "No Title"}</h2>
              <div className="description">
                <span className="text-sm text-[#888]">
                  {new Date(msg.published_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <p
                  className="text-white w-full"
                  dangerouslySetInnerHTML={{ __html: msg.message_content }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4 justify-end">
            <button
              className="bg-gray-700 text-purple-400 hover:text-gray-300 !rounded-[.5rem] p-1 flex items-center gap-2"
              onClick={() => {
                router.push(`messages/${msg.id}`);
              }}
            >
              <FaEye />
            </button>

            <button
              className="bg-gray-700 text-yellow-400 hover:text-gray-300 !rounded-[.5rem] p-1 flex items-center gap-2"
              onClick={() => {
                router.push(`messages/${msg.id}`);
              }}
            >
              <FaEdit />
            </button>

            <button
              className="bg-gray-700 text-red-400 hover:text-gray-300 !rounded-[.5rem] p-1 flex items-center gap-2"
              onClick={() => {
                setSelectedMessage(msg);
                setShowModal("delete");
              }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {!loading && messages.length === 0 && (
        <p className="text-white">No announcements found.</p>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && selectedMessage && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1F2937] rounded-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Delete Modal */}
              {showModal === "delete" && (
                <>
                  <h2 className="text-red-500 text-lg font-bold mb-4">
                    Confirm Delete
                  </h2>
                  <p className="text-white mb-4">
                    Are you sure you want to delete this announcement?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-gray-700 text-white px-4 py-2 rounded"
                      onClick={() => setShowModal(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
