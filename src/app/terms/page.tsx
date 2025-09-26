import React from "react";
import "./page.css";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
function page() {
  const starPositions = [31, 12, 57, 93, 23, 70, 6];
  return (
    <div className=" mt-[10rem] md:mt-[3rem]  titan-terms">
      <div className="privacy-wrapper w-[90%] md:w-[70%] mx-auto">
        <h1 className="text-2xl md:text-4xl text-center text-white my-10">
          Terms and Condition
        </h1>
        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">1. Introduction</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              Welcome to Titan Investments By using our website and services,
              you agree to the following terms and conditions. If you do not
              agree with these terms, please do not use our services.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">2. Services </p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              Titan Investments provides investment opportunities through forex
              trading utilizing advanced algorithms and fully automated trading
              systems. Please be aware that financial markets are inherently
              risky and unpredictable.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">3. Risk Acknowledgment</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              By using our services, you acknowledge and accept the inherent
              risks associated with financial markets. Titan Investments cannot
              guarantee profits and there is a possibility of incurring losses.
              Despite our successful track record, market conditions may lead to
              financial losses. However, our experts aim to limit losses to a
              maximum of 25-30%. If your investment experiences a 30% decline,
              Titan Investments commits to returning 70% of the remaining
              capital.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">4. Investment Performance</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              Our trading systems may not yield positive returns every month.
              During periods of losses, investors must exercise patience as we
              work to recover and generate profits. Investors should be prepared
              for months where no returns are generated and understand that this
              is a part of the investment process.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">5. Fees and Commissions</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              A fee of 20% will be deducted from all withdrawals, covering our
              commission and service charges. This fee is applied to the total
              amount withdrawn, and it constitutes Titan Investments&apos; share of
              the profits. Investors must accept these terms before proceeding
              with their investments.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">6. User Responsibilities</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              You must be at least 18 years old to use our services. You are
              responsible for maintaining the confidentiality of your account
              information. You agree to use our services only for lawful
              purposes and in accordance with these terms.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">7. Account Termination</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              We reserve the right to suspend or terminate your account if we
              believe you have violated these terms or engaged in fraudulent
              activity.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">8. Limitation of Liability</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              Titan Investments shall not be liable for any indirect,
              incidental, or consequential damages arising from the use of our
              services.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">9. Changes to Terms</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              We may update these terms and conditions from time to time. Any
              changes will be posted on our website, and it is your
              responsibility to review them periodically.
            </span>
          </div>
        </article>

        <article className="w-full">
          <div className="article-header text-center">
            <p className="text-[#383C47] dark:text-white">10. Governing Law</p>
          </div>
          <div className="article-body tex-left">
            <span className="text-[#888]">
              These terms and conditions are governed by the laws of UAE. Any
              disputes arising from these terms will be subject to the exclusive
              jurisdiction of the courts in UAE.
            </span>
          </div>
        </article>
      </div>
      <div className="back-to-titan h-[10rem]">
        <div className="w-full button-animation-container sm:w-[30vw] mx-auto">
          <Link
            href="/"
            className="p-2 button w-full button-animation text-white rounded-[1rem] border-2 hover:border-[#1A68FF] border-white flex justify-center items-center gap-2 relative"
          >
            <FaArrowLeft />
            <span>Back To Titan Base</span>
            <div className="space w-full flex justify-between items-center">
              {starPositions.map((i, index) => (
                <span
                  key={index}
                  className="star"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></span>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
