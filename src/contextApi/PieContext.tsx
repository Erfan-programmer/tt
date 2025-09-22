"use client";

import React, { createContext, useContext, useState } from "react";

type WealthyContextType = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WealthyContext = createContext<WealthyContextType | undefined>(undefined);

export const WealthyProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <WealthyContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </WealthyContext.Provider>
  );
};

export const useWealthy = () => {
  const ctx = useContext(WealthyContext);
  if (!ctx) {
    throw new Error("useWealthy must be used inside WealthyProvider");
  }
  return ctx;
};
