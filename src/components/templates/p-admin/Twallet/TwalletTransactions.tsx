"use client";
import AdminDynamicTable, { TableColumn } from "@/components/modules/p-admin/AdminTable";
import React, { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";

interface Transaction {
  id: number;
  date: string;
  invoiceNumber: string;
  amount: string;
  from: string;
  to: string;
  accountType: string;
  invoiceCurrency: string;
  txId: string;
  status: string;
}

export default function AdminTranactionsPayment() {
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      date: "2025-08-19",
      invoiceNumber: "INV001",
      amount: "$1000",
      from: "User A",
      to: "User B",
      accountType: "Crypto",
      invoiceCurrency: "USD",
      txId: "TX123456",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-08-19",
      invoiceNumber: "INV001",
      amount: "$1000",
      from: "User A",
      to: "User B",
      accountType: "Crypto",
      invoiceCurrency: "USD",
      txId: "TX123456",
      status: "pending",
    },
    {
      id: 3,
      date: "2025-08-18",
      invoiceNumber: "INV002",
      amount: "$500",
      from: "User C",
      to: "User D",
      accountType: "Bank",
      invoiceCurrency: "EUR",
      txId: "TX654321",
      status: "expired",
    },
  ]);

  const columns: TableColumn<Transaction>[] = [
    { title: "Date", field: "date" },
    { title: "Invoice Number", field: "invoiceNumber" },
    { title: "Amount", field: "amount" },
    { title: "From", field: "from" },
    { title: "To", field: "to" },
    { title: "Account Type", field: "accountType" },
    { title: "Invoice Currency", field: "invoiceCurrency" },
    { title: "TxID", field: "txId" },
    {
      title: "Status",
      field: "status",
      render: (value:any) => {
        const status = value?.toLowerCase();
        const color =
          status === "expired"
            ? "#FF6060"
            : status === "completed"
            ? "#A8FFAE"
            : "#FED563";
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: "Action",
      field: "id", 
      render: () => (
        <div className="flex gap-2">
          <button className="p-1 rounded text-[#6A6A6A]">
            <FaEye />
          </button>
          <button className="p-1 rounded text-[#6A6A6A]">
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return <AdminDynamicTable columns={columns} data={transactions} />;
}
