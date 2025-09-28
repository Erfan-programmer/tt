"use client";
import React, { useState, useEffect, useCallback } from "react";
import LineTitle from "../LineTitle";
import AbilityCnfigModes from "./AbilityCnfigModes";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import TicketReceivedList from "./TicketReceivedList";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import CustomAdminInput from "../CustomAdminInput";
import DepartmentList from "./DepartmentList";
import { toast } from "react-toastify";
import Pagination from "../../UserPanel/Pagination/Pagination";

export default function TicketPage() {
  const [showTickets, setShowTickets] = useState({
    abilityMessage: true,
    departments: true,
    showMessage: true,
  });
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [params, setParams] = useState<{ [key: string]: string }>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [deptPage, setDeptPage] = useState(1);
  const [deptPerPage] = useState(10);
  const [deptTotal, setDeptTotal] = useState(0);

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
    [token]
  );

  useEffect(() => {
    fetchTickets(params);
  }, [params, fetchTickets]);

  const handleSearch = (key: string, value: string) => {
    const newParams = { ...params };
    if (value) newParams[key] = value;
    else delete newParams[key];
    setParams(newParams);
  };

  const handleClear = () => setParams({});

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/departments?page=${deptPage}&per_page=${deptPerPage}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setDepartments(res.data.data);
        setDeptTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, deptPage, deptPerPage]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreateDepartment = async () => {
    if (!newDepartment.trim()) return;
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createDepartment`,
      "POST",
      { name: newDepartment },
      { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    );
    if (res.success) {
      toast.success("Department created");
      setNewDepartment("");
      fetchDepartments();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeptPageChange = (_: any, page: number) => {
    setDeptPage(page);
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

      <LineTitle
        onClick={() =>
          setShowTickets((prev) => ({
            ...prev,
            departments: !prev.departments,
          }))}
        title="Departments"
      />

      {showTickets.departments && (
        <>
          <div className="flex items-end justify-between gap-2">
            <CustomAdminInput
              title="Title"
              value={newDepartment}
              onChange={(val) => setNewDepartment(val)}
            />
            <button onClick={handleCreateDepartment} className="titan-btn">
              Add
            </button>
          </div>

          <DepartmentList
            departments={departments}
            fetchDepartments={fetchDepartments}
          />

          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(deptTotal / deptPerPage)}
              page={deptPage}
              onChange={handleDeptPageChange}
            />
          </div>
        </>
      )}
    </>
  );
}
