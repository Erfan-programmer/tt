// GoldRewardPopup.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useHeader } from "@/contextApi/HeaderContext";
import { apiRequest, ApiResponse } from "@/libs/api";
import Image from "next/image";

export interface PopupDataItem {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  description: string;
  amount: string;
  button_text: string;
  button_url: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

interface GoldRewardPopupProps {
  popupData?: PopupDataItem[];
  onClose?: () => void;
  onRefetch?: () => void;
}

export default function GoldRewardPopup({
  popupData,
  onClose,
}: GoldRewardPopupProps) {
  const [closed, setClosed] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { refetch } = useHeader();

  useEffect(() => {
    if (popupData && popupData.length > 0) {
      setShow(true);
      setClosed(false);
    }
  }, [popupData]);

  // ✅ اصلاح شده: استفاده از یک mutation مشترک به جای دو mutation
  const readPopupMutation = useMutation({
    mutationFn: async (id: string) => {
      const res: ApiResponse = await apiRequest<any>(`/popup/read?id=${id}`, "GET");
      return res;
    },
    onSuccess: () => {
      setClosed(true);
      if (onClose) onClose();
    },
    onError: (error: any) => {
      if (error?.error?.code === 401) {
        router.push("/login");
      } else {
        setClosed(true);
        if (onClose) onClose();
      }
    },
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
      setTimeout(() => {
        setClosed(true);
        if (onClose) onClose();
      }, 350);
    }
  };

  const handleClose = (id: string) => {
    setShow(false);
    setTimeout(() => {
      readPopupMutation.mutate(id, {
        onSuccess: () => {
          setTimeout(() => {
            refetch();
          }, 100);
        },
      });
    }, 350);
  };

 const handleButtonClick = (id: string, buttonUrl: string) => {
  setShow(false);

  const isClient = typeof window !== "undefined";
  const currentOrigin = isClient ? window.location.origin : "";

  const isInternalUrl =
    buttonUrl.startsWith("/") || (isClient && buttonUrl.startsWith(currentOrigin));

  readPopupMutation.mutate(id);

  if (isInternalUrl) {
    if (!isClient) return; 
    const url = new URL(buttonUrl, currentOrigin);
    if (!url.searchParams.has("pop_up")) {
      url.searchParams.set("pop_up", "false");
    }
    const finalPath = url.pathname + url.search + url.hash;
    refetch();
    router.push(finalPath);
  } else {
    if (!isClient) return; 
    refetch();
    window.open(buttonUrl, "_blank", "noopener,noreferrer");
  }
};


  if (!popupData || popupData.length === 0 || closed) return null;

  const data = popupData[popupData.length - 1];

  const VISIBLE_COUNT = Math.min(popupData.length - 1, 3);
  const visiblePopups = popupData.slice(-VISIBLE_COUNT - 1, -1);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[350px] sm:w-[60vw] lg:w-[40vw] h-[500px] flex items-center justify-center">
        {visiblePopups.map((item, idx, arr) => {
          const reverseIdx = arr.length - idx - 1;
          const rotate = (reverseIdx + 1) * 8;
          const translate = (reverseIdx + 1) * 20;
          const z = 1 + idx;
          const opacity = 0.2 + 0.15 * idx;
          return (
            <div
              key={item.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotate}deg) translateY(${translate}px)`,
                zIndex: z,
                opacity,
                pointerEvents: "none",
                transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
              }}
            >
              <div className="rounded-2xl overflow-hidden relative shadow-2xl p-6 sm:p-8 bg-[#171717] border border-[#3a4256] w-[350px] sm:w-[60vw] lg:w-[40vw] flex flex-col items-center">
                <div className="absolute -left-4 -bottom-4 w-28 h-32 rounded-full blur-xl bg-[#0052B4] shadow-xl shadow-[#0052B4] z-0"></div>
                <div className="absolute -right-4 -top-4 w-28 h-32 rounded-full blur-xl bg-[#0052B4] shadow-xl shadow-[#0052B4] z-0"></div>
                <div className="relative z-10 w-full flex flex-col items-center px-4">
                  <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-[#FAD594] text-center mt-2 mb-1 px-2 break-words">
                    {item.title || "CONGRATULATIONS!"}
                  </h2>
                  <h3 className="text-lg sm:text-xl text-[#FAD594] font-semibold text-center mb-2 px-2 w-[90%]">
                    {item.subtitle || "YOU'VE REACHED GOLD"}
                  </h3>
                  {/* ✅ اصلاح شده: lazy load برای تصاویر */}
                  <Image
                    width={300}
                    height={300}
                    loading="lazy"
                    src={
                      item.image
                        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.image}`
                        : "/images/iphone.png"
                    }
                    alt="Reward"
                    className="w-20 h-20 object-contain mx-auto mb-2 drop-shadow-lg"
                  />
                  <div className="text-xl font-bold text-[#FAD594] text-center mb-2 px-2 break-words">
                    {item.amount
                      ? `$ ${Number(item.amount).toLocaleString()} USD`
                      : "$1,200 USD"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div
          className={`rounded-2xl overflow-hidden relative shadow-2xl p-6 sm:p-8 bg-[#171717] border border-[#3a4256] w-[350px] sm:w-[60vw] lg:w-[40vw] flex flex-col items-center transition-all duration-350 ${
            show ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(.4,2,.6,1)",
            zIndex: 10,
          }}
        >
          <button
            className="absolute right-4 top-4 z-20 text-[#FAD594] hover:text-red-400 text-2xl"
            onClick={() => handleClose(data.id)}
          >
            <FaTimes />
          </button>
          <div className="absolute -left-4 -bottom-4 w-28 h-32 rounded-full blur-xl bg-[#0052B4] shadow-xl shadow-[#0052B4] z-0"></div>
          <div className="absolute -right-4 -top-4 w-28 h-32 rounded-full blur-xl bg-[#0052B4] shadow-xl shadow-[#0052B4] z-0"></div>
          <div className="relative z-10 w-full flex flex-col items-center px-4">
            <h2 className="text-[2rem] sm:text-[4rem] font-bold text-[#FAD594] text-center mt-2 mb-1 px-2 break-words">
              {data.title || "CONGRATULATIONS!"}
            </h2>
            <h3 className="text-lg sm:text-xl text-[#FAD594] font-semibold text-center mb-2 px-2 break-words max-w-[100%]">
              {data.subtitle || "YOU'VE REACHED GOLD"}
            </h3>
            <p className="text-sm text-gray-200 text-center mb-4 px-2 break-words max-w-[95%]">
              {data.content || "Only a few make it this far. You did it!"}
            </p>
            <Image
              width={400}
              height={400}
              loading="lazy"
              src={
                data.image
                  ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${data.image}`
                  : "/images/iphone.png"
              }
              alt="Reward"
              className="w-32 h-32 object-contain mx-auto mb-4 drop-shadow-lg"
            />
            <p className="text-white text-center mb-2 px-2 break-words max-w-[95%]">
              {data.description || "You've just unlocked a reward worth:"}
            </p>
            <div className="text-2xl sm:text-3xl font-bold text-[#FAD594] text-center mb-4 px-2 break-words">
              {data.amount
                ? `$ ${Number(data.amount).toLocaleString()} USD`
                : "$1,200 USD"}
            </div>
            {data.button_text && (
              <button
                className="w-full py-2 rounded-lg border border-[var(--gold)] text-[#FAD594] font-semibold bg-black/40 hover:bg-[#FAD594] hover:text-[#232b41] transition-colors duration-200 mt-2"
                onClick={() => handleButtonClick(data.id, data.button_url)}
              >
                {data.button_text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
