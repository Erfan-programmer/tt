"use client";
import React, { useEffect, useState, useMemo } from "react";

const BackgroundPattern: React.FC = () => {
  const patternCount = 3;

  const fixedPositions = useMemo(() => [
    { x: 20, y: 20, rotation: 45 },
    { x: 80, y: 30, rotation: 120 },
    { x: 50, y: 70, rotation: 240 },
    { x: 90, y: 60, rotation: 270 },
    { x: 40, y: 180, rotation: 270 },
  ], []);

  const [patterns, setPatterns] = useState(
    Array(patternCount)
      .fill(null)
      .map(() => ({
        isVisible: false,
      }))
  );

  useEffect(() => {
    const showPattern = (index: number) => {
      setPatterns(prevPatterns => {
        const newPatterns = [...prevPatterns];
        newPatterns[index] = { isVisible: true };
        return newPatterns;
      });

      setTimeout(() => {
        setPatterns(prevPatterns => {
          const newPatterns = [...prevPatterns];
          newPatterns[index] = { isVisible: false };
          return newPatterns;
        });
      }, 2000);
    };

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    fixedPositions.forEach((_, index) => {
      const startDelay = index * 1000;
      const intervalTime = 5000;

      const timeoutId = setTimeout(() => {
        showPattern(index);
        const intervalId = setInterval(() => showPattern(index), intervalTime);
        intervals.push(intervalId);
      }, startDelay);

      timeouts.push(timeoutId);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      intervals.forEach((i) => clearInterval(i));
    };
  }, [fixedPositions]);

  return (
    <>
      {patterns.map((pattern, index) => (
        <div
          key={index}
          className="absolute transition-all duration-1000 ease-in-out"
          style={{
            left: `${fixedPositions[index].x}%`,
            top: `${fixedPositions[index].y}%`,
            transform: `rotate(${fixedPositions[index].rotation}deg)`,
            opacity: pattern.isVisible ? 0.8 : 0,
            visibility: pattern.isVisible ? "visible" : "hidden",
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 120 120"
            fill="none"
            className="bg-transparent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g style={{ mixBlendMode: "lighten" }} opacity="0.5">
              <rect
                width="96"
                height="96"
                transform="translate(26.998 0.679688) rotate(15.911)"
                fill="none"
              />
              <ellipse
                cx="60.0007"
                cy="59.9995"
                rx="48"
                ry="5"
                transform="rotate(-164.089 60.0007 59.9995)"
                fill="url(#paint0_radial_3732_14792)"
              />
              <ellipse
                cx="60.0005"
                cy="59.9997"
                rx="48"
                ry="4.99999"
                transform="rotate(-74.089 60.0005 59.9997)"
                fill="url(#paint1_radial_3732_14792)"
              />
            </g>
            <defs>
              <radialGradient
                id="paint0_radial_3732_14792"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(60.0007 59.9995) rotate(90) scale(5 48)"
              >
                <stop offset="0.109375" stopColor="white" className="stop1"/>
                <stop offset="1" stopColor="white" stopOpacity="0" className="stop1"/>
              </radialGradient>
              <radialGradient
                id="paint1_radial_3732_14792"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(60.0005 59.9997) rotate(90) scale(4.99999 48)"
              >
                <stop offset="0.109375" stopColor="white" className="stop1"/>
                <stop offset="1" stopColor="white" stopOpacity="0" className="stop1"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}
    </>
  );
};

export default BackgroundPattern;
