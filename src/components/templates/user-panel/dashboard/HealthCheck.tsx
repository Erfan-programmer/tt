"use client";
import React, { useState } from "react";
import "./HealthChecck.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useApiQuery } from "@/hooks/useApi";


interface HealthData {
  contract_number: string;
  loss_level: string;
  capital_status: string;
  can_cancel: boolean;
  requires_action: boolean;
  initial_investment: number;
  current_balance: number;
  time_info: {
    remaining_days: number;
    total_duration_days: number;
  };
  progress: number;
  color: string;
  remind: number;
  periods: number;
}

// Helper function to calculate progress and color based on status
// const getProgressAndColor = (
//   status: string,
//   balance: number,
//   amount: number
// ) => {
//   const percentage = (balance / amount) * 100;

//   switch (status.toLowerCase()) {
//     case "perfect":
//       return { progress: 95, color: "success", lossLevel: "0%" };
//     case "normal":
//       return { progress: 65, color: "normal", lossLevel: "-5%" };
//     case "risk":
//       return { progress: 45, color: "loss", lossLevel: "-30%" };
//     default:
//       return {
//         progress: percentage,
//         color: "normal",
//         lossLevel: `${Math.round(percentage - 100)}%`,
//       };
//   }
// };


const CircularProgress = ({
  progress,
  lossLevel,
  amount,
  capital_status,
  color,
}: {
  progress: number;
  lossLevel: string;
  capital_status: string;
  amount: number;
  color: string;
}) => {
  const radius = 170;
  const strokeWidth = 25;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center my-8">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          stroke="rgba(0, 0, 0, 0.2)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          filter="url(#glow)"
          className="transition-all duration-500 ease-in-out"
          stroke={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[var(--main-background)] dark:text-white text-base">
            Loss Level:
          </span>
          <span
            className="text-base"
            style={{
              color:
                capital_status.toLowerCase() === "loss"
                  ? "var(--loss)"
                  : capital_status.toLowerCase() === "perfect"
                  ? "var(--perfect)"
                  : "var(--normal)",
            }}
          >
            {lossLevel}
          </span>
        </div>
        <div className="text-[var(--main-background)] dark:text-white text-4xl font-bold mb-1 text-lg">
          ${amount}
        </div>
      </div>
    </div>
  );
};

const renderProgressBar = (data: HealthData) => {
  const remainingDays = Number(Math.round(data.time_info.remaining_days) || 0);
  const totalDays = Number(data.time_info.total_duration_days || 720);
  const remainingPercentage =
    totalDays > 0 ? (remainingDays / totalDays) * 100 : 0;

  return (
    <div className="progress-time-spend mt-4">
      <div className="progress-time-spend-title mb-2">
        <p className="text-[var(--main-background)] dark:text-white text-sm">
          Remaining Time for the ${data.initial_investment} Contract
        </p>
      </div>

      <div className="w-full rounded-xl bg-white overflow-hidden h-2 relative">
        <div
          className="bg-[#1a68ff] rounded-xl h-full"
          style={{ width: `${remainingPercentage}%` }}
        ></div>
      </div>
      <p className="time-spend text-right text-[var(--main-background)] dark:text-white text-sm mt-1">
        <span>{remainingDays}</span> <span>day/s</span>
      </p>
    </div>
  );
};

