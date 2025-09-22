"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import InvestmentTermSkeleton from "@/skeletons/my-admin/blog/InvestmentTermSkeleton";
import ItemsOptionProfits from "./ItemsOptionProfits";
import { RegisterFormType } from "@/validations/validationSchema";

interface InvestmentTermProps {
  handlePrevStep: () => void;
  handleNextStep: (planId: number) => void;
  setValue: (name: keyof RegisterFormType, value: string) => void;
}

interface Plan {
  id: number;
  name: string;
  type: string;
  duration_months: number;
  user_percentage: string;
  company_percentage: string;
  has_loss_coverage: boolean;
  has_bonus_shield: boolean;
  can_earn_referral: boolean;
  can_earn_commission: boolean;
  can_earn_annual_sales: boolean;
}

export default function InvestmentTerm({
  handlePrevStep,
  setValue,
  handleNextStep,
}: InvestmentTermProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const res = await apiRequest<{ data: Plan[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/showType?type=investor`
      );
      if (res.success) {
        setPlans(res.data?.data || []);
        if (res.data?.data?.length > 0) {
          setSelectedPlan(res.data.data[0]);
          setValue("plan_id" , String(res.data.data[0].id));
        }
      } else {
        console.error("Failed to fetch investor plans", res.error);
      }
      setLoading(false);
    };
    fetchPlans();
  }, [setValue]);

  useEffect(() => {
    console.log(selectedPlan);
  }, [selectedPlan]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="mt-[1rem] sm:mt-[2rem]"
    >
      <div className="terms-container">
        {loading ? (
          <InvestmentTermSkeleton />
        ) : (
          plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <div
                key={plan.id}
                className={` bg-[#f4f7fd] dark:bg-[var(--main-background)] 
                    px-[1.5rem] py-[1rem] mb-4 cursor-pointer transition-all rounded-[3rem]
                    ${
                      isSelected
                        ? "shadow-[inset_0px_0px_35px_#275edf] ring-2 ring-[#275edf]"
                        : "ring-1 ring-gray-400 hover:shadow-[inset_0px_0px_35px_#275edf]"
                    }
                  `}
                onClick={() => {
                  setSelectedPlan(plan);
                  setValue("plan_id" , String(plan.id));
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-[var(--main-background)] dark:text-[#fff]">
                    {plan.name}
                  </h3>
                  <label className="custom-radio-container">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedPlan(plan);
                        setValue("plan_id" , String(plan.id));
                      }}
                      className="hidden"
                    />
                    <span className="custom-radio w-6 h-6 border-2 border-[#275edf] dark:border-white rounded-full flex items-center justify-center relative">
                      {isSelected && (
                        <span className="check-icon absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#275edf] dark:text-white"
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
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            );
          })
        )}

        {selectedPlan && (
          <div className="terms-options flex justify-center w-full">
            <div className="ring-1 ring-gray-400 shadow-[inset_0px_0px_70px_#275edf] drop-shadow-[0px_0px_20px_#84A9FF66] rounded-[3rem] w-full p-3">
              <div className="flex flex-col items-start justify-center gap-2 w-[70%] mx-auto">
                <ItemsOptionProfits
                  user_per={Number(selectedPlan.user_percentage)}
                  company_per={Number(selectedPlan.company_percentage)}
                  loss_cover={selectedPlan.has_loss_coverage}
                  bonus_shield={selectedPlan.has_bonus_shield}
                  referral={selectedPlan.can_earn_referral}
                  commission={selectedPlan.can_earn_commission}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          type="button"
          onClick={handlePrevStep}
          className="submit-register text-white w-[80%] md:w-full order-1 lg:order-0 bg-gray-500 hover:bg-gray-600 rounded-lg py-3"
        >
          Back
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          type="button"
          onClick={() => {
            if (selectedPlan) handleNextStep(selectedPlan.id);
          }}
          className={`submit-register text-white w-[80%] md:w-full rounded-lg py-3 ${
            !selectedPlan
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#030a30] hover:bg-[#020826] cursor-pointer"
          }`}
          disabled={!selectedPlan}
        >
          Confirm & Continue
        </motion.button>
      </div>
    </motion.div>
  );
}
