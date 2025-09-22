import { VerifyProvider } from "@/contextApi/TitanContext";
import Reset2FAConfirm from "@/pages/Reset2FaCodeConfirm";
import React from "react";

export default function page() {
  return (
    <VerifyProvider>
      <Reset2FAConfirm />
    </VerifyProvider>
  );
}
