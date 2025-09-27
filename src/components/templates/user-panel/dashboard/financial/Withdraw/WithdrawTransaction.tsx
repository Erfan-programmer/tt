"use client";
import { useCallback } from "react";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithdrawBox from "./WithdrawBox";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { FaTimes } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { formatToTwoDecimals } from "@/components/modules/FormatToDecimal";
import WithdrawSkeleton from "@/skeletons/User-Panel/dashboard/WithdrawSkeleton";

// EmptyBox component for when withdraw is not available
function EmptyBox({ whitelistMessage }: { whitelistMessage?: string }) {
  return (
    <div className="withdraw-empty-container border-standard rounded-xl py-8 px-6 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
      <div className="text-center">
        <div className="mb-4">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto text-gray-400"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-[var(--dark-color)] dark:text-white mb-2">
          Withdraw Temporarily Unavailable
        </h3>
        {whitelistMessage && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center mb-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-600 dark:text-yellow-400 mr-2"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                Withdrawal Schedule
              </span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {whitelistMessage}
            </p>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Please try again during the scheduled withdrawal period or contact
          support for assistance.
        </p>
      </div>
    </div>
  );
}

// Skeleton component for withdraw transactions
function WithdrawTransactionSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr
          key={index}
          className={`transition-colors ${
            index % 2 === 0
              ? "bg-white dark:bg-[#2A3246]"
              : "bg-[#f9f9fe] dark:bg-[#222631]"
          }`}
        >
          <td className="py-4 text-center px-4">
            <div className="h-4 w-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
          <td className="py-4 text-center px-4">
            <div className="h-4 w-16 sm:w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
          <td className="py-4 text-center px-4">
            <div className="h-4 w-12 sm:w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
          <td className="py-4 text-center px-4">
            <div className="h-4 w-20 sm:w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
          <td className="py-4 text-center px-4">
            <div className="h-4 w-16 sm:w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
          <td className="py-4 text-center px-4">
            <div className="h-4 w-24 sm:w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
          <td className="py-4 text-center px-4">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

interface Transaction {
  id: string;
  user_id: string;
  // roi: string;
  // commission: string;
  transaction_hash: string;
  external_address: string;
  gross_amount: string;
  currency: string;
  ref: string;
  amount?: string;
  cryptocurrency: string;
  wallet_address: string;
  status:
    | "pending"
    | "completed"
    | "failed"
    | "processed"
    | "approved"
    | "canceled";
  note?: string | null;
  txid?: string | null;
  payed_at?: string | null;
  created_at: string;
  updated_at: string;
}
interface WithdrawResponse {
  total: number;
  per_page: number;
  data: Transaction[];
  withdraw: {
    withdraw_whitelist?: string;
  };
}

export default function WithdrawTransaction() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [withdrawRefresh, setWithdrawRefresh] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modalFadeOut, setModalFadeOut] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelModalFadeOut, setCancelModalFadeOut] = useState(false);
  const [transactionToCancel, setTransactionToCancel] =
    useState<Transaction | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [withdrawLoading, setIsLWithdrawLoading] = useState(false);

  // Cancel withdraw mutation using useApiMutation

  // Function to trigger withdraw list refresh
  const handleWithdrawSubmitted = () => {
    setWithdrawRefresh((prev) => prev + 1);
  };

  const [data, setData] = useState<WithdrawResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withdrawDetail, setWithdrawDetail] = useState<any | null>(null);

  const fetchWithdrawList = useCallback(
    async (page: number = 1, itemsPerPage: number = 10) => {
      try {
        setIsLoading(true);
        setError(null);
        const token = loadUserData()?.access_token;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/withdrawList`
          : "/v1/client/wallet/withdrawList";

        const url = `${apiUrl}?page=${page}&per_page=${itemsPerPage}`;

        const res = await apiRequest<any>(url, "GET", null, {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        });

        if (res.success) {
          setData(res.data);
          setTransactions(res.data?.data);
        } else {
          throw new Error(res.message || "Failed to fetch withdraw list");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ---------------- Fetch Withdraw Detail ----------------
  const fetchWithdrawDetail = useCallback(async () => {
    setIsLWithdrawLoading(true);
    try {
      const token = loadUserData()?.access_token;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/withdrawDetail`
        : "/v1/client/wallet/withdrawDetail";

      const res = await apiRequest<any>(apiUrl, "GET", null, {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      });

      if (res.success) {
        setWithdrawDetail(res.data?.data || res.data);
        setIsLWithdrawLoading(false);
      } else {
        setIsLWithdrawLoading(false);
        throw new Error(res.message || "Failed to fetch withdraw detail");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  }, []);
  // call when page or withdrawRefresh changes

  const safeData = data ?? { total: 0, per_page: itemsPerPage, withdraw: [] };
  const total = safeData?.total || 0;
  const perPage = safeData?.per_page || itemsPerPage;
  const withdrawInfo = data?.withdraw;
  const canWithdraw = withdrawDetail?.can_withdrawal;
  const whitelistMessage = withdrawInfo?.withdraw_whitelist;
  useEffect(() => {
    fetchWithdrawList(page, perPage);
    fetchWithdrawDetail();
  }, [page, withdrawRefresh, fetchWithdrawList, fetchWithdrawDetail, perPage]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleShowModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalFadeOut(false);
    setModalOpen(true);
    console.log("transaction", transaction);
  };

  const handleCloseModal = () => {
    setModalFadeOut(true);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedTransaction(null);
      setModalFadeOut(false);
    }, 250);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Function to check if transaction can be cancelled (1-5 of each month)

  // Function to handle cancel withdraw
  const handleCancelWithdraw = (transaction: Transaction) => {
    setTransactionToCancel(transaction);
    setCancelModalFadeOut(false);
    setCancelModalOpen(true);
  };

  // Function to confirm cancel withdraw
  const handleConfirmCancel = async (transaction?: Transaction) => {
    setIsCancelling(true);

    const targetTransaction = transaction || transactionToCancel;
    if (!targetTransaction) return;

    try {
      const token = loadUserData()?.access_token;

      const response = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/cancelWithdrawal/${targetTransaction.id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.status) {
        toast.success(response.message || "Withdrawal cancelled successfully!");

        handleCloseCancelModal();

        handleWithdrawSubmitted();
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.dismiss("cancel-loading");
      toast.error(err.message || "Failed to cancel withdrawal.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Function to close cancel modal
  const handleCloseCancelModal = () => {
    setCancelModalFadeOut(true);
    setTimeout(() => {
      setCancelModalOpen(false);
      setTransactionToCancel(null);
      setCancelModalFadeOut(false);
    }, 250);
  };

  // Function to handle cancel modal overlay click
  const handleCancelOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseCancelModal();
    }
  };

  //   const { data: permissions } = usePermissions();

  //   let permissionArray = [];

  //   if (typeof permissions?.data?.body === "string") {
  //     permissionArray = permissions.data.body.split(",");
  //   } else if (Array.isArray(permissions?.data?.body)) {
  //     permissionArray = permissions.data.body;
  //   }
  console.log("selectedTransaction =>", selectedTransaction);
  return (
    <>
      {withdrawLoading ? (
        <>
          <WithdrawSkeleton />
        </>
      ) : (
        <>
          {withdrawDetail?.can_withdrawal ? (
            <WithdrawBox
              onWithdrawSubmitted={handleWithdrawSubmitted}
              onRefetch={() => fetchWithdrawList(page, itemsPerPage)}
              roi={withdrawDetail.roi}
              commission={withdrawDetail.commission}
              referral={withdrawDetail.referral}
              total={withdrawDetail.total}
            />
          ) : (
            <EmptyBox whitelistMessage="Withdrawals are temporarily disabled." />
          )}
        </>
      )}

      {
        <div className="withdraw-transaction-container border-standard rounded-xl px-[2rem] py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
          <div className="withdraw-transaction-header flex items-center justify-between text-[var(--dark-color)] dark:text-white mb-6">
            <p className="text-xl font-semibold">Withdraw List</p>
          </div>

          <div className="overflow-x-auto rounded-[1em]">
            <table className="w-full border-collapse rounded-lg">
              <thead>
                <tr className="bg-[#D9D9D9] rounded-t-lg">
                  <th className="text-center py-4 text-black font-medium px-4">
                    #
                  </th>
                  <th className="text-center py-4 text-black font-medium px-4">
                    Amount
                  </th>
                  <th className="text-center py-4 text-black font-medium px-4">
                    Currency
                  </th>
                  <th className="text-center py-4 text-black font-medium px-4">
                    Wallet Address
                  </th>
                  <th className="text-center py-4 text-black font-medium px-4">
                    Status
                  </th>
                  <th className="text-center py-4 text-black font-medium px-4">
                    Request Date
                  </th>
                  <th className="text-center py-4 text-black font-medium px-4">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <WithdrawTransactionSkeleton />
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-red-500">
                      {(error as any)?.message
                        ? (error as any).message
                        : String(error)}
                    </td>
                  </tr>
                ) : transactions?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions?.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`transition-colors ${
                        index % 2 === 0
                          ? "bg-white dark:bg-[#2A3246]"
                          : "bg-[#f9f9fe] dark:bg-[#222631]"
                      }`}
                    >
                      <td className="py-4 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {index + 1}
                      </td>
                      <td className="py-4 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {formatToTwoDecimals(Number(transaction.amount))}
                      </td>
                      <td className="py-4 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {transaction.currency.toUpperCase()}
                      </td>
                      <td className="py-4 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {transaction.external_address}
                      </td>
                      <td className="py-4 text-center px-4">
                        <div className="flex flex-col items-center gap-2">
                          <span
                            className={`text-sm ${
                              transaction.status === "pending"
                                ? "text-yellow-500"
                                : transaction.status === "completed"
                                ? "text-green-500"
                                : transaction.status === "processed"
                                ? "text-[#00FF90]"
                                : transaction.status === "approved"
                                ? "text-green-500"
                                : transaction.status === "canceled"
                                ? "text-red-500"
                                : "text-blue-500"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 text-center px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="hover:scale-110 transition-transform"
                            title="Show Details"
                            onClick={() => handleShowModal(transaction)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="#275EDF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="#275EDF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {transaction?.status?.toLowerCase() === "pending" &&
                            canWithdraw && (
                              <button
                                onClick={() =>
                                  handleCancelWithdraw(transaction)
                                }
                                className="px-3 py-1 text-white text-[.8rem] rounded-lg transition-colors bg-red-500 hover:bg-red-600"
                                title="Cancel Withdraw"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {modalOpen && selectedTransaction && (
            <div
              className={`fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 bg-opacity-40 transition-opacity duration-250 ${
                modalFadeOut ? "opacity-0" : "opacity-100"
              }`}
              onClick={handleOverlayClick}
            >
              <div
                className={`bg-white dark:bg-[#23263a] rounded-2xl shadow-2xl p-0 min-w-[340px] w-[90%] sm:w-[50%]  relative ${
                  modalFadeOut ? "animate-fadeOut" : "animate-fadeIn"
                }`}
              >
                {/* Header with blue accent and close button */}
                <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl bg-[#275EDF] dark:bg-[#275EDF]">
                  <h2 className="text-sm font-bold text-[#383C47] dark:text-white">
                    Transaction Details
                  </h2>
                  <button
                    className="text-white hover:text-red-200 text-2xl font-extrabold transition-colors"
                    onClick={handleCloseModal}
                    title="Close"
                    style={{ lineHeight: 1 }}
                  >
                    &times;
                  </button>
                </div>
                <div className="px-6 py-5">
                  {/* Transaction Summary */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-[#2a2c37] rounded-lg">
                    <h3 className="text-sm font-semibold text-[var(--dark-color)] dark:text-white mb-3">
                      Transaction Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Amount:
                        </span>
                        <p className="text-[var(--dark-color)] dark:text-white font-semibold">
                          {/* {selectedTransaction.roi !== "0.000000" &&
                            `ROI: $${parseFloat(
                              selectedTransaction.roi
                            ).toFixed(2)}`}
                          {selectedTransaction.commission !== "0.000000" &&
                            `Commission: $${parseFloat(
                              selectedTransaction.commission
                            ).toFixed(2)}`}
                          {selectedTransaction.ref !== "0.000000" &&
                            `Referral: $${parseFloat(
                              selectedTransaction.ref
                            ).toFixed(2)}`} */}

                          {selectedTransaction?.amount &&
                            selectedTransaction.amount !== "0.000000" &&
                            ` $${parseFloat(
                              Number(selectedTransaction.amount).toFixed(2)
                            )}`}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Currency:
                        </span>
                        <p className="text-[var(--dark-color)] dark:text-white font-semibold">
                          {selectedTransaction?.cryptocurrency?.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Status:
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-[.8rem] font-medium ${
                            selectedTransaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                              : selectedTransaction.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : selectedTransaction.status === "processed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                              : selectedTransaction.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : selectedTransaction.status === "canceled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                          }`}
                        >
                          {selectedTransaction.status
                            ?.charAt(0)
                            ?.toUpperCase() +
                            selectedTransaction.status?.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Created:
                        </span>
                        <p className="text-[var(--dark-color)] dark:text-white font-semibold">
                          {new Date(
                            selectedTransaction.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="mb-4 flex flex-col gap-1">
                        <label className="font-semibold text-[var(--dark-color)] dark:text-white">
                          Gross Amount:
                        </label>
                        <span className="text-gray-700 dark:text-gray-300 ">
                          $ {selectedTransaction?.gross_amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-col gap-1">
                    <label className="font-semibold text-[var(--dark-color)] dark:text-white">
                      External Address:
                    </label>
                    <span className="text-gray-700 dark:text-gray-300 border-[2px] border-standard rounded-lg px-2 py-1">
                      {selectedTransaction?.external_address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Information Modal */}
          {cancelModalOpen && transactionToCancel && (
            <div
              className={`fixed inset-0 z-[1002] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                cancelModalFadeOut ? "opacity-0" : "opacity-100"
              }`}
              onClick={handleCancelOverlayClick}
            >
              <div
                className={`bg-white dark:bg-[#1a1b23] rounded-3xl shadow-2xl p-0 w-[95%] sm:w-[80%] md:w-[60%]  relative transform transition-all duration-300 ${
                  cancelModalFadeOut
                    ? "scale-95 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              >
                {/* Header with blue gradient background */}
                <div className="flex items-center justify-between px-6 py-4 rounded-t-3xl bg-gradient-to-r from-[#275EDF] via-[#1e40af] to-[#1e3a8a]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#383C47] dark:text-white"
                      >
                        <path
                          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#383C47] dark:text-white">
                        Cancel Not Available
                      </h2>
                      <p className="text-white/80 text-xs">
                        Transaction cancellation is currently disabled
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-200 hover:scale-110"
                    onClick={handleCloseCancelModal}
                    title="Close"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="px-6 py-6">
                  {/* Main content with better spacing */}
                  <div className="mb-6">
                    {/* Icon and main message */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-blue-600 dark:text-blue-400"
                        >
                          <path
                            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      {canWithdraw ? (
                        <>
                          <h3 className="text-xl font-bold text-[var(--dark-color)] dark:text-white mb-2">
                            Confirm Cancellation
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-base">
                            Are you sure you want to cancel this withdrawal
                            transaction?
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-[var(--dark-color)] dark:text-white mb-2">
                            Cancellation Temporarily Disabled
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-base">
                            This transaction cannot be cancelled at the moment
                            due to system restrictions.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Whitelist message with blue theme */}
                    {whitelistMessage && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-[#383C47] dark:text-white"
                            >
                              <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="text-blue-800 dark:text-blue-200 font-semibold text-base">
                            Cancellation Schedule
                          </span>
                        </div>
                        <div className="bg-white dark:bg-[#23263a] rounded-lg p-3 border border-blue-300 dark:border-blue-600">
                          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed font-medium">
                            {whitelistMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Final message */}
                    <div className="mt-6 text-center">
                      {!canWithdraw && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-blue-600"
                          >
                            <path
                              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-blue-700 dark:text-blue-300 text-[.8rem] font-medium">
                            Please try again during the scheduled cancellation
                            period
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-center gap-3">
                    {cancelModalOpen ? (
                      <>
                        <button
                          onClick={() => handleConfirmCancel()}
                          disabled={isCancelling}
                          className={`px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg ${
                            isCancelling
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105"
                          }`}
                        >
                          {isCancelling ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Cancelling...
                            </div>
                          ) : (
                            "Confirm Cancel"
                          )}
                        </button>

                        <button
                          onClick={handleCloseCancelModal}
                          disabled={isCancelling}
                          className={`px-6 py-2 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg ${
                            isCancelling
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 hover:scale-105"
                          }`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCloseCancelModal}
                        className="px-6 py-2 bg-gradient-to-r from-[#275EDF] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1e3a8a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(total / perPage)}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        </div>
      }
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
