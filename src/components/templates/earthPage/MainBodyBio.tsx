"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Style from "@/styles/Home/page.module.css";
import OrbitContainer from "@/components/modules/OrbitContainer/OrbitContainer";
import GraphIcon from "@/components/modules/GraphIcon/graphIcon";
import { FaAngleRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import CustomModal from "@/components/modules/CustomModal";

export default function MainBodyBio() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const x = e.clientX - card.offsetLeft;
    const y = e.clientY - card.offsetTop;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="main-body-bio flex flex-col mt-[2rem] sm:mt-[5rem] justify-center items-center w-full gap-5 ">
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0)" }}
          transition={{ delay: 2, duration: 1 }}
          className={`${Style.main_body_joinUs} p-0 flex justify-center gap-3`}
        >
          {/* <span className="text-[#383C47] dark:text-white">💸</span> */}
          <span className="text-sm">
            Grow your wealth with Titan Investment
          </span>
        </motion.div>
        <div className={Style.main_title}>
          <h1 className="w-[80%] mx-auto sm:w-auto text-center text-3xl md:text-5xl text-[#fff]">
            <motion.span
              viewport={{ once: true }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Welcome{" "}
            </motion.span>
            <motion.span
              viewport={{ once: true }}
              initial={{ opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0)" }}
              transition={{ delay: 1.7 }}
            >
              To The
            </motion.span>
            <motion.span
              viewport={{ once: true }}
              initial={{ opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0)" }}
              transition={{ delay: 1.9 }}
              className={`${Style.option_header_span} `}
            >
              {" "}
              Future !
            </motion.span>
          </h1>
        </div>
        <div className={`${Style.main_description} w-[60%] sm:w-[40%] flex`}>
          <motion.span
            viewport={{ once: true }}
            className="text-[#888] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Join us to embark on a transformative journey through the dynamic
            world of forex. Have a unique investment horizon and unlock
            opportunities.
          </motion.span>
        </div>
        <div className={Style.main_body}>
          <motion.button
            viewport={{ once: true }}
            className="p-2 px-4 flex justify-center items-center gap-2 rounded-lg"
            initial={{ width: "5rem", opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.svg
              viewport={{ once: true }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0, duration: 0.2 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 16V20M6 4V8M7 18H3M8 6H4M13 4L14.7528 8.44437C14.9407 8.92083 15.0347 9.15906 15.1786 9.35994C15.3061 9.538 15.462 9.69391 15.6401 9.82143C15.8409 9.9653 16.0792 10.0593 16.5556 10.2472L21 12L16.5556 13.7528C16.0792 13.9407 15.8409 14.0347 15.6401 14.1786C15.462 14.3061 15.3061 14.462 15.1786 14.6401C15.0347 14.8409 14.9407 15.0792 14.7528 15.5556L13 20L11.2472 15.5556C11.0593 15.0792 10.9653 14.8409 10.8214 14.6401C10.6939 14.462 10.538 14.3061 10.3599 14.1786C10.1591 14.0347 9.92083 13.9407 9.44437 13.7528L5 12L9.44437 10.2472C9.92083 10.0593 10.1591 9.9653 10.3599 9.82143C10.538 9.69391 10.6939 9.538 10.8214 9.35994C10.9653 9.15906 11.0593 8.92083 11.2472 8.44437L13 4Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            <motion.span
              className="opacity-50"
              onClick={() => setIsOpen(true)}
              viewport={{ once: true }}
              initial={{ opacity: 0, fontSize: "0px", display: "none" }}
              animate={{ opacity: 1, fontSize: "1rem", display: "inline" }}
              transition={{ delay: 3, duration: 1.5 }}
            >
              Let’s Join Us Now
            </motion.span>
          </motion.button>
        </div>

        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, transform: "translateY(100%)" }}
          animate={{ opacity: 1, transform: "translateY(-37px)" }}
          transition={{ delay: 1, duration: 2 }}
          className={`${Style.main_body_shapes}  top-[-2rem] w-full flex justify-center mt-[3rem] `}
        >
          <svg
            style={{ zIndex: 2 }}
            width="100%"
            height="100%"
            viewBox="0 0 1440 693"
            fill="none"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="720.5"
              cy="346.5"
              rx="916.5"
              ry="346.5"
              fill="url(#paint0_linear_1_381)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1_381"
                x1="720.5"
                y1="0"
                x2="720.5"
                y2="693"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#18192C" />
                <stop offset="0.5" stopColor="#080A1D" />
                <stop offset="1" stopColor="#080A1D" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <div
          className="main-body-shapes-bottom  w-full top-[-25vh]  sm:top-[-30vh] md:top-[-40vh] lg:top-[-50vh] xl:top-[-70vh] relative"
          style={{ zIndex: 2 }}
        >
          <div className="flex flex-col justify-center items-center w-full relative main-body-shapes-bottom-wrapper ">
            <div className={`${Style.main_body_shapes_bottom_title} w-[80%] sm:w-[70%] md:w-[60%] lg:w-[35%] mx-auto mt-[4rem] sm:mt-[1rem]`}>
              <motion.h3
                viewport={{ once: true }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-white sm:text-[#888] text-[1.3rem] sm:text-[1.7rem] text-center"
              >
                With{" "}
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-white "
                >
                  {" "}
                  TITAN INVESTMENTS{" "}
                </motion.span>
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  move into the orbit of success.
                </motion.span>
              </motion.h3>
            </div>
            <div className="hidden sm:block w-full ml-20 mt-10 ">
              <motion.div
                viewport={{ once: true }}
                className="main-body-content-box w-full sm:w-[50%] p-2 bg-transparent flex flex-col justify-center gap-2"
                initial={{ opacity: 0, transform: "translateY(-10px)" }}
                whileInView={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 3, delay: 0.2 }}
              >
                <svg
                  width="98"
                  height="2"
                  viewBox="0 0 98 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L97 1.00001"
                    stroke="#0DC8D4"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-white text-[1.2rem]">
                  Invest in a Secure Tomorrow{" "}
                </p>
                <p className="text-[#888] text-[.9rem] w-[50%]">
                  With Titan Investments, step into a world where your
                  investments enter the orbit of success. Using intelligent
                  systems and cutting-edge strategies, we bring you consistent
                  returns and long-term financial growth.
                </p>
              </motion.div>
            </div>

            <OrbitContainer />
            <div className="sm:hidden text-white relative top-[-50vh] flex flex-wrap  items-center justify-center gap-5  w-[80%]">
              <div className={Style.process_orbit}>
                <Image
                  src="/images/cash.png"
                  width={10}
                  height={10}
                  className="w-10 j-10"
                  alt=""
                />
                <p className="text-2xl text-[#383C47] dark:text-white">450%</p>
                <div>
                  <span className="text-[#888]">Profit 2020 - 2024</span>
                </div>
              </div>
              <div className={Style.process_orbit}>
                <Image
                  width={10}
                  height={10}
                  src="/images/cost.png"
                  className="w-10 j-10"
                  alt=""
                />
                <p className="text-2xl text-[#383C47] dark:text-white">$10M+</p>
                <div>
                  <span className="text-[#888]">Investments</span>
                </div>
              </div>
              <div className={Style.process_orbit}>
                <Image
                  width={10}
                  height={10}
                  src="/images/space_man.png"
                  className="w-10 j-10 "
                  alt=""
                />
                <p className="text-2xl text-[#383C47] dark:text-white">100%</p>
                <div>
                  <span className="text-[#888]">Automated Trading</span>
                </div>
              </div>
              <div className={Style.process_orbit}>
                <Image
                  width={10}
                  height={10}
                  src="/images/khazaneh.png"
                  className="w-10 j-10"
                  alt=""
                />
                <p className="text-xl text-whit text-center">
                  Secure investment
                </p>
                <div>
                  <span className="text-[#888]"></span>
                </div>
              </div>
            </div>
            <div className="sm:hidden block relative top-[-40vh] main-body-content-box w-[90%] mx-auto p-2 bg-transparent flex flex-col justify-center gap-2">
              <p className="text-white text-center text-[1.7rem]">
                Invest in a Secure Tomorrow
              </p>
              <p className="text-[#888] text-center text-[.9rem] w-[70%] mx-auto text-left mt-[1rem]">
                With Titan Investments, step into a world where your investments
                enter the orbit of success. Using intelligent systems and
                cutting-edge strategies, we bring you consistent returns and
                long-term financial growth.
              </p>
            </div>
            <div className="w-full ml-20 mt-[-10rem] hidden sm:flex justify-end relative top-[-20rem]">
              <motion.div
                viewport={{ once: true }}
                className="hidden sm:block main-body-content-box w-[30%] sm:w-[50%] md:w-[30%] sm:mt-10 md:mt-0 mr-2 p-2 bg-transparent flex flex-col justify-center gap-2"
                initial={{ opacity: 0, transform: "translateY(-10px)" }}
                whileInView={{ opacity: 1, transform: "translateY(0)" }}
                transition={{ duration: 3, delay: 0.2 }}
              >
                <p className="text-white text-[1.2rem]">
                  Innovation with Integrity
                </p>
                <p className="text-[#888] text-[.9rem] w-[50%] md:w-[80%] mb-[1rem]">
                  At Titan Investments, we are always evolving and improving,
                  but never at the expense of the market&apos;s realities. Our
                  advanced systems are designed to identify the best
                  opportunities while considering the real risks and challenges,
                  ensuring sustainable growth.
                </p>
                <svg
                  width="98"
                  height="2"
                  className="mt-5"
                  viewBox="0 0 98 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L97 1.00001"
                    stroke="#0DC8D4"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>
            <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-center  h-[100vh] mt-[-4rem] sm:mt-0 top-[-10rem] sm:top-[-7rem] relative graph_info_container">
              <div
                className="graph-info flex flex-col justify-center items-start w-[90%]"
                id="about"
              >
                <GraphIcon />

                {/* <MobileGraph /> */}

                <div id="about_us" className={`${Style.main_body_content_box} w-[100%] sm:w-[70%] ml-auto  mr-20 p-2 bg-transparent flex flex-col justify-center items-center sm:items-start gap-5  relative z-[10]`}>
                  <p className="hidden sm:inline-block !font-clash text-white text-[2rem]">
                    <motion.span
                      viewport={{ once: true }}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.4 }}
                    >
                      Who{" "}
                    </motion.span>{" "}
                    <motion.span
                      viewport={{ once: true }}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.6 }}
                    >
                      {" "}
                      we{" "}
                    </motion.span>{" "}
                    <motion.span
                      viewport={{ once: true }}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.8 }}
                    >
                      are
                    </motion.span>
                  </p>
                  <motion.p
                    viewport={{ once: true }}
                    className="text-[#888] text-left text-[.9rem] w-full sm:w-[80%] mx-auto sm:mx-0  mt-[6rem] sm:mt-0"
                    initial={{ opacity: 0, y: "10px" }}
                    whileInView={{ opacity: 1, y: "0" }}
                    transition={{ duration: 2, delay: 0.5 }}
                  >
                    Welcome to TITAN INVESTMENTS – a privately managed
                    investment pool specializing in algorithmic forex trading.
                    Participation is exclusively by personal invitation or
                    referral. Our mission is to deliver intelligent,
                    technology-driven asset management through proprietary
                    trading systems, offering qualified participants access to
                    our expertise in risk-managed, algorithmic strategies. Titan
                    Investments is not open to the general public. All
                    participation involves financial risk, and returns are not
                    guaranteed.
                  </motion.p>
                  <motion.div
                    className="w-full sm:w-[50%] ml-auto mr-[10rem]  flex justify-end"
                    initial={{
                      transform: "translateX(100px)",
                      opacity: 0,
                      filter: "blur(10px)",
                    }}
                    whileInView={{
                      transform: "translateX(0)",
                      opacity: 1,
                      filter: "blur(0)",
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 3, delay: 0.4 }}
                  >
                    <Link
                      href="/about-us"
                      className={` p-2 px-4  flex justify-center  rounded-lg bg-white shadow shadow-white items-center mx-auto sm:mx-0 ${Style.link}  gap-2`}
                    >
                      <motion.span
                        viewport={{ once: true }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 3, delay: 0.3 }}
                      >
                        Discover More
                      </motion.span>
                      <motion.span
                        viewport={{ once: true }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 3, delay: 0.3 }}
                      >
                        <FaAngleRight />
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className="w-full sm:w-[30%] sm:relative sm:h-full flex flex-col justify-center items-enter">
                <div className={`${Style.mobile_graph_title} relative top-[80%] relative z-[11]`}>
                  <p className="font-clash sm:hidden text-white text-[2rem]  text-center">
                    Who we are
                  </p>
                </div>
                <div className={`${Style.graph_image}`}></div>
              </div>
            </div>
          </div>
        </div>
        <div id="titan_opportunities" className={`${Style.titan_opportunities} w-full md:relative  md:top-[-30rem]`}>
          <motion.h4
            viewport={{ once: true }}
            className="text-white text-2xl  sm:text-4xl text-center w-[90%] sm:w-[50%] mx-auto"
            initial={{ opacity: 0, transform: "translateY(-30px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 3, delay: 0.3 }}
          >
            <span className="text-[#888]">
              <motion.span
                viewport={{ once: true }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Profitable
              </motion.span>
              <motion.span
                viewport={{ once: true }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {" "}
                opportunities in the
              </motion.span>
            </span>{" "}
            <motion.p
              viewport={{ once: true }}
              initial={{ opacity: 0, transform: "translateY(-10px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0)" }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              TITAN INVESTMENTS
            </motion.p>
          </motion.h4>
          <div className=" w-[90%] lg:w-[65%] xl:w-[80%] mt-20 mx-auto flex justify-center items-center flex-wrap gap-5">
            <motion.div
              viewport={{ once: true }}
              initial={{ transform: "translateX(80px)", opacity: 0 }}
              whileInView={{ transform: "translateX(0)", opacity: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: "linear" }}
              className={`${Style.titan_opportunities_box}  col-span-1 w-[80%] md:w-[48%] xl:w-[28rem] h-auto sm:min-h-60 sm:max-h-80 p-4 sm:p-2`}
              onMouseMove={handleMouseMove}
            >
              <span>01</span>
              <p className="text-white font-clash text-lg lg:text-xl mt-2">
                TITAN&apos;s Investor Profit Split{" "}
              </p>
              <span className="text-[.8rem]  text-[#888]">
                Choose a 2-year investment with TITAN and withdraw your profits
                on an 80/20 basis — keeping 80% of the gains, while 20% supports
                our continued performance and growth. Opt for a 4-year contract
                and enjoy an even more rewarding 85/15 model.
              </span>
            </motion.div>
            <motion.div
              viewport={{ once: true }}
              initial={{ transform: "translateX(80px)", opacity: 0 }}
              whileInView={{ transform: "translateX(0)", opacity: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: "linear" }}
              onMouseMove={handleMouseMove}
              className={`${Style.titan_opportunities_box} w-[80%] md:w-[48%] xl:w-[33rem]  h-auto sm:min-h-60 sm:max-h-80 p-4 sm:p-2 px-10`}
            >
              <span>02</span>
              <p className="text-white text-lg lg:text-xl mt-2">
                TITAN Loss Coverage Plan
              </p>
              <span className="text-[.8rem]  text-[#888]">
                Protecting You from Unexpected Market Downturns If your monthly
                trading loss exceeds 5%, only 5% will be deducted from your
                account. The remaining loss will be covered by TITAN and settled
                at the end of your contract period. TITAN stands by your
                capital—even when the market doesn’t.
              </span>
            </motion.div>

            <motion.div
              viewport={{ once: true }}
              onMouseMove={handleMouseMove}
              initial={{ transform: "translateX(80px)", opacity: 0 }}
              whileInView={{ transform: "translateX(0)", opacity: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: "linear" }}
              className={`${Style.titan_opportunities_box} w-[80%] md:w-[80%] xl:w-[33rem]  h-auto sm:min-h-60 sm:max-h-80 p-4 sm:p-2`}
            >
              <span>03</span>
              <p className="text-white text-lg lg:text-xl mt-2">
                TITAN Bonus Shield
              </p>
              <span className="text-[.8rem]  text-[#888]">
                A Reward for Your Patience, A Boost for Your Recovery After two
                consecutive months without profit, TITAN grants a 20% bonus on
                your capital to boost your trading power. If losses continue, an
                extra 20% is added each month—up to 100% by month six. The bonus
                is removed as soon as a profit is made.
              </span>
            </motion.div>

            <motion.div
              viewport={{ once: true }}
              onMouseMove={handleMouseMove}
              initial={{ transform: "translateX(80px)", opacity: 0 }}
              whileInView={{ transform: "translateX(0)", opacity: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: "linear" }}
              className={`${Style.titan_opportunities_box} relative overflow-hidden col-span-1 w-[80%] md:w-[80%] xl:w-[28rem] h-auto sm: h-auto sm:min-h-60 sm:max-h-80 p-4 sm:p-2 px-10`}
            >
              <span>04</span>
              <p className="text-white text-lg lg:text-xl mt-2">
                30% total Drawdown
              </p>
              <span className="text-[.8rem]  text-[#888]">
                Investing in financial markets always comes with both profits
                and risks. At Titan Investments, we understand these risks and
                inform our investors about them. To protect capital, if losses
                reach 30%, all operations will stop, and the remaining capital
                will be returned to the investors.
              </span>
              <div className="absolute top-0 left-0">
                <svg
                  width="600"
                  height="129"
                  viewBox="0 0 600 129"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.16"
                    x="550"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="550"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="550"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="495"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="495"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="495"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="440"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="440"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="440"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="385"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="385"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="385"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="330"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="330"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="330"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="275"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="275"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="275"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="220"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="220"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="220"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="165"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="165"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="165"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="110"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="110"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="110"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="55"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="55"
                    y="73"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    x="55"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    y="-37"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                  <rect
                    opacity="0.16"
                    y="18"
                    width="55"
                    height="55"
                    rx="16"
                    stroke="#1A68FF"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {isOpen && (
        <CustomModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registration Notice"
        >
          <p>
            Registration will be available soon. The website is still under
            development.
          </p>
        </CustomModal>
      )}
    </>
  );
}
