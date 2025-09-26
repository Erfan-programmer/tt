"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FaEye, FaSpinner, FaTimes } from "react-icons/fa";
import { FaBell, FaCheckDouble } from "react-icons/fa6";
import { apiRequest, ApiResponse } from "@/libs/api";
import { toast } from "react-toastify";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { IoIosTimer } from "react-icons/io";

interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: "expire" | "normal";
  expire_date: string;
  created_at: string;
  read_at: string;
  updated_at: string;
}

interface NotificationContainerProps {
  onClose: () => void;
  notifications: any[];
  onRefetch?: () => void;
}

const normalizeNotifications = (serverNotifications: any[]): Notification[] => {
  return serverNotifications.map((item) => ({
    id: item.id,
    user_id: String(item.notifiable_id),
    message: item.data?.message || "",
    type: item.data?.expires_at ? "expire" : "normal",
    expire_date: item.data?.expires_at || "",
    read_at: item.read_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
};

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  onClose,
  notifications,
  onRefetch,
}) => {
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const normalized = normalizeNotifications(notifications);
  const token = loadUserData()?.access_token;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedProgress: { [key: string]: number } = {};
      normalized.forEach((notification) => {
        if (notification.expire_date) {
          const expireDate = new Date(notification.expire_date);
          const createdDate = new Date(notification.created_at);
          if (expireDate > now) {
            const total = expireDate.getTime() - createdDate.getTime();
            const elapsed = now.getTime() - createdDate.getTime();
            updatedProgress[notification.id] = Math.min(
              (elapsed / total) * 100,
              100
            );
          } else {
            updatedProgress[notification.id] = 100;
          }
        }
      });
      setProgress(updatedProgress);
    }, 1000);
    return () => clearInterval(interval);
  }, [normalized]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setLoadingIds((prev) => ({ ...prev, [notificationId]: true }));
      const res: ApiResponse = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/readNotification/${notificationId}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Notification marked as read");
        onRefetch?.();
      } else {
        toast.error(res.message || "Failed to mark as read");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark as read");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoadingAll(true);
      const res: ApiResponse = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/readAllNotification`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("All notifications marked as read");
        onRefetch?.();
      } else {
        toast.error(res.message || "Failed to mark all as read");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark all as read");
    } finally {
      setLoadingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 dark:bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.2 }}
        className="relative w-[90%] sm:w-96 max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FaBell className="text-yellow-500" /> Notifications
          </h3>
          <div className="flex items-center gap-2">
            {normalized.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loadingAll}
                className="px-2 sm:px-3 py-1 text-[.8rem] sm:text-sm text-blue-500 underline rounded hover:text-blue-600 disabled:opacity-50"
              >
                {loadingAll ? "Marking..." : "Mark All Read"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {normalized.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {normalized.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-3 sm:p-4 transition-colors
                ${
                  notification.read_at === null
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <p className="text-[.8rem] sm:text-sm text-gray-900 dark:text-gray-200">
                        {notification.message}
                      </p>
                      <p className="text-[10px] sm:text-[.8rem] text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
                      {notification.type === "expire" && (
                        <div className="mt-2 w-full h-1 bg-gray-200 dark:bg-gray-600 rounded">
                          <div
                            className="h-1 bg-blue-500 rounded transition-all duration-1000"
                            style={{
                              width: `${progress[notification.id] || 0}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={loadingIds[notification.id]}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {loadingIds[notification.id] ? (
                        <FaSpinner className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-blue-500" />
                      ) : notification.expire_date ? (
                        <IoIosTimer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
                      ) : notification.read_at === null ? (
                        <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <FaCheckDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationContainer;
