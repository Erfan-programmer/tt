"use client";
import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Typography,
  Skeleton,
} from "@mui/material";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import React from "react";
import CryptoSelector from "@/components/Ui/inputs/CryptoSelector";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { FaTimes, FaMinus } from "react-icons/fa";
import Image from "next/image";
import TitanNotification from "@/components/modules/UserPanel/TitanNotification/TitanNotification";
import { IoIosTimer } from "react-icons/io";
import { useRouter } from "next/navigation";

const StyledTableCell = styled(TableCell)(({}) => ({
  padding: "12px 16px",
  borderRadius: "8px",
  border: "none",
  transition: "all 0.2s ease",
  "&.MuiTableCell-head": {
    backgroundColor: "#868686",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.2rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#757575",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
  },
  "&.MuiTableCell-body": {
    backgroundColor: "#ececec",
    border: "2px solid #333",
    color: "#000",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  "&.footer-cell": {
    position: "sticky",
    bottom: 0,
    backgroundColor: "#ececec",
    color: "#000",
    fontWeight: "bold",
    fontSize: "1.2rem",
    zIndex: 2,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  "&.amount-column": {
    width: "30%",
    minWidth: "120px",
  },
  "&.description-column": {
    width: "70%",
  },
}));

type contractBodyTypes = {
  can_cancel: boolean;
  details: {
    contract_number: string;
    total_lose_covered: string;
    initial_investment: string;
    total_income_deducted: string;
    cancellation_fee_percentage: string;
    penalty: number;
    refund_amount: number;
  };
};

export default function CancelContractForm() {
  const [twoFaCode, setTwoFaCode] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crypto, setCrypto] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState<boolean>(false);
  const [contractBody, setContractBody] = useState<contractBodyTypes>();
  const [show70Error, setShow70Error] = useState("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    const token = loadUserData()?.access_token;
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/cancellationPreview`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response.status === 403) {
        setShow70Error(response.message);
        console.log("message =>", response.message);
        router.back();
        setShowPendingModal(true);
      }
      if (response.status === 402) {
        setShowPendingModal(true);
        setShow70Error(response.message);
      } else if (response.success) {
        setContractBody(response.data.data);
      } else {
        setContractError("Failed to fetch contract details." as any);
      }
    } catch (err: any) {
      setContractError(err.message || "Something went wrong.");
    } finally {
      setContractLoading(false);
    }
  };
  useEffect(() => {
    setContractLoading(true);

    fetchData();
  }, [router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null;
    if (!selected) return;
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crypto || !walletAddress || !file || !twoFaCode) {
      toast.error("All fields are required");
      return;
    }
    const token = loadUserData()?.access_token;
    try {
      const formData = new FormData();
      formData.append("refund_currency", crypto);
      formData.append("refund_address", walletAddress);
      formData.append("code", twoFaCode);
      formData.append("document", file);

      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/cancel`,
        "POST",
        formData,
        { Authorization: `Bearer ${token}` }
      );
      if (response.success) {
        toast.success(response.message || "Contract canceled successfully");
      } else {
        toast.error(response.message || "Failed to cancel contract");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (contractLoading)
    return (
      <>
        <TitanNotice
          title="Notice"
          alert="Please note that after confirming the cancellation, your account will be permanently deactivated."
          description="If you cancel your investment contract before its end date and the contract is terminated by you, the company will deduct all the profits paid to you so far from your investment amount, and a 10% penalty will be applied to your principal investment. After completing the necessary documentation, the remaining amount will be transferred to the wallet address you have provided.
If you have received more than 80% of your investment amount in profits from Titan Investments during this period, you will not be able to cancel your contract and must wait until its legal end date."
        />
        <div className="p-8">
          <Skeleton variant="rectangular" height={40} className="mb-4" />
          <Skeleton variant="rectangular" height={40} className="mb-4" />
          <Skeleton variant="rectangular" height={40} className="mb-4" />
          <Skeleton variant="rectangular" height={40} className="mb-4" />
          <Skeleton
            variant="rounded"
            height={60}
            width="60%"
            className="mt-8"
          />
        </div>
      </>
    );

  if (contractError)
    return (
      <>
        <TitanNotice
          title="Notice"
          alert="Please note that after confirming the cancellation, your account will be permanently deactivated."
          description="If you cancel your investment contract before its end date and the contract is terminated by you, the company will deduct all the profits paid to you so far from your investment amount, and a 10% penalty will be applied to your principal investment. After completing the necessary documentation, the remaining amount will be transferred to the wallet address you have provided.
If you have received more than 80% of your investment amount in profits from Titan Investments during this period, you will not be able to cancel your contract and must wait until its legal end date."
        />
        <div className="text-center text-red-500 py-8">
          Error loading contract details
        </div>
      </>
    );

  const handleDownload = async () => {
    try {
      const token = loadUserData()?.access_token;
      if (!token) throw new Error("No access token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/downloadSettlementAgreement`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to download file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "SettlementAgreement.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error("Download failed:", err);
      return false;
    }
  };

  return (
    <>
      <TitanNotice
        title="Notice"
        alert="Please note that after confirming the cancellation, your account will be permanently deactivated."
        description="If you cancel your investment contract before its end date and the contract is terminated by you, the company will deduct all the profits paid to you so far from your investment amount, and a 10% penalty will be applied to your principal investment. After completing the necessary documentation, the remaining amount will be transferred to the wallet address you have provided.
If you have received more than 80% of your investment amount in profits from Titan Investments during this period, you will not be able to cancel your contract and must wait until its legal end date."
      />
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="user-contacts-container border-standard rounded-xl py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
        <div className="user-contact-header flex flex-col sm:flex-row items-center px-2 sm:px-[2rem]">
          <p className="text-[var(--main-background)] dark:text-white text-lg sm:text-xl">
            Cancel Contract and Refund Details
          </p>
        </div>
        <div className="w-full h-[1px] bg-standard my-3"></div>
        <div className="user-contracts-wrapper px-2 sm:px-[2rem]">
          <div className="mt-5 p-3 bg-[#d9d9d9] rounded-xl overflow-x-auto">
            <TableContainer
              sx={{
                maxHeight: 440,
                border: "none",
                backgroundColor: "transparent",
                "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "var(--sidebar-bg)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#A8FFAE",
                  borderRadius: "4px",
                },
              }}
            >
              <Table
                stickyHeader
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: ".4rem 0px",
                  minWidth: 400,
                }}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell className="amount-column">
                      Amount (USD)
                    </StyledTableCell>
                    <StyledTableCell className="description-column">
                      Description
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contractBody && (
                    <>
                      <TableRow>
                        <StyledTableCell className="amount-column">
                          ${contractBody.details.initial_investment}
                        </StyledTableCell>
                        <StyledTableCell className="description-column">
                          Initial Investment
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className="amount-column">
                          ${contractBody.details.total_income_deducted}
                        </StyledTableCell>
                        <StyledTableCell className="description-column">
                          Total Income
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className="amount-column">
                          ${contractBody.details.penalty}
                        </StyledTableCell>
                        <StyledTableCell className="description-column">
                          Penalty (
                          {contractBody.details.cancellation_fee_percentage})
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className="footer-cell amount-column">
                          ${contractBody.details.refund_amount}
                        </StyledTableCell>
                        <StyledTableCell className="footer-cell description-column">
                          Refund Amount
                        </StyledTableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="w-full h-[1px] bg-standard my-3"></div>
        <div className="flex flex-col ml-4 p-4 items-center justify-center gap-4">
          <button
            className="titan-btn flex items-center justify-center gap-4 !p-2 !px-4 w-full md:w-auto"
            onClick={() => setShowSampleModal(true)}
          >
            <span>View Sample Selfie</span>
          </button>
          <button
            className="flex items-center justify-center w-full md:w-auto"
            onClick={handleDownload}
          >
            <span className="underline text-[#004ADA]">
              Download Termination Form
            </span>
          </button>
        </div>
        <div className="w-full h-[1px] bg-standard my-3"></div>
        <form
          className="px-2 sm:px-[2rem] space-y-3 flex flex-col md:flex-row md:flex-wrap md:gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full md:w-[50%]">
            <CryptoSelector
              className="w-full"
              label="Select a cryptocurrency"
              value={crypto}
              onChange={setCrypto}
              required={true}
            />
          </div>
          <CustomInput
            readOnly={false}
            label="Your Wallet Address"
            value={walletAddress}
            onChange={setWalletAddress}
            required={true}
            className="w-full md:w-[50%]"
            type="text"
            placeholder="Wallet Address"
            validateLatinOnly={true}
            maxLength={100}
          />
          <div className="w-full md:w-[50%]">
            <Typography className="mb-4 text-[var(--main-background)] dark:text-white">
              Upload Your Selfie and Signed Contract
            </Typography>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden mt-3"
              ref={fileInputRef}
              accept="image/*,.pdf"
            />
            <div
              className="border-2 border-[#585966] rounded-2xl mt-2 p-1 cursor-pointer flex items-center justify-center bg-white dark:bg-[var(--sidebar-bg)] text-[#D9D9D9]"
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <div className="flex justify-center items-center w-full gap-3">
                {!file ? (
                  <div className="text-center file-upload-text gap-3">
                    <p className="text-[var(--main-background)] dark:text-[#D9D9D9]">
                      PNG, JPG or PDF
                    </p>
                    <p className="text-[var(--main-background)] dark:text-[#D9D9D9] text-sm">
                      (Max 800 X 800px)
                    </p>
                  </div>
                ) : (
                  <div className="text-center file-upload-text gap-3">
                    <p className="text-[var(--main-background)] dark:text-[#D9D9D9]">
                      {file.name.length > 30
                        ? file.name.slice(0, 30) + "..."
                        : file.name}
                    </p>
                    <p className="text-sm text-[var(--main-background)] dark:text-[#D9D9D9]">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            {previewUrl && (
              <div className="relative mt-4 w-40 h-40">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-xl cursor-pointer"
                  onClick={() => setShowPreviewModal(true)}
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-md"
                  onClick={handleRemoveFile}
                >
                  <FaMinus size={12} />
                </button>
              </div>
            )}
            {!previewUrl && file && (
              <div className="relative mt-4 p-3 border rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className="truncate text-sm text-[var(--main-background)] dark:text-[#D9D9D9]">
                  {file.name}
                </p>
                <p className="text-[.8rem] text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-md"
                  onClick={handleRemoveFile}
                >
                  <FaMinus size={12} />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-between items-end w-full flex-wrap">
            <CustomInput
              readOnly={false}
              label="2FA Code"
              value={twoFaCode}
              className="w-full md:w-[50%]"
              onChange={(value: string) => setTwoFaCode(value)}
              required={true}
              type="text"
              placeholder="Enter 2FA code"
              validateLatinOnly={true}
              maxLength={6}
            />
            <button
              type="submit"
              className="titan-cancel-btn text-white dark:text-[var(--main-background)] bg-[var(--main-background)] shadow-[0_1px_17px_#03071D] dark:bg-white dark:shadow-[0_1px_17px_#fff] mt-4 w-full md:w-auto"
            >
              Submit Cancellation Request
            </button>
          </div>
        </form>
      </div>
      <AnimatePresence>
        {showSampleModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
            onClick={() => setShowSampleModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="flex flex-col rounded-2xl p-4 bg-white max-w-sm bg-[#00000093] shadow-lg mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-end mb-2">
                <button
                  className="bg-white w-7 h-7 flex justify-center items-center rounded-full"
                  onClick={() => setShowSampleModal(false)}
                >
                  <FaTimes
                    className="text-[var(--main-background)]"
                    size={16}
                  />
                </button>
              </div>
              <div className="rounded-xl mx-auto overflow-hidden w-[90%] max-h-[80vh]">
                <Image
                  width={600}
                  height={600}
                  src="/cancel-contract.jpg"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div className="flex items-center justify-center my-8">
                <button className="titan-btn flex items-center justify-center gap-2 w-fit">
                  <svg
                    width="18"
                    height="22"
                    viewBox="0 0 18 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 14.4498V20.934M15 20.934L13 18.7726M15 20.934L17 18.7726M9 1.48145H4.2C3.0799 1.48145 2.51984 1.48145 2.09202 1.71702C1.71569 1.92424 1.40973 2.25489 1.21799 2.66159C1 3.12393 1 3.72918 1 4.93967V17.4757C1 18.6862 1 19.2915 1.21799 19.7538C1.40973 20.1605 1.71569 20.4912 2.09202 20.6984C2.51984 20.934 3.0799 20.934 4.2 20.934H10M9 1.48145L15 7.96562M9 1.48145V6.23651C9 6.84176 9 7.14438 9.10899 7.37555C9.20487 7.5789 9.35785 7.74422 9.54601 7.84783C9.75992 7.96562 10.0399 7.96562 10.6 7.96562H15M15 7.96562V10.127M5 16.6112H9M5 12.2884H11M5 7.96562H6"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>View Termination Form</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {showPreviewModal && previewUrl && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md"
            onClick={() => setShowPreviewModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="relative bg-white dark:bg-[#0f163a] p-4 rounded-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-3 -right-3 bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => setShowPreviewModal(false)}
              >
                <FaTimes className="text-[var(--main-background)]" size={16} />
              </button>
              <Image
                src={previewUrl}
                alt="Full Preview"
                width={600}
                height={600}
                className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPendingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
            onClick={() => setShowPendingModal(false)}
          >
            <div
              className="bg-white dark:bg-[var(--sidebar-bg)] rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <TitanNotification
                icon={
                  <IoIosTimer className="text-[var(--main-background)]  text-2xl" />
                }
                className="border-1"
                btn="dashboard"
                btnLink="/dashboard"
                btnStyle="bg-[var(--success)]"
              >
                {show70Error ? (
                  <span className="text-white">{show70Error}</span>
                ) : (
                  <span className="text-white">
                    Your cancellation request is pending! Our team will review
                    it, and you will be notified once the verification is
                    complete. Please note that the review process may take up to
                    10 business days, depending on your nationality.
                  </span>
                )}
              </TitanNotification>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
