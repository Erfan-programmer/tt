"use client";

import SingleTicketDetailPage from "@/components/templates/user-panel/Support/tickets/SingleTicketDetailPage";
import { useParams } from "next/navigation";
import React from "react";

export default function SingleTicketDetail() {
  const params = useParams();
  const { id }:any = params

  if (!id) return <div className="p-8 text-center">Ticket ID not found</div>;

  return <SingleTicketDetailPage ticketId={id} />;
}
