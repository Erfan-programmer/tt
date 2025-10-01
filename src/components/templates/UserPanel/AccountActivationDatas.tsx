type ActivationPlans = Record<number, (userName: string) => string>;

interface AccountActivationDatasType {
  investor: ActivationPlans;
  contract_free: ActivationPlans;
  marketer: ActivationPlans;
}

export const AccountActivationDatas: AccountActivationDatasType = {
  investor: {
    1: (userName: string) => {
      return `Dear ${userName}, Thank you for choosing Titan Investments for your financial journey. Before proceeding with your investment and activating your account, please read the following terms and risk disclosures carefully. You may only proceed with your deposit and investment if you fully agree to these terms.
        ⚠️ Risk Disclosure
        Investing in financial markets always involves risk and may result in partial or total loss of your capital. Please only invest funds that you can afford to lose without affecting your financial or personal well-being. By accepting this agreement, you acknowledge the risks involved and take full responsibility for your investment, maintaining a long-term and informed perspective with Titan Investments.
        📜 Investment Terms and Conditions
        1. Profit and Loss Awareness <br /> By accepting this agreement, you acknowledge that financial market activity may result in profit or loss, and agree to remain patient and understanding during loss periods.
        2. Automated Trading Systems <br/> Your capital will be entrusted to Titan's fully automated trading systems for a period of one year under the “Investor” contract.
        <ul style="list-style-type: disc">
        <li>Capital cannot be withdrawn during this period.</li>
        <li>Early withdrawal will be considered a unilateral termination of the agreement by you.</li>
        <li>A 10% penalty on the original capital will be applied.</li>
        <li>All previously withdrawn profits will be deducted from your principal, and the remaining balance returned.</li>
        </ul>
        3. Profit Withdrawal Profit withdrawal is only permitted between the 1st and 5th of each calendar month.
        <ul>
        <li>70% of profit goes to the investor</li>
        <li>30% is retained by the company</li>
        </ul>
        4. No Bonus, Shield, or Coverage Plans <br/> The 1-year plan does not include Titan Bonus, Titan Shield, or Coverage Plans.
        5. No Annual Sales Rewards <br/> Investors in the 1-year plan do not qualify for annual sales prizes even if they engage in network marketing. Only referral bonuses and commissions apply.
        6. No Fixed Profit Guarantee <br/> Titan Investments makes no commitment to fixed returns in case of unforeseen global events such as economic crises, pandemics, wars, or other force majeure situations.
        7. Capital Protection Priority <br/> In case of a 30% loss across total invested capital, all trading operations will be halted and 70% of remaining funds will be returned to investors.
        8. Account Type Is Non-Changeable <br/> Switching from the “Investor” account to other types (Marketer or Contract-Free) is not allowed.
        9. Activation Deadline <br/> You have 30 days from registration to activate your account by making a deposit. Failure to do so will result in permanent deletion of your registration data.
        `;
    },
    2: (userName: string) =>
      `Dear ${userName}, Thank you for choosing Titan Investments for your financial journey. Before proceeding with your investment and activating your account, please read the following terms and risk disclosures carefully. You may only proceed with your deposit and investment if you fully agree to these terms.
        ⚠️ Risk Disclosure
        Investing in financial markets always involves risk and may result in partial or total loss of your capital. Please only invest funds that you can afford to lose without affecting your financial or personal well-being. By accepting this agreement, you acknowledge the risks involved and take full responsibility for your investment, maintaining a long-term and informed perspective with Titan Investments.
        📜 Investment Terms and Conditions
        1. Profit and Loss Awareness <br /> By accepting this agreement, you acknowledge that financial market activity may result in profit or loss, and agree to remain patient and understanding during loss periods.
        2. Automated Trading Systems <br/> Your capital will be entrusted to Titan's fully automated trading systems for a period of one year under the “Investor” contract.
        <ul style=list-style-type: disc">
        <li>Capital cannot be withdrawn during this period.</li>
        <li>Early withdrawal will be considered a unilateral termination of the agreement by you.</li>
        <li>A 10% penalty on the original capital will be applied.</li>
        <li>All previously withdrawn profits will be deducted from your principal, and the remaining balance returned.</li>
        </ul>3. Profit Withdrawal Profit withdrawal is only permitted between the 1st and 5th of each calendar month.
        <ul>
        <li>80% of profit goes to the investor</li>
        <li>20% is retained by the company</li>
        </ul>
        4. No Bonus, Shield, or Coverage Plans <br/> The 2-year plan does not include Titan Bonus, Titan Shield, or Coverage Plans.
        5. No Annual Sales Rewards <br/> Investors in the 2-year plan do not qualify for annual sales prizes even if they engage in network marketing. Only referral bonuses and commissions apply.
        6. No Fixed Profit Guarantee <br/> Titan Investments makes no commitment to fixed returns in case of unforeseen global events such as economic crises, pandemics, wars, or other force majeure situations.
        7. Capital Protection Priority <br/> In case of a 30% loss across total invested capital, all trading operations will be halted and 70% of remaining funds will be returned to investors.
        8. Account Type Is Non-Changeable <br/> Switching from the “Investor” account to other types (Marketer or Contract-Free) is not allowed.
        9. Activation Deadline <br/> You have 30 days from registration to activate your account by making a deposit. Failure to do so will result in permanent deletion of your registration data.
        `,
    3: (userName: string) =>
      ` Dear ${userName}, Thank you for choosing Titan Investments for your financial journey. Before proceeding with your investment and activating your account, please read the following terms and risk disclosures carefully. You may only proceed with your deposit and investment if you fully agree to these terms.
        ⚠️ Risk Disclosure
        Investing in financial markets always involves risk and may result in partial or total loss of your capital. Please only invest funds that you can afford to lose without affecting your financial or personal well-being. By accepting this agreement, you acknowledge the risks involved and take full responsibility for your investment, maintaining a long-term and informed perspective with Titan Investments.
        📜 Investment Terms and Conditions
        1. Profit and Loss Awareness <br /> By accepting this agreement, you acknowledge that financial market activity may result in profit or loss, and agree to remain patient and understanding during loss periods.
        2. Automated Trading Systems <br/> Your capital will be entrusted to Titan's fully automated trading systems for a period of one year under the “Investor” contract.
        <ul style=list-style-type: disc">
        <li>Capital cannot be withdrawn during this period.
        </li>
        <li>Early withdrawal will be considered a unilateral termination of the agreement by you.</li>
        <li>A 10% penalty on the original capital will be applied.</li>
        <li>All previously withdrawn profits will be deducted from your principal, and the remaining balance returned.</li>
        </ul>
        3. Profit Withdrawal Profit withdrawal is only permitted between the 1st and 5th of each calendar month.
        <ul>
        <li>85% of profit goes to the investor</li>
        <li>15% is retained by the company</li>
        </ul>
        4. No Bonus, Shield, or Coverage Plans <br/> The 4-year plan does not include Titan Bonus, Titan Shield, or Coverage Plans.
        5. No Annual Sales Rewards <br/> Investors in the 4-year plan do not qualify for annual sales prizes even if they engage in network marketing. Only referral bonuses and commissions apply.
        6. No Fixed Profit Guarantee <br/> Titan Investments makes no commitment to fixed returns in case of unforeseen global events such as economic crises, pandemics, wars, or other force majeure situations.
        7. Capital Protection Priority <br/> In case of a 30% loss across total invested capital, all trading operations will be halted and 70% of remaining funds will be returned to investors.
        8. Account Type Is Non-Changeable <br/> Switching from the “Investor” account to other types (Marketer or Contract-Free) is not allowed.
        9. Activation Deadline <br/> You have 30 days from registration to activate your account by making a deposit. Failure to do so will result in permanent deletion of your registration data.
        `,
  },
  contract_free: {
    1: (userName: string) => {
      return `Dear ${userName}, Thank you for choosing Titan Investments and opting for a Contract-Free account. Before engaging in any financial activity, please carefully read the terms and risk disclosures below. You may only proceed if you fully accept all conditions.
    ⚠️ Risk Disclosure
    Participating in financial markets, especially through independent and contract-free options, involves high risk and may result in full or partial capital loss. Only invest what you can afford to lose without impacting your lifestyle or financial obligations. By accepting this agreement, you acknowledge the risks and take full personal responsibility for your investment.
    📜 Terms and Conditions
    1. Account Nature <br/> The Contract-Free account offers flexibility without long-term commitments or locked capital, but does not include benefits tied to standard investment contracts.
    2. Profit Sharing <br/> Profit withdrawal is only allowed between the 1st and 5th of each month.
    <ul>
     <li>50% of profit goes to the investor</li>
     <li>50% is retained by the company</li>
    </ul>
    3.No Bonuses or Protection Plans <br/>
    Contract-Free users do not qualify for:
    <ul>
    <li>Titan Bonus
    </li>
    <li>Titan Shield</li>
    <li>Coverage Plans</li>
    </ul>
    4.Referral and Commission Rules:
    <ul>
    <li>No referral bonus is granted for bringing in new users.</li>
    <li>Only direct commissions from referred users’ activity are earned.</li>
    <li>Annual sales rewards are not available in this account type.</li>
    </ul>
    5. No Fixed Profit Guarantee <br/>
    Titan Investments does not guarantee fixed income and cannot be held accountable for market disruptions caused by global events beyond its control.<br/>
    6. Account Type Is Non-Changeable <br/> After activation, you cannot switch from the Contract-Free account to other types (Investor or Marketer).<br/>
    7. Capital Protection Priority <br/> If the company suffers a 30% total capital loss, all trading operations will cease and 70% of remaining funds will be refunded to investors.
    8. Activation Deadline <br/> Users must activate their account by depositing within 30 days of registration. Failure to do so will result in permanent deletion of registration data.
`;
    },
  },
  marketer: {
    1: (userName: string) => {
      return `Dear ${userName},
      Thank you for choosing to join Titan Investments as a Marketer. This account is designed for individuals who prefer not to invest directly, but wish to build their own business by introducing Titan Investments to others.
      Before proceeding with your registration and activating your account, please carefully read the following terms and conditions. By activating your Marketer account, you confirm your full agreement with these rules.
      ⚠️ Risk & Responsibility Disclosure
      Becoming a Marketer requires responsibility and commitment. Please note that:
      <ul>
      <li>The initial start-up fee determined by the company is non-refundable.</li>
      <li>No profit is generated from this initial fee.</li>
      <li>Success as a Marketer depends on your personal effort, consistency, and compliance with company policies.</li>
      </ul>
      📜 Marketer Terms and Conditions
      Contract Duration
      <ul>
      <li>The Marketer account is valid for a fixed period of 2 years.</li>
      <li>During this period, the account type cannot be changed to Investor or Contract-Free.</li>
      </ul>
      Commissions & Profit Sharing
      <ul>
       <li>Marketers earn commissions from their direct and indirect referrals.</li>
       <li>Withdrawal of commissions follows the ratio: 70% to the Marketer, 30% retained by the company.</li>
       <li>Additional rewards and bonuses may be granted through team building and attracting new investors.</li>
      </ul>
      Non-Refundable Start-Up Fee
      <ul>
      <li>The registration/start-up fee is a one-time cost and cannot be refunded under any circumstances.</li>
      </ul>
      Marketing Rules & Compliance
      <ul>
      <li>Marketers must strictly adhere to Titan Investments’ official guidelines.</li>
      <li>It is strictly forbidden to make false promises, misrepresent returns, or pressure potential investors.</li>
      <li><span style="color:#ff6060"}>In case of proven misconduct, the Marketer account will be permanently terminated and the individual will not be allowed to re-register under Titan Investments in the future.</span></li>
      </ul>
      Possible Limitations
      <ul>
      <li>Some features and privileges may be more limited compared to Investor accounts.</li>
      </ul>
      Growth Opportunity
      By respecting the company’s framework and working consistently, Marketers have the chance to achieve financial success, enjoy commissions and rewards, and work towards financial freedom with the support of Titan Investments.
      Activation Deadline
       <ul>
       <li>You have 30 days from registration to activate your account by completing the required start-up fee payment. Failure to do so will result in permanent deletion of your registration data.</li>
       </ul>`;
    },
  },
};
