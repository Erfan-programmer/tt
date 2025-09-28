"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { resetTriggerSubmit } from "@/store/PaymentSlice";
import { useRouter } from "next/navigation";
import { z } from "zod";
import CryptoSelector from "@/components/Ui/inputs/CryptoSelector";
import { useVerify } from "@/contextApi/TitanContext";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { usePayment } from "@/contextApi/PaymentProvider";
import { FaTimes } from "react-icons/fa";

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
  const router = useRouter();

  const depositSchema = z
    .string()
    .regex(/^\d+$/, { message: "Amount must be a number" })
    .transform((val) => Number(val))
    .refine((val) => val % 1 === 0, {
      message: "Amount must be a multiple of 1,000",
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

  const debouncedValidateDeposit = useMemo(
    () => debounce((value: string) => validateDeposit(value), 500),
    [validateDeposit]
  );

  const handleDepositChange = (value: string) => {
    if (/^\d*$/.test(value)) {
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
    deposit.trim() !== "" &&
    crypto !== "" &&
    (!errors.deposit || errors.deposit === "");

  const submitForm = useCallback(async () => {
    const token = loadUserData()?.access_token;
    try {
      const res = await apiRequest<any>(
        `${BASE_URL}/v1/client/createContract`,
        "POST",
        {
          payment_method: "direct_payment",
          amount: deposit,
          currency: cryptoKey,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success) {
        toast.success(res.message || "");
        setTimeout(() => {
          setAccountActivation("PAYMENT");
          setPayment(res.data.data);
          router.push(`/dashboard/payment`);
        }, 1000);
      }
    } catch (err: any) {
      toast.error(err?.error?.message || "Error submitting request");
    }
  }, [deposit, cryptoKey, router, setAccountActivation, setPayment]);

  useEffect(() => {
    if (triggerSubmit) {
      if (isValid) {
        submitForm();
      } else {
        toast.error(
          "Please enter a valid amount (multiple of 1,000) and select a cryptocurrency."
        );
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
          readOnly={false}
          label="Deposit Amount"
          value={deposit}
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
        <div className="mb-[5rem]">
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
