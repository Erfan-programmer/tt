"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import TidInput from "@/components/Ui/inputs/TidInput";
import { toast, ToastContainer } from "react-toastify";
import { useHeader } from "@/contextApi/HeaderContext";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

export default function TWalletTothers() {
  const [amount, setAmount] = useState<string>("");
  const [tid, setTid] = useState<string>("");
  const [twofaCode, setTwoFaCode] = useState<string>("");
  const [tidError, setTidError] = useState("");
  const [twofaError, setTwofaError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { headerData , refetch } = useHeader();
  const token = loadUserData()?.access_token;

  const handleSubmit = async () => {
    let valid = true;
    setTidError("");
    setTwofaError("");

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      valid = false;
    }
    if (!tid || isNaN(Number(tid))) {
      setTidError("Enter a valid contact ID");
      valid = false;
    }
    if (twofaCode.length !== 6 || !/^[0-9]{6}$/.test(twofaCode)) {
      setTwofaError("2FA code must be exactly 6 digits");
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/sendToContact`,
      "POST",
      {
        contact_id: parseInt(tid),
        amount: parseFloat(amount),
        code: twofaCode,
        note: "default note",
      },
      { Authorization: `Bearer ${token}` }
    );

    setIsLoading(false);

    if (res.success) {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      });
      setAmount("");
      setTid("");
      setTwoFaCode("");
      refetch()
    } else {
      toast.error(res.message || "Transfer failed");
    }
  };

  return (
    <div className="team-account-content px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
      <ToastContainer />
      <div className="team-claim-reward">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 31 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 stroke-[var(--dark-color)] dark:stroke-[#d9d9d9]"
          >
            <path
              d="M13.8889 22.875H6.15556C4.35094 22.875 3.44864 22.875 2.75936 22.5344C2.15306 22.2348 1.66013 21.7567 1.3512 21.1687C1 20.5002 1 19.6252 1 17.875V6C1 4.24984 1 3.37475 1.3512 2.70628C1.66013 2.11827 2.15306 1.64021 2.75936 1.3406C3.44864 1 4.35094 1 6.15556 1H24.8444C26.6491 1 27.5514 1 28.2406 1.3406C28.8469 1.64021 29.3399 2.11827 29.6488 2.70628C30 3.37475 30 4.24984 30 6V13.5M1 7.25H30M30 22.8763L20.3333 22.875M30 22.8763L26.7778 19.75M30 22.8763L26.7778 26"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[var(--dark-color)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
            T-Wallet to Others
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>

      <div className="mt-4 sm:mt-6 md:mt-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="register-inputs-reward-special bg-[#d9d9d9] dark:bg-[#123b90] flex justify-between w-full sm:w-2/3 md:w-[45%] rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] py-1.5 sm:py-2 md:py-3 border-standard px-2 sm:px-3 items-center gap-1.5 sm:gap-2 md:gap-3 bg-[#123B90]"
        >
          <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 md:gap-2">
            <span className="text-[var(--dark-color)] dark:text-[#D9D9D9] text-[.8rem] sm:text-sm md:text-base">
              T-wallet Balance
            </span>
          </div>
          <p className="text-[var(--dark-color)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
            ${headerData?.t_wallet}
          </p>
        </motion.div>

        <CustomInput
          className="w-full sm:w-2/3 md:w-[50%] mt-3 sm:mt-4 md:mt-[1rem]"
          readOnly={false}
          label="Amount"
          value={amount}
          onChange={setAmount}
          required={true}
          placeholder="Enter amount"
          type="number"
          validateLatinOnly={true}
          onlyNumber={true}
          showStar={true}
        />

        <TidInput
          value={tid}
          mainTID={headerData?.t_id}
          onChange={setTid}
          className="w-full sm:w-2/3 md:w-[50%] mt-3 sm:mt-4 md:mt-[1rem]"
        />
        {tidError && <div className="text-red-500 text-[.8rem] mt-1">{tidError}</div>}

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
            className="titan-btn w-full sm:w-[50%] md:w-[40%] disabled:!bg-gray-400 disabled:cursor-not-allowed lg:w-[30%] mt-2 sm:mt-0 text-sm sm:text-base transition-all duration-300 hover:opacity-90"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !amount ||
              isNaN(Number(amount)) ||
              Number(amount) <= 0 ||
              !tid ||
              isNaN(Number(tid)) ||
              !twofaCode ||
              !/^[0-9]{6}$/.test(twofaCode)
            }
          >
            {isLoading ? "Transferring..." : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}
