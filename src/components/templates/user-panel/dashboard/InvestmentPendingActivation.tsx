"use client";

import React, { useState, useEffect } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface InvestmentData {
  contract_investment: string;
  contract_number: string;
  end_date: string;
  label: string;
  start_date: string;
  status: boolean;
}

const InvestmentPendingActivationSkeleton = () => (
  <div className="mt-[1rem] py-4 px-6 sm:px-8 w-full bg-gradient-to-r from-[#F6FAFF] to-[#E0EFFF] border-standard rounded-xl shadow-md animate-pulse">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        <div className="h-6 bg-gray-300 rounded w-48"></div>
      </div>
      <div className="w-6 h-6 rounded-full bg-gray-300"></div>
    </div>
    <div className="mt-4">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mt-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mt-2"></div>
    </div>
    <div className="mt-4 rounded-full bg-gray-300 h-2"></div>
  </div>
);

export default function InvestmentPendingActivation() {
  const [data, setData] = useState<InvestmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (start: string, end: string): number => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = Date.now();

    // The logic should be the time passed, not the time remaining.
    const totalDuration = endDate - startDate;
    const timePassed = now - startDate;

    return (timePassed / totalDuration) * 100;
  };
  const [hintShow, setShowHint] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = loadUserData()?.access_token;
        if (!token) {
          setError("User not authenticated.");
          setIsLoading(false);
          return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/client/dashboard/inForex`;

        const response = await apiRequest<{ data: InvestmentData }>(
          url,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (response.success && response.data) {
          setData(response.data.data);
        } else {
          setError(response.error?.message || "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Failed to fetch investment data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <InvestmentPendingActivationSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-[1rem] p-4 w-full bg-[#f4f7fd] border border-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-[1rem] p-4 w-full bg-[#f4f7fd] border border-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No investment data available.</p>
      </div>
    );
  }
  const progressPercentage = calculateProgress(data.start_date, data.end_date);
  return (
    <>
      <div className="my-[1rem] w-full border-standard rounded-t-xl shadow-md overflow-hidden">
        <div className=" bg-gradient-to-r from-[#F6FAFF] to-[#E0EFFF]">
          <div className="py-4 px-6 sm:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <IoIosInformationCircleOutline
                  className="text-blue-500 text-3xl"
                  onClick={() => setShowHint(!hintShow)}
                />
                <p className="text-gray-800 font-semibold text-lg">
                  Investment Pending Activation
                </p>
              </div>
            </div>
            <div className="mt-4 text-gray-700 text-sm leading-relaxed">
              <p>
                Your investment contract{" "}
                <span className="font-bold">#{data.contract_number}</span> for{" "}
                <span className="font-bold">${data.contract_investment}</span>{" "}
                has been successfully registered. From{" "}
                <span className="font-bold">{data.label}</span>, your capital
                will automatically enter the trading cycle.
              </p>
              <p className="mt-2">
                Meanwhile, your account is fully active and you can use all
                features of the platform.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-full bg-gray-300 dark:bg-gray-700 h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-r-xl transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* {hintShow && (
      )} */}
    </>
  );
}
