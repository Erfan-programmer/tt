import React from 'react';

interface ActiveIndicatorProps {
  className?: string;
}

const ActiveIndicator: React.FC<ActiveIndicatorProps> = ({ className = "" }) => {
  return (
    <svg 
      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[116px] h-[30px]  ${className}`} 
      viewBox="0 0 116 39" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_6254_22461)">
        <path 
          d="M94.1057 41.2885C91.1703 35.3316 86.1539 30.2247 79.691 26.6135C73.228 23.0024 65.6087 21.0492 57.7965 21.0009C49.9844 20.9527 42.3303 22.8115 35.8021 26.3425C29.274 29.8734 24.165 34.9178 21.1213 40.8377L42.001 48.1053C43.2978 45.5831 45.4744 43.434 48.2557 41.9296C51.037 40.4253 54.298 39.6333 57.6263 39.6539C60.9547 39.6744 64.2008 40.5066 66.9544 42.0451C69.7079 43.5836 71.8451 45.7594 73.0957 48.2974L94.1057 41.2885Z" 
          fill="#60A5FA" 
          fillOpacity="0.9"
        />
      </g>
      <defs>
        <filter 
          id="filter0_f_6254_22461" 
          x="0.121094" 
          y="0" 
          width="114.984" 
          height="69.2969" 
          filterUnits="userSpaceOnUse" 
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="8" result="effect1_foregroundBlur_6254_22461"/>
          <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#1A68FF" floodOpacity="0.8"/>
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#1A68FF" floodOpacity="0.6"/>
          <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#1E40AF" floodOpacity="0.4"/>
          <feDropShadow dx="0" dy="6" stdDeviation="15" floodColor="#1A68FF" floodOpacity="0.2"/>
        </filter>
      </defs>
    </svg>
  );
};

export default ActiveIndicator; 