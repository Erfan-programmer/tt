"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { IoMdClose } from "react-icons/io"; 

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40  bg-opacity-50 flex justify-center items-center z-[9999]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#212335] text-white rounded-2xl shadow-lg w-[90%] max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <IoMdClose size={22} />
            </button>

            {/* Title */}
            {title && (
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">⚡</span> {title}
              </h2>
            )}

            {/* Body */}
            <div className="text-sm text-gray-200 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
