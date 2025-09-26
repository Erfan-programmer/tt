"use client";

import { useState } from "react";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import TitanNotification from "../../../TitanNotification/TitanNotification";
import { IoMdClose } from "react-icons/io";
import TitanNotice from "../../../TitanNotice/TitanNotice";
import ResetTitan2FaCode from "./ResetTitan2FaCode";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface TwoFaFormFields {
  email: string;
  password: string;
}
export interface TwoFaData {
  secretKey: string;
  qrCodeUrl: string;
}
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.toLowerCase().endsWith("@gmail.com");
}

export default function Send2FaCode({
  handleResetToken,
  handleEmail,
}: {
  handleResetToken: (data: TwoFaData) => void;
  handleEmail: (email: string) => void;
  handleSetSecret: (secret: string) => void;
}) {
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "code">("form");
  const [email , setEmail] = useState("")

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<TwoFaFormFields>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: TwoFaFormFields) => {
    setLoading(true);
    const accessToken = loadUserData()?.access_token;
    setEmail(data.email)
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/security/2fa/request-reset`,
      "POST",
      {
        email: data.email,
        password: data.password,
      },
      { Authorization: `Bearer ${accessToken}` }
    );

    setLoading(false);

    if (res.success) {
      toast.success(res.message || "Verification code sent successfully");
      reset();
      handleEmail(data.email);
      setStep("code");
    } else {
      if (res.error?.code === 401) {
        setShowUnauthorizedModal(true);
        setErrorMessage(res.error?.message || "Unauthorized request");
      } else {
        toast.error(res.error?.message || "Error sending verification code");
      }
    }
  };

  const isFormDirty = Object.values(watch()).some((val) => val.length > 0);
  const canSubmit = isFormDirty && isValid && !loading;

  return (
    <>
      <TitanNotice
        title="Notice"
        description="To enhance security measures, users are required to activate two-factor authentication for their accounts. Users who do not activate two-factor authentication will not be able to perform transactions within their accounts. Scan this QR code with your Google Authenticator App. Alternatively, you can use the code: *Before enabling two-factor authentication, make sure to take a backup of the QR-Code image and store it securely in a safe place If you lose your two-factor authentication barcode or code after activating it, for any reason, there will be a $25 fee charged by the company for recovery.."
      />
      {showUnauthorizedModal && (
        <TitanNotification
          icon={<IoMdClose className="text-[var(--main-background)] text-2xl" />}
          className="border-failed"
          btn="Ok"
          btnStyle="bg-[var(--loss)]"
          onClose={() => setShowUnauthorizedModal(false)}
        >
          {errorMessage}
        </TitanNotification>
      )}

      <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
        <div className="titan-form-title w-[95%] mx-auto text-[var(--main-background)] dark:text-white">
          <p>Reset Two-Factor Authentication</p>
        </div>
        <div className="bg-standard w-full h-[2px] my-4"></div>

        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[1rem] items-start w-[95%] mx-auto">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  validate: (value) =>
                    validateEmail(value) ||
                    "Please enter a valid Gmail address (e.g., user@gmail.com)",
                }}
                render={({ field }) => (
                  <CustomInput
                    className="w-full md:w-[50%]"
                    readOnly={false}
                    label="Enter your registered email address"
                    value={field.value}
                    name="email"
                    onChange={(val) => field.onChange(val)}
                    required={true}
                    type="email"
                    placeholder="Enter your email"
                    maxLength={100}
                    hasError={!!errors.email}
                    errorMessage={errors.email?.message as string}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]*$/,
                    message: "Only Latin characters and numbers are allowed",
                  },
                }}
                render={({ field }) => (
                  <CustomInput
                    className="w-full md:w-[50%]"
                    readOnly={false}
                    label="Enter your account password for verification"
                    value={field.value}
                    name="password"
                    onChange={(val) => field.onChange(val)}
                    required={true}
                    type="password"
                    placeholder="Enter your password"
                    validateLatinOnly={true}
                    maxLength={100}
                    hasError={!!errors.password}
                    errorMessage={errors.password?.message as string}
                  />
                )}
              />

              <div className="my-[1rem] w-full flex justify-center md:justify-start">
                <button
                  className="titan-btn-reset disabled:!bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {loading ? "Sending..." : "Send 2FA Reset Code"}
                </button>
              </div>
            </div>
          </form>
        )}

        {step === "code" && (
          <div className="titan-form-body mt-4 w-[95%] mx-auto">
            <ResetTitan2FaCode
              handleResetToken={handleResetToken}
              userEmail={email}
            />
          </div>
        )}
      </div>
    </>
  );
}
