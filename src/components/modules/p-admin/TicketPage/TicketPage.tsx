"use client";
import React, { useState, useEffect, useCallback } from "react";
import LineTitle from "../LineTitle";
import AbilityCnfigModes from "./AbilityCnfigModes";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import TicketReceivedList from "./TicketReceivedList";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

export default function TicketPage() {
  const [showTickets, setShowTickets] = useState({
    abilityMessage: true,
    showMessage: true,
  });
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [params, setParams] = useState<{ [key: string]: string }>({});
  const token = loadEncryptedData()?.token;

  const fetchTickets = useCallback(
    async (query: Record<string, string> = {}) => {
      try {
        const searchParams = new URLSearchParams(query).toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/tickets${
          searchParams ? `?${searchParams}` : ""
        }`;
        const res = await apiRequest<any>(url, "GET", undefined, {
          Authorization: `Bearer ${token}`,
        });
        if (res.success) {
          setFilteredTickets(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [token, setFilteredTickets]
  );

  useEffect(() => {
    fetchTickets(params);
  }, [params, fetchTickets]);

  const handleSearch = (key: string, value: string) => {
    const newParams = { ...params };
    if (value) {
      newParams[key] = value;
    } else {
      delete newParams[key];
    }
    setParams(newParams);
  };

  const handleClear = () => {
    setParams({});
  };

  return (
    <>
      <LineTitle
        onClick={() =>
          setShowTickets((prev) => ({
            ...prev,
            abilityMessage: !prev.abilityMessage,
          }))
        }
        title="The ability to send messages"
      />
      {showTickets.abilityMessage && (
        <AnimationTemplate>
          <AbilityCnfigModes />
        </AnimationTemplate>
      )}

      <LineTitle
        onClick={() =>
          setShowTickets((prev) => ({
            ...prev,
            showMessage: !prev.showMessage,
          }))
        }
        title="Messages & Tickets"
      />
      {showTickets.showMessage && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              {
                label: "Status",
                value: "status",
                placeholder: "Enter Status...",
              },
              {
                label: "Priority",
                value: "priority",
                placeholder: "Enter Priority...",
              },
              {
                label: "Department",
                value: "department_id",
                placeholder: "Enter Department ID...",
              },
            ]}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          <TicketReceivedList
            tickets={filteredTickets}
            refetch={() => fetchTickets(params)}
          />
        </AnimationTemplate>
      )}
    </>
  );
}
