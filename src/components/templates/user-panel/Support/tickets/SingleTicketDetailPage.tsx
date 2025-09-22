"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowDown } from "react-icons/fa";

import TicketHeader from "./TicketHeader";
import CloseTicketModal from "./CloseTicketModal";
import ChatMessageList from "./ChatMessageList";
import MessageInput from "./MessageInput";
import { apiRequest } from "@/libs/api";
import { Reply } from "@/types/p-admin/Message";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface Props {
  ticketId: string;
}

interface TicketData {
  id: number;
  client_id: number;
  department_id: number;
  subject: string;
  status: string;
  priority: string;
  last_reply_at: string;
  created_at: string;
  updated_at: string;
  department: { id: number; name: string };
  attachments: any[];
  replies: Reply[];
}

export default function SingleTicketDetailPage({ ticketId }: Props) {
  const id = ticketId;
  const token = loadUserData()?.access_token;

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

 const fetchTicket = useCallback(async () => {
  if (!id) return;
  setIsLoading(true);
  try {
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/showTickets/${id}`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (res.success && res.data) {
      setTicket(res.data.data);
    } else {
      toast.error(res.message);
      setTicket(null);
    }
  } catch {
    toast.error("Unexpected error fetching ticket");
    setTicket(null);
  } finally {
    setIsLoading(false);
  }
}, [id, token, setTicket, setIsLoading]);

  useEffect(() => {
    fetchTicket();
  }, [id , fetchTicket]);

  const handleSend = async (message: string, attachments: File[]) => {
    if (!message.trim() && attachments.length === 0) return;
    try {
      const formData = new FormData();
      formData.append("message", message);
      attachments.forEach((file) => formData.append("attachments[]", file));

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/replyTickets/${id}`,
        "POST",
        formData,
        { Authorization: `Bearer ${token}` }
      );

      if (!res.success) toast.error(res.message);
      await fetchTicket();
    } catch {
      toast.error("Error sending message. Please try again.");
    }
  };

  const handleClose = async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/showTickets/${id}/close`,
        "PUT",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success)
        toast.success(res.message || "Ticket closed successfully");
      else toast.error(res.message);

      setShowCloseConfirm(false);
      await fetchTicket();
    } catch {
      toast.error("Error closing ticket. Please try again.");
      setShowCloseConfirm(false);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
    }
  };

  useEffect(() => {
    if (!showScrollButton) scrollToBottom("smooth");
  }, [ticket?.replies, showScrollButton]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!ticket)
    return <div className="p-8 text-center text-red-500">No ticket found</div>;

  return (
    <div className="h-full flex flex-col relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <TicketHeader
        ticketNumber={ticket.subject}
        status={ticket.status}
        isClosing={false}
      />

      <div className="flex-1 overflow-y-hidden pt-4 pb-24 md:pb-32 flex justify-center">
        <ChatMessageList
          messages={ticket.replies}
          isLoading={isLoading}
          chatEndRef={chatEndRef}
          scrollContainerRef={scrollContainerRef}
          onScroll={handleScroll}
        />
      </div>

      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-28 right-10 z-30 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
          aria-label="Scroll to bottom"
        >
          <FaArrowDown />
        </button>
      )}

      <MessageInput
        ticketStatus={ticket.status}
        isSending={false}
        onSend={handleSend}
      />

      <CloseTicketModal
        isOpen={showCloseConfirm}
        isClosing={false}
        onConfirm={handleClose}
        onCancel={() => setShowCloseConfirm(false)}
      />
    </div>
  );
}
