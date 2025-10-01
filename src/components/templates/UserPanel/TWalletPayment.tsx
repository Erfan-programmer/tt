"use client";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { IoMdClose } from "react-icons/io";
import { z } from "zod";
import { resetTriggerSubmit } from "@/store/PaymentSlice";
import TitanNotification from "@/components/modules/UserPanel/TitanNotification/TitanNotification";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { useHeader } from "@/contextApi/HeaderContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "@/contextApi/AuthContext";

interface TwalletPaymentProps {
  onValidityChange?: (isValid: boolean) => void;
}

export default function TwalletPayment({
  onValidityChange,
}: TwalletPaymentProps) {
  const [twofaCode, setTwoFaCode] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [errors, setErrors] = useState<{
    twofaCode?: string;
    deposit?: string;
  }>({});
  const [touched, setTouched] = useState<{
    twofaCode?: boolean;
    deposit?: boolean;
  }>({});
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);

  const triggerSubmit = useSelector(
    (state: RootState) => state.payment.triggerSubmit
  );
  const dispatch = useDispatch();
  const { refetch, headerData } = useHeader();
  const router = useRouter();
  const { user } = useAuth();
  const depositSchema = z
    .string()
    .regex(/^\d+$/, { message: "Amount must be a number" })
    .transform((val) => Number(val))
    .superRefine((val, ctx) => {
      const planType = user?.plan?.type?.toLowerCase();
      const minInv = Number(user?.plan?.min_investment ?? 0);

      if (planType === "contract_free" || planType === "investor") {
        if (val % minInv !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Amount must be a multiple of ${minInv}`,
          });
        }
      }

      if (planType === "investor") {
        if (val < minInv) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Amount must be at least ${minInv}`,
          });
        }
      }
    });

  const validateDeposit = useCallback(
    (value: string) => {
      const result = depositSchema.safeParse(value);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          deposit: result.error.issues[0]?.message || "",
        }));
        return false;
      }
      setErrors((prev) => ({ ...prev, deposit: "" }));
      return true;
    },
    [depositSchema]
  );

  const validateTwoFaCode = useCallback((value: string) => {
    let error = "";
    if (!/^[0-9]*$/.test(value)) error = "Only numbers are allowed";
    else if (value.length !== 6) error = "Code must be 6 digits";
    setErrors((prev) => ({ ...prev, twofaCode: error }));
    return error === "";
  }, []);

  const handleDepositChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setDeposit(value);
      if (touched.deposit) validateDeposit(value);
    }
  };

  const handleTwoFaChange = (value: string) => {
    setTwoFaCode(value);
    validateTwoFaCode(value);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "twofaCode") validateTwoFaCode(twofaCode);
    if (field === "deposit") validateDeposit(deposit);
  };

  const isValid =
    deposit.trim() !== "" &&
    twofaCode.length === 6 &&
    (!errors.twofaCode || errors.twofaCode === "") &&
    (!errors.deposit || errors.deposit === "");

  const submitForm = useCallback(async () => {
    try {
      const body = {
        amount: Number(deposit),
        payment_method: "wallet",
      };

      const res = await apiRequest<{ pay_id: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/createContract`,
        "POST",
        body,
        { Authorization: `Bearer ${loadUserData()?.access_token}` }
      );

      if (!res.success) {
        toast.error(res.message || "Error submitting request");
        return;
      }

      setShowSuccessNotif(true);
      setDeposit("");
      setTwoFaCode("");

      const pay_id = res.data?.pay_id;
      setTimeout(() => {
        refetch();
        if (pay_id) router.push(`/payment/${pay_id}`);
      }, 1500);

      toast.success("Contract created successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error");
    }
  }, [deposit, router, refetch]);

  useEffect(() => {
    if (triggerSubmit) {
      if (isValid) submitForm();
      else toast.error("Please fill all required fields correctly.");
      dispatch(resetTriggerSubmit());
    }
  }, [triggerSubmit, isValid, dispatch, submitForm]);

  useEffect(() => {
    if (onValidityChange) onValidityChange(isValid);
  }, [deposit, twofaCode, errors, isValid, onValidityChange]);

  return (
    <>
      {showSuccessNotif && (
        <TitanNotification
          icon={
            <IoMdClose className="text-[var(--main-background)] text-2xl" />
          }
          btn="Go to Dashboard"
          btnLink="/dashboard"
          btnStyle="bg-[#275EDF]"
          onClose={() => setShowSuccessNotif(false)}
        >
          <div className="font-bold text-lg mb-2 text-white">
            Congratulations!
            <br />
            Your Account is Fully Activated 🎉
          </div>
          <div className="text-sm mt-2 text-white">
            Your investment process is complete, and your account is now{" "}
            <b>fully active</b>.
            <br />
            Go to Your <b>Dashboard</b> to start managing your investments and
            track your progress.
          </div>
        </TitanNotification>
      )}
      <div className="add-user-action-container px-2 sm:px-[2rem]">
        <ToastContainer
          closeButton={({ closeToast }) => (
            <button onClick={closeToast}>
              <FaTimes className="text-white" />
            </button>
          )}
        />
        <div className="add-user-action-desc">
          <span className="text-sm text-[var(--main-background)] dark:text-white">
            Your T-Wallet Balance: $
            {Number(headerData?.t_wallet) > 0
              ? Number(headerData?.t_wallet)
              : 0}
          </span>
        </div>
        <div className="border-standard bg-[#f9f9fe] dark:bg-[#0f163a] rounded-[1em] mt-3 p-5 py-[2rem] space-y-4">
          <CustomInput
            className="w-full"
            readOnly={user?.plan?.type?.toLowerCase() === "marketer"}
            label="Deposit Amount"
            value={
              user?.plan?.type?.toLowerCase() === "marketer"
                ? String(user?.plan?.min_investment ?? "")
                : deposit
            }
            min={Number(user?.plan?.min_investment ?? 0)}
            onChange={handleDepositChange}
            onBlur={() => handleBlur("deposit")}
            required={true}
            placeholder="Enter deposit amount"
            type="number"
            validateLatinOnly={true}
            onlyNumber={true}
            showStar={true}
            hasError={touched.deposit && !!errors.deposit}
            errorMessage={touched.deposit ? errors.deposit : ""}
          />

          <CustomInput
            className="w-full"
            readOnly={false}
            label="2FA Code"
            value={twofaCode}
            onChange={handleTwoFaChange}
            onBlur={() => handleBlur("twofaCode")}
            required={true}
            placeholder="Enter 2FA code"
            validateLatinOnly={true}
            minLength={6}
            maxLength={6}
            type="number"
            hasError={touched.twofaCode && !!errors.twofaCode}
            errorMessage={touched.twofaCode ? errors.twofaCode : ""}
          />
        </div>
      </div>
    </>
  );
}
