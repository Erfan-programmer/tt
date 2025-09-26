"use client"
import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const handleCheck = () => {
    setIsOnline(navigator.onLine)
  }

  useEffect(() => {
    window.addEventListener("online", handleCheck)
    window.addEventListener("offline", handleCheck)
    return () => {
      window.removeEventListener("online", handleCheck)
      window.removeEventListener("offline", handleCheck)
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        key={isOnline ? "online" : "offline"}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white font-medium z-[9999] ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isOnline ? "✅ اینترنت وصل است" : "⚠️ اینترنت قطع شد"}
      </motion.div>
    </AnimatePresence>
  )
}
