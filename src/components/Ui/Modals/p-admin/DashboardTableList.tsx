"use client";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  name: string;
  email: string;
  wallet: string; // wallet address
}

interface ApiResponse {
  status: boolean;
  data: Transaction[];
  error?: { message: string };
}

export default function DashboardTableList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/forms`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data: ApiResponse = await res.json();

        if (data.status) {
          const decodedTransactions = data.data.map(
            (transaction: Transaction) => ({
              ...transaction,
              wallet: transaction.wallet ? atob(transaction.wallet) : "",
            })
          );
          setTransactions(decodedTransactions || []);
        } else {
          console.error("API Error:", data.error?.message);
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch transactions:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    return () => controller.abort();
  }, []);

  const columns: TableColumn<Transaction>[] = [
    { title: "ID", field: "id" },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Wallet Address", field: "wallet" },
  ];

  return (
    <AdminDynamicTable<Transaction>
      columns={columns}
      data={transactions}
      loading={loading}
    />
  );
}
