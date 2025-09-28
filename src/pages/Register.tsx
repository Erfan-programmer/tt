"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/styles/Register/Register.css";
import StepLevel from "@/components/modules/Register/StepLevel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { positions } from "@/data/Positions";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import PositionStep from "@/components/modules/Register/PositionStep";
import InfoStep from "@/components/modules/Register/InfoStep";
import TwoFAStep from "@/components/modules/Register/TwoFAStep";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateEmail, validatePhone } from "@/validations/Validation";
import {
  RegisterFormType,
  registerSchema,
} from "@/validations/validationSchema";
import InvenstmentTerm from "@/components/modules/Register/InvenstmentTerm";
import { FaTimes } from "react-icons/fa";

export default function Register() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPosition, setSelectedPosition] = useState<string>(
    positions[0].value
  );
  const [twoFactore, setTwoFactore] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const [linkChecked, setLinkChecked] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const { watch, setValue } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      secret: "",
      sponsor_id: "",
      referrer_id: "",
      hasSponsor: false,
      acceptTerms: false,
      first_name: "",
      last_name: "",
      email: "",
      email_confirmation: "",
      country_id: "",
      otp: "",
      plan_id: 1,
      user_type: "",
      gender: "",
      mobile: "",
      qrCode: "",
      dial_code: "",
    },
  });
  const values = watch();

  const handlePositionChange = (value: string) => {
    setSelectedPosition(value);
  };
  const [selectedPlanId] = useState<number | null>(null);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const code = searchParams?.get("id");
    if (code && !linkChecked) {
      setLinkChecked(true);
      axios
        .post(`${process.env.VITE_API_URL}/auth/check-link`, { code })
        .then((response: any) => {
          if (
            response.data.status === "success" &&
            response.data.data.status === true
          ) {
            setValue("hasSponsor", true);
            setValue("sponsor_id", response.data.data.sponser_id);
            setValue("referrer_id", response.data.data.refferal_id);
          } else {
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("id");
              window.location.href = url.toString();
            }
          }
        })
        .catch(() => {
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("id");
            window.location.href = url.toString();
          }
        });
    }
  }, [mounted, searchParams, linkChecked, setValue]);

  const handleCopy = async () => {
    try {
      if (!values.secret) return;
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(values.secret);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleChange = (
    name: keyof RegisterFormType,
    value: string | boolean
  ) => {
    setValue(name, value as any);
  };

  const validateForm = (): boolean => {
    return (
      values.first_name.trim().length > 0 &&
      values.last_name.trim().length > 0 &&
      values.gender.trim().length > 0 &&
      values.email.trim().length > 0 &&
      validateEmail(values.email) &&
      validateEmail(values.email_confirmation) &&
      values.email === values.email_confirmation &&
      values.country_id.trim().length > 0 &&
      values.mobile.trim().length > 9 &&
      values.acceptTerms === true
    );
  };

  const steps = [
    {
      key: "position",
      render: (
        <PositionStep
          selectedPosition={selectedPosition}
          setValue={setValue}
          setSelectedPosition={handlePositionChange}
          handleNextStep={handleNextStep}
        />
      ),
    },
    ...(selectedPosition === "investor"
      ? [
          {
            key: "investment",
            render: (
              <InvenstmentTerm
                handlePrevStep={handlePrevStep}
                setValue={setValue}
                handleNextStep={handleNextStep}
              />
            ),
          },
        ]
      : []),
    {
      key: "info",
      render: (
        <InfoStep
          formData={values}
          setValue={setValue}
          handleChange={handleChange}
          validateEmail={validateEmail}
          validatePhone={validatePhone}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          selectedPlanId={selectedPlanId}
          validateForm={validateForm}
          selectedPosition={selectedPosition}
        />
      ),
    },
    {
      key: "2fa",
      render: (
        <TwoFAStep
          twoFactore={twoFactore}
          setTwoFactore={setTwoFactore}
          formData={values}
          handleCopy={handleCopy}
          copied={copied}
          handleChange={handleChange}
          handlePrevStep={handlePrevStep}
        />
      ),
    },
  ];

  const totalSteps = steps.length;

  if (!mounted) return null;

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="sm:mb-[4rem] ">
        <div className="formlayout-bg-mobile flex flex-col items-start justify-center gap-4 px-[1rem] sm:hidden">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center lg:text-left"
          >
            Create Your TITAN Account
          </motion.h2>
          <span className="text-white">
            Unlock new opportunities with just a few clicks
          </span>
        </div>
        <div className="hidden sm:block text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[var(--main-background)] dark:text-white"
          >
            Create Your TITAN Account
          </motion.h2>
        </div>

        <div className="mt-8 px-4">
          <StepLevel currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="px-4 sm:px-0">
          {steps[currentStep - 1]?.render || null}
        </div>
      </div>
    </>
  );
}
