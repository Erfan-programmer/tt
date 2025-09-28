"use client";
import React, { useEffect, useState } from "react";
import "./TeamContractsContent.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { useHeader } from "@/contextApi/HeaderContext";
import { FaTimes } from "react-icons/fa";

export default function TeamContractsContent() {
  const [contractRenewalData, setContractRenewalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const { headerData } = useHeader();
  const router = useRouter();

  // API call for contract renewal list
  useEffect(() => {
    const fetchContractRenewalList = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = loadUserData()?.access_token;
        const response = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/renewal-preview`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (response.success) {
          setContractRenewalData(response.data.data);
          setSelectedContract(response.data.data);
        } else {
          setError(response.message || "Failed to load contract renewal list");
          toast.error(
            response.message || "Failed to load contract renewal list"
          );
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        toast.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContractRenewalList();
  }, []);

  useEffect(() => {
    if (contractRenewalData) {
      if (contractRenewalData?.data?.body?.data?.length > 0) {
        setSelectedContract(contractRenewalData.data.body.data[0]);
      }
    }
  }, [contractRenewalData, error]);

  const handleSelect = (id: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextClick = () => {
    if (selectedOptions["contract"] === "accept_renewal") {
      setShowModal(true);
    } else if (selectedOptions["contract"] === "not_accept_renewal") {
      router.push(`/dashboard/financial/my-investments/cancel`);
    }
  };

  const handleCloseModal = () => {
    if (loading) return;
    setShowModal(false);
    setTwoFACode("");
  };

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black-500 bg-opacity-50 flex items-center justify-center z-50"
          onClick={loading ? undefined : handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-[#1a1a2e] rounded-xl p-6 border border-gray-200 dark:border-[#2a2a3e] shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-yellow-600 dark:text-[var(--gold)]">
                Confirm Account Renewal
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={loading}
                className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gray-300 dark:bg-gray-600 mb-4"></div>

            {/* Contract Info (above 2FA) */}
            {selectedContract && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-[#16213e] rounded-lg border border-gray-300 dark:border-[#2a2a3e] text-sm text-gray-700 dark:text-gray-300">
                <p>Fee Base Amount: {selectedContract.fee_base_amount}</p>
                <p>Fee Percentage: {selectedContract.fee_percentage}%</p>
                <p>Renewal Fee: {selectedContract.renewal_fee}</p>
                <p>Is Free: {selectedContract.is_free ? "Yes" : "No"}</p>
              </div>
            )}

            {/* 2FA Input */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Enter your 2FA code
              </label>
              <input
                type="text"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                value={twoFACode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setTwoFACode(value);
                }}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg text-center text-lg font-mono tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  twoFACode.length === 6
                    ? "bg-blue-100 border-2 border-blue-500 text-blue-900 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-100"
                    : "bg-gray-100 border-2 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:focus:ring-blue-400 dark:focus:border-transparent
                `}
                placeholder="Enter 2FA code"
              />
            </div>

            {/* Confirm Button */}
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const token = loadUserData()?.access_token;

                  const postResponse = await apiRequest<any>(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/renew`,
                    "POST",
                    { code: twoFACode },
                    { Authorization: `Bearer ${token}` }
                  );

                  if (postResponse.success) {
                    toast.success(postResponse.message || "Renewal confirmed!");

                    // Refresh contract renewal preview
                    const getResponse = await apiRequest<any>(
                      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/renewal-preview`,
                      "GET",
                      undefined,
                      { Authorization: `Bearer ${token}` }
                    );

                    if (getResponse.success) {
                      setContractRenewalData(getResponse.data);
                      if (getResponse.data?.length > 0) {
                        setSelectedContract(getResponse.data[0]);
                      }
                    }

                    setShowModal(false);
                    setTwoFACode("");
                  } else {
                    toast.error(
                      postResponse.message || "Failed to confirm renewal"
                    );
                  }
                } catch (err: any) {
                  toast.error(err.message || "Something went wrong");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || twoFACode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {loading ? "Processing..." : "Confirm Renewal"}
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Contract Expiration Message */}
      <div className="team-account-content min-h-[70vh] px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
        <div className="contract-expiration-modal bg-[#fff] dark:bg-[#16213e] rounded-xl p-6 border border-[#2a2a3e] shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#383C47] dark:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-[var(--dark-color)] dark:text-white text-lg font-semibold">
              Contract Expiration #{headerData?.t_id}
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
              Your contract period has ended.{" "}
              <span className="text-red-400 font-semibold">
                {selectedContract
                  ? `(${Math.ceil(
                      (new Date(selectedContract.expire_date).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} days remaining)`
                  : "(14 days remaining)"}
              </span>{" "}
              Please confirm whether you wish to renew your account or let it
              expire. Once confirmed, this decision will be final and cannot be
              changed.
            </p>
          </div>

          {/* Radio options */}
          <div className="space-y-4 mb-6">
            <div
              className={`register-inputs-reward ${
                selectedOptions["contract"] === "accept_renewal"
                  ? "selected"
                  : "unselected"
              } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 w-full  sm:w-[60%] md:w-[50%]`}
              onClick={() => handleSelect("contract", "accept_renewal")}
            >
              <span
                className={`${
                  selectedOptions["contract"] === "accept_renewal"
                    ? "text-[var(--gold)]"
                    : "text-[var(--dark-color)] dark:text-white"
                }`}
              >
                I want to renew my account
              </span>
              <label className="custom-radio-container">
                <input
                  type="radio"
                  name={`contract-renewal`}
                  value="accept_renewal"
                  checked={selectedOptions["contract"] === "accept_renewal"}
                  onChange={() => handleSelect("contract", "accept_renewal")}
                  className="hidden"
                />
                <span className="custom-radio w-7 h-7 border-2 rounded-full border-[var(--gold)] flex items-center justify-center relative">
                  {selectedOptions["contract"] === "accept_renewal" && (
                    <svg
                      className="w-5 h-5 text-[#fff]"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </label>
            </div>

            <div
              className={`register-inputs-reward ${
                selectedOptions["contract"] === "not_accept_renewal"
                  ? "selected"
                  : "unselected"
              } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 w-full sm:w-[60%] md:w-[50%]`}
              onClick={() => handleSelect("contract", "not_accept_renewal")}
            >
              <span
                className={`${
                  selectedOptions["contract"] === "not_accept_renewal"
                    ? "text-[var(--loss)]"
                    : "text-[var(--dark-color)] dark:text-white"
                }`}
              >
                I do not want to renew my account
              </span>
              <label className="custom-radio-container">
                <input
                  type="radio"
                  name={`contract-renewal`}
                  value="not_accept_renewal"
                  checked={selectedOptions["contract"] === "not_accept_renewal"}
                  onChange={() =>
                    handleSelect("contract", "not_accept_renewal")
                  }
                  className="hidden"
                />
                <span className="custom-radio w-7 h-7 border-2 rounded-full border-[var(--loss)] flex items-center justify-center relative">
                  {selectedOptions["contract"] === "not_accept_renewal" && (
                    <svg
                      className="w-5 h-5 text-[#fff]"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[20vw] rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedOptions["contract"]}
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
