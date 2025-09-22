"use client";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AdminDepositTransactions, { Investment } from "@/components/modules/p-admin/AdminDepositTransactions/AdminDepositTransactions";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import AdminTranactionsPayment, { Payment } from "@/components/modules/p-admin/AdminTranactionsPayment/AdminTranactionsPayment";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { apiRequest } from "@/libs/api";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";




export default function TwalletPaymentHistory() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showLineTitle, setShowLineTile] = useState({
    payment_history: true,
    deposit_investments: true,
  });

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalMessages, setTotalMessages] = useState(0);

  const fetchInvestments = useCallback(
    async (filter_by?: string, filter_value?: string) => {
      try {
        const token = loadEncryptedData()?.token;
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("per_page", itemsPerPage.toString());

        if (filter_by && filter_value) {
          queryParams.append("filter_by", filter_by);
          queryParams.append("filter_value", filter_value);
        }

        const res = await apiRequest<{ data: Investment[]; meta: { total: number } }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/search/investments?${queryParams.toString()}`,
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          setInvestments(res?.data?.data || []);
          setTotalMessages(res?.data?.meta?.total || 0);
        } else {
          toast.error("Error fetching investments: " + res.message);
        }
      } catch (err: any) {
        toast.error("Error fetching investments: " + err.message);
      }
    },
    [page, itemsPerPage]
  );

  const fetchPayments = useCallback(
    async (filter_by?: string, filter_value?: string) => {
      try {
        const token = loadEncryptedData()?.token;
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("per_page", itemsPerPage.toString());

        if (filter_by && filter_value) {
          queryParams.append("filter_by", filter_by);
          queryParams.append("filter_value", filter_value);
        }

        const res = await apiRequest<{ data: Payment[]; meta: { total: number } }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/search/payment?${queryParams.toString()}`,
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          setPayments(res?.data?.data || []);
          setTotalMessages(res?.data?.meta.total || 0);
        } else {
          toast.error("Error fetching payments: " + res.message);
        }
      } catch (err: any) {
        toast.error("Error fetching payments: " + err.message);
      }
    },
    [page, itemsPerPage]
  );

  useEffect(() => {
    fetchInvestments();
    fetchPayments();
  }, [page, fetchInvestments, fetchPayments]);

  return (
    <>
      <LineTitle
        onClick={() =>
          setShowLineTile((prev) => ({
            ...prev,
            payment_history: !showLineTitle.payment_history,
          }))
        }
        title="Payment History"
      />
      {showLineTitle.payment_history && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              { label: "Invoice Number", value: "invoice_number", placeholder: "Enter Invoice Number..." },
              { label: "To User TID", value: "to_user_tid", placeholder: "Enter To User TID..." },
              { label: "Currency", value: "currency", placeholder: "Enter Currency..." },
              { label: "TXID", value: "txid", placeholder: "Enter TXID..." },
              { label: "Status", value: "status", placeholder: "Enter Status..." },
            ]}
            onSearch={(filter_by, filter_value) => fetchPayments(filter_by, filter_value)}
            onClear={() => fetchPayments()}
          />
          <AdminTranactionsPayment data={payments} />
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(totalMessages / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </div>
        </AnimationTemplate>
      )}

      <LineTitle
        onClick={() =>
          setShowLineTile((prev) => ({
            ...prev,
            deposit_investments: !showLineTitle.deposit_investments,
          }))
        }
        title="Deposit & Investments"
      />
      {showLineTitle.deposit_investments && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Deposit & Investments"
            filterOptions={[
              { label: "User ID", value: "user_id", placeholder: "Enter User ID..." },
              { label: "Name", value: "name", placeholder: "Enter Name..." },
              { label: "Email", value: "email", placeholder: "Enter Email..." },
              { label: "Status", value: "status", placeholder: "Enter Status..." },
            ]}
            onSearch={(filter_by, filter_value) => fetchInvestments(filter_by, filter_value)}
            onClear={() => fetchInvestments()}
          />
          <AdminDepositTransactions data={investments} />
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(totalMessages / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
