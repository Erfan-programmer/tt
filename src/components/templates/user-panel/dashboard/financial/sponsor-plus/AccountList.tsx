"use client";

import { useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { FaEye, FaTimes, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "@/libs/api";
import { motion, AnimatePresence } from "framer-motion";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { useStatements } from "@/contextApi/SponsorContext";

interface AccountListProps {
  accounts: any[];
  refetch:()=> void
}

export default function AccountList({ accounts  , refetch}: AccountListProps) {
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");

  const baseUrl = "http://localhost:3000/register?splus_token=";

  const { fetchStatements, currentPage, totalPages } = useStatements();

  const handleShowActions = (account: any) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleCloseActions = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  const handleShowQr = async () => {
    if (!selectedAccount) return;
    try {
      const link = `${baseUrl}${selectedAccount.token}`;
      const url = await QRCode.toDataURL(link);
      setQrImage(url);
      setShowQrModal(true);
    } catch {
      toast.error("Failed to generate QR code");
    }
  };

  const handleCloseQr = () => {
    setShowQrModal(false);
    setQrImage("");
  };

  const handleCopyCode = () => {
    if (!selectedAccount) return;
    const link = `${baseUrl}${selectedAccount.token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    const token = loadUserData()?.access_token;
    try {
      await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/deleteSponsorPlus/${selectedAccount.id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Account deleted successfully!");
      fetchStatements(currentPage); 
      refetch()
      setShowDeleteModal(false);
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete account");
    }
  };

  const handlePageChange = (page: number) => {
    fetchStatements(page);
  };

  return (
    <div className="use-action-history-container border-standard rounded-xl px-[2rem] py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
      <ToastContainer />
      <div className="use-action-history-header flex items-center justify-between text-[var(--main-background)] dark:text-white mb-6">
        <p className="text-xl font-semibold">Your Sponsor Plus List</p>
      </div>
      <div className="overflow-x-auto rounded-[1em]">
        <table className="w-full border-collapse rounded-lg min-w-max">
          <thead>
            <tr className="bg-white dark:bg-[#D9D9D9] rounded-t-lg">
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                #
              </th>
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                Token
              </th>
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                Creator TID
              </th>
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                Sponsor TID
              </th>
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                Referrer TID
              </th>
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                Created At
              </th>
              <th className="text-center py-4 text-black font-medium px-4 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 text-center text-[var(--main-background)] dark:text-white whitespace-nowrap"
                >
                  No accounts found
                </td>
              </tr>
            ) : (
              accounts.map((account, index) => (
                <tr
                  key={account.id}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-[#2A3246]"
                      : "bg-[#f9f9fe] dark:bg-[#222631]"
                  }`}
                >
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap">
                    {index + 1 + (currentPage - 1) * 10 /* شماره‌گذاری با صفحه */}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap">
                    {account.token}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap">
                    {account.creator_client_tid}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap">
                    {account.sponsor_client_tid}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap">
                    {account.referrer_client_tid}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap">
                    {new Date(account.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4 whitespace-nowrap flex justify-center gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 shadow-lg text-white rounded transition-all duration-200"
                      onClick={() => handleShowActions(account)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="px-3 py-1 bg-red-200 hover:bg-red-300 shadow-lg rounded transition-all duration-200"
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handlePageChange(page)}
        />
      </div>

      {/* Actions Modal */}
      <AnimatePresence>
        {showModal && selectedAccount && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#2A3246] p-6 rounded-lg w-[400px] max-w-full flex flex-col gap-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Actions
                </h2>
                <button onClick={handleCloseActions}>
                  <FaTimes className="text-red-500" />
                </button>
              </div>
              <button
                className="w-full h-12 border-[2px] rounded-[.5rem] text-gray-400 dark:text-white shadow-md hover:bg-[#EDEDEC] dark:hover:bg-gray-800 transition-all"
                onClick={handleCopyCode}
              >
                Copy Code
              </button>
              <button
                className="w-full h-12 border-[2px] rounded-[.5rem] text-gray-400 dark:text-white shadow-md hover:bg-[#EDEDEC] dark:hover:bg-gray-800 transition-all"
                onClick={handleShowQr}
              >
                Show QR Code
              </button>
              <button
                className="w-full h-12 border-[2px] rounded-[.5rem] text-gray-400 dark:text-white shadow-md hover:bg-[#EDEDEC] dark:hover:bg-gray-800 transition-all"
                onClick={() =>
                  window.open(`${baseUrl}${selectedAccount.token}`, "_blank")
                }
              >
                Open Link In New tab
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQrModal && selectedAccount && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-[10001]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#2A3246] p-6 rounded-lg w-[400px] max-w-full flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                QR Code
              </h2>
              {qrImage && (
                <Image
                  width={200}
                  height={200}
                  src={qrImage}
                  alt="QR Code"
                  className="w-full max-w-[200px]"
                />
              )}
              <button
                className="mt-4 w-full h-10 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleCloseQr}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedAccount && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-[#2A3246] p-6 rounded-lg w-[400px] max-w-full flex flex-col gap-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                Confirm Delete
              </h2>
              <p className="text-black dark:text-white">
                Are you sure you want to delete this account?
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 h-10 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="flex-1 h-10 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
