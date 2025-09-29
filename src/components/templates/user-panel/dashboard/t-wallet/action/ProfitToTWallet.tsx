"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useHeader } from "@/contextApi/HeaderContext";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";

interface WalletOption {
  key: "roi" | "referral" | "commission";
  label: string;
  amount: number;
  feeApplies: boolean;
}

export default function ProfitToTWallet() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [twofaCode, setTwoFaCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [twofaError, setTwofaError] = useState<string>("");
  const [walletInfos, setWalletInfos] = useState({
    roi: 0,
    commission: 0,
    referral: 0,
  });
  const queryClient = useQueryClient();
  const { headerData, refetch: refetchHeader } = useHeader();
  const token = loadUserData()?.access_token;

  const fetchTWalletDetails = useCallback(async () => {
    try {
      const res = await apiRequest<{
        data: {
          roi: number;
          commission: number;
          referral: number;
        };
      }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success && res.data) {
        const apiData = res.data.data;
        setWalletInfos((prev) => ({
          ...prev,
          roi: apiData.roi,
          commission: apiData.commission,
          referral: apiData.referral,
        }));
      } else {
        toast.error(res.message || "Failed to fetch wallet details");
      }
    } catch {
      toast.error("Error while fetching wallet details");
    }
  }, [token, setWalletInfos]);
  useEffect(() => {
    fetchTWalletDetails();
  }, [fetchTWalletDetails]);

  const { refetch: refetchTWalletInfo } = useQuery({
    queryKey: ["twallet-info"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data?.data?.body || res.data;
    },
  });

  const feePercent = headerData?.transform_to_twallet || 0;

  const handleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions?.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const options: WalletOption[] = useMemo(
    () => [
      {
        key: "roi",
        label: "ROI",
        amount: walletInfos?.roi ?? 0,
        feeApplies: true,
      },
      {
        key: "referral",
        label: "Referral",
        amount: walletInfos?.referral ?? 0,
        feeApplies: false,
      },
      {
        key: "commission",
        label: "Commission",
        amount: walletInfos?.commission ?? 0,
        feeApplies: true,
      },
    ],
    [walletInfos?.roi, walletInfos?.referral, walletInfos?.commission]
  );

  const selectedAmounts = options
    ?.filter((opt) => selectedOptions.includes(opt.label))
    .map((opt) => {
      const num = Number(opt.amount) || 0;
      if (opt.feeApplies && feePercent > 0) {
        return num - (num * feePercent) / 100;
      }
      return num;
    });

  const totalSelected = selectedAmounts.reduce((acc, cur) => acc + cur, 0);

  const totalAll = options
    .map((opt) => {
      const num = Number(opt.amount) || 0;
      if (opt.feeApplies && feePercent > 0) {
        return num - (num * feePercent) / 100;
      }
      return num;
    })
    .reduce((acc, cur) => acc + cur, 0);

  const singleSelectedOption =
    selectedOptions.length === 1
      ? options.find((opt) => opt.label === selectedOptions[0])
      : null;

  const isAmountEditable = selectedOptions.length === 1;
  const displayAmount = selectedOptions.length > 1 ? totalSelected : amount;

