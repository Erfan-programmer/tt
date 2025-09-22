"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import * as QRCode from "qrcode";
import TitanNotification from "@/components/modules/UserPanel/TitanNotification/TitanNotification";
import { IoMdClose } from "react-icons/io";
import { PaymentSkeleton } from "@/skeletons/User-Panel/MessageSkeleton/MessageSkeleton";
import { useVerify } from "@/contextApi/TitanContext";
import { apiRequest } from "@/libs/api";
import Image from "next/image";

interface PaymentDetail {
  pay_id: string;
  amount: number;
  date: string;
  qr_data?: string;
  cryptocurrency: string;
  toWallet: string;
}

interface PaymentIDPaymentProps {
  payId?: string;
}

interface PaymentDetail {
  pay_id: string;
  amount: number;
  date: string;
  qr_data?: string;
  cryptocurrency: string;
  toWallet: string;
}

interface PaymentIDPaymentProps {
  payId?: string;
}


export default function PaymentIDPayment({ payId }: PaymentIDPaymentProps) {
  const { paymentID } = useVerify();
  const effectivePayId = useMemo(() => payId || paymentID, [payId, paymentID]);
  const [data, setData] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [timer, setTimer] = useState(29 * 60 + 30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPaymentDetail = useCallback(async () => {
    if (!effectivePayId) return;
    setLoading(true);
    const res = await apiRequest<PaymentDetail>(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/detail/${effectivePayId}`,
      "GET",
      undefined,
      { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    );

    if (res.success) setData(res.data);
    else
      toast.error(
        res.message || res.error?.message || "Error fetching payment details"
      );
    setLoading(false);
  }, [effectivePayId]);

  const handleSubmit = async () => {
    if (!effectivePayId) {
      toast.error("Payment ID not found");
      return;
    }
    
    setLoading(true);
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
      "POST",
      { pay_id: effectivePayId },
      { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    );

    if (res.success) {
      toast.success(res.message || "Payment verified successfully");
      setShowSuccessNotif(true);
      fetchPaymentDetail();
    } else {
      toast.error(
        res.message || res.error?.message || "Error verifying payment"
      );
    }
    setLoading(false);
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(data?.toWallet || "");
      setCopied(true);
    } catch {
      toast.error("Failed to copy wallet address");
    }
  }, [data?.toWallet]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };



  useEffect(() => {
    fetchPaymentDetail();
  }, [fetchPaymentDetail]);




  useEffect(() => {
    fetchPaymentDetail();
  }, [fetchPaymentDetail]);

  useEffect(() => {
    if (data?.qr_data) {
      QRCode.toDataURL(data.qr_data)
        .then((url) => setQrImage(url))
        .catch(() => setQrImage(""));
    }
  }, [data?.qr_data]);

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

  return (
    <>
      <ToastContainer />
      {showSuccessNotif && (
        <TitanNotification
          icon={
            <IoMdClose className="text-[var(--main-background)] text-2xl" />
          }
          btn="Go to Dashboard"
          btnStyle="bg-[#275EDF]"
          onClose={() => setShowSuccessNotif(false)}
        >
          <div className="font-bold text-lg mb-2">
            Congratulations!
            <br />
            Your Account is Fully Activated 🎉
          </div>
          <div className="text-sm mt-2">
            Your investment process is complete, and your account is now{" "}
            <b>fully active</b>.<br />
            Go to Your <b>Dashboard</b> to start managing your investments and
            track your progress.
          </div>
        </TitanNotification>
      )}
      {loading && <PaymentSkeleton />}
      {data && (
        <div className="payment-content px-2 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
          <div className="payment-wrapper flex justify-between items-center text-[var(--gold)]">
            <p>{data.date || "-"}</p>
            <p>{formatTime(timer)}</p>
          </div>
          <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>
          <div className="text-[#FFD600] text-md leading-relaxed mb-2 px-10">
            Please complete the payment within the remaining time shown above.
            Otherwise, create a new deposit request by filling the deposit form
            again and follow the same procedure.
          </div>

          <div className="w-[100%] lg:w-[80%] flex flex-wrap gap-x-2 sm:gap-x-4 justify-center items-center mx-auto border-standard bg-[#f9f9fe] dark:bg-[#0f163a] p-2 pt-[1rem] mt-[2rem] rounded-lg">
            <div className="twofacode-img min-w-[80px] bg-[#275EDF] p-2 rounded-lg max-w-[12rem] overflow-hidden min-h-[100px] hidden sm:flex flex-col items-center">
              {qrImage && (
                <Image
                  width={400}
                  height={400}
                  src={qrImage}
                  alt="Payment QR Code"
                  className="w-full h-full object-cover rounded-lg"
                  onClick={handleCopy}
                  style={{ cursor: "pointer" }}
                  title="Click to copy QR data"
                />
              )}
            </div>

            <div className="text-[var(--main-background)] dark:text-white flex-1 min-w-[200px]">
              <div className="flex flex-col gap-1 mb-2">
                <span className="font-semibold text-base">
                  Invoice Number:{" "}
                  <span className="font-mono word-break">#{data.pay_id}</span>
                </span>
                <span className="font-semibold text-base">
                  Deposit Amount:{" "}
                  <span className="font-mono">${data.amount}</span>
                </span>
                <span className="font-semibold text-base">
                  Billing Currency:{" "}
                  <span className="font-mono">{data.cryptocurrency}</span>
                </span>
                <span className="font-semibold text-base">Wallet Address:</span>
              </div>

              <div className="flex items-skretch my-4 sm:my-0">
                <div className="scan-code w-full border-standard overflow-x-auto p-2 text-left rounded-lg pr-[2rem] flex flex-wrap items-center rounded-g sm:mt-4">
                  <span className="break-all text-lg text-[#fff]">
                    {data.toWallet}
                  </span>
                </div>
                <button
                  className="flex sm:hidden justify-center gap-3 items-center bg-white p-2 px-4 rounded-lg"
                  onClick={handleCopy}
                >
                  <FaCopy className="text-[var(--main-background)]" />
                </button>
              </div>

              <div className="titan-copy mt-4 hidden sm:flex">
                <button
                  className="flex justify-center gap-3 items-center bg-white p-2 min-w-[8rem] sm:px-[2rem] rounded-lg w-full sm:w-auto border border-[#00E0FF] hover:bg-[#00E0FF] hover:text-white transition"
                  onClick={handleCopy}
                >
                  <span className="text-[var(--main-background)] text-sm sm:text-base">
                    Copy Code
                  </span>
                  {copied ? (
                    <FaCheck className="text-[var(--gold)]" />
                  ) : (
                    <FaCopy className="text-[var(--main-background)]" />
                  )}
                </button>
              </div>

              <div
                className={`coppied-text text-center lg:text-left ${
                  copied ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300 mt-2`}
              >
                <span className="text-sm sm:text-base text-green-500 flex items-center gap-1 justify-center lg:justify-start">
                  <FaCheck className="inline-block" /> Wallet info copied!
                </span>
              </div>
            </div>
          </div>

          <div className="text-[#FFD600] text-md leading-relaxed mb-2 px-10 my-6">
            Please enter the transaction ID of your payment in the field below
            and click the submit button after the invoice amount has been
            confirmed by the blockchain network. Your request will be reviewed
            promptly, and the results will be sent to you as soon as possible.
          </div>

          <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>
          <div className="flex justify-center">
            <button
              className="mt-4 w-fit mx-auto payment-btn text-base font-semibold transition-all titan-btn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
