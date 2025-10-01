"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import CryptoSelector from "@/components/Ui/inputs/CryptoSelector";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useHeader } from "@/contextApi/HeaderContext";

interface walletType {
  id: number;
  client_id: number;
  balance: string;
  roi: string;
  commission: string;
  referral: string;
  created_at: string;
  updated_at: string;
}
type optionType = {
  label: string;
  amount: number;
};
interface WithdrawBoxProps {
  onWithdrawSuccess?: () => void;
  onWithdrawSubmitted?: () => void;
  onRefetch?: () => void;
  roi: number;
  commission: number;
  referral: number;
  total: number;
}

export default function WithdrawBox({
  onWithdrawSuccess,
  onWithdrawSubmitted,
  onRefetch,
}: WithdrawBoxProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userModifiedAmount, setUserModifiedAmount] = useState(false);
  const [twalletInfo, setTWalletInfo] = useState<walletType>();
  const { headerData } = useHeader();
  const system_percent = headerData?.transform_to_twallet;

  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        setLoading(true);
        const token = loadUserData()?.access_token;
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet`,
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        );
        if (res.success) setTWalletInfo(res?.data?.data);
        else toast.error(res.message || "Failed to fetch wallet info");
      } catch (error: any) {
        toast.error(error?.message || "Error fetching wallet info");
      } finally {
        setLoading(false);
      }
    };
    fetchWalletInfo();
  }, []);

  const withdrawSchema = z.object({
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
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
  type WithdrawFormType = z.infer<typeof withdrawSchema>;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    reset,
  } = useForm<WithdrawFormType>({
    resolver: zodResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: {
      amount: "",
      crypto: "",
      walletAddress: "",
      twoFaCode: "",
    },
  });

  const [cryptoKey, setCryptoKey] = useState<string>("");

  const options: optionType[] = useMemo(
    () => [
      { label: "ROI", amount: Number(twalletInfo?.roi) },
      { label: "Referral", amount: Number(twalletInfo?.referral) },
      { label: "Commission", amount: Number(twalletInfo?.commission) },
    ],
    [twalletInfo]
  );

  const totalAll = useMemo(() => {
    return options
      .map((x) => Number(x.amount) || 0)
      .reduce((acc, cur) => acc + cur, 0);
  }, [options]);

  const singleSelectedOption =
    selectedOptions.length === 1
      ? options.find((opt) => opt.label === selectedOptions[0])
      : null;
  const isAmountEditable = selectedOptions.length === 1;

  const handleSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev?.filter((item) => item !== option)
        : [...prev, option]
    );
    setUserModifiedAmount(false);
  };

  useEffect(() => {
    if (userModifiedAmount && selectedOptions.length === 1) return;

    if (selectedOptions.length === 0) {
      setValue("amount", "");
      return;
    }

    let totalAfterFees = 0;
    selectedOptions.forEach((label) => {
      const option = options.find((opt) => opt.label === label);
      if (!option || !option.amount) return;

      let amount = Number(option.amount);
      const lowerCaseLabel = label.toLowerCase();
      if (lowerCaseLabel === "roi" || lowerCaseLabel === "commission") {
        const fee = system_percent ? Number(system_percent) / 100 : 0;
        amount *= 1 - fee;
      }
      totalAfterFees += amount;
    });

    const newAmount = totalAfterFees.toString();
    const currentAmount = getValues("amount");
    if (newAmount !== currentAmount) setValue("amount", newAmount);

    if (selectedOptions.length !== 1) setUserModifiedAmount(false);
  }, [
    selectedOptions,
    system_percent,
    userModifiedAmount,
    options,
    setValue,
    getValues,
  ]);

  const handleAmountChange = (val: string) => {
    if (!isAmountEditable) return;
    const num = Number(val);
    if (isNaN(num)) return;

    if (singleSelectedOption) {
      const lowerCaseLabel = singleSelectedOption.label.toLowerCase();
      let maxAmount = Number(singleSelectedOption.amount);
      if (lowerCaseLabel === "roi" || lowerCaseLabel === "commission") {
        const fee = system_percent ? Number(system_percent) / 100 : 0;
        maxAmount = maxAmount * (1 - fee);
      }

      if (num < 0) setValue("amount", "0");
      else if (num > maxAmount) setValue("amount", maxAmount.toFixed(2));
      else setValue("amount", val);
    } else {
      setValue("amount", val);
    }

    setUserModifiedAmount(true);
  };

  const onSubmit = async (data: WithdrawFormType) => {
    if (!cryptoKey) {
      toast.error("Please select a cryptocurrency.");
      return;
    }

    if (selectedOptions.length === 0) {
      toast.error(
        "Please select at least one option (ROI, Commission, Referral)."
      );
      return;
    }

    const maxAvailableAmount = selectedOptions
      .map((label) => {
        const option = options.find((opt) => opt.label === label);
        return Number(option?.amount || 0);
      })
      .reduce((acc, cur) => acc + cur, 0);

    const submittedAmount = Number(data.amount);

    if (selectedOptions.length === 1 && submittedAmount > maxAvailableAmount) {
      toast.error(`Amount cannot exceed the available balance.`);
      return;
    }

    setLoading(true);

    const lowerCaseTypes = selectedOptions.map((t) => t.toLowerCase());

    const body: any = {
      currency: cryptoKey,
      address: data.walletAddress,
      code: data.twoFaCode,
      types: lowerCaseTypes,
    };

    if (selectedOptions.length === 1) {
      body.amount = submittedAmount;
    }

    try {
      const token = loadUserData()?.access_token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/withdraw`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Withdraw request submitted successfully!");
        reset();
        setSelectedOptions([]);
        setUserModifiedAmount(false);
        if (onWithdrawSuccess) onWithdrawSuccess();
        if (onWithdrawSubmitted) onWithdrawSubmitted();
        if (onRefetch) onRefetch();
      } else toast.error(res.message || "Withdraw failed");
    } catch (err: any) {
      toast.error(err?.message || "Withdraw failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-container border-standard rounded-xl py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
      <div className="withdraw-header">
        <div className="flex items-center gap-1.5 sm:gap-2  mb-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 31 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=" stroke-[var(--dark-colorark:stroke-white"
          >
            <path
              d="M17.1111 23.7513L24.8444 23.75C26.6491 23.75 27.5514 23.75 28.2406 23.3958C28.8469 23.0842 29.3399 22.587 29.6488 21.9755C30 21.2803 30 20.3702 30 18.55V6.2C30 4.37983 30 3.46974 29.6488 2.77453C29.3399 2.163 28.8469 1.66582 28.2406 1.35423C27.5514 1 26.6491 1 24.8444 1H6.15556C4.35094 1 3.44863 1 2.75936 1.35423C2.15306 1.66582 1.66013 2.163 1.3512 2.77453C1 3.46974 1 4.37983 1 6.2V17.25M1 7.5H28.3889M10.6667 23.7513L1 23.75M10.6667 23.7513L7.44444 20.5M10.6667 23.7513L7.44444 27"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[var(--da--dark-colortext-white text-[.8rem] sm:text-sm md:text-base">
            Withdraw Profits
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 md:gap-3 px-4 my-4">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`register-inputs-reward py-3 ${
                selectedOptions.includes(option.label)
                  ? "selected"
                  : "unselected"
              } flex justify-between rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] py-3 border-standard px-2 sm:px-3 items-center gap-1.5 sm:gap-2 md:gap-3 cursor-pointer hover:bg-opacity-80 transition-all duration-300 w-full sm:w-auto`}
              onClick={() => handleSelect(option.label)}
            >
              <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                <span className="text-[var(--dark-c--dark-color-[#D9D9D9] text-[.8rem] sm:text-sm md:text-base">
                  {option.label}:
                </span>
                {option.amount != 0 ? (
                  <>
                    <span
                      className={`text-[var(--dark-color)] ${
                        option.label.toLocaleLowerCase() !== "referral"
                          ? "line-through !text-[.8rem] "
                          : ""
                      } dark:text-white`}
                    >
                      $ {option.amount}
                    </span>
                    {option.label.toLocaleLowerCase() !== "referral" && (
                      <span className="text-[var(--gold)] !text-lg">
                        ${" "}
                        {(
                          Number(option.amount) *
                          (1 - (Number(system_percent) || 0) / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="!text-lg">
                    ${" "}
                    {(
                      Number(option.amount) *
                      (1 - (Number(system_percent) || 0) / 100)
                    ).toFixed(2)}
                  </span>
                )}
              </div>
              <label
                htmlFor={`reward-${index}`}
                className="custom-radio-container cursor-pointer"
              >
                <span
                  className={`twallet-custom-radio border-1 ${
                    selectedOptions.includes(option.label)
                      ? "bg-[#275edf] border-[#275edf]"
                      : "bg-white"
                  } w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 border-2 rounded-full  flex items-center justify-center relative`}
                >
                  {selectedOptions.includes(option.label) && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 stroke-white text-[#275EDF]"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </label>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="register-inputs-reward-special bg-[#d9d9d9] dark:bg-[#123b90] flex justify-between rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] py-3 border-standard px-2 sm:px-3 items-center gap-1.5 sm:gap-2 md:gap-3 bg-[#123B90] flex-1 w-full sm:w-auto"
          >
            <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 md:gap-2">
              <span className="text-[var(--dark-color)] d--dark-color9] text-[.8rem] sm:text-sm md:text-base">
                Total
              </span>
            </div>
            <p className="text-[var(--dark-color)] dark:--dark-color[.8rem] sm:text-sm md:text-base">
              $ {totalAll}
            </p>
          </motion.div>
        </div>
        <div className="px-[2rem] mx-auto my-2">
          <span className="text-[var(--dark-color)] dark:text--dark-colorem] sm:text-sm md:text-base">
            Company Fee: {system_percent}%
          </span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-standard my-3"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-[2rem]">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <CustomInput
                readOnly={!isAmountEditable}
                label={`Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-[var(--gold)] text-sm">(After Fees)</span>`}
                value={field.value ? field.value : field.value.toString()}
                onChange={(val) => {
                  field.onChange(val);
                  handleAmountChange(val);
                }}
                required={true}
                className="mt-[1rem] w-full sm:w-[50%]"
                type="number"
                placeholder={
                  isAmountEditable
                    ? `Enter a value up to ${singleSelectedOption?.amount}`
                    : "Calculated automatically"
                }
                validateLatinOnly={true}
                maxLength={10}
                hasError={!!errors.amount}
                errorMessage={errors.amount?.message as string}
              />
            )}
          />
          <Controller
            name="crypto"
            control={control}
            render={({ field }) => (
              <CryptoSelector
                className="mt-[1rem] w-full sm:w-[50%]"
                label="Select a cryptocurrency"
                value={field.value}
                onChange={field.onChange}
                onKeyChange={setCryptoKey}
                required={true}
              />
            )}
          />
          <Controller
            name="walletAddress"
            control={control}
            render={({ field }) => (
              <CustomInput
                readOnly={false}
                label="Your Wallet Address"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required={true}
                className="mt-[1rem] w-full sm:w-[50%]"
                type="text"
                placeholder="Wallet Address"
                validateLatinOnly={true}
                maxLength={100}
                hasError={!!errors.walletAddress}
                errorMessage={errors.walletAddress?.message as string}
              />
            )}
          />
          <Controller
            name="twoFaCode"
            control={control}
            render={({ field }) => (
              <CustomInput
                readOnly={false}
                label="2FA Code"
                value={field.value}
                className="mt-[1rem] w-full sm:w-[50%]"
                onChange={(val) => field.onChange(val)}
                required={true}
                type="number"
                placeholder="Enter 2FA code"
                validateLatinOnly={true}
                maxLength={6}
                hasError={!!errors.twoFaCode}
                errorMessage={errors.twoFaCode?.message as string}
              />
            )}
          />
        </div>
        <div className="flex justify-center sm:justify-end p-[2rem]">
          <button
            className="titan-btn w-[90%] disabled:!bg-gray-400 sm:w-[50%] md:w-[30%]"
            disabled={loading || !isValid}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
