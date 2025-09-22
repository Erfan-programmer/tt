"use client"
import React, { useState } from "react";

interface LineTitleProps {
  title: string;
  onClick: () => void;
}

export default function LineTitle({ title, onClick }: LineTitleProps) {
  const [result ,  setResult] = useState(false)
  const handleClick = () => {
  onClick()
  setResult(!result)

  };

  return (
    <div
      className={`flex items-center my-8 gap-2 w-full cursor-pointer ${!result ? "text-white" : "text-[#6c6f78]"}`}
      onClick={handleClick}
    >
      <span className={`flex-1 text-nowrap select-none`}>
        {title}
      </span>
      <div className="h-[1px] w-full bg-[#383C47]"></div>
    </div>
  );
}
