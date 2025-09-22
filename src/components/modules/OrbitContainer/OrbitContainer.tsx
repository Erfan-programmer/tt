import React from "react";
import Style from "@/styles/Home/page.module.css";
// import Pyramid from "../Pyramid/Pyramid";
import "./OrbitContainer.css";
import Image from "next/image";
import dynamic from "next/dynamic";
const Pyramid = dynamic(() => import("../Pyramid/Pyramid"), {
  ssr: false, // This ensures the component is never rendered on the server
});
export default function OrbitContainer() {
  return (
    <div
      className={`${Style.orbit_container} w-[90%] h-[40rem] rounded-full mt-[14rem] sm:mt-[10rem] flex relative bg-[#080A1D] `}
    >
      <div className="orbit_carousel hidden sm:block">
        <div className="orbit__item">
          <figure className="hidden sm:flex h-[100%] flex-col justify-center items-center">
            <span className="font-semibold font-clash  absolute top-[20px]">
              450%
            </span>{" "}
            <span
              className={` text-center block w-[80%] text-[.5rem] mt-[28px] `}
            >
              profit 2020-2024
            </span>
          </figure>
        </div>
        <div className="orbit__item">
          <svg
            className={Style.dot_star3}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1_488)" />
            <defs>
              <radialGradient
                id="paint0_radial_1_488"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12 12) rotate(90) scale(10)"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#1A68FF" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="orbit__item">
          <figure className="hidden sm:flex h-[100%] flex-col justify-center items-center">
            <span
              className={` text-center block  text-[1.2rem]`}
              style={{ fontSize: "1rem", width: "100%" }}
            >
              secure investment
            </span>
          </figure>
        </div>
        <div className="orbit__item">
          <svg
            className={Style.dot_star3}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1_488)" />
            <defs>
              <radialGradient
                id="paint0_radial_1_488"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12 12) rotate(90) scale(10)"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#1A68FF" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="orbit_carousel_small hidden sm:block">
        <div className="orbit__item">
          <figure className="hidden sm:flex h-[100%] flex-col justify-center items-center">
            <span className="font-semibold font-clash  absolute top-[20px]">
              100%
            </span>{" "}
            <span
              className={` text-center block w-[80%] text-[.5rem] mt-[28px] `}
            >
              Automated Trading
            </span>
          </figure>
        </div>
        <div className="orbit__item">
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="4" fill="#747580" />
          </svg>
        </div>
        <div className="orbit__item">
          <svg
            className={Style.dot_star3}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1_488)" />
            <defs>
              <radialGradient
                id="paint0_radial_1_488"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12 12) rotate(90) scale(10)"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#1A68FF" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="orbit__item">
          <figure className="hidden sm:flex h-[100%] flex-col justify-center items-center">
            <span className="font-semibold font-clash  absolute top-[20px]">
              $10M+
            </span>{" "}
            <span
              className={` text-center block w-[80%] text-[.5rem] mt-[28px] `}
            >
              Investments
            </span>
          </figure>
        </div>
        <div className="orbit__item">
          <svg
            className={Style.dot_star3}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1_488)" />
            <defs>
              <radialGradient
                id="paint0_radial_1_488"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12 12) rotate(90) scale(10)"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#1A68FF" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="orbit__item">
          <svg
            className={Style.dot_star3}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1_488)" />
            <defs>
              <radialGradient
                id="paint0_radial_1_488"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12 12) rotate(90) scale(10)"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#1A68FF" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="orbit__item">
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="4" fill="#747580" />
          </svg>
        </div>
      </div>

      <svg
        className="absolute top-[4%] left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]"
        style={{ zIndex: 2 }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1_488)" />
        <defs>
          <radialGradient
            id="paint0_radial_1_488"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(12 12) rotate(90) scale(10)"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#1A68FF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <svg
        className="w-[50vw] sm:w-[40vw] lg:w-[20vw]"
        width="424"
        height="272"
        viewBox="0 0 424 272"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M420.157 80.2242C429.241 114.127 414.296 151.12 382.599 183.545C350.911 215.962 302.543 243.737 245 259.155C187.457 274.574 131.681 274.704 88.03 262.475C44.3666 250.242 12.9274 225.678 3.84325 191.775C-5.24092 157.873 9.70413 120.88 41.4014 88.4543C73.0899 56.0379 121.458 28.2627 179.001 12.8442C236.544 -2.57442 292.319 -2.70445 335.971 9.5248C379.634 21.7575 411.073 46.3217 420.157 80.2242Z"
          stroke="url(#paint0_linear_1_472)"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1_472"
            x1="178.871"
            y1="12.3612"
            x2="245.129"
            y2="259.638"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#363848" stopOpacity="0" />
            <stop offset="1" stopColor="#363848" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className="w-[50vw] sm:w-[40vw]  lg:w-[20vw]"
        width="424"
        height="272"
        viewBox="0 0 424 272"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M420.157 191.775C411.073 225.678 379.634 250.242 335.971 262.475C292.319 274.704 236.544 274.574 179.001 259.156C121.458 243.737 73.09 215.962 41.4016 183.545C9.70427 151.12 -5.24078 114.127 3.84338 80.2245C12.9275 46.3219 44.3667 21.7577 88.0302 9.52506C131.681 -2.7042 187.457 -2.57416 245 12.8444C302.543 28.263 350.911 56.0382 382.599 88.4546C414.297 120.88 429.242 157.873 420.157 191.775Z"
          stroke="url(#paint0_linear_1_471)"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1_471"
            x1="245.129"
            y1="12.3615"
            x2="178.872"
            y2="259.638"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#363848" />
            <stop offset="1" stopColor="#363848" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        width="152"
        height="152"
        viewBox="0 0 152 152"
        className={`top-5`}
        fill="#888 "
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "color-dodge" }}
          filter="url(#filter0_f_1_477)"
          fill="#000"
        >
          <circle cx="76" cy="76" r="60" fill="url(#paint0_radial_1_477)" />
        </g>
        <defs>
          <filter
            id="filter0_f_1_477"
            x="0"
            y="0"
            width="152"
            height="152"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="8"
              result="effect1_foregroundBlur_1_477"
            />
          </filter>
          <radialGradient
            id="paint0_radial_1_477"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(76 76) rotate(90) scale(60)"
          >
            <stop stopColor="white" />
            <stop offset="0.333333" stopColor="#747580" />
            <stop offset="0.666667" stopColor="#747580" />
            <stop offset="1" stopColor="#080A1D" />
          </radialGradient>
        </defs>
      </svg>

      <Pyramid />

      {/* mobile part */}

      <figure className={`orbit_carousel_mobile sm:hidden`}>
        <div className="orbit__item">
          <Image
            width={32}
            height={32}
            src="/images/cost.png"
            alt=""
            className="w-[2rem]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50% , -50%)",
            }}
          />
        </div>
        <div className="orbit__item">
          <Image
            width={32}
            height={32}
            src="/images/cash.png"
            alt=""
            className="w-[2rem]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50% , -50%)",
            }}
          />
        </div>
        <div className="orbit__item">
          <Image
            width={32}
            height={32}
            src="/images/khazaneh.png"
            alt=""
            className="w-[2rem]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50% , -50%)",
            }}
          />
        </div>
        <div className="orbit__item">
          <Image
            width={32}
            height={32}
            alt=""
            quality={100}
            src="/images/space_man.png"
            className="w-[2rem]"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50% , -50%)",
            }}
          />
        </div>
      </figure>

      {/* mobile part */}
    </div>
  );
}
