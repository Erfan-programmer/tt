"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FaCheck, FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import TitanNotification from "@/components/modules/UserPanel/TitanNotification/TitanNotification";
import { PaymentData } from "@/types/Layout/FormLayout";
import { decodeData } from "@/utils/HashData";
import Image from "next/image";
import { useAuth } from "@/contextApi/AuthContext";
import { usePayment } from "@/contextApi/PaymentProvider";
import { useHeader } from "@/contextApi/HeaderContext";

interface PaymentTitanProps {
  paymentProp?: PaymentData;
}

export default function PaymentTitan({ paymentProp }: PaymentTitanProps) {
  const searchParams = useSearchParams();
  const paymentEncoded = searchParams?.get("data");
  const { payment: paymentFromContext } = usePayment();
  const { user } = useAuth();
  const CLIENT_ID = user?.id;

  const initialPaymentData = paymentEncoded
    ? decodeData(paymentEncoded)
    : paymentProp || paymentFromContext;

  const [payment] = useState<PaymentData | null>(initialPaymentData);
  const [timer, setTimer] = useState(29 * 60 + 30);
  const [copied, setCopied] = useState(false);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { refetch } = useHeader();
  
  useEffect(() => {
    if (!CLIENT_ID || typeof window === 'undefined') return;

    let echoInstance: any;
    
    import("@/libs/PusherConfig")
      .then((module) => {
        echoInstance = module.default;
        
        const privateChannel = echoInstance.private(`client.${CLIENT_ID}`);

        privateChannel.listen(".payment.success", (data: { message: string }) => {
          setMessage(data.message);
          setShowSuccessNotif(true);
          setTimeout(() => {
            refetch();
          }, 1500);
        });

        return () => {
          if (privateChannel) {
            privateChannel.stopListening(".payment.success");
            echoInstance.leave(`client.${CLIENT_ID}`);
          }
        };
      })
      .catch((error) => {
        console.error("Failed to load PusherConfig:", error);
      });
      
    return () => {
        if (echoInstance) {
            echoInstance.leave(`client.${CLIENT_ID}`);
        }
    }
  }, [CLIENT_ID, refetch]);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Payment verified successfully");
      setShowSuccessNotif(true);

      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (copied) {
      toast.success("Wallet address copied!");
      setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCopy = useCallback(async () => {
    if (!payment) return;
    try {
      await navigator.clipboard.writeText(payment.wallet_address);
      setCopied(true);
    } catch {
      toast.error("Failed to copy wallet address");
    }
  }, [payment]);


  return (
    <>
      <ToastContainer />
      {showSuccessNotif && (
        <TitanNotification
          icon={<IoMdClose className="text-[var(--dark-color)] text-2xl" />}
          btn="Go to Dashboard"
          btnLink="/dashboard"
          btnStyle="bg-[#275EDF]"
          onClose={() => setShowSuccessNotif(false)}
        >
          <div className="font-bold text-lg mb-2">
            {message ? (
              message
            ) : (
              <>
                Congratulations!
                <br />
                Your Account is Fully Activated 🎉
              </>
            )}
          </div>
        </TitanNotification>
      )}
      {payment && (
        <div className="payment-content px-2 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
          <div className="payment-wrapper flex justify-between items-center text-[var(--gold)]">
            <p>{formatTime(timer)}</p>
          </div>
          <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>
          <div className="text-[#FFD600] text-md leading-relaxed mb-2 px-10">
            Please complete the payment within the remaining time shown above.
          </div>
          <div className="w-[100%] lg:w-[80%] flex flex-wrap gap-x-2 sm:gap-x-4 justify-center items-center mx-auto border-standard bg-[#f9f9fe] dark:bg-[#0f163a] p-2 pt-[1rem] mt-[2rem] rounded-lg">
            <div className="twofacode-img min-w-[80px] bg-[#275EDF] p-2 rounded-lg max-w-[12rem] overflow-hidden min-h-[100px]  flex flex-col items-center">
              {payment.qr && (
                <Image
                  width={400}
                  height={400}
                  src={payment.qr}
                  alt="Payment QR Code"
                  className="w-full h-full object-cover rounded-lg"
                  onClick={handleCopy}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            <div className="text-[var(--dark-color)] dark:text-white flex-1 min-w-[200px] my-4">
              <div className="flex flex-col gap-1 mb-2 text-center sm:text-left">
                <span className="font-semibold text-base">
                  Invoice Number:{" "}
                  <span className="font-mono">#{payment.invoice_number}</span>
                </span>
                <span className="font-semibold text-base">
                  Deposit Amount:{" "}
                  <span className="font-mono">${payment.currency_amount}</span>
                </span>
                <span className="font-semibold text-base">
                  Billing Currency:{" "}
                  <span className="font-mono">{payment.billing_currency}</span>
                </span>
                <span className="font-semibold text-base">Wallet Address:</span>
              </div>
              <div className="flex items-skretch my-4 sm:my-0">
                <div className="scan-code w-full border-[1px] border-[#383C47] rounded-[.5rem] overflow-x-auto p-2 text-left pr-[2rem] flex flex-wrap items-center">
                  <span className="break-all text-lg text-[#fff]">
                    {payment.wallet_address}
                  </span>
                </div>
                <button
                  className="flex sm:hidden justify-center gap-3 items-center bg-[var(--box-background)] p-2 px-4 rounded-lg"
                  onClick={handleCopy}
                >
                  <FaCopy className="text-[var(--dark-color)]" />
                </button>
              </div>
              <div className="titan-copy mt-4 hidden sm:flex">
                <button
                  className="flex justify-center gap-3 items-center bg-[var(--box-background)] p-2 min-w-[8rem] sm:px-[2rem] rounded-lg w-full sm:w-auto border border-[#00E0FF] hover:bg-[#00E0FF] hover:text-white transition"
                  onClick={handleCopy}
                >
                  <span className="text-[var(--dark-color)] text-sm sm:text-base">
                    Copy Code
                  </span>
                  {copied ? (
                    <FaCheck className="text-[var(--gold)]" />
                  ) : (
                    <FaCopy />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className={`payment-btn w-fit titan-btn ${
                loading ? "!bg-gray-400" : ""
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
            <button className="titan-btn !bg-gray-400">Back</button>
          </div>
        </div>
      )}
    </>
  );
}