export type TermKey = string;

export interface TermBenefit {
  icon: string;
  span: string;
}

export const termsOptionProfits: Record<TermKey, TermBenefit[]> = {
  1: [
    {
      icon: "check",
      span: "",
    },
    {
      icon: "time",
      span: "2. <p>Profit Split: <span class='text-white font-bold'>Investor 80% / Company 20%</span></p>",
    },
    {
      icon: "time",
      span: "3. <p>Titan Bonus Shield : <span class='text-white font-bold'>Included</span></p>",
    },
    {
      icon: "check",
      span: "4. <p>Referral & Commission Program – <span class='text-white font-bold'>Active</span></p>",
    },
  ],
  2: [
    {
      icon: "check",
      span: "1. <p>Profit Split: <span class='text-white font-bold'>Investor 80% / Company 20%</span></p>",
    },
    {
      icon: "check",
      span: "2. <p>Profit Split: <span class='text-white font-bold'>Investor 80% / Company 20%</span></p>",
    },
    {
      icon: "check",
      span: "3. <p>Titan Bonus Shield : <span class='text-white font-bold'>Included</span></p>",
    },
    {
      icon: "check",
      span: "4. <p>Referral & Commission Program – <span class='text-white font-bold'>Active</span></p>",
    },
  ],
  3: [
    {
      icon: "check",
      span: "1. <p>Profit Split: <span class='text-white font-bold'>Investor 80% / Company 20%</span></p>",
    },
    {
      icon: "check",
      span: "2. <p>Profit Split: <span class='text-white font-bold'>Investor 80% / Company 20%</span></p>",
    },
    {
      icon: "check",
      span: "3. <p>Titan Bonus Shield : <span class='text-white font-bold'>Included</span></p>",
    },
    {
      icon: "check",
      span: "4. <p>Referral & Commission Program – <span class='text-white font-bold'>Active</span></p>",
    },
    {
      icon: "check",
      span: "5. <p><span class='text-white font-bold'>Enhanced Benefits for Long-Term Partners</span></p>",
    },
  ],
};
