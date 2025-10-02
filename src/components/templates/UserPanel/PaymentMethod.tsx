"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentMethodTabs from "./PaymentMethodTab";
import { setTriggerSubmit } from "@/store/PaymentSlice";
import { RootState } from "@/store";

export default function PaymentMethod() {
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.payment.isLoading);

  const handleSubmit = () => {
    dispatch(setTriggerSubmit());
  };
  return (
    <>
      <div className="user-details-container border-standard rounded-xl py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
        <div className="user-details-header flex items-center gap-3 px-[2rem]">
          <p className="text-[var(--main-background)] dark:text-white">
            Choosing a Payment Method
          </p>
        </div>
        <div className="mt-5 mb-2 lg:w-[50%]">
          <PaymentMethodTabs onCurrentTabValidityChange={setIsValid} />
        </div>
      </div>
      <div className="flex justify-center sm:justify-end mt-8">
        <button
          className={`titan-btn ${
            isLoading ? "!bg-gray-400" : ""
          } text-white !px-12 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition text-lg`}
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
    </>
  );
}
