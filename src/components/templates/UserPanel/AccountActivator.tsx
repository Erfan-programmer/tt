"use client";
import { useState } from "react";
import "./AccountActivation.css";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import { useVerify } from "@/contextApi/TitanContext";
import { useAuth } from "@/contextApi/AuthContext";
import { AccountActivationDatas } from "./AccountActivationDatas";

interface AcountActivationType {
  type: string;
  plan?: number;
}

export default function AcountActivation({
  type,
  plan = 1,
}: AcountActivationType) {
  const { user } = useAuth();
  const fullName = `${user?.first_name} ${user?.last_name}`;

  const [acceptTerms, setAcceptTerms] = useState(false);
  const { setAccountActivation } = useVerify();

  const activationInfo =
    AccountActivationDatas[type as keyof typeof AccountActivationDatas];
  let activationText: string;
  if (type === "investor") {
    activationText =
      activationInfo?.[plan]?.(fullName) ??
      "Account typeTest or plan is not valid.";
  } else {
    const planFunc = activationInfo?.[1];
    activationText = planFunc
      ? planFunc(fullName)
      : "Account type or plan is not valid.";
  }
  return (
    <>
      <TitanNotice
        title="Important Notice"
        description="This is a private investment pool, not available to the general public. Participation is by personal invitation only. All capital is subject to risk, and returns are not guaranteed."
      />
      <div className="px-4 mt-10 py-4 bg-[#ddd] dark:bg-[#2C2F33] access-container rounded-lg text-[#333] dark:text-white">
        <div className="max-h-[400px] overflow-y-auto">
          <div className="px-4 accesss-content">
            <span className="whitespace-pre-line text-[#222] dark:text-[#D1D1D1]">
              <p className="text-[var(--gold)]">
                🎉 Welcome to Titan Investments
              </p>
              <span
                className="account-span"
                dangerouslySetInnerHTML={{ __html: activationText }}
              />
            </span>
          </div>
        </div>

        <div className="flex items-start md:justify-center gap-3 my-6">
          <label className="custom-radio-container">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="hidden"
            />
            <span
              className={`${
                !acceptTerms ? "bg-white" : "bg-[var(--main-background)]"
              } w-7 h-7 border-2 border-[#275edf] rounded-lg flex items-center justify-center relative`}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity">
                <svg
                  className={`w-5 h-5 ${
                    !acceptTerms ? "opacity-0" : "opacity-100"
                  }`}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </label>
          <p
            className="text-[var(--main-background)] dark:text-white text-xl"
            onClick={() => setAcceptTerms(!acceptTerms)}
          >
            I have carefully read and fully accept all the terms, conditions,
            and risk disclosures outlined above
          </p>
        </div>

        <div className="flex justify-center items-center">
          <button
            className={`titan-btn ${
              !acceptTerms ? "!bg-gray-400" : ""
            } mt-8 bg-red-500`}
            disabled={!acceptTerms}
            onClick={() => setAccountActivation("METHOD")}
          >
            🌱 Start Your Investment
          </button>
        </div>
      </div>
    </>
  );
}
