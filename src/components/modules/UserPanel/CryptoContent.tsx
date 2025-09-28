// CryptoContent.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import CryptoBox from "./CryptoBox";
import CryptoSkeletonBox from "@/skeletons/User-Panel/CryptoSkeletonBox/CryptoSkeletonBox";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "../EncryptData/SavedEncryptData";

export interface CurrencyItem {
  code: string;
  rate: number;
  country_code: string;
  flag_url: string;
}


export interface CurrenciesResponse {
  base: string;
  flag_url: string;
  data: CurrencyItem[];
  success: boolean;
}

export default function CryptoContent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [cryptoDatas, setCryptoDatas] = useState<CurrencyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [base, setBase] = useState<{base:string;flag_url:string}>({ base: "", flag_url: "" });

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftGradient(scrollLeft > 0);
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const fetchCurrencies = async () => {
    setIsLoading(true);
    const token = loadUserData()?.access_token;
    try {
      const res = await apiRequest<CurrenciesResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/currencies`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        console.log("res.data" , res.data)
        setBase({base:res.data.base , flag_url:res.data.flag_url });
        setCryptoDatas(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="w-[95%] mx-auto bg-[#f4f7fd] dark:bg-[#090d23] border-standard rounded-xl py-2 px-4 hidden sm:block">
      <div className={`crypto-scroll-container relative ${showLeftGradient ? "show-left-gradient" : ""} ${showRightGradient ? "show-right-gradient" : ""}`}>
        <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide">
          <div className="inline-flex gap-8 py-2 ml-4">
            {isLoading
              ? [...Array(5)].map((_, idx) => (
                  <div key={idx} className="flex-none">
                    <CryptoSkeletonBox />
                  </div>
                ))
              : cryptoDatas.map((crypto) => (
                  <div key={crypto.code} className="flex-none">
                    <CryptoBox crypto={crypto} base={base} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
