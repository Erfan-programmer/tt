"use client";

import React, { useState } from "react";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { FaEye } from "react-icons/fa";
import MessageManagementTableSkeleton from "@/skeletons/User-Panel/dashboard/MessageManagementTableSkeleton";
import Link from "next/link";

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

interface MessageManagementTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(date.getDate()).padStart(2, "0")}`;
};

export default function MessageManagementTable({
  tickets,
  isLoading,
  totalCount,
  onPageChange,
}: MessageManagementTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    onPageChange(value);
  };

  const getResponseStatus = (ticket: Ticket) => {
    if (ticket.last_answer.toLowerCase() === "user") {
      return ticket.is_read_by_admin ? "under review" : "waiting";
    }
    return "responded";
  };

  const getResponseColor = (ticket: Ticket) => {
    const status = getResponseStatus(ticket);
    switch (status) {
      case "waiting":
        return "text-yellow-500";
      case "under review":
        return "text-[var(--gold)]";
      case "responded":
        return "text-[var(--success)]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="withdraw-transaction-container px-[1rem] rounded-xl py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
      <div className="overflow-x-auto rounded-[1em]">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr className="bg-[#D9D9D9] rounded-t-lg">
              <th className="text-center py-4 text-black font-medium px-4">#</th>
              <th className="text-center py-4 text-black font-medium px-4">
                Ticket Number
              </th>
              <th className="text-center py-4 text-black font-medium px-4">
                Request Date
              </th>
              <th className="text-center py-4 text-black font-medium px-4">
                Subject
              </th>
              <th className="text-center py-4 text-black font-medium px-4">
                Your Message
              </th>
              <th className="text-center py-4 text-black font-medium px-4">
                Response
              </th>
              <th className="text-center py-4 text-black font-medium px-4">
                Status
              </th>
              <th className="text-center py-4 text-black font-medium px-4">
                Operation
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <MessageManagementTableSkeleton key={idx} />
                ))
              : tickets?.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={`transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-[#2A3246]"
                        : "bg-[#f9f9fe] dark:bg-[#222631]"
                    }`}
                  >
                    <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                      {index + 1 }
                    </td>
                    <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                      {ticket.ticket_number}
                    </td>
                    <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                      {formatDate(ticket.updated_at)}
                    </td>
                    <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                      {ticket.subject}
                    </td>
                    <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                      <span dangerouslySetInnerHTML={{ __html:ticket.message}}/>
                    </td>
                    <td className="py-4 text-center px-4">
                      <span className={`text-sm ${getResponseColor(ticket)}`}>
                        {getResponseStatus(ticket)}
                      </span>
                    </td>
                    <td className="py-4 text-center px-4">
                      <span
                        className={`text-sm ${
                          ticket.status.toLowerCase() === "closed"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 text-center px-4">
                      <Link
                        className="hover:text-blue-600 transition-colors"
                        title="View Ticket"
                        href={`/dashboard/support/tickets/${ticket.id}`}
                      >
                        <FaEye className="inline w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(totalCount / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
