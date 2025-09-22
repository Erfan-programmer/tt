import TitanNotice from "../TitanNotice/TitanNotice";
import TeamCommissionDetailsContent from "./TeamCommissionDetailsContent";

export default function CommissionDetailPage() {
  return (
    <>
      <TitanNotice
        title="Notice"
        description="When the Titan trading system makes a profit and pays dividends to all investors, you will receive a commission from the profits of the people you have brought into the company. For those who invest in Titan Investments directly through you, you will receive 5% of their profits. For those who join the company through your team, you will receive commissions of 4%, 3%, 2%, and 1% of their profits respectively"
      />
      <TeamCommissionDetailsContent />
    </>
  );
}
