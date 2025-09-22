"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface FileSectionPair {
  file?: File; 
  id: number;
  key: string;
  title: string;
  section:number |string;
  path: string | File;
  type: "passport" | "national_id" | "driver_license";
  status?: "rejected" | "approved" | "pending" | "";
  reject_reason?: string;
}

interface VerifyContextType {
  sendVerify: boolean;
  capitalIncease: boolean;
  paymentID: string;
  activeItem: string | null;
  cancelContract: boolean;
  isSidebarOpen: boolean;
  claimReward: string;
  selectedCountryCode: string;
  accountActivation: string;
  setAccountActivation: (value: string) => void;
  setSendVerify: (value: boolean) => void;
  setPaymentID: (value: string) => void;
  setIsSidebarOpen: (status: boolean) => void;
  setCancelContract: (value: boolean) => void;
  setActiveItem: (value: string | null) => void;
  setClaimReward: (value: string) => void;
  verifyResult: string;
  setVerifyResult: (value: string) => void;
  setCapitalIncease: (value: boolean) => void;
  setSelectedCountryCode: (value: string) => void;
  setCountryDefault: (value: string) => void;
  countryDefault: string;
  fileSectionPairs: FileSectionPair[];
  setFileSectionPairs: React.Dispatch<React.SetStateAction<FileSectionPair[]>>;
}

const VerifyContext = createContext<VerifyContextType | undefined>(undefined);

export const VerifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sendVerify, setSendVerify] = useState<boolean>(false);
  const [cancelContract, setCancelContract] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<string>("");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [capitalIncease, setCapitalIncease] = useState<boolean>(false);
  const [claimReward, setClaimReward] = useState<string>("");
  const [paymentID, setPaymentID] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("1");
  const [countryDefault, setCountryDefault] = useState<string>("");
  const [accountActivation, setAccountActivation] = useState<string>("LAW");
  const [fileSectionPairs, setFileSectionPairs] = useState<FileSectionPair[]>([]);

  useEffect(() => {
    if (sendVerify) {
      setSendVerify(false);
      const randomResult = Math.random() < 0.5 ? "success" : "failed";
      setVerifyResult(randomResult);
    }
  }, [sendVerify]);

  return (
    <VerifyContext.Provider
      value={{
        sendVerify,
        capitalIncease,
        selectedCountryCode,
        setSelectedCountryCode,
        setCountryDefault,
        paymentID,
        setPaymentID,
        countryDefault,
        activeItem,
        cancelContract,
        isSidebarOpen,
        claimReward,
        accountActivation,
        setAccountActivation,
        setSendVerify,
        setIsSidebarOpen,
        setCancelContract,
        setActiveItem,
        setClaimReward,
        verifyResult,
        setVerifyResult,
        setCapitalIncease,
        fileSectionPairs,
        setFileSectionPairs,
      }}
    >
      {children}
    </VerifyContext.Provider>
  );
};

export const useVerify = (): VerifyContextType => {
  const context = useContext(VerifyContext);
  if (!context) {
    throw new Error("useVerify must be used within a VerifyProvider");
  }
  return context;
};
