"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

interface HeaderMessage {
  id: string;
  title: string;
  message: string;
  image: string;
  color_start: string;
  color_end: string;
  text_color: string;
  published_at: string;
}

export default function HeaderClientMessage() {
  const [messages, setMessages] = useState<HeaderMessage[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setISLoading] = useState<boolean>(false);

  const fetchMessages = async () => {
    const token = loadUserData()?.access_token;
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/getHeaderMessages`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setMessages(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load header messages", err);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSeen = async (id: string) => {
    const token = loadUserData()?.access_token;
    try {
      setISLoading(true);
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/header/seenHeaderMessage/${id}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setISLoading(false);
        await fetchMessages();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Failed to mark header message as seen", err);
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [messages]);

  if (!messages.length) return null;

  const msg = messages[current];

  const goNext = () => setCurrent((prev) => (prev + 1) % messages.length);
  const goPrev = () =>
    setCurrent((prev) => (prev - 1 + messages.length) % messages.length);

  return (
    <>
      <ToastContainer />
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={msg.title + current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="
              border-[#383C47] border-[1px] 
              mb-4 p-6 
              rounded-xl relative overflow-hidden
            "
          >
            <div
              className="
                absolute inset-0 
                sm:bg-[#090D23] 
                bg-[#090D23]/70 
                backdrop-blur-xl sm:backdrop-blur-0
              "
              style={{
                background: `linear-gradient(to right, ${msg.color_start}, ${msg.color_end})`,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div>
                <p
                  className="title"
                  style={{ color: msg.text_color || "#fff" }}
                >
                  {msg.title}
                </p>
              </div>
              <div className="team-tournoment-description mt-2 w-[100%] sm:w-[80%]">
                <span
                  className="description"
                  style={{ color: msg.text_color || "#fff", opacity: 0.8 }}
                  dangerouslySetInnerHTML={{ __html: msg.message }}
                />
              </div>
              <div className="team-tournoment-btn mt-8 flex justify-center sm:justify-start">
                <button
                  onClick={() => handleSeen(msg.id)}
                  className={`titan-btn ${
                    isLoading ? "!bg-gray-400" : ""
                  } flex items-center justify-center gap-4 text-white px-6 py-2 rounded-2xl tournoment-btn transition-all duration-300 hover:drop-shadow-[0_0_px_#1A68FF4D]`}
                >
                  <span>Ok</span>
                </button>
              </div>
            </div>

            {/* Image */}
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${msg.image}`}
              alt=""
              width={200}
              height={200}
              className="absolute blur-[.05px] top-1/2 right-[50%] translate-x-1/2 sm:translate-x-0 -translate-y-[50%] sm:right-0 sm:top-0 sm:translate-y-0 z-[2] opacity-40 sm:opacity-100"
            />
          </motion.div>
        </AnimatePresence>

        {messages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
            >
              <FaAngleLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
            >
              <FaAngleRight size={20} />
            </button>
          </>
        )}

        {messages.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {messages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full ${
                  idx === current ? "bg-blue-500" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
