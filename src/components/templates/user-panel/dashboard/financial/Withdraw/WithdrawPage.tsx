import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import WithdrawTransaction from "./WithdrawTransaction";

export default function FinancialWithdraw() {
  return (
    <>
      <TitanNotice
        title="Withdrawal Notice"
        description={` Withdrawals Policy Notice
    <ul style="list-style: disc; ">
            <li>
             Withdrawals are processed from the 1st to the 5th of each month.
            </li>
            <li>
            The minimum withdrawal amount is $13.
            </li>
            <li>
            The company fee percentage varies depending on the investment contract you agreed to at the time of deposit. This fee may range from 15% to 50%, based on the type and terms of your investment.
            </li>
            <li>
            Blockchain transaction fees are the responsibility of the investor and will be deducted from the withdrawal amount.
            Withdrawals are processed and transferred within 10 business days.
            </li>
          </ul>
        <p class="withdraw-notice-important-note">
        Important Note: <br/>
        Please ensure that your wallet address and blockchain network are entered accurately when submitting a withdrawal request. The investor bears full responsibility for providing correct information. In case of errors in the wallet address or network type, the company cannot trace or recover the funds.</p>`}
      />
      <WithdrawTransaction />
    </>
  );
}
