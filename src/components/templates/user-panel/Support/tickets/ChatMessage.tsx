"use client";
import { Reply } from "@/types/p-admin/Message";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ChatMessageProps {
  msg: Reply;
}

export default function ChatMessage({ msg }: ChatMessageProps) {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const isUser = msg.replier_type === "App\\Models\\Client";
  const senderName = isUser
    ? "Me"
    : "first_name" in msg.replier
    ? `${msg.replier.first_name} ${msg.replier.last_name}`
    : (msg.replier as any).name;

  const openModal = (src: string) => setModalImage(src);
  const closeModal = () => setModalImage(null);

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[90%] px-4 py-3 rounded-2xl shadow transition-all duration-300 animate-fade-in
          ${isUser
            ? "bg-blue-500 text-white rounded-br-none self-end"
            : "bg-gray-200 dark:bg-[#23263a] text-[var(--main-background)] dark:text-white rounded-bl-none self-start"
          }
        `}
      >
        <div className={`text-[.8rem] font-bold mb-1 ${isUser ? "text-right" : "text-left"}`}>
          {senderName}
        </div>
        <div
          className={`whitespace-pre-line break-words pb-2 ${isUser ? "text-right" : "text-left"}`}
          dangerouslySetInnerHTML={{ __html: msg.message }}
        />
        {msg.attachments.length > 0 && (
          <div className="mt-2 flex flex-col gap-2 border-t border-white/20 dark:border-black/20 pt-2">
            {msg.attachments.map((att, i) => {
              const imgSrc = `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${att.path}`;
              return (
                <div key={i} className="flex flex-col gap-1">
                  <a
                    href={imgSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-blue-200 dark:text-blue-400 hover:text-blue-100"
                  >
                    {att.original_name}
                  </a>
                  <div
                    className="relative w-full h-40 cursor-pointer"
                    onClick={() => openModal(imgSrc)}
                  >
                    <Image
                      src={imgSrc}
                      alt={att.original_name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-[.8rem] mt-2 text-right opacity-70">
          {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
        </div>

        <AnimatePresence>
          {modalImage && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-3xl bg-gray-900 rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
                >
                  <FaTimes size={18} />
                </button>

                <div className="relative w-full h-[70vh] flex items-center justify-center p-4">
                  <Image
                    src={modalImage}
                    alt="Attachment"
                    width={400}
                    height={400}
                    className="w-auto max-h-72 rounded-lg"
                  />
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
