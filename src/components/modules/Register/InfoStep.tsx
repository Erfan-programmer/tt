"use client";
import React, { useEffect, useState } from "react";
import CountrySelect from "@/components/Ui/inputs/CountrySelect";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import GenderSelect from "@/components/Ui/inputs/GenderSelect";
import PhoneInput from "@/components/Ui/inputs/PhoneInput";
import { motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { RegisterFormType } from "@/validations/validationSchema";
import { useSearchParams } from "next/navigation";

interface InfoStepProps {
  formData: any;
  handleChange: (name: keyof RegisterFormType, value: string | boolean) => void;
  validateEmail: (val: string) => boolean;
  selectedPlanId: number | null;
  validatePhone: (val: string) => boolean;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  validateForm: () => boolean;
  selectedPosition?: string;
  setValue: (name: keyof RegisterFormType, value: string) => void;
}

export default function InfoStep({
  formData,
  handleChange,
  validateEmail,
  handlePrevStep,
  handleNextStep,
  validateForm,
  setValue,
}: InfoStepProps) {
  const [loading, setLoading] = useState(false);
  const [lockSponsorFields, setLockSponsorFields] = useState(false);

  const searchParams = useSearchParams();
  const sponsorToken = searchParams?.get("splus_token");
  useEffect(() => {
    const getLinkValid  = async () => {
      if (sponsorToken) {
        try {
          const response = await apiRequest<any>(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/client/verify-sponsor-token?sponsor_token=${sponsorToken}`,
            "GET"
          );

          if (response.success && response.data) {
            handleChange("hasSponsor", true);
            handleChange("sponsor_id", String(response.data.data?.sponsor_id));
            handleChange("referrer_id", String(response.data.data?.referrer_id));
            setLockSponsorFields(true);
          }
        } catch (error) {
          console.error("Failed to verify sponsor token", error);
        }
      }
    };
    getLinkValid()
  }, [handleChange , sponsorToken]);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/register`,
        "POST"
      );

      if (response.success && response.data?.data) {
        const secret = response?.data?.data?.secret;
        const qrCode = response?.data?.data?.qrCode;

        if (secret && qrCode) {
          setValue("secret", secret);
          setValue("qrCode", qrCode);
          handleNextStep();
        } else {
          alert(response?.message || "Something went wrong!");
        }
      } else {
        alert(response.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="mt-[1rem] sm:mt-[2rem]"
    >
      {/* Sponsor Section */}
      <div className="register-inputs-sponsor flex items-center gap-3 mb-4 sm:mb-6">
        <label
          className={`custom-radio-container ${
            lockSponsorFields
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <input
            type="checkbox"
            checked={formData.hasSponsor}
            onChange={() =>
              !lockSponsorFields &&
              handleChange("hasSponsor", !formData.hasSponsor)
            }
            disabled={lockSponsorFields}
            className="hidden"
          />
          <span
            className={`custom-radio w-7 h-7 border-2 border-[#275edf] dark:border-white rounded-lg flex items-center justify-center relative ${
              lockSponsorFields ? "opacity-50" : ""
            }`}
          >
            <span className="check-icon absolute inset-0 flex items-center justify-center opacity-0 transition-opacity">
              <svg
                className={`w-5 h-5 ${
                  formData.hasSponsor
                    ? "text-white"
                    : "dark:text-white"
                }`}
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
          className={`text-[var(--main-background)] dark:text-white text-md ${
            lockSponsorFields
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
          onClick={() =>
            !lockSponsorFields &&
            handleChange("hasSponsor", !formData.hasSponsor)
          }
        >
          I have sponsor
        </p>
      </div>

      {formData.hasSponsor && (
        <>
          <CustomInput
            readOnly={lockSponsorFields}
            label="Sponsor ID"
            placeholder="Enter Your Sponsor ID"
            name="sponsor_id"
            value={formData.sponsor_id}
            onChange={(value) => handleChange("sponsor_id", value)}
            showStar
            required
            onlyNumber
            minLength={4}
            maxLength={20}
          />
          <CustomInput
            readOnly={lockSponsorFields}
            label="Ref ID"
            placeholder="Enter Your Ref ID"
            name="referrer_id"
            value={formData.referrer_id}
            onChange={(value) => handleChange("referrer_id", value)}
            showStar
            required
            onlyNumber
            minLength={4}
            maxLength={20}
          />
        </>
      )}

      <div className="space-y-4">
        <CustomInput
          label="First Name"
          value={formData.first_name}
          name="first_name"
          onChange={(value) => handleChange("first_name", value)}
          required
          showStar
          readOnly={false}
          placeholder="Enter your first name"
          validateLatinOnly
          minLength={2}
          maxLength={50}
        />
        <CustomInput
          label="Last Name"
          value={formData.last_name}
          name="last_name"
          onChange={(value) => handleChange("last_name", value)}
          required
          showStar
          readOnly={false}
          placeholder="Enter your last name"
          validateLatinOnly
          minLength={2}
          maxLength={50}
        />
        <CustomInput
          label="Email"
          value={formData.email}
          name="email"
          onChange={(value) => handleChange("email", value)}
          required
          readOnly={false}
          showStar
          placeholder="Enter your email"
          type="email"
          customValidation={{
            validate: validateEmail,
            errorMessage: "Please enter a valid email address",
          }}
        />
        <CustomInput
          label="Confirm Email"
          value={formData.email_confirmation}
          name="email_confirmation"
          onChange={(value) => handleChange("email_confirmation", value)}
          required
          readOnly={false}
          placeholder="Confirm your email"
          showStar
          type="email"
          customValidation={{
            validate: (value) => value === formData.email,
            errorMessage: "Email addresses do not match",
          }}
        />
        <CountrySelect
          label="Country"
          value={formData.country_id}
          onChange={(value) => handleChange("country_id", value)}
          required
        />
        <GenderSelect
          label="Gender"
          value={formData.gender}
          onChange={(value) => handleChange("gender", value)}
          required
        />
        <PhoneInput
          label="Phone Number"
          value={formData.mobile}
          onChange={(value) => handleChange("mobile", value)}
          defaultDialCode={formData.dial_code}
          onPrefixChange={(country) => {
            handleChange("dial_code", String(country.id));
          }}
          required
        />
      </div>

      <div className="flex items-start gap-3 mt-6">
        <label className="custom-radio-container">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={() => handleChange("acceptTerms", !formData.acceptTerms)}
            className="hidden"
          />
          <span className="custom-radio w-7 h-7 border-2 border-[#275edf] dark:border-white rounded-lg flex items-center justify-center relative">
            <span className="check-icon absolute inset-0 flex items-center justify-center opacity-0 transition-opacity">
              <svg
                className="w-5 h-5 text-white "
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
          className="text-[var(--main-background)] dark:text-white text-md"
          onClick={() => handleChange("acceptTerms", !formData.acceptTerms)}
        >
          I acknowledge and accept that all investments involve risk, and I
          understand the potential for both profits and losses. Titan
          Investments does not guarantee specific outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-6">
        <motion.button
          type="button"
          onClick={handlePrevStep}
          className="submit-register text-white w-[80%] md:w-full order-1 lg:order-0 bg-gray-500 hover:bg-gray-600"
        >
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          className={`submit-register text-white w-[80%] md:w-full ${
            !validateForm() || loading
              ? "disabled bg-gray-400"
              : "cursor-pointer bg-[#030a30]"
          }`}
          disabled={!validateForm() || loading}
        >
          {loading ? "Processing..." : "Confirm & Continue"}
        </motion.button>
      </div>
    </motion.div>
  );
}
