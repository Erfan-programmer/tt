"use client";
import React, { useState } from "react";
import { FaPaperclip, FaPaperPlane, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import Image from "next/image";

export default function AddNewMessage({
  ticketId,
  status,
  onSentSuccess,
}: {
  ticketId: number;
  status: string;
  onSentSuccess?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const removeFile = () => setFile(null);

  const handleSend = async () => {
    if (!message.trim() && !file) return;
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      if (file) formData.append("attachment", file);
      const token = loadEncryptedData()?.token;
      await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/tickets/${ticketId}/reply`,
        "POST",
        formData,
        { Authorization: `Bearer ${token}` },
      );
      setMessage("");
      setFile(null);
      if (onSentSuccess) onSentSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const renderFilePreview = () => {
    if (!file) return null;
    const fileType = file.type;
    const fileURL = URL.createObjectURL(file);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative inline-block"
      >
        <button
          onClick={removeFile}
          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
        >
          <FaTimes size={12} />
        </button>
        {fileType.startsWith("image/") && (
          <Image
            width={1000}
            height={1000}
            src={fileURL}
            alt="preview"
            className="max-w-[150px] max-h-[150px] rounded-md border border-gray-600"
          />
        )}
        {fileType.startsWith("video/") && (
          <video
            src={fileURL}
            controls
            className="max-w-[200px] max-h-[150px] rounded-md border border-gray-600"
          />
        )}
        {!fileType.startsWith("image/") && !fileType.startsWith("video/") && (
          <div className="text-gray-300 text-sm border border-gray-600 px-3 py-2 rounded-md bg-[#2a2b31]">
            <p>{file.name}</p>
            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fixed bottom-0 right-0 w-full bg-[#1E1F25] border-t border-[#383C47] px-4 py-3 flex flex-col gap-2 xl:w-[80%] ml-auto">
      <AnimatePresence>{file && <div>{renderFilePreview()}</div>}</AnimatePresence>
      <div className={`flex items-center relative gap-3 ${status !== "closed" ? "opacity-100" : "opacity-50"}`}>

        <label className="cursor-pointer text-gray-300 hover:text-white">
          <FaPaperclip size={18} />
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-transparent border border-[#383C47] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full w-12 h-12 flex justify-center items-center gap-2"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
}
