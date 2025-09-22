"use client"
import React from 'react'
import Style from "@/styles/AboutUs/page.module.css"
import { useRouter } from 'next/navigation'
export default function Page() {
  const router = useRouter()
  return (
    <div className='about-us w-full my-[10rem] pb-5 '>
        <div className={Style.about_us_wrapper}>
            <div className={Style.about_us_info}>
                <h2>Who We Are?</h2>
                <div className={Style.about_us_description}>
                    <span>At Titan Investments, we are dedicated to revolutionizing the world of forex trading through innovative, data-driven solutions. Established with the vision of making high-level trading accessible to everyone, we have combined cutting-edge technology, expert insights, and automated systems to offer a seamless and profitable experience to our clients worldwide.</span>
                </div>
            </div>

            <div className={Style.about_us_info}>
                <h2>Our Mission</h2>
                <div className={Style.about_us_description}>
                    <span>Our mission is simple: to empower individuals and institutions by providing them with robust investment opportunities that drive long-term success. We strive to bridge the gap between traditional and modern trading by utilizing advanced algorithms and automated strategies that enable our investors to maximize their potential, regardless of their experience level. With transparency and integrity at the core of our operations, Titan Investments is here to help you grow your wealth with confidence.</span>
                </div>
            </div>

            <div className={Style.about_us_info}>
                <h2>Our Expertise</h2>
                <div className={Style.about_us_description}>
                    <span>Our team comprises financial experts, data scientists, and engineers who have crafted proprietary trading systems designed to operate 24/7 in global forex markets. These systems are fully automated, reducing the risks of human error while optimizing trade decisions based on real-time data analysis and market trends. With years of backtesting and proven results, our technology is built to handle and confront the volatility of financial markets and deliver consistent, sustainable returns.</span>
                </div>
            </div>

            <div className={Style.about_us_info}>
                <h2>Our Values</h2>
                <ul className={`list-disc ${Style.about_us_description} `}>
                    <li>Innovation: We constantly seek new technologies and strategies to improve our trading systems, ensuring our clients stay ahead in a fast-paced, ever-changing market.</li>
                    <li>Integrity: At Titan Investments, we believe in transparency. Every investor deserves to know how their capital is being managed and the risks involved. We ensure full disclosure in all our dealings.</li>
                    <li>Excellence: We are committed to providing high-quality service and unparalleled performance. Our systems are designed to minimize risks while maximizing profitability.</li>
                    <li>Client-Centric Approach: Our investors are at the core of everything we do. From personalized support to flexible investment plans, we adjust our services to meet each client’s unique needs.</li>
                </ul>
            </div>

            <div className={Style.about_us_info}>
                <h2>Risk Management and Performance</h2>
                <div className={Style.about_us_description}>
                    <span>We understand that investing can be risky, especially in the forex market where fluctuations can be unpredictable. That’s why we are committed to safeguarding our clients&apos; investments by employing risk management techniques that ensure losses are minimized and gains are maximized. In the rare case of a monthly loss, no profit is distributed, and when necessary, we guarantee the return of 70% of the remaining initial investment if the market suffers 30% loss. Our performance speaks for itself. Titan Investments offers annual returns from 40% to 200% profits, depending on market conditions and individual investment plans. We take pride in being a trusted partner for both novice and inexperienced traders and investors, helping them achieve their financial goals through reliable strategies.</span>
                </div>
            </div>

            <div className={Style.about_us_info}>
                <h2>Join Us on the Journey</h2>
                <div className={Style.about_us_description}>
                    <span>By partnering with Titan Investments, you are not just another investor; you are part of a larger mission to redefine financial independence. We invite you to join our growing community of traders and investors who trust our expertise and technology to navigate the complex world of forex with ease and confidence. Whether you are looking for a short-term gain or long-term wealth accumulation, Titan Investments is the partner you need to turn your financial aspirations into reality.</span>
                </div>
            </div>
        </div>
        <button
        onClick={()=> router.back()}
        className="p-2  w-[60%] mx-auto rounded-[1rem] mt-10 border-2 border-[#383C47] flex justify-center items-center gap-2   mx-auto text-white"
      >
        Home
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12.9662C6 12.9662 7.6 14.9662 10 14.9662C12.4 14.9662 14 12.9662 14 12.9662M1 12.5662V10.0964C1 8.94767 1 8.37331 1.14805 7.84438C1.2792 7.37584 1.49473 6.93517 1.78405 6.54399C2.11067 6.10239 2.56404 5.74977 3.47078 5.04453L6.07078 3.0223C7.47608 1.92929 8.17873 1.38279 8.95461 1.17271C9.63921 0.987351 10.3608 0.987351 11.0454 1.17271C11.8213 1.38279 12.5239 1.9293 13.9292 3.02231L16.5292 5.04453C17.436 5.74977 17.8893 6.10239 18.2159 6.54399C18.5053 6.93517 18.7208 7.37584 18.8519 7.84438C19 8.37331 19 8.94767 19 10.0964V12.5662C19 14.8065 19 15.9266 18.564 16.7822C18.1805 17.5349 17.5686 18.1468 16.816 18.5303C15.9603 18.9662 14.8402 18.9662 12.6 18.9662H7.4C5.15979 18.9662 4.03969 18.9662 3.18404 18.5303C2.43139 18.1468 1.81947 17.5349 1.43597 16.7822C1 15.9266 1 14.8065 1 12.5662Z"
            stroke="#1A68FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}