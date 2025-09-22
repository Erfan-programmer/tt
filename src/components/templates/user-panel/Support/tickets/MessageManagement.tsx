// MessageManagement.tsx
"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import MessageManagementTable from "./MessageManagementTable";

interface Ticket {
  id: number;
  ticket_number: string;
  updated_at: string;
  subject: string;
  message: string;
  last_answer: string;
  is_read_by_admin: boolean;
  status: string;
}

interface RawTicket {
  id: number;
  updated_at: string;
  subject: string;
  status: string;
}

const MessageManagement = forwardRef(function MessageManagementRef(_, ref) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = async (page: number) => {
    setIsLoading(true);
    const token = loadUserData()?.access_token;
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/getTickets?page=${page}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        const formattedTickets = res.data.data.map((t: RawTicket) => ({
          id: t.id,
          ticket_number: `#${t.id}`,
          updated_at: t.updated_at,
          subject: t.subject,
          message: "-",
          last_answer: "user",
          is_read_by_admin: t.status !== "open",
          status: t.status,
        }));

        setTickets(formattedTickets);
        setTotalCount(res.data.meta.total);
      } else {
        setTickets([]);
        setTotalCount(0);
      }
    } catch {
      setTickets([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  // expose fetchTickets to parent via ref
  useImperativeHandle(ref, () => ({
    fetchTickets: () => fetchTickets(page),
  }));

  return (
    <MessageManagementTable
      tickets={tickets}
      isLoading={isLoading}
      totalCount={totalCount}
      onPageChange={setPage}
    />
  );
});

export default MessageManagement;
