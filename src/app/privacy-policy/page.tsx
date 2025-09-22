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
        Privacy Policy</h1>
      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">1. Introduction</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            Titan Investments is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and protect your
            personal information.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">2. Information </p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            We Collect Personal Information: We may collect personal information
            such as your name, email address, phone number, and financial
            details when you register for our services. Usage Data: We may
            collect information about your use of our website, including IP
            addresses, browser types, and usage patterns.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">3. How We Use Your Information</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            To provide and improve our services. To communicate with you about
            your account and our services.To comply with legal obligations and
            protect our rights.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">4. Sharing Your Information</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            We do not sell or rent your personal information to third parties.
            We may share your information with trusted service providers who
            assist us in operating our website and services. We may disclose
            your information if required by law or in response to legal
            processes.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">5. Data Security</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            We implement reasonable security measures to protect your personal
            information from unauthorized access or disclosure. However, no
            system is completely secure, and we cannot guarantee the absolute
            security of your data.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">6. Your Rights</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            You have the right to access, correct, or delete your personal
            information. You can opt-out of receiving promotional communications
            from us at any time.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">7. Cookies</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            Our website uses cookies to enhance your experience. You can manage
            your cookie preferences through your browser settings.
          </span>
        </div>
      </article>

      <article className="w-full">
        <div className="article-header text-center">
          <p className="text-white">8. Changes to Privacy Policy</p>
        </div>
        <div className="article-body tex-left">
          <span className="text-[#888]">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on our website, and we encourage you to review it
            periodically.
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
