"use client";

import React from "react";

import Footer from "@/components/templates/Footer/Footer";
import BenefitsSlides from "@/components/templates/BenefitsSlides/BenefitsSlides";
import LatestNews from "@/components/templates/LatestNews/LatestNews";
import UserQuestions from "@/components/templates/UserQuestions/UserQuestions";
import LastMainSection from "@/components/templates/LastMainSection/LastMainSection";
import EarthChartContainer from "@/components/templates/earthPage/EartchchartContainer";
import MainBodyBio from "@/components/templates/earthPage/MainBodyBio";
import WealthyInvest from "@/components/templates/WealthyInvest";
import MainImageContainer from "@/components/templates/earthPage/MainImageContainer";

const TitanAlgotrade: React.FC = () => {
  return (
    <div className="main-body h-auto flex flex-col justify-center items-center relative">
      <MainImageContainer />
      <MainBodyBio />
      <EarthChartContainer /> 
      <WealthyInvest />
      <BenefitsSlides />
      <LatestNews />
      <UserQuestions />
      <LastMainSection />  
      <Footer /> 
    </div>
  );
};

export default TitanAlgotrade;
