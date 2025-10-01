import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import TWalletTab from "./TWalletTab";
import { WalletStatementProvider } from "@/contextApi/WalletStatementContext";

export default function TWalletActionPage() {
  return (
    <>
      <TitanNotice
        title="Notice"
        description="You can transfer the profits and commissions you have received to your T-Wallet. Additionally, you can transfer funds from your T-Wallet to other members of your group. If you have not activated two-factor authentication for your account, you will not be able to perform transactions. The amount transferred from ROI and commissions to T-Wallet will be non-withdrawable. It can only be used for transferring to other investors or for registering a new account. Please note that a 20% company fee will be deducted during the transfer from ROI and commissions to T-Wallet."
      />
      <WalletStatementProvider>
        <TWalletTab />
      </WalletStatementProvider>
    </>
  );
}
