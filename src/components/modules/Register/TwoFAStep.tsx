"use client";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { RegisterFormType } from "@/validations/validationSchema";
import { apiRequest } from "@/libs/api";

interface TwoFAStepProps {
  twoFactore: boolean;
  setTwoFactore: (val: boolean) => void;
  formData: any;
  handleCopy: () => void;
  copied: boolean;
  handleChange: (name: keyof RegisterFormType, value: string | boolean) => void;
  handlePrevStep: () => void;
  errors?: any;
}

export default function TwoFAStep({
  twoFactore,
  setTwoFactore,
  formData,
  handleCopy,
  copied,
  handleChange,
  handlePrevStep,
  errors,
}: TwoFAStepProps) {
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/[۰-۹آ-یءًٌٍَُِّ]/.test(val)) {
      setLocalError("Type only Latin numbers");
    } else if (/[^0-9]/.test(val)) {
      setLocalError("Just type numbers");
    } else {
      setLocalError("");
    }

    handleChange("otp", val.replace(/[^0-9]/g, ""));
  };

  const fetchRegisterForm = async () => {
    if (formData.otp.length !== 6) return;
    setIsLoading(true);
    try {
      const response = await apiRequest<{ success: boolean; message: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/confirmTwoFactor`,
        "POST",
        formData
      );

      if (response.success) {
        setIsLoading(true);
        toast.success(response.message || "User registered successfully!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setIsLoading(false);
        toast.error(response.message || "User registrerd failed!");
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.message || "Unexpected error occurred!");
    }
  };

  return (
    <>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mt-[1rem] sm:mt-[2rem]"
      >
        {/* Toggle 2FA */}
        <div className="flex items-start gap-3 mb-6">
          <label className="custom-radio-container">
            <input
              type="checkbox"
              checked={twoFactore}
              onChange={() => setTwoFactore(!twoFactore)}
              className="hidden"
            />
            <span className="custom-radio w-7 h-7 border-2 border-[#275edf] dark:border-white rounded-lg flex items-center justify-center relative">
              <span className="check-icon absolute inset-0 flex items-center justify-center opacity-0 transition-opacity">
                <svg
                  className="w-5 h-5 text-white dark:text-[#275EDF]"
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
              </span>
            </span>
          </label>
          <p
            className="text-[var(--main-background)] dark:text-white text-md cursor-pointer"
            onClick={() => setTwoFactore(!twoFactore)}
          >
            Two-factor authentication is required to complete your account setup
            and gain access
          </p>
        </div>

        {/* 2FA Section */}
        <div className={`${twoFactore ? "blur-0" : "blur-[10px]"}`}>
          <div className="mt-4 sm:mt-8">
            <span className="text-sm sm:text-base text-[#383C47] dark:text-white">
              To complete your account setup, enabling two-factor authentication
              (2FA) is mandatory. Before you activate your 2FA, please ensure
              that you have backed up your QR code and secret key. Resetting 2FA
              in the future may incur a fee.
            </span>
          </div>

          <div className="sm:w-[95%] flex flex-wrap gap-x-2 sm:gap-x-4 justify-center items-center mx-auto border-standard bg-[#f9f9fe] dark:bg-[#0f163a] p-2 py-[1rem] mt-[2rem] rounded-lg">
            {/* QR Code */}
            <div className="twofacode-img w-[14rem] h-[14rem]  rounded-lg overflow-hidden p-[1rem] bg-[#0f163a] dark:bg-white min-h-[100px]">
              <Image
                width={500}
                height={500}
                src={formData.qrCode}
                alt="2FA QR Code"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Secret + Copy */}
            <div className="text-var[(--main-background)] dark:text-white flex-1 min-w-[200px]">
              <div className="scan-container text-center lg:text-left">
                <p className="text-sm sm:text-base">Can&apos;t scan QR code?</p>
                <span className="text-sm sm:text-base">
                  Enter this secret instead:
                </span>
              </div>

              <div className="scan-code w-full border-[1px] border-[#0f163a] dark:border-[#383C47] overflow-x-auto text-black dark:text-white p-2 text-center lg:text-left rounded-lg pr-[2rem] flex flex-wrap items-center mt-4">
                <span className="break-all secret-text">{formData.secret}</span>
              </div>

              <div
                className={`coppied-text text-center lg:text-left ${
                  copied ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-sm sm:text-base">QR code copied...</span>
              </div>

              <div className="titan-copy mt-4 flex justify-center lg:justfy-start">
                <button
                  className="flex justify-center gap-3 items-center bg-white p-2 min-w-[8rem] sm:px-[2rem] rounded-lg w-full sm:w-auto"
                  onClick={handleCopy}
                >
                  <span className="text-[var(--main-background)] text-sm sm:text-base">
                    Copy Code
                  </span>
                  {copied ? (
                    <FaCheck className="text-[var(--gold)]" />
                  ) : (
                    <svg
                      width="17"
                      height="20"
                      viewBox="0 0 17 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.5 5V11.8C15.5 12.9201 15.5 13.4802 15.282 13.908C15.0903 14.2843 14.7843 14.5903 14.408 14.782C13.9802 15 13.4201 15 12.3 15H8.7C7.5799 15 7.01984 15 6.59202 14.782C6.21569 14.5903 5.90973 14.2843 5.71799 13.908C5.5 13.4802 5.5 12.9201 5.5 11.8V4.2C5.5 3.0799 5.5 2.51984 5.71799 2.09202C5.90973 1.71569 6.21569 1.40973 6.59202 1.21799C7.01984 1 7.5799 1 8.7 1H11.5M15.5 5L11.5 1M15.5 5H13.1C12.5399 5 12.2599 5 12.046 4.89101C11.8578 4.79513 11.7049 4.64215 11.609 4.45399C11.5 4.24008 11.5 3.96005 11.5 3.4V1M1.5 5V12.6C1.5 14.8402 1.5 15.9603 1.93597 16.816C2.31947 17.5686 2.93139 18.1805 3.68404 18.564C4.53969 19 5.65979 19 7.9 19H11.5"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="mt-8 w-full sm:w-[80%] mx-auto">
            <label
              htmlFor="verification-code"
              className="text-sm sm:text-base block text-[#383C47] dark:text-white"
            >
              Enter verification code:
            </label>
            <input
              id="verification-code"
              type="text"
              name="code"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter verification code"
              className="w-full p-2 border rounded-lg mt-2 bg-transparent text-[var(--box-background)] dark:text-white text-sm sm:text-base"
              value={formData.code}
              onChange={handleCodeChange}
              maxLength={6}
            />
            {localError && (
              <span className="text-red-500 text-[.8rem] mt-1 block">
                {localError}
              </span>
            )}
            {errors?.code && (
              <span className="text-red-500 text-[.8rem] mt-1 block">
                {errors.otp.message}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-6">
          <motion.button
            type="button"
            onClick={handlePrevStep}
            className="submit-register text-white w-[80%] order-1 lg:order-0 xl:w-full bg-gray-500 hover:bg-gray-600"
          >
            Back
          </motion.button>
          <motion.button
            type="button"
            className={`submit-register text-white w-[80%] xl:w-full text-[.8rem]  md:text-[1rem] relative ${
              formData.otp.length !== 6 || isLoading
                ? "opacity-50 bg-gray-400 cursor-not-allowed"
                : "cursor-pointer bg-[#030a30]"
            }`}
            onClick={fetchRegisterForm}
            disabled={formData.otp.length !== 6 || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm sm:text-base">Processing...</span>
              </div>
            ) : (
              "Activate 2FA & Get Your Account"
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