export default function HealthCheck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const [checkValue, setCheckValue] = useState<string>("");

  interface HealthCheckResponse {
    data: {
      contract_number: string;
      loss_level: string;
      capital_status: string;
      initial_investment: number;
      current_balance: number;
      time_info: {
        remaining_days: number;
        total_duration_days: number;
      };
    };
  }

  const {
    data: healthCheckData,
    isLoading,
    error,
  } = useApiQuery<HealthCheckResponse>(
    ["contract-health-check", 1],
    `/v1/client/contracts/healthCheck`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loadUserData()?.access_token}`,
      },
    }
  );

  // Mutation for allowing contract to invest
  // const allowToInvestMutation = useApiMutation(
  //   "/contract/allow-to-invest",
  //   "POST"
  // );

  // Convert contracts to health data
const healthData = React.useMemo(() => {
  return Array.isArray(healthCheckData?.data)
    ? healthCheckData.data
    : [healthCheckData?.data];
}, [healthCheckData]);



  // Submit contract action function
  // const SubmitContractAction = async () => {
  //   if (!checkValue || !selectedContractId) {
  //     toast.error("Please select an option and ensure contract is selected");
  //     return;
  //   }

  //   if (checkValue === "continue_trading") {
  //     try {
  //       await allowToInvestMutation.mutateAsync({
  //         data: {
  //           contract_id: selectedContractId,
  //         },
  //         headers: GetHeaderWithAuth(),
  //       });

  //       toast.success("Contract allowed to continue trading successfully!");
  //       setCheckValue("");
  //       setSelectedContractId("");

  //       // Refetch contracts data
  //       await refetch();
  //     } catch (error: any) {
  //       console.error("Error allowing contract to invest:", error);
  //       toast.error(
  //         error?.response?.data?.message ||
  //           "Failed to allow contract to continue trading"
  //       );
  //     }
  //   } else if (checkValue === "withdraw") {
  //     // Navigate to cancel contract page
  //     toast.success("Redirecting to cancel contract page...");
  //     setCheckValue("");
  //     setSelectedContractId("");
  //     router.push(`/financial/my-investments/${selectedContractId}`);
  //   }
  // };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : healthData.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < healthData.length - 1 ? prev + 1 : 0));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentData = healthData[currentIndex];

  // Set selected contract ID for mobile view when currentIndex changes
  React.useEffect(() => {
    if (
      currentData &&
      currentData?.capital_status?.toLowerCase() === "risk" &&
      !true
    ) {
    }
  }, [currentData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="health-check mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] border-standard rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="health-check mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] border-standard rounded-lg p-4">
        <div className="text-center text-red-500">
          Error loading contracts:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  // Show empty state
  if (healthData.length === 0) {
    return (
      <div className="health-check mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] border-standard rounded-lg p-4">
        <div className="text-center text-[var(--main-background)] dark:text-white">
          No contracts found
        </div>
      </div>
    );
  }

  // If only one contract, use it directly instead of currentData
  const singleContract = healthData.length === 1 ? healthData[0] : null;

  const STATUS_COLORS: Record<
    string,
    { text: string; bg: string; stroke: string }
  > = {
    perfect: {
      text: "text-[var(--perfect)]",
      bg: "bg-[var(--perfect)]",
      stroke: "var(--perfect)",
    },
    loss: {
      text: "text-[var(--loss)]",
      bg: "bg-[var(--loss)]",
      stroke: "var(--loss)",
    },
    normal: {
      text: "text-[var(--normal)]",
      bg: "bg-[var(--normal)]",
      stroke: "var(--normal)",
    },
  };

  const renderHealthCard = (data: HealthData) => {
    const remainingDays = Number(data.current_balance || 0);
    const totalDays = Number(data.initial_investment || 720);
    const remainingPercentage =
      totalDays > 0 ? (remainingDays / totalDays) * 100 : 0;

    const statusKey = (data?.capital_status?.toLowerCase() ||
      "normal") as keyof typeof STATUS_COLORS;
    const colors = STATUS_COLORS[statusKey];

    return (
      <div className="health-check mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] border-standard rounded-lg p-4">
        <div className="capital-health-check flex justify-start items-center gap-2 mb-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 11L14 6M6 6H6.01M10 4H10.01M16 10H16.01M4 10H4.01M12 13C12 14.1046 11.1046 15 10 15C8.89543 15 8 14.1046 8 13C8 11.8954 8.89543 11 10 11C11.1046 11 12 11.8954 12 13ZM19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
              stroke={colors.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={`text-[var(--main-background)] dark:text-white`}>
            Capital Health Check
          </p>
        </div>

        <div className="w-[95%] mx-auto">
          <div className="contract-number flex gap-2 text-[var(--main-background)] dark:text-[#B9B9B9] my-1">
            <span>Contract Number : </span>
            <span>#{data.contract_number}</span>
          </div>
          <div className="contract-number flex gap-2 text-[var(--main-background)] dark:text-[#B9B9B9] my-1">
            <span>Loss Level : </span>
            <div className={`flex gap-1 items-center ${colors.text}`}>
              {data.loss_level}
            </div>
          </div>
          <div className="contract-number flex gap-2 text-[var(--main-background)] dark:text-[#B9B9B9] my-1">
            <span>Your Last Capital status: </span>
            <span className={`flex gap-1 items-center ${colors.text}`}>
              {data?.capital_status?.toUpperCase()}
            </span>
          </div>

          <div className="progress-bar">
            <div className="w-full rounded-lg bg-white overflow-hidden h-[3rem] p-[3px] relative">
              <div
                className={`${colors.bg} rounded-lg p-[2px] h-full flex items-center justify-center min-w-fit`}
                style={{ width: `${remainingPercentage}%` }}
              ></div>
              <div className="progress-bar-label text-[1.4rem] absolute left-10 z-[2] text-black">
                Your balance: ${data.current_balance}
              </div>
            </div>
          </div>

          {data.requires_action && (
            <div className="bg-white dark:bg-[#4C4C4C] rounded-[2rem] p-3 py-[1rem] mt-[1rem]">
              <p className="flex items-center gap-2">
                ⚠️
                <span className="text-[var(--)]">
                  Trading on your account has been stopped due to reaching the
                  30% drawdown limit.
                </span>
              </p>

              <ul className="pl-3 text-[var(--main-background)] dark:text-[#B9B9B9] mt-[1rem]">
                <li>
                  Contract Number:{" "}
                  <span className="text-[var(--main-background)] dark:text-white">
                    #{data.contract_number}
                  </span>
                </li>
                <li>
                  Current Balance:{" "}
                  <span className="text-[var(--main-background)] dark:text-white">
                    {" "}
                    ${data.current_balance} USD
                  </span>
                </li>
              </ul>
              <div className="desc mt-[2rem]">
                <p className="text-[#555] dark:text-[#B9B9B9]">
                  Contract Number: #{data.contract_number} Current Balance: $
                  {data.current_balance} USD We regret to inform you that your
                  portfolio has reached the drawdown limit. While this is an
                  unfortunate situation, you now have two options: you can
                  withdraw your remaining balance or trust Titan Investments to
                  continue trading in an effort to recover the losses. Please be
                  aware that if you choose to trust Titan&apos;s trading systems,
                  your remaining balance will be reinvested into recovery
                  strategies, and you will no longer have access to your
                  funds—even in the case of further losses—until your portfolio
                  recovers and reaches PERFECT status. We will do everything in
                  our power to improve the performance and restore your
                  portfolio. Important Note:If you do not select any of the
                  options, Titan&apos;s trading systems will no longer trade on your
                  account. Please make your decision:
                </p>
              </div>
              <div className="mt-4 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`register-inputs-reward ${
                    checkValue === "withdraw" ? "selected" : "unselected"
                  } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 md:ml-[2rem] sm:w-[40%] cursor-pointer`}
                  onClick={() => setCheckValue("withdraw")}
                >
                  <span className="text-[var(--main-background)] dark:text-white">
                    Withdraw funds
                  </span>
                  <label className="custom-radio-container cursor-pointer">
                    <input
                      type="radio"
                      name="reward"
                      value="withdraw"
                      checked={checkValue === "withdraw"}
                      onChange={() => setCheckValue("withdraw")}
                      className="hidden"
                    />
                    <span
                      className={`custom-radio w-7 h-7 border-2 rounded-full border-[var(--main-background)] dark:border-white flex items-center justify-center relative ${
                        checkValue === "withdraw"
                          ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                          : ""
                      }`}
                    >
                      {checkValue === "withdraw" && (
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`register-inputs-reward ${
                    checkValue === "continue_trading"
                      ? "selected"
                      : "unselected"
                  } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 md:ml-[2rem] sm:w-[40%] cursor-pointer`}
                  onClick={() => setCheckValue("continue_trading")}
                >
                  <span className="text-[var(--main-background)] dark:text-white">
                    Continue Trading
                  </span>
                  <label className="custom-radio-container cursor-pointer">
                    <input
                      type="radio"
                      name="reward"
                      value="continue_trading"
                      checked={checkValue === "continue_trading"}
                      onChange={() => setCheckValue("continue_trading")}
                      className="hidden"
                    />
                    <span
                      className={`custom-radio w-7 h-7 border-2 rounded-full border-[var(--main-background)] dark:border-white flex items-center justify-center relative ${
                        checkValue === "continue_trading"
                          ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                          : ""
                      }`}
                    >
                      {checkValue === "continue_trading" && (
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </label>
                </motion.div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  className={`titan-btn sm:w-[80%] md:w-[50%] lg:w-[40%] ${
                    !checkValue ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!checkValue}
                  // onClick={SubmitContractAction}
                >
                  {"Submit"}
                </button>
              </div>
            </div>
          )}
          {renderProgressBar(data)}
        </div>
      </div>
    );
  };

  const statusKey = (singleContract?.capital_status?.toLowerCase() ||
    "normal") as keyof typeof STATUS_COLORS;
  const colors = STATUS_COLORS[statusKey];
  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block space-y-4">
        {healthData.map((data) => renderHealthCard(data))}
      </div>

      {/* Mobile View */}
      <div
        className="sm:hidden bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] border-standard rounded-lg p-4 mt-[2rem]"
        onTouchStart={singleContract ? undefined : onTouchStart}
        onTouchMove={singleContract ? undefined : onTouchMove}
        onTouchEnd={singleContract ? undefined : onTouchEnd}
      >
        <div className="capital-health-check flex justify-start items-center gap-2 mb-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 11L14 6M6 6H6.01M10 4H10.01M16 10H16.01M4 10H4.01M12 13C12 14.1046 11.1046 15 10 15C8.89543 15 8 14.1046 8 13C8 11.8954 8.89543 11 10 11C11.1046 11 12 11.8954 12 13ZM19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
              // stroke={`var(--${singleContract ? singleContract.color : curreloss)`}
              stroke={`${colors.stroke}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[var(--main-background)] dark:text-white">
            Capital Health Check
          </p>
        </div>
        <div className="text-center mb-4">
          <div className="text-[var(--main-background)] dark:text-[#B9B9B9] text-base">
            Contract Number: #
            {singleContract
              ? singleContract.contract_number
              : currentData.contract_number}
          </div>
        </div>
        <CircularProgress
          progress={(() => {
            const data = singleContract || currentData;
            const remainingDays = Number(data.current_balance || 0);
            const totalDays = Number(data.initial_investment || 720);
            return totalDays > 0 ? (remainingDays / totalDays) * 100 : 0;
          })()}
          lossLevel={singleContract && currentData.loss_level}
          capital_status={singleContract && currentData.capital_status}
          amount={
            singleContract
              ? singleContract.initial_investment
              : currentData.initial_investment
          }
          // color={singleContract ? singleContract.color : curreloss}
          color={colors.stroke}
        />
        {singleContract && (
          <div className="text-center mb-4">
            <div className={`${colors.text} text-xl font-medium`}>
              {singleContract?.capital_status?.toUpperCase()}
            </div>
          </div>
        )}
        {!singleContract && (
          <div className="flex items-center justify-between px-4 mb-4">
            <button
              onClick={handlePrev}
              className="text-[var(--main-background)] dark:text-white/50 hover:text-[var(--main-background)] dark:text-white transition-colors"
            >
              <IoIosArrowBack size={24} />
            </button>
            <div
              // className={`text-[var(--${curreloss)] text-xl font-medium`}
              className={`text-[var(--)] text-xl font-medium`}
            >
              {currentData?.capital_status?.toUpperCase()}
            </div>
            <button
              onClick={handleNext}
              className="text-[var(--main-background)] dark:text-white/50 hover:text-[var(--main-background)] dark:text-white transition-colors"
            >
              <IoIosArrowForward size={24} />
            </button>
          </div>
        )}
        {singleContract?.requires_action && (
          <div className="bg-white dark:bg-[#4C4C4C] rounded-[2rem] p-3 py-[1rem] mt-[1rem]">
            <p className="flex items-center gap-2">
              ⚠️
              <span className="text-[var(--)]">
                Trading on your account has been stopped due to reaching the 30%
                drawdown limit.
              </span>
            </p>

            <ul className="pl-3 text-[var(--main-background)] dark:text-[#B9B9B9] mt-[1rem]">
              <li>
                Contract Number:{" "}
                <span className="text-[var(--main-background)] dark:text-white">
                  #{currentData.contract_number}
                </span>
              </li>
              <li>
                Current Balance:{" "}
                <span className="text-[var(--main-background)] dark:text-white">
                  {" "}
                  ${currentData.current_balance} USD
                </span>
              </li>
            </ul>
            <div className="desc mt-[2rem]">
              <p className="text-[#555] dark:text-[#B9B9B9]">
                Contract Number: #{currentData.contract_number} Current Balance:
                ${currentData.current_balance} USD We regret to inform you that
                your portfolio has reached the drawdown limit. While this is an
                unfortunate situation, you now have two options: you can
                withdraw your remaining balance or trust Titan Investments to
                continue trading in an effort to recover the losses. Please be
                aware that if you choose to trust Titan&apos;s trading systems, your
                remaining balance will be reinvested into recovery strategies,
                and you will no longer have access to your funds—even in the
                case of further losses—until your portfolio recovers and reaches
                PERFECT status. We will do everything in our power to improve
                the performance and restore your portfolio. Important Note:If
                you do not select any of the options, Titan&apos;s trading systems
                will no longer trade on your account. Please make your decision:
              </p>
            </div>
            <div className="mt-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`register-inputs-reward ${
                  checkValue === "withdraw" ? "selected" : "unselected"
                } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 md:ml-[2rem] sm:w-[40%] cursor-pointer`}
                onClick={() => setCheckValue("withdraw")}
              >
                <span className="text-[var(--main-background)] dark:text-white">
                  Withdraw funds
                </span>
                <label className="custom-radio-container cursor-pointer">
                  <input
                    type="radio"
                    name="reward"
                    value="withdraw"
                    checked={checkValue === "withdraw"}
                    onChange={() => setCheckValue("withdraw")}
                    className="hidden"
                  />
                  <span
                    className={`custom-radio w-7 h-7 border-2 rounded-full border-[var(--main-background)] dark:border-white flex items-center justify-center relative ${
                      checkValue === "withdraw"
                        ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                        : ""
                    }`}
                  >
                    {checkValue === "withdraw" && (
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`register-inputs-reward ${
                  checkValue === "continue_trading" ? "selected" : "unselected"
                } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 md:ml-[2rem] sm:w-[40%] cursor-pointer`}
                onClick={() => setCheckValue("continue_trading")}
              >
                <span className="text-[var(--main-background)] dark:text-white">
                  Continue Trading
                </span>
                <label className="custom-radio-container cursor-pointer">
                  <input
                    type="radio"
                    name="reward"
                    value="continue_trading"
                    checked={checkValue === "continue_trading"}
                    onChange={() => setCheckValue("continue_trading")}
                    className="hidden"
                  />
                  <span
                    className={`custom-radio w-7 h-7 border-2 rounded-full border-[var(--main-background)] dark:border-white flex items-center justify-center relative ${
                      checkValue === "continue_trading"
                        ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                        : ""
                    }`}
                  >
                    {checkValue === "continue_trading" && (
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </motion.div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className={`titan-btn  ${
                  checkValue.length ? "opacity-50 cursor-not-allowed" : ""
                }`}
                // onClick={SubmitContractAction}
                // disabled={
                //   checkValue.length
                // }
              >
                {"Submit"}
              </button>
            </div>
          </div>
        )}
        {renderProgressBar(singleContract || currentData)}
      </div>
    </>
  );
}
