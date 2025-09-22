import React, { useState } from "react";
import "./ImageMagnifire.css";
import Image from "next/image";

export default function ImageMagnifire({ imageUrl }: { imageUrl: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
    setCursorPosition({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  return (
    <div
      className="img-magnifire-container rounded-md overflow-hidden"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseHover}
      style={{ position: "relative", display: "inline-block" }}
    >
      <Image
        width={400}
        height={400}
        src={imageUrl}
        alt=""
        className="magnifier-img"
        style={{ display: "block" }}
      />

      {showMagnifier && (
        <div
          className="magnifier-glass"
          style={{
            position: "absolute",
            left: cursorPosition.x - 75,
            top: cursorPosition.y - 75,
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "3px solid #000",
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "800%",
            backgroundPosition: `${position.x}% ${position.y}%`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