const handleAmountChange = (val: string) => {
  if (!isAmountEditable || !singleSelectedOption) return;

  const num = Number(val);
  if (isNaN(num) || num < 0) {
    setAmount("0");
    return;
  }

  const rawMax = Number(singleSelectedOption.amount) || 0;
  const maxAfterFee = singleSelectedOption.feeApplies
    ? rawMax - (rawMax * feePercent) / 100
    : rawMax;

  if (num > maxAfterFee) {
    setAmount(maxAfterFee.toString());
  } else {
    setAmount(val);
  }
};


  useEffect(() => {
    if (selectedOptions.length === 1) {
      const selected = options.find((opt) => opt.label === selectedOptions[0]);
      if (selected) {
        const num = Number(selected.amount) || 0;
        const finalAmount =
          selected.feeApplies && feePercent > 0
            ? num - (num * feePercent) / 100
            : num;

        setAmount((prev) => {
          if (prev === "" || Number(prev) > finalAmount) {
            return finalAmount.toString();
          }
          return prev;
        });
      }
    }
    if (selectedOptions.length !== 1) {
      setAmount("");
    }
  }, [selectedOptions, feePercent, options]);
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!twofaCode) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    if (!/^[0-9]{6}$/.test(twofaCode)) {
      setTwofaError("2FA code must be 6 digits");
      return;
    } else {
      setTwofaError("");
    }

    setLoading(true);
    const types = options
      ?.filter((opt) => selectedOptions.includes(opt.label))
      .map((opt) => opt.key);

    try {
      const payload =
        selectedOptions.length === 1
          ? { code: twofaCode, types, amount }
          : { code: twofaCode, types };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/transferToBalance`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Transfer successful!");
        setTwoFaCode("");
        setSelectedOptions([]);
        fetchTWalletDetails();
        setAmount("");
        refetchTWalletInfo();
        if (refetchHeader) refetchHeader();
        queryClient.invalidateQueries({ queryKey: ["twallet-list"] });
      } else {
        toast.error(res.message || "Transfer failed");
      }
    } catch {
      toast.error("Error while transferring");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-account-content px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
      <div className="team-claim-reward">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 31 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=" stroke-[var(--main-background)] dark:stroke-white"
          >
            <path
              d="M17.1111 23.7513L24.8444 23.75C26.6491 23.75 27.5514 23.75 28.2406 23.3958C28.8469 23.0842 29.3399 22.587 29.6488 21.9755C30 21.2803 30 20.3702 30 18.55V6.2C30 4.37983 30 3.46974 29.6488 2.77453C29.3399 2.163 28.8469 1.66582 28.2406 1.35423C27.5514 1 26.6491 1 24.8444 1H6.15556C4.35094 1 3.44863 1 2.75936 1.35423C2.15306 1.66582 1.66013 2.163 1.3512 2.77453C1 3.46974 1 4.37983 1 6.2V17.25M1 7.5H28.3889M10.6667 23.7513L1 23.75M10.6667 23.7513L7.44444 20.5M10.6667 23.7513L7.44444 27"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[var(--main-background)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
            Profits to T-Wallet
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>
      <div className="my-5">
        <span className="text-[.8rem] text-[var(--main-background)] dark:text-white">
          Wallet Balance: <b>{headerData?.t_wallet ?? 0}</b>
        </span>
      </div>
      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 md:gap-3">
        {options.map((option, index) => {
          const num = Number(option.amount) || 0;
          const hasFee = option.feeApplies && feePercent > 0;
          const finalAmount = hasFee ? num - (num * feePercent) / 100 : num;

          return (
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
                <span className="text-[var(--main-background)] dark:text-[#D9D9D9] text-[.8rem] sm:text-sm md:text-base">
                  {option.label}:
                </span>
                {num !== 0 ? (
                  <>
                    <span
                      className={`text-[var(--main-background)] ${
                        hasFee ? "line-through !text-[.8rem] " : ""
                      } dark:text-white`}
                    >
                     $ {num}
                    </span>
                    {hasFee && (
                      <span className="text-[var(--gold)] !text-lg">
                       $ {finalAmount}
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    className={`
                       " !text-[.8rem] `}
                  >
                    $ {num}
                  </span>
                )}
              </div>

              <label className="custom-radio-container cursor-pointer">
                <span
                  className={`twallet-custom-radio border-1 ${
                    selectedOptions.includes(option.label)
                      ? "bg-[#275edf] border-[#275edf]"
                      : "bg-white"
                  } w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 border-2 rounded-full flex items-center justify-center relative`}
                >
                  {selectedOptions.includes(option.label) && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 stroke-white text-[#275EDF] "
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
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="register-inputs-reward-special bg-[#d9d9d9] dark:bg-[#123b90] flex justify-between rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] py-3 border-standard px-2 sm:px-3 items-center gap-1.5 sm:gap-2 md:gap-3 bg-[#123B90]  w-full sm:w-auto min-w-72"
        >
          <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 md:gap-2">
            <span className="text-[var(--main-background)] dark:text-[#D9D9D9] text-[.8rem] sm:text-sm md:text-base">
              Total
            </span>
          </div>
          <p className="text-[var(--main-background)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
            $ {totalAll}
          </p>
        </motion.div>
      </div>

      <form onSubmit={handleTransfer}>
        <div className="mt-4 sm:mt-6 md:mt-[2rem]">
          <CustomInput
            className="w-full sm:w-2/3 md:w-[50%]"
            readOnly={!isAmountEditable}
            label="Amount"
            value={isAmountEditable ? amount : displayAmount.toString()}
            onChange={handleAmountChange}
            required={true}
            type="number"
            placeholder={
              isAmountEditable && singleSelectedOption
                ? `Enter a value between 0 and ${singleSelectedOption.amount}`
                : "Multi-select: No edit"
            }
            validateLatinOnly={true}
            maxLength={10}
          />

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-[2rem]">
            <CustomInput
              className="w-full sm:w-2/3 md:w-[50%]"
              readOnly={false}
              label="2FA Code"
              value={twofaCode}
              onChange={setTwoFaCode}
              required={true}
              type="text"
              placeholder="Enter 2FA code"
              validateLatinOnly={true}
              maxLength={6}
              onlyNumber={true}
              hasError={!!twofaError}
              errorMessage={twofaError}
            />

            <button
              type="submit"
              className="titan-btn w-full sm:w-[50%] md:w-[40%] lg:w-[30%] mt-2 sm:mt-0 disabled:!bg-gray-400 text-sm sm:text-base transition-all duration-300 hover:opacity-90 flex items-center justify-center"
              disabled={
                loading || twofaCode.length !== 6 || displayAmount === ""
              }
            >
              {loading ? "Transferring..." : "Transfer"}
            </button>
          </div>
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
