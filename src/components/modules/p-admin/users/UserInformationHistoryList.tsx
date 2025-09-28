"use client";
import React from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { useRouter } from "next/navigation";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface Transaction {
  id: number;
  date: string;
  name: string;
  user: string;
  deposit: string;
  email: string;
  position: string;
  income: string;
  rank: string;
  gender: string | null;
  action: string | null;
}

interface Props {
  users: Transaction[];
}

export default function UserInformationHistoryList({ users }: Props) {
  const router = useRouter();

  const columns: TableColumn<Transaction>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Date", field: "date" },
    { title: "Name", field: "name" },
    { title: "User", field: "user" },
    {
      title: "Deposit",
      field: "deposit",
      render: (_value, row) => formatToTwoDecimals(row.deposit),
    },
    { title: "Email", field: "email" },
    { title: "Position", field: "position" },
    {
      title: "Income",
      field: "income",
      render: (_value, row) => formatToTwoDecimals(row.income),
    },
    { title: "Rank", field: "rank" },
    { title: "Gender", field: "gender", render: (value) => value ?? "-" },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => router.push(`user-information/${row.id}`)}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => router.push(`user-information/${row.id}`)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return <AdminDynamicTable<Transaction> columns={columns} data={users} />;
}
