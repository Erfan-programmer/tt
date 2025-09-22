"use client";

import { useState } from "react";
import Send2FaCode, { TwoFaData } from "@/components/modules/UserPanel/dashboard/account/MyProfile/Send2FaCode";
import Enable2FaCode from "@/components/modules/UserPanel/dashboard/account/MyProfile/Enable2FaCode";

export default function TwoFaCode() {
  const [twoFaData, setTwoFaData] = useState<TwoFaData | null>(null);
  const [email, setEmail] = useState(""); 

  const handleSetTwoFaData = (data: TwoFaData) => {
    setTwoFaData(data);
    console.log("handleSetTwoFaData=>" , data)
  };

  const handleBackToStep1 = () => {
    setTwoFaData(null);
    setEmail("");
  };

  const handleSetEmail = (userEmail: string) => {
    setEmail(userEmail);
  };
 console.log("twoFaData =>" , twoFaData)
  const renderComponent = () => {
  
    if (twoFaData) {
      return (
        <Enable2FaCode
          secretKey={twoFaData.secretKey}
          qrCodeUrl={twoFaData.qrCodeUrl}
          onBackToStep1={handleBackToStep1}
          userEmail={email}
        />
      );
    }
    return (
      <Send2FaCode
        handleResetToken={handleSetTwoFaData}
        handleEmail={handleSetEmail}
        handleSetSecret={() => {}}
      />
    );
  };

  return <>{renderComponent()}</>;
}
