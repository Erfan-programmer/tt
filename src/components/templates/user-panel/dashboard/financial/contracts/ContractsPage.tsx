import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import TeamContractsContent from "./TeamContractsContent";

export default function ContractsPage() {


  
  return (
    <>
      <TitanNotice
        title="Notice"
        description="Please select one of the following options based on your decision to either extend or not extend your contract:"
      />

      <TeamContractsContent />
    </>
  );
}
