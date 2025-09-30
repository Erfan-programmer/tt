"use client";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoTriangleUp } from "react-icons/go";

export default function TitanNotice({
  title,
  description,
  alert,
  warning,
}: {
  title: string;
  description: string;
  alert?: string | ReactNode;
  warning?: string | ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-[#f4f7fd] dark:bg-[var(--notif-color)] border-l-4 border-[#1A68FF] rounded-xl p-2 py-4">
      {/* Header: Title + Icon */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="notice-svg">
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 8.5H14.515M14.5 13V20.5M28 14.5C28 21.9558 21.9558 28 14.5 28C7.04416 28 1 21.9558 1 14.5C1 7.04416 7.04416 1 14.5 1C21.9558 1 28 7.04416 28 14.5Z"
                stroke="#FFC857"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[var(--gold)] font-semibold">{title}</p>
        </div>
        <div className="bg-[#080a1d] dark:bg-white p-1 rounded-lg">
          <GoTriangleUp
            size={28}
            className={`transition-transform text-white dark:text-[#080a1d] duration-300 ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Content: description, warning, alert */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex flex-col gap-2 overflow-hidden"
          >
            <div
              className="text-[var(--main-background)] dark:text-[#B9B9B9]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {warning && (
              <div className="text-[var(--gold)] mt-1">
                {typeof warning === "string" ? (
                  <span dangerouslySetInnerHTML={{ __html: warning }} />
                ) : (
                  warning
                )}
              </div>
            )}
            {alert && (
              <div className="text-red-400 mt-1">
                {typeof alert === "string" ? (
                  <span dangerouslySetInnerHTML={{ __html: alert }} />
                ) : (
                  alert
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
