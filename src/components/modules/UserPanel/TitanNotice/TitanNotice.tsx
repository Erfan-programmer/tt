"use client";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

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
  const previewLength = 150;

  const isLong = description.length > previewLength;
  const previewText =
    description.slice(0, previewLength) + (isLong && !expanded ? "..." : "");

  return (
    <div className="flex justify-between items-end gap-[1rem] bg-[#f4f7fd] dark:bg-[var(--notif-color)] border-l-4 border-[#1A68FF] rounded-xl p-2 py-4">
      <div className="flex gap-4 items-start">
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

        <div className="flex-1">
          <div className="info-title">
            <p className="text-[var(--gold)] font-semibold">{title}</p>
          </div>

          <div className="info-description text-[.9rem] flex flex-col gap-1">
            <div
              className="text-[var(--main-background)] dark:text-[#B9B9B9]"
              dangerouslySetInnerHTML={{ __html: previewText }}
            />
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="text-[var(--main-background)] dark:text-[#B9B9B9]"
                    dangerouslySetInnerHTML={{
                      __html: description.slice(previewLength),
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {warning && (
                  <div className="text-[var(--gold)] mt-2">
                    {typeof warning === "string" ? (
                      <span dangerouslySetInnerHTML={{ __html: warning }} />
                    ) : (
                      warning
                    )}
                  </div>
                )}
                {alert && (
                  <div className="text-red-400 mt-2">
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
      </div>
      
        {isLong && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center  whitespace-nowrap gap-1 mt-2 px-3 py-1 bg-white dark:bg-gray-100 text-gray-800 dark:text-gray-900 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
          >
            {expanded ? (
              <>
                Show Less <FaAngleUp />
              </>
            ) : (
              <>
                Show More <FaAngleDown />
              </>
            )}
          </button>
        )}
    </div>
  );
}
