"use client";
import React from "react";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: string | number;
  type: string;
  status: string;
  from_user: { tid: string | number; name: string };
  to_user: { tid: string | number; name: string };
}

export default function UsersTransactionHistory() {
  const { userInfo } = useUserDocuments();

  const transactions: Transaction[] = userInfo?.transaction_history || [];

  const mappedTransactions = transactions.map((tx) => ({
    id: tx.id,
    date: tx.date,
    amount: formatToTwoDecimals(tx.amount),
    from: tx.from_user.name,
    to: tx.to_user.name,
    accountType: tx.type,
    invoiceNumber: tx.description,
    invoiceCurrency: "",
    status: tx.status,
  }));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "var(--success)";
      case "pending":
        return "var(--normal)";
      case "failed":
      case "expired":
      case "rejected":
        return "var(--loss)";
      default:
        return "var(--normal)";
    }
  };

  const columns: TableColumn<typeof mappedTransactions[0]>[] = [
    { title: "Date", field: "date" },
    { title: "Amount", field: "amount" },
    { title: "From", field: "from" },
    { title: "Invoice Number", field: "invoiceNumber" },
    { title: "Type", field: "accountType" },
    { title: "To", field: "to" },
    {
      title: "Status",
      field: "status",
      render: (_, rowData: any) => (
        <span style={{ color: getStatusColor(rowData.status) }}>
          {rowData.status}
        </span>
      ),
    },
  ];

  return <AdminDynamicTable columns={columns} data={mappedTransactions} />;
}
