"use client";
import React from "react";
import "./EarthSvg.css";
import { motion } from "framer-motion";
export default function EarthSvg() {
  return (
    <motion.div
      className="earth-svg absolute left-[50%]  mx-auto flex justify-center top-[60%]"
      initial={{ opacity: 0, transform: "translateY(2rem)" }}
      animate={{ opacity: 1, transform: "translateY(0)" }}
      transition={{ delay: 4 }}
    >
      <svg
        className="absolute"
        style={{right:"0"}}
        width="98"
        height="83"
        viewBox="0 0 98 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <g
          style={{ mixBlendMode: "plus-lighter" }}
          filter="url(#filter0_f_1_375)"
        >
          <path
            d="M18.3185 27.5892C17.127 23.4124 16.1105 19.1861 15.7082 14.9248C15.4601 12.2976 15.4153 9.65006 15.4377 7M18.3185 27.5892C18.5994 28.5739 19.0206 29.5672 18.9045 30.5851M18.3185 27.5892L22.4848 21.0515L24.2652 16.7629L43.7727 7M18.3185 27.5892L18.6115 19.2276M18.9045 30.5851C18.4443 34.6181 13.2699 37.9115 10.7273 41.2652C8.87676 43.7061 7.91734 46.3168 7.42526 49M18.9045 30.5851L20.7045 24.8041L35.8371 14.9248L45 12L54 5.5M0.978569 82.6629C2.66012 79.2417 5.41252 76.2796 6.35901 72.6637C7.44399 68.5186 6.94499 64.1169 6.94499 59.9214C6.94499 56.3069 6.76712 52.5887 7.42526 49M20.7045 7L18.6115 19.2276M18.6115 19.2276L23.375 11.4021L32.8636 7M7.42526 49L12 44L18.9045 38.5L23.375 36L27 31.5L27.5 27.5892L32.5 24.8041L47 20.5M47 20.5L72 11.4021L96.5 1M47 20.5L54 14.9248L60 9L68.5 5.5L74.5 3"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_375"
            x="0.228516"
            y="0.249878"
            width="97.0215"
            height="83.1631"
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
              stdDeviation="0.25"
              result="effect1_foregroundBlur_1_375"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        style={{right:"0"}}
        width="101"
        height="83"
        viewBox="0 0 101 87"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "plus-lighter" }}
          filter="url(#filter0_f_1_374)"
        >
          <path
            d="M20.3185 29.5892C19.127 25.4124 18.1105 21.1861 17.7082 16.9248C17.4601 14.2976 17.4153 11.6501 17.4377 9M20.3185 29.5892C20.5994 30.5739 21.0206 31.5672 20.9045 32.5851M20.3185 29.5892L24.4848 23.0515L26.2652 18.7629L45.7727 9M20.3185 29.5892L20.6115 21.2276M20.9045 32.5851C20.4443 36.6181 15.2699 39.9115 12.7273 43.2652C10.8768 45.7061 9.91734 48.3168 9.42526 51M20.9045 32.5851L22.7045 26.8041L37.8371 16.9248L56 9M2.97857 84.6629C4.66012 81.2417 7.41252 78.2796 8.35901 74.6637C9.44399 70.5186 8.94499 66.1169 8.94499 61.9214C8.94499 58.3069 8.76712 54.5887 9.42526 51M22.7045 9L20.6115 21.2276M20.6115 21.2276L25.375 13.4021L34.8636 9M9.42526 51L14 46L20.9045 40.5L25.375 38L29 33.5L29.5 29.5892L34.5 26.8041L49 22.5M49 22.5L74 13.4021L98.5 3M49 22.5L56 16.9248L62 11L70.5 7.5L76.5 5"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_374"
            x="0.728516"
            y="0.749878"
            width="100.021"
            height="86.1631"
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
              stdDeviation="1"
              result="effect1_foregroundBlur_1_374"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        style={{left:"0"}}
        width="86"
        height="83"
        viewBox="0 0 86 83"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "plus-lighter" }}
          filter="url(#filter0_f_1_379)"
        >
          <path
            d="M80.5113 82.0363C81.4204 80.3102 82.3355 78.7365 83.1786 76.7163C84.2243 74.2104 84.155 72.3567 83.2644 69.6053C82.0229 65.7701 83.3916 61.5957 82.392 57.2097C82.1643 56.2105 81.9133 55.1336 81.6684 54M80.4422 42.5266C80.6804 38.2918 79.5232 34.906 80.5113 32.064M80.4422 42.5266L76.7143 28.8416L71.8 21.7832L53.9857 9.22177M80.4422 42.5266L70.5714 25.0409L50.5357 12.7705L39.5179 11.6352L28.5 6.5M80.4422 42.5266C80.2196 46.4834 80.9148 50.5106 81.6684 54M80.5113 32.064C81.6956 28.6575 82.9388 25.3865 84.2271 22.3107M80.5113 32.064L79.9349 25.0409L76.7143 20.1543L60.7429 9.22177M80.5113 32.064L80.4 20.1543L67.5 9.8381M84.2271 22.3107C84.5532 21.5322 85.5733 19.7496 84.9199 18.2853C84.1903 16.6499 83.3431 15.7277 82.6512 13.8697C82.0276 12.1949 81.5697 10.1378 81.1612 8M84.2271 22.3107L77.985 9.8381M81.6684 54L77.985 48.5L75 42.5266L69.5 38.5L65 36L63 32.064L55.5 26.5H52.5L48.5 25.0409L44.5 21.7832L36.5 16L21.5 9.8381L1.5 1"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_379"
            x="0.75"
            y="0.249878"
            width="85.1338"
            height="82.5365"
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
              stdDeviation="0.25"
              result="effect1_foregroundBlur_1_379"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="25"
        height="88"
        viewBox="0 0 25 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "plus-lighter" }}
          filter="url(#filter0_f_1_377)"
        >
          <path
            d="M19.0588 85.0003C18.5744 83.1084 16.9667 78.4002 18.0906 75.986C18.8305 74.3965 19.5754 72.9473 20.2616 71.087C21.1128 68.7793 21.0564 67.0723 20.3315 64.5385C19.321 61.0068 20.435 57.1627 19.6214 53.1237C18.8655 49.3712 17.7943 44.4298 18.0343 39.6023C18.2282 35.7025 17.2863 32.5846 18.0906 29.9674M18.0906 29.9674C19.0546 26.8305 20.0664 23.8182 21.1151 20.9858M18.0906 29.9674L17.6214 23.5L12 18.5L2.5 13.2126M21.1151 20.9858C21.3805 20.2689 22.2108 18.6273 21.679 17.2789C21.0851 15.7728 20.3955 14.9236 19.8324 13.2126C19.3248 11.6703 18.9521 9.77598 18.6196 7.80732C18.4928 7.05655 17.8451 3.16294 18.2503 2.5M21.1151 20.9858L16.0343 9.5"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_377"
            x="0.25"
            y="0.25"
            width="23.8535"
            height="87.0004"
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
              stdDeviation="1"
              result="effect1_foregroundBlur_1_377"
            />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute"
        style={{left:"0"}}
        width="86"
        height="83"
        viewBox="0 0 86 83"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "plus-lighter" }}
          filter="url(#filter0_f_1_378)"
        >
          <path
            d="M78.5113 80.0363C79.4204 78.3102 80.3355 76.7365 81.1786 74.7163C82.2243 72.2104 82.155 70.3567 81.2644 67.6053C80.0229 63.7701 81.3916 59.5957 80.392 55.2097C80.1643 54.2105 79.9133 53.1336 79.6684 52M78.4422 40.5266C78.6804 36.2918 77.5232 32.906 78.5113 30.064M78.4422 40.5266L74.7143 26.8416L69.8 19.7832L51.9857 7.22177M78.4422 40.5266L68.5714 23.0409L48.5357 10.7705L22.5 4.5M78.4422 40.5266C78.2196 44.4834 78.9148 48.5106 79.6684 52M78.5113 30.064C79.6956 26.6575 80.9388 23.3865 82.2271 20.3107M78.5113 30.064L77.9349 23.0409L74.7143 18.1543L58.7429 7.22177M78.5113 30.064L78.4 18.1543L65.5 7.8381M82.2271 20.3107C82.5532 19.5322 83.5733 17.7496 82.9199 16.2853C82.1903 14.6499 81.3431 13.7277 80.6512 11.8697C80.0276 10.1949 79.5697 8.13779 79.1612 6M82.2271 20.3107L75.985 7.8381M79.6684 52L75.985 46.5L73 40.5266L67.5 36.5L63 34L61 30.064L53.5 24.5H50.5L46.5 23.0409L42.5 19.7832L34.5 14L19.5 7.8381L2.5 2.5"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_378"
            x="0.25"
            y="0.249878"
            width="85.1338"
            height="82.0365"
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
              stdDeviation="1"
              result="effect1_foregroundBlur_1_378"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="32"
        height="53"
        viewBox="0 0 32 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_1_373)">
          <rect x="12" y="12.5" width="8" height="28" fill="white" />
        </g>
        <defs>
          <filter
            id="filter0_f_1_373"
            x="0"
            y="0.5"
            width="32"
            height="52"
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
              stdDeviation="6"
              result="effect1_foregroundBlur_1_373"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="234"
        height="198"
        viewBox="0 0 234 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g style={{ mixBlendMode: "overlay" }} filter="url(#filter0_f_1_372)">
          <path
            d="M115.402 48.5V61.3765L114.071 64.998L113.272 67.8147L107.946 120.61L48 149.5H117H186L126.054 120.61L120.728 67.8147L119.929 64.998L118.598 61.3765V48.5H117H115.402Z"
            fill="#1A68FF"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_372"
            x="0"
            y="0.5"
            width="234"
            height="197"
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
              stdDeviation="24"
              result="effect1_foregroundBlur_1_372"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="244"
        height="198"
        viewBox="0 0 244 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g style={{ mixBlendMode: "overlay" }} filter="url(#filter0_f_1_371)">
          <path
            d="M115.402 48.5V61.3765L114.071 64.998L113.272 67.8147L107.946 120.61L48 149.5H117H196L126.054 120.61L120.728 67.8147L119.929 64.998L118.598 61.3765V48.5H117H115.402Z"
            fill="#1A68FF"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_371"
            x="0"
            y="0.5"
            width="244"
            height="197"
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
              stdDeviation="24"
              result="effect1_foregroundBlur_1_371"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="294"
        height="198"
        viewBox="0 0 294 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g style={{ mixBlendMode: "overlay" }} filter="url(#filter0_f_1_370)">
          <path
            d="M145.402 48.5V61.3765L144.071 64.998L143.272 67.8147L137.946 120.61L48 149.5H147H246L156.054 120.61L150.728 67.8147L149.929 64.998L148.598 61.3765V48.5H147H145.402Z"
            fill="#11398E"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_370"
            x="0"
            y="0.5"
            width="294"
            height="197"
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
              stdDeviation="24"
              result="effect1_foregroundBlur_1_370"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="352"
        height="146"
        viewBox="0 0 352 146"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "color-dodge" }}
          filter="url(#filter0_f_1_369)"
        >
          <path
            d="M171.714 16V31.8505L168.143 36.3084L166 39.7757L164.571 71.8481C160.119 99.4615 136.364 119.814 108.395 119.979L16 120.522L96 122.287L176 130L256 122.287L336 120.522L243.605 119.979C215.636 119.814 191.881 99.4615 187.429 71.8481L186 39.7757L183.857 36.3084L180.286 31.8505V16H176H171.714Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_369"
            x="0"
            y="0"
            width="352"
            height="146"
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
              result="effect1_foregroundBlur_1_369"
            />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute"
        width="412"
        height="155"
        viewBox="0 0 412 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{ mixBlendMode: "color-dodge" }}
          filter="url(#filter0_f_1_368)"
        >
          <path
            d="M200.857 24.5V40.5627L196.571 45.0804L194 48.5941L192.286 81.0961L190.905 84.4512C182.29 105.39 162.621 119.696 140.047 121.442L24 130.422H206H388L271.953 121.442C249.379 119.696 229.71 105.39 221.095 84.4512L219.714 81.0961L218 48.5941L215.429 45.0804L211.143 40.5627V24.5H206H200.857Z"
            fill="#1A68FF"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1_368"
            x="0"
            y="0.5"
            width="412"
            height="153.922"
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
              stdDeviation="12"
              result="effect1_foregroundBlur_1_368"
            />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}
