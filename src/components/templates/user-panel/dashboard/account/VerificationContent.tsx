"use client";
import { useEffect, useState } from "react";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import { motion } from "framer-motion";
import TitanVarification from "./TitanVarification";
import { IoTimerOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosTimer } from "react-icons/io";
import TitanSecStepVerification from "./TitanSecStepVerification";
import { useVerificationList } from "@/contextApi/VerificationListContext";
import { useVerify } from "@/contextApi/TitanContext";
import TitanNotification from "@/components/modules/UserPanel/TitanNotification/TitanNotification";

export default function VerificationContent() {
  const [check, setCheck] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState(false);
  const { fileSectionPairs } = useVerify();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const validateForm = (): boolean => check;

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setIsVerified(true);
  };
  const { verificationList } = useVerificationList();

  useEffect(() => setIsVerified(false), []);
  const { sendVerify, verifyResult, setVerifyResult } = useVerify();

  useEffect(() => {
    if (verifyResult === "failed") {
      setIsVerified(false);
    }
  }, [verifyResult]);

  useEffect(() => {
    if (
      verificationList &&
      Array.isArray(verificationList) &&
      verificationList.length > 0
    ) {
      setIsCheckingStatus(true);

      const hasSuccess = verificationList.some(
        (file: any) => file.status === "success"
      );
      const hasFailed = verificationList.some(
        (file: any) => file.status === "failed"
      );
      const allPending = verificationList.every(
        (file: any) => file.status === "pending"
      );

      console.log(
        "hasSuccess:",
        hasSuccess,
        "hasFailed:",
        hasFailed,
        "allPending:",
        allPending
      );

      if (allPending && !hasSuccess && !hasFailed) {
        setVerifyResult("success");
      } else if (hasSuccess) {
        setVerifyResult("");
      } else if (hasFailed) {
        setVerifyResult("failed");
      } else {
        setVerifyResult("");
      }

      setIsCheckingStatus(false);
    }
  }, [verificationList, setVerifyResult]);

  //   let permissionArray = [];

  //   if (typeof permissions?.data?.body === "string") {
  //     permissionArray = permissions.data.body.split(",");
  //   } else if (Array.isArray(permissions?.data?.body)) {
  //     permissionArray = permissions.data.body;
  //   }

  return (
    <>
      <>
        {/* Loading Overlay */}
        {isCheckingStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300">
                Checking verification status...
              </p>
            </div>
          </div>
        )}

        {/* Verification Notifications */}
        {verifyResult && verifyResult !== "" && (
          <>
            <TitanNotice
              title="Your Verification is Pending"
              description="Thank you for submitting your documents. Your verification is currently under review. We will notify you as soon as the process is complete. We appreciate your patience and understanding during this time"
            />

            {verifyResult === "success" ? (
              <TitanNotification
                icon={
                  <IoIosTimer className="dark:text-[var(--main-background)] text-wite text-2xl" />
                }
                className="border-1"
                btn="dashboard"
                btnLink="/dashboard"

                btnStyle="bg-[var(--success)]"
              >
                Your documents have been successfully submitted! Our team will
                review them, and you will be notified once the verification is
                complete. Please note that the review process may take up to 10
                business days, depending on your nationality.
              </TitanNotification>
            ) : verifyResult === "failed" ? (
              <TitanNotification
                icon={
                  <IoMdClose className="dark:text-[var(--main-background)] text-white text-2xl " />
                }
                className="border-failed"
                btn="ok"
                btnStyle="bg-[var(--loss)]"
              >
                <span>
                  Your Verification Was Unsuccessful Unfortunately, your
                  submitted documents did not meet our verification
                  requirements. Please review the guidelines carefully and
                  resubmit the correct documents for further processing.
                </span>
              </TitanNotification>
            ) : (
              <TitanNotification
                icon={
                  <IoTimerOutline className="dark:text-[var(--main-background)] text-white text-2xl border-standard" />
                }
                btn="OK"
                btnStyle="bg-[#275EDF]"
              >
                <span>
                  Your documents have been successfully submitted! Our team will
                  review them, and you will be notified once the verification is
                  complete. Please note that the review process may take up to
                  10 business days, depending on your nationality.
                </span>
              </TitanNotification>
            )}
          </>
        )}

        {!isVerified && !verifyResult && fileSectionPairs.length === 0 ? (
          <>
            <TitanNotice
              title="Verification Guide"
              description="Please carefully read the verification rules and regulations before submitting your documents."
            />

            <TitanVarification />
            <form
              className="register-inputs-sponsor mt-[.4rem]"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center gap-3 my-[1rem] sm:ml-[2rem]">
                <label className="custom-radio-container cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={check}
                    onChange={() => setCheck(!check)}
                  />
                  <span className="custom-radio w-7 h-7 border-2 border-[var(--main-background)] dark:border-white rounded-lg flex items-center justify-center relative">
                    <span
                      className={`check-icon absolute inset-0 flex items-center justify-center transition-opacity ${
                        check ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-[#275EDF]"
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
                  className="confirm-upload-condition text-[var(--main-background)] dark:text-white text-md cursor-pointer"
                  onClick={() => setCheck(!check)}
                >
                  I confirm that I uploaded a valid government-issued photo ID.
                  This ID includes my picture, signature, name, date of birth,
                  and address.
                </p>
              </div>

              <motion.input
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                type="submit"
                value={`Confirm & Continue`}
                className={`submit-verify min-w-fit p-2 w-[35%] text-white ${
                  verifyResult === "failed" ? "bg-[#D7FE63]" : " bg-[#030a30] "
                } ${
                  !validateForm()
                    ? "opacity-0 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                }`}
                disabled={!validateForm()}
              />
            </form>
          </>
        ) : (
          <>
            {!sendVerify && (
              <TitanNotice
                title="Notice"
                description="To ensure the security and authenticity of your account, Titan Investments requires identity verification. Please upload a clear, valid identification document, such as a passport, national ID, or driver's license, that matches the name registered on your account. Important Notes: Double-check your personal details (e.g., name, date of birth) before uploading your documents. Any discrepancies may delay the verification process. Your documents will only be used for verification purposes and will remain confidential as per our privacy policy. By completing this step, you'll unlock access to all features and benefits of your Titan Investments account."
              />
            )}
            <TitanSecStepVerification />
          </>
        )}
      </>
    </>
  );
}
