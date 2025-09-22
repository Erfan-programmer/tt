"use client";
import MessagesContent from "./MessageContent";
import { useState, useEffect } from "react";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import MessageSkeleton from "@/skeletons/User-Panel/MessageSkeleton/MessageSkeleton";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface Announcement {
  id: number;
  image_path?: string | null;
  title: string;
  message_content: string;
  published_at: string;
}


export default function MessagePage() {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const fetchAnnouncements = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = loadUserData()?.access_token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/announcements?page=${page}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.success) {
        setError(response.error?.message || "Server connection error");
        setMessages([]);
        return;
      }

      const body = response.data;
      setMessages(body.data || []);
      setTotalMessages(body.meta.total || 0);
      setItemsPerPage(body.meta.per_page || 15);
    } catch {
      setError("Unexpected error");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page);
  }, [page]);

  return (
    <>
      {isLoading && (
        <>
          <MessageSkeleton />
          <MessageSkeleton />
        </>
      )}

      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}

      {!isLoading && !error && messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No messages found.
        </div>
      )}

      {!isLoading &&
        !error &&
        messages.map((message) => (
          <MessagesContent
            key={message.id}
            image={
              message.image_path
                ? `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${message.image_path}`
                : undefined
            }
            title={message.title}
            description={message.message_content}
            date={new Date(message.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        ))}

      {!isLoading && !error && (
        <div className="flex justify-center mt-8">
          <Pagination
            count={Math.ceil(totalMessages / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </div>
      )}
    </>
  );
}
