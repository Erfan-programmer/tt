"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { resetTriggerSubmit, setLoading } from "@/store/PaymentSlice";
import { useRouter } from "next/navigation";
import { z } from "zod";
import CryptoSelector from "@/components/Ui/inputs/CryptoSelector";
import { useVerify } from "@/contextApi/TitanContext";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { usePayment } from "@/contextApi/PaymentProvider";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "@/contextApi/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface DirectPaymentProps {
  onValidityChange?: (isValid: boolean) => void;
}

export default function DirectPayment({
  onValidityChange,
}: DirectPaymentProps) {
  const [deposit, setDeposit] = useState<string>("");
  const [crypto, setCrypto] = useState<string>("");
  const [cryptoKey, setCryptoKey] = useState<string>("");
  const [errors, setErrors] = useState<{ deposit?: string }>({});
  const [touched, setTouched] = useState<{ deposit?: boolean }>({});
  const { setAccountActivation } = useVerify();
  const triggerSubmit = useSelector(
    (state: RootState) => state.payment.triggerSubmit
  );
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();

  const planType = user?.plan?.type?.toLowerCase();
  const minInvestment = String(user?.plan?.min_investment ?? "");
  const isMarketer = planType === "marketer";
  const finalDepositValue = isMarketer ? minInvestment : deposit;

  const depositSchema = z
    .string()
    .regex(/^\d+$/, { message: "Amount must be a number" })
    .transform((val) => Number(val))
    .superRefine((val, ctx) => {
      const minInv = Number(user?.plan?.min_investment ?? 0);

      if (planType === "contract_free" || planType === "investor") {
        if (minInv > 0 && val % minInv !== 0) {
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
      if (isMarketer) {
        setErrors((prev) => ({ ...prev, deposit: "" }));
        return true;
      }
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
    [depositSchema, isMarketer]
  );

  const debouncedValidateDeposit = useMemo(
    () => debounce((value: string) => validateDeposit(value), 500),
    [validateDeposit]
  );

  const handleDepositChange = (value: string) => {
    if (!isMarketer && /^\d*$/.test(value)) {
      setDeposit(value);
      debouncedValidateDeposit(value);
    }
  };

  const handleDepositBlur = () => {
    setTouched((prev) => ({ ...prev, deposit: true }));
    validateDeposit(deposit);
  };
  const { setPayment } = usePayment();

  const isValid =
    finalDepositValue.trim() !== "" &&
    crypto !== "" &&
    (!errors.deposit || errors.deposit === "");

  const submitForm = useCallback(async () => {
    const token = loadUserData()?.access_token;
    try {
      dispatch(setLoading(true));
      const res = await apiRequest<any>(
        `${BASE_URL}/v1/client/createContract`,
        "POST",
        {
          payment_method: "direct_payment",
          amount: isMarketer
            ? Number(minInvestment)
            : Number(finalDepositValue),
          currency: cryptoKey,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success) {
        toast.success(res.message || "");
        dispatch(setLoading(false));
        setTimeout(() => {
          setAccountActivation("PAYMENT");
          setPayment(res.data.data);
          router.push(`/dashboard/payment`);
        }, 1000);
      }
      else {

        toast.error(res.message || "");
      }
      dispatch(setLoading(false));
    } catch (err: any) {
      toast.error(err?.error?.message || "Error submitting request");
      dispatch(setLoading(false));
    }
  }, [
    finalDepositValue,
    cryptoKey,
    router,
    setAccountActivation,
    setPayment,
    isMarketer,
    minInvestment,
  ]);

  useEffect(() => {
    if (triggerSubmit) {
      if (isValid) {
        submitForm();
      } else {
        toast.error("Please enter a valid amount and select a cryptocurrency.");
      }
      dispatch(resetTriggerSubmit());
    }
  }, [triggerSubmit, isValid, dispatch, submitForm]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [deposit, crypto, errors, isValid, onValidityChange]);

  return (
    <div className="add-user-action-container px-2 sm:px-[2rem]">
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
              <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="border-standard bg-[#f9f9fe] dark:bg-[#0f163a] rounded-[1em] mt-3 p-5 py-[2rem] space-y-4">
        <CustomInput
          className="w-full"
          readOnly={isMarketer}
          label="Deposit Amount"
          value={isMarketer ? minInvestment : deposit}
          min={Number(user?.plan?.min_investment ?? 0)}
          onChange={handleDepositChange}
          onBlur={handleDepositBlur}
          required={true}
          placeholder="Enter deposit amount"
          type="number"
          validateLatinOnly={true}
          onlyNumber={true}
          showStar={true}
          hasError={touched.deposit && !!errors.deposit}
          errorMessage={touched.deposit ? errors.deposit : ""}
        />
        <div className="mb-[2rem]">
          <CryptoSelector
            className="w-full mb-8"
            label="Select a cryptocurrency"
            value={crypto}
            onChange={setCrypto}
            onKeyChange={setCryptoKey}
            showStar={true}
            required={true}
          />
        </div>
      </div>
    </div>
  );
}
