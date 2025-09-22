"use client";
import CryptoSelector from "@/components/Ui/inputs/CryptoSelector";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "@/libs/api";
import { useState } from "react";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

const schema = z.object({
  crypto: z.string().min(1, "Cryptocurrency is required"),
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .max(100, "Wallet address too long"),
  twoFaCode: z
    .string()
    .length(6, "2FA code must be 6 digits")
    .regex(/^\d{6}$/, "2FA code must be 6 digits (0-9)."),
});

type FormType = z.infer<typeof schema>;

interface TeamReceiveRewardCashProps {
  rewardId: number;
  goBack: () => void;
}

export default function TeamReceiveRewardCash({
  rewardId,
  goBack,
}: TeamReceiveRewardCashProps) {
  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      crypto: "",
      walletAddress: "",
      twoFaCode: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormType) => {
    if (!rewardId) return;

    setLoading(true);

    try {
      const token = loadUserData()?.access_token;
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/prizes/submitWallet/${rewardId}`,
        "POST",
        {
          currency: data.crypto,
          wallet_address: data.walletAddress,
          code: data.twoFaCode,
        },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Reward submitted successfully!");
        goBack();
      } else {
        toast.error(res.message || "Submission failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="team-account-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 pb-[2rem]">
        <div className="team-claim-reward ">
          <p className="text-[var(--dark-color)] dark:text-white">
            Claim Prize in Crypto
          </p>
        </div>
        <div className="w-full h-[1px] bg-standard my-3"></div>
        <form className="mt-[2rem]" onSubmit={handleSubmit(onSubmit)}>
          <CryptoSelector
            label="Select a cryptocurrency"
            value={watch("crypto")}
            onChange={(val) =>
              setValue("crypto", val, { shouldValidate: true })
            }
            required={true}
          />
          {errors.crypto && (
            <div className="text-red-500 text-xs mt-1">
              {errors.crypto.message}
            </div>
          )}

          <CustomInput
            readOnly={false}
            label="Your Wallet Address"
            value={watch("walletAddress")}
            onChange={(val) =>
              setValue("walletAddress", val, { shouldValidate: true })
            }
            required={true}
            type="text"
            placeholder="Wallet Address"
            maxLength={100}
            hasError={!!errors.walletAddress}
            errorMessage={errors.walletAddress?.message as string}
          />

          <CustomInput
            readOnly={false}
            label="2FA Code"
            value={watch("twoFaCode")}
            onChange={(val) =>
              setValue("twoFaCode", val, { shouldValidate: true })
            }
            required={true}
            type="text"
            placeholder="Enter 2FA code"
            maxLength={6}
            hasError={!!errors.twoFaCode}
            errorMessage={errors.twoFaCode?.message as string}
            onlyNumber={true}
          />

          <div className="mt-[2rem] w-[100%] sm:w-[60%] md:w-[40%] flex justify-between">
            <button
              type="submit"
              disabled={!isValid || loading}
              className="titan-btn w-[48%] disabled:!bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="titan-btn !bg-gray-300 hover:!bg-gray-400 w-[48%]"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
