"use client";
import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimationTemplateProps {
  children: ReactNode;
}

export default function AnimationTemplate({
  children,
}: AnimationTemplateProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="admin-animation-container w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
