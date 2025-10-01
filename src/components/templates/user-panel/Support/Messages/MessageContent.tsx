"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessagePropType {
  image?: string;
  title: string;
  date: string;
  description: string;
}

const truncateWords = (text: string, wordCount: number) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + "...";
};

export default function MessagesContent({
  image,
  title,
  date,
  description,
}: MessagePropType) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const hasMore = description.split(" ").length > 180;

  return (
    <div className="messages message-container px-[1rem] py-[1rem] bg-white dark:bg-[#1A1B26] bg-shadow-custom border-standard rounded-xl mt-5 pb-[2rem]">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image Section */}
        <div className="sm:w-[30%] min-w-[200px] h-[15rem] bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
          {image ? (
            <Image
              width={200}
              height={200}
              src={image}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-400 text-lg">No Image</span>
          )}
        </div>

        {/* Text Section */}
        <div className="flex flex-col space-y-1">
          <h3
            className="text-yellow-400 font-semibold text-sm"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-gray-400 text-xs">{date}</p>

          {!isExpanded && (
            <p
              className="message-notif text-gray-900 dark:text-gray-300 text-sm mt-4"
              dangerouslySetInnerHTML={{
                __html: truncateWords(description, 70),
              }}
            />
          )}

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="expanded-text"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <p
                  className="message-notif text-gray-900 dark:text-gray-300 text-sm mt-4"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && (
            <button
              onClick={toggleExpand}
              className="mt-2 text-blue-500 text-sm font-medium hover:underline self-start"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
