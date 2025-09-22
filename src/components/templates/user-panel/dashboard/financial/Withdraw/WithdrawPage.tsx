import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import WithdrawTransaction from "./WithdrawTransaction";

export default function FinancialWithdraw() {
  return (
    <>
      <TitanNotice
        title="Withdrawal Notice"
        description={`Withdrawals are processed from the 1st to the 5th of each month.
        The minimum withdrawal amount is $13.
        20% company fee will be deducted from each withdrawal amount.
        Withdrawals will be processed and transferred within 10 business days.
        Important Note: <br />
        <p class="withdraw-notice-important-note">
        Please ensure the accuracy of your wallet address and the blockchain network type when requesting a withdrawal. The responsibility for providing the correct wallet address and network lies entirely with the investor. If an error is made in the wallet address or network selection, the company will not be able to trace or recover the funds.</p>`}
      />
      <WithdrawTransaction />   
    </>
  );
}
