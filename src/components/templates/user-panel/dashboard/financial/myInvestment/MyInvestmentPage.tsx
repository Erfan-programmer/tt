"use client";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import UserContracts from "./UserContracts";
import { useEffect, useState } from "react";
import { apiRequest } from "@/libs/api";
import { useVerify } from "@/contextApi/TitanContext";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { ContractLast } from "@/types/p-admin/Message";



export default function MyInvestmentPage() {
  const { cancelContract, setCancelContract } = useVerify();
  const [contractLast, setContractLast] = useState<ContractLast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCancelContract(false);
  }, [setCancelContract]);

  useEffect(() => {
    const fetchContractLast = async () => {
      setLoading(true);
      setError("");

      const token = loadUserData()?.access_token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contractLast`,
        "GET",
        undefined,
        {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      );

      if (res.success) {
        setContractLast(res.data?.data);
      } else {
        setError(res.message);
      }
      setLoading(false);
    };

    if (!cancelContract) {
      fetchContractLast();
    }
  }, [cancelContract, setCancelContract]);

  function ContractsSkeleton() {
    return (
      <div className="user-contacts-container border-standard rounded-xl mt-[2rem] py-5 pb-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] animate-pulse">
        <div className="user-contact-header flex items-center gap-3 px-2 sm:px-[2rem]">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 mt-5 mb-2 rounded" />
        <div className="user-contacts-wrapper px-2 sm:px-[2rem]">
          <div className="flex flex-wrap user-contracts-details items-center gap-3 mb-2">
            <div className="user-contracts-detail min-w-[10rem]">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="user-contracts-detail min-w-[10rem]">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TitanNotice
        title="Notice"
        description="If you cancel your investment contract before its end date and the contract is terminated by you, the company will deduct all the profits paid to you so far from your investment amount, and a 10% penalty will be applied to your principal investment. After completing the necessary documentation, the remaining amount will be transferred to the wallet address you have provided. If you have received more than 80% of your investment amount in profits from Titan Investments during this period, you will not be able to cancel your contract and must wait until its legal end date. If you have increased your investment after an initial investment, the company will consider your initial account as the primary account. If you cancel the initial amount, your account will be restricted. However, if you cancel the amount you added later, you will receive only that amount according to the conditions described. Please note that after confirming the Cancellation, your account will be permanently deactivated."
      />
      {loading ? (
        <ContractsSkeleton />
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : contractLast ? (
        <UserContracts key={contractLast.id} contract={contractLast} />
      ) : null}
    </>
  );
}
