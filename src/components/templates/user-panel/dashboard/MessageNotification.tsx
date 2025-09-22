"use client";
import Message from "@/components/modules/UserPanel/dashboard/MessageBox";
import { useState, useEffect } from "react";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";

interface MessageData {
  id: number;
  title: string;
  image_path: string;
  message_content: string;
  updated_at: string;
}

export default function MessageNotification() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = loadUserData()?.access_token;

      const response= await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/announcements`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.success) {
        setError(response.error?.message || "Server connection error");
        setMessages([]);
        return;
      }

      setMessages(response.data.data || []);
    } catch  {
      setError("Unexpected error");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="trade-overview mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg p-4">
      <div className="flex justify-between items-center gap-4">
        <p className="text-[var(--main-background)] dark:text-white">Messages</p>
      </div>

      <div className="border-1 px-2 rounded-lg border-[#171b29] text-[var(--main-background)] dark:text-white py-3 mt-[1rem]">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">No messages available</p>
          </div>
        ) : (
          messages.map((message) => <Message key={message.id} messageInfo={message} />)
        )}
      </div>
    </div>
  );
}
