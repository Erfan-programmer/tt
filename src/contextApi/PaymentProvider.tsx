"use client";
import { PaymentData } from "@/types/Layout/FormLayout";
import { createContext, useContext, useState, ReactNode } from "react";


type PaymentContextType = {
  payment: PaymentData | null;
  setPayment: (data: PaymentData) => void;
  clearPayment: () => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payment, setPaymentState] = useState<PaymentData | null>(null);

  const setPayment = (data: PaymentData) => {
    setPaymentState(data);
  };

  const clearPayment = () => {
    setPaymentState(null);
  };

  return (
    <PaymentContext.Provider value={{ payment, setPayment, clearPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
