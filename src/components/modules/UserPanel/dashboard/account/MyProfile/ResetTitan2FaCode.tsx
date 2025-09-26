"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import TitanNotification from "../../../TitanNotification/TitanNotification";
import { IoMdClose } from "react-icons/io";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface TwoFaData {
  secretKey: string;
  qrCodeUrl: string;
}

interface Props {
  userEmail: string;
  handleResetToken: (data: TwoFaData) => void;
}


export default function ResetTitan2FaCode({
  userEmail,
  handleResetToken,
}: Props) {
  const [code, setCode] = useState("");
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (isPending || !code) return;
    if (!userEmail) {
      toast.error("Email not found. Please enter your email first.");
      return;
    }

    setIsPending(true);
    const token = loadUserData()?.access_token;

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/security/2fa/verify-code`,
        "POST",
        { code, email: userEmail },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success && res.data) {
        toast.success(res.message || "2FA verification successful");

        handleResetToken({
          secretKey: res.data?.data?.secret_key,
          qrCodeUrl: res.data?.data?.qr_code_url,
        });

        setCode("");
      } else {
        if (res.error?.code === 401) {
          setShowUnauthorizedModal(true);
          setErrorMessage(
            res.error.message || "Unauthorized access. Please try again."
          );
        } else {
          toast.error(res.error?.message || "Error verifying 2FA code");
        }
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleModalClose = () => {
    setShowUnauthorizedModal(false);
    setCode("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
      {showUnauthorizedModal && (
        <TitanNotification
          icon={
            <IoMdClose className="text-[var(--main-background)] text-2xl" />
          }
          className="border-failed"
          btn="Try Again"
          btnStyle="bg-[var(--loss)]"
          onClose={handleModalClose}
        >
          {errorMessage}
        </TitanNotification>
      )}

      <div className="mt-4 w-full md:w-[50%]">
        <label className="sponsor-label flex justify-start items-start gap-2 mb-2 text-[var(--main-background)] dark:text-white text-md">
          Enter Email Verification Code
        </label>
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 text-[#383C47] dark:text-white"
            autoComplete="off"
          />
          <div
            className="w-full h-full text-white flex items-center px-4 py-2 rounded-lg border bg-transparent text-xl tracking-widest select-none min-h-[48px]"
            style={{ letterSpacing: "0.5em", zIndex: 1 }}
            onClick={() => inputRef.current?.focus()}
          >
            {"*".repeat(code.length)}
          </div>
        </div>

        <div className="titan-form-footer flex justify-center md:justify-start items-end mt-8 w-[95%] mx-auto">
          <button
            className="titan-btn min-w-[30%] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isPending || !code}
          >
            {isPending ? "Verifying..." : "Reset 2FA"}
          </button>
        </div>
      </div>
    </>
  );
}
