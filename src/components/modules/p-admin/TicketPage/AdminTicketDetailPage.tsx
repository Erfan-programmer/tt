"use client";
import React, { useState, useEffect, useCallback } from "react";
import AddNewMessage from "./AddNewMessage";
import { useParams } from "next/navigation";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { VscEyeClosed } from "react-icons/vsc";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface TicketReplyAttachment {
  id: number;
  path: string;
  filename: string;
  mime_type: string;
  size: number;
}

interface TicketReply {
  id: number;
  message: string;
  created_at: string;
  replier_type: string;
  replier_label: string;
  replier: {
    first_name: string;
    last_name: string;
    tid: number;
  };
  attachments: TicketReplyAttachment[];
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  client: {
    first_name: string;
    last_name: string;
    tid: number;
    email: string;
    user_type: string;
  };
  department: {
    name: string;
  };
  replies: TicketReply[];
}

export default function AdminTicketDetailPage() {
  const { id }: any = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<{ data: Ticket }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/tickets/${id}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      setTicket(res?.data?.data || null);
    } catch (err: any) {
      setError(err?.message || "Failed to load ticket");
    } finally {
      setIsLoading(false);
    }
  }, [id, setIsLoading, setError, setTicket]);

  useEffect(() => {
    fetchTicket();
  }, [id, fetchTicket]);

  if (isLoading)
    return <p className="text-center py-8 text-white">Loading ticket...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (!ticket)
    return <p className="text-center py-8 text-white">No ticket found.</p>;
 console.log("reply.attachement , " , ticket.replies)
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-white gap-4">
          <FaArrowRight />
          <Link href="/hrtaamst2025/support/tickets-receive">Tickets</Link>
        </div>
        {ticket.status === "closed" && (
          <button className="rounded-xl p-4 bg-red-500 text-white flex items-center gap-2">
            <span>Ticket is Closed</span>
            <VscEyeClosed className="text-xl" />
          </button>
        )}
      </div>
      <div className="space-y-8">
        {ticket.replies
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
          .map((reply) => (
            <div
              key={reply.id}
              className={`user-request border-[2px] border-[#383C47] px-6 py-4 rounded-[.5rem] w-[80%] text-white ${
                reply.replier_label?.toLowerCase()?.includes("admin")
                  ? "ml-auto"
                  : ""
              }`}
            >
              <p className="font-bold">
                {reply.replier.first_name} {reply.replier.last_name}{" "}
                {reply.replier_label.includes("Client") &&
                  `(TID ${reply.replier.tid})`}
              </p>
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{ __html: reply.message }}
              />
              {reply.attachments.length > 0 && (
                <div
                  className={`flex flex-wrap gap-4 mt-4 ${
                    reply.replier_label?.toLowerCase()?.includes("admin")
                      ? "justify-end"
                      : ""
                  }`}
                >
                  {reply.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="w-40 h-40 rounded-[.5rem] overflow-hidden"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${att.path}`}
                        alt={att.filename}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        <AddNewMessage
          ticketId={Number(id)}
          onSentSuccess={fetchTicket}
          status={ticket.status}
        />
      </div>
    </>
  );
}
