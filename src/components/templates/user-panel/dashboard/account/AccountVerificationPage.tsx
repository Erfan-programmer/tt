"use client"
import { VerificationListProvider } from "@/contextApi/VerificationListContext";
import VerificationContent from "./VerificationContent";

export default function AccountVerificationPage() {
  return (
    <VerificationListProvider>
      <VerificationContent />
    </VerificationListProvider>
  );
}
