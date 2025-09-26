"use client";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import TeamContractsContent from "./TeamContractsContent";
import { useAuth } from "@/contextApi/AuthContext";

export default function ContractsPage() {
  const { user } = useAuth();

  return (
    <>
      <TitanNotice
        title="Notice"
        description="Please select one of the following options based on your decision to either extend or not extend your contract:"
      />
      {user?.plan?.type === "contract_free" && <TeamContractsContent />}
    </>
  );
}
