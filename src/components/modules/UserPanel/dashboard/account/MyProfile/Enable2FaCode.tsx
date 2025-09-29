"use client";

import { useState, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import TitanNotice from "../../../TitanNotice/TitanNotice";
import TitanNotification from "../../../TitanNotification/TitanNotification";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest, ApiResponse } from "@/libs/api";
import Image from "next/image";

interface Enable2FaProps {
  secretKey: string;
  qrCodeUrl?: string;
  userEmail: string;
  onBackToStep1?: () => void;
}

export default function Enable2FaCode({
  secretKey,
  qrCodeUrl,
  userEmail,
  onBackToStep1,
}: Enable2FaProps) {
  const inputLength = 6;
  const [code, setCode] = useState<string[]>(Array(inputLength).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [isLoading , setIsLoading] = useState(false)
  const confirm2FA = async (): Promise<ApiResponse> => {
    const token = loadUserData()?.access_token;
    setIsLoading(true)
    const verificationCode = code.join("");

    return await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/security/2fa/confirm-new`,
      "POST",
      { code: verificationCode, email: userEmail },
      { Authorization: `Bearer ${token}` }
    );
  };

  const { mutate: handleConfirm2FA } = useMutation({
    mutationFn: confirm2FA,
    onSuccess: (res: ApiResponse) => {
      setShowNotification(true);
    setIsLoading(false)
    
    setNotificationMessage(res.message || "2FA enabled successfully");
  },
  onError: (error: any) => {
      setIsLoading(false)
      setShowNotification(true);
      setNotificationMessage(error?.message || "Error enabling 2FA");
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < inputLength - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;
    const newCode = pasteData
      .slice(0, inputLength)
      .split("")
      .concat(Array(inputLength).fill(""))
      .slice(0, inputLength);
    setCode(newCode);
    const lastFilledIndex = newCode.findIndex((char) => char === "");
    inputRefs.current[
      lastFilledIndex > 0 ? lastFilledIndex : inputLength - 1
    ]?.focus();
  };

  const handleApple = () => {
    window.open(
      "https://apps.apple.com/us/app/google-authenticator/id388497605",
      "_blank"
    );
  };

  const handleGooglePlay = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&pli=1",
      "_blank"
    );
  };

  const handleVerify2FA = () => {
    if (code.join("").length === 6) {
      handleConfirm2FA();
    } else {
      toast.error("Please enter the complete 6-digit code");
    }
  };

  return (
    <>
      <TitanNotice
        title="Notice"
        description="Two Factor Authentication is disabled for now. Please enable it."
      />
      {showNotification && (
        <TitanNotification
          icon={
            <IoMdClose className="text-[var(--main-background)] text-2xl" />
          }
          className={
            notificationMessage.includes("successfully")
              ? "border-success"
              : "border-failed"
          }
          btn="Close"
          btnStyle={
            notificationMessage.includes("successfully")
              ? "bg-[var(--profit)]"
              : "bg-[var(--loss)]"
          }
          onClose={() => {
            setShowNotification(false);
            if (notificationMessage.includes("successfully") && onBackToStep1) {
              onBackToStep1();
            }
          }}
        >
          <span className="text-white">

          {notificationMessage}
          </span>
        </TitanNotification>
      )}

      <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
        <div className="titan-form-title w-[95%] mx-auto text-[var(--main-background)] dark:text-white">
          <p>
            Two factor authentication (2FA) strengthens access security by
            requiring two methods to verify your identity. Make sure you backup
            your QR code and secret.
          </p>
        </div>

        <div className="sm:w-[85%] flex flex-col sm:flex-row gap-2 sm:gap-x-4 items-center mx-auto border-standard bg-[#f9f9fe] dark:bg-[#0f163a] p-2 py-[1rem] mt-[2rem] rounded-lg">
          <div className="twofacode-img bg-[var(--main-background)] dark:bg-white w-[14rem] h-[14rem] md:w-[15rem] md:h-[15rem] rounded-xl overflow-hidden p-[1rem]">
            <Image
              width={600}
              height={600}
              className="w-full h-full"
              src={qrCodeUrl as string}
              alt="2FA QR Code"
            />
          </div>
          <div className="text-[var(--main-background)] dark:text-white">
            <div className="scan-container">
              <p>Can&apos;t scan QR code?</p>
              <span>Enter this secret instead:</span>
            </div>
            <div className="scan-code  md:w-fit p-2 rounded-lg pr-[2rem] flex flex-wrap items-center mt-4 border-[2px] border-[#383C47]">
              <span>{secretKey}</span>
            </div>

            <div
              className={`coppied-text text-[--main-background] ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            >
              <span>QR code copied...</span>
            </div>

            <div className="titan-copy">
              <button
                className="flex justify-center gap-3 items-center bg-white p-2 min-w-[8rem] sm:px-[2rem] rounded-lg"
                onClick={handleCopy}
              >
                <span className="text-[var(--main-background)]">Copy Code</span>
                {copied ? <FaCheck className="text-[var(--gold)]" /> : null}
              </button>
            </div>
          </div>
        </div>

        <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[1rem] items-start w-[95%] mx-auto">
          <ol className="text-[var(--main-background)] dark:text-white">
            <li>
              1. You must set up your Google Authenticator app before
              proceeding.
            </li>
            <li>2. Enter the 6-digit code provided by Google Authenticator.</li>
          </ol>
        </div>

        <div className="titan-form-footer mt-[2rem] my-[1rem] w-[95%] mx-auto">
          <div className="titan-form-footer-title text-[var(--main-background)] dark:text-white">
            <p>Enter Verification Code:</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-[1rem] justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el: any) => (inputRefs.current[index] = el!)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-12 text-center text-[var(--main-background)] dark:text-white text-[1.3rem] rounded-lg border-2 border-[var(--main-background)] dark:border-[#fff] bg-transparent focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-4">
        <div className="mt-[2rem]">
          <div className="flex justify-start items-center flex-wrap gap-5 mb-4">
            <button
              onClick={handleApple}
              className="flex items-center gap-3 min-w-fit w-[80%] mx-auto sm:mx-0 sm:w-[40%] md:w-[30%] xl:w-[20%] text-left titan-btn-download-white"
            >
              <Image
                width={200}
                height={200}
                src="/8abf638d4b14347baf79d8c45d671cfe.png"
                className="w-[2rem]"
                alt=""
              />
              <p>
                Download On <br />
                <span className="font-[600]">The App Store</span>
              </p>
            </button>
            <button
              onClick={handleGooglePlay}
              className="flex items-center gap-3 min-w-fit w-[80%] mx-auto sm:mx-0 sm:w-[40%] md:w-[30%] xl:w-[20%] text-left  titan-btn-download-white"
            >
              <Image
                width={200}
                height={200}
                src="/69baf10bd9b43094878263a082232abf.png"
                className="w-[3rem]"
                alt=""
              />
              <p>
                Get It On <br /> <span className="font-[600]">Google Play</span>
              </p>
            </button>
          </div>
        </div>
        <button
          className={`titan-btn ${isLoading ? "!bg-gray-400" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleVerify2FA}
        >
          {isLoading ? "Enabling ..." : "Enable 2FA"}
        </button>
      </div>
    </>
  );
}
