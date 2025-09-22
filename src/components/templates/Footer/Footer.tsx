"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./Footer.css";
import { FaArrowUp } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleScrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="titan-footer px-5 py-[2rem] w-full mt-[20rem] relative sm:mt-0">
      <div className="flex flex-col gap-2 sm:gap-0 flex-wrap justify-center items-center w-[90%] mx-auto">
        {isBrowser && (
          <button
            aria-label="Scroll to top"
            className="w-[2rem] h-[2rem] bg-[#fff] rounded-full flex justify-center items-center absolute top-[-1rem] right-[50%] translate-x-[50%]"
            onClick={handleScrollTop}
          >
            <FaArrowUp />
          </button>
        )}

        <div className="copy-right mt-4">
          <p className="text-[#888] text-center text-sm">
            © 2024 Titan Investments All Rights Reserved
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4 text-white my-8">
          <li><Link href="#">Home</Link></li>
          <li><Link href="#about_us">About Us</Link></li>
          <li><Link href="#titan_opportunities">Opportunities</Link></li>
          <li><Link href="#Performance">Performance</Link></li>
          <li><Link href="#what_makes">Why Titan</Link></li>
          <li><Link href="#blog">Blog / News</Link></li>
          <li><Link href="#faqs">FAQ</Link></li>
          <li><Link href="#contract">Contact</Link></li>
        </ul>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-10 mt-16 md:mt-20 text-sm">
          <Image
            src="/titan.main-avatar.png"
            width={1200}
            height={1500}
            alt="Titan main avatar"
            className="w-fit"
          />
          <span className="text-[#8E8F98]">
            Titan Investments – A private investment pool powered by advanced
            algorithmic trading and robust risk management, built for
            transparency and long-term growth.
          </span>
        </div>

        <div className="w-full h-[2px] bg-[#8E8F98] my-12"></div>

        <div className="footer-description text-[#8E8F98]" id="contract">
          <span className="text-[.8rem]">
            Disclaimer and Risk Statement <br />
            Titan Investments is a private investment pool that operates through
            proprietary, fully automated systems for market analysis and
            algorithmic trading. All trades executed on this platform are
            carried out without direct human intervention, based on proprietary
            algorithms, risk management strategies, and predefined frameworks.
            While these systems have demonstrated positive performance across
            various tests and market conditions, it must be noted that financial
            markets are inherently unpredictable. There is no guarantee of
            consistent profitability or fixed returns. By investing through this
            platform, investors acknowledge and accept that all investments in
            financial markets involve risk, and that losses may occur, including
            the potential loss of 30% or more of the invested capital. The
            company’s primary policy is built upon transparency, stability, and
            honest participation with investors. Profits and losses are shared
            transparently with investors, and the company’s revenue is derived
            mainly from a predetermined fee deducted from profit withdrawals. By
            allocating capital to this fund, investors confirm that they have
            read, understood, and accepted all associated risks and conditions,
            and acknowledge that the decision to invest is made voluntarily and
            at their own risk. The company does not guarantee profit generation
            or the prevention of losses under any circumstances. The ultimate
            objective of Titan Investments is to build a sustainable, long-term,
            and growing platform for participation in the global forex
            markets—enabling investors to benefit from market opportunities
            without requiring prior financial expertise or trading experience.
          </span>
        </div>
      </div>
    </footer>
  );
}
