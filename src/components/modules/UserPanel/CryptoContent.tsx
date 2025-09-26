"use client"
import { useEffect, useRef, useState } from "react";
import CryptoBox from "./CryptoBox";
import { useQuery } from "@tanstack/react-query";
import CryptoSkeletonBox from "@/skeletons/User-Panel/CryptoSkeletonBox/CryptoSkeletonBox";
import { currencyApi } from "./currencyApi";

interface CryptoData {
  id: number;
  from: {
    img: string;
    cryptoName: string;
  };
  to: {
    img: string;
    cryptoName: string;
  };
  price: number;
  kind: string;
}

export default function CryptoContent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const {
    data: currencyData,
    isLoading,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: currencyApi.getCurrencies,
  });

  const cryptoDatas: CryptoData[] = currencyData?.data?.body
    ? Object.entries(currencyData.data.body).map(([pair, data], index) => {
        const [from, to] = pair.split("_");
        return {
          id: index + 1,
          from: {
            img: data.flag_1,
            cryptoName: from.toUpperCase(),
          },
          to: {
            img: data.flag_2,
            cryptoName: to.toUpperCase(),
          },
          price: data.value,
          kind: "currency",
        };
      })
    : [];


  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <>
      <div className="w-[95%] mx-auto bg-[#f4f7fd] dark:bg-[#090d23] border-standard rounded-xl py-2 px-4 hidden sm:block">
        <div
          className={`crypto-scroll-container relative ${
            showLeftGradient ? "show-left-gradient" : ""
          } ${showRightGradient ? "show-right-gradient" : ""}`}
        >
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
          >
            <div className="inline-flex gap-8 py-2 ml-4">
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="flex-none">
                      <CryptoSkeletonBox />
                    </div>
                  ))}
                </>
              ) : (
                cryptoDatas.map((cryptoData) => (
                  <div
                    key={cryptoData.from.cryptoName + cryptoData.to.cryptoName}
                    className="flex-none"
                  >
                    <CryptoBox crypto={cryptoData} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
