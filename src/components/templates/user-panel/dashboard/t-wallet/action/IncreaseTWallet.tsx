import { useState } from "react";
import { motion } from "framer-motion";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import CryptoSelector from "@/components/Ui/inputs/CryptoSelector";
import { useHeader } from "@/contextApi/HeaderContext";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { useRouter } from "next/navigation";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { encodeData } from "@/utils/HashData";

export default function IncreaserTWallet() {
  const { headerData } = useHeader();
  const router = useRouter();

  const [depositAmount, setDepositAmount] = useState<string>(
    headerData?.deposit ?? ""
  );
  const [crypto, setCrypto] = useState<string>("");
  const [cryptoKey, setCryptoKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || !cryptoKey) {
      toast.error("Please enter the amount and select a cryptocurrency.");
      return;
    }
    setIsSubmitting(true);
    const token = loadUserData()?.access_token;

    try {
      const res = await apiRequest<{ body?: { pay_id?: string }; data?: any }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/deposit`,
        "POST",
        { amount: depositAmount, currency: cryptoKey },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(
          res.message || "T-Wallet increase request submitted successfully."
        );

        const encodedData = encodeData(res.data?.data);

        router.push(`/dashboard/payment?data=${encodedData}`);
      } else {
        toast.error(res.message || "Error submitting request");
      }
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="team-account-content px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
      <div className="team-claim-reward">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 31 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 stroke-[var(--main-background)] dark:stroke-white"
          >
            <path
              d="M13.8889 22.875H6.15556C4.35094 22.875 3.44864 22.875 2.75936 22.5344C2.15306 22.2348 1.66013 21.7567 1.3512 21.1687C1 20.5002 1 19.6252 1 17.875V6C1 4.24984 1 3.37475 1.3512 2.70628C1.66013 2.11827 2.15306 1.64021 2.75936 1.3406C3.44864 1 4.35094 1 6.15556 1H24.8444C26.6491 1 27.5514 1 28.2406 1.3406C28.8469 1.64021 29.3399 2.11827 29.6488 2.70628C30 3.37475 30 4.24984 30 6V11.9375M1 7.25H30M25.1667 26V16.625M30 21.3138L20.3333 21.3125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-[var(--main-background)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
            Increase T-Wallet
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>

      <form className="mt-4 sm:mt-6 md:mt-[2rem]" onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:w-2/3 md:w-[50%]"
        >
          <CustomInput
            readOnly={false}
            label="Deposit Amount"
            value={depositAmount}
            onChange={setDepositAmount}
            required={true}
            type="tel"
            placeholder="Enter deposit amount"
            validateLatinOnly={true}
            minLength={1}
            maxLength={10}
            className="w-full"
          />
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-[2rem]">
          <CryptoSelector
            className="w-full sm:w-2/3 md:w-[50%]"
            label="Select a cryptocurrency"
            value={crypto}
            onChange={setCrypto}
            onKeyChange={setCryptoKey}
            required={true}
          />

          <button
            type="submit"
            className="titan-btn w-full sm:w-[50%] md:w-[40%] lg:w-[30%] mt-2 sm:mt-0 text-sm sm:text-base transition-all duration-300 hover:opacity-90"
            disabled={isSubmitting || !depositAmount || !crypto}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
