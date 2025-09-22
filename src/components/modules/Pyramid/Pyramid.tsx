"use client";

import React from "react";
import Lottie from "lottie-react";

import "./Pyramid.css";
import imagePyramid from "@/../public/animations/pyramid.json";

export default function Pyramid() {
  return (
    <div className="pyramid-container">
      <Lottie
        animationData={imagePyramid}
        loop
        style={{ width: 400, height: 400 }}
      />
    </div>
  );
}
