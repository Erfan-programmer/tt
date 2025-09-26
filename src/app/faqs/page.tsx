"use client";
import React from "react";
import Style from "@/styles/AboutUs/page.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter()
  return (
    <div className="about-us w-full my-[10rem] mb-[15rem] pb-10 ">
      <div
        className={`${Style.about_us_wrapper} flex flex-col justify-center items-center gap-5`}
      >
        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2>What is Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              Titan Investments is a financial advisory and investment company
              that currently trades in the forex market using its powerful
              algorithmic trading systems. The company focuses on growing its
              clients&apos; capital through advanced trading strategies.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>
            Is Titan Investments always profitable with algorithmic trading?
          </h2>
          <div className={Style.about_us_description}>
            <span>
              Certainly not! Losses are an inherent part of the market. Even the
              world&apos;s largest banks and major companies experience losses
              in this market and will continue to do so in the future. Titan
              Investments is no exception. There may be months when Titan
              Investments is unable to generate profits or even incurs losses.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What is the potential profit at Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              Titan Investments commits to growing its investors&apos; capital
              by 40% to 200% over the course of one year.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What is the Forex market?</h2>
          <div className={Style.about_us_description}>
            <span>
              The Forex market, or the foreign exchange market, was established
              in the 1970s and is currently the largest and most liquid
              financial market in the world, where various international
              currencies are bought and sold. This market has a daily trading
              volume of trillions of dollars and operates 24 hours a day, five
              days a week. Below, a comprehensive and detailed explanation of
              the Forex market is provided.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What are algorithmic trading systems?</h2>
          <div className={Style.about_us_description}>
            <span>
              Algorithmic trading systems, or automated trading, refer to
              methods where computer algorithms are used to execute trades in
              financial markets. Instead of relying on human decisions, these
              systems analyze data and execute trades using complex mathematical
              algorithms and computer programs. Algorithmic trading can carry
              out trades with high speed and precision. These instructions
              typically include conditions for buying or selling, trade volume,
              timing, and risk management criteria.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What are the characteristics of algorithmic trading systems?</h2>
          <div className={`list-disc ${Style.about_us_description} `}>
            Speed and Efficiency: Algorithms can execute trades in a fraction of
            a second, which is crucial for taking advantage of market
            opportunities. Reduced Human Error: Since trades are executed based
            on pre-defined instructions, the errors caused by human decisions
            are minimized. Diversity and Range: The ability to analyze and trade
            across multiple markets and assets simultaneously. Improved Risk
            Management: Algorithms are used to implement advanced risk
            management strategies. Precision and Consistency: Algorithms can
            execute complex strategies with precision and without variation.
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Why does Titan Investments use algorithmic trading systems?</h2>
          <div className={Style.about_us_description}>
            <span>
              Titan Investments utilizes advanced algorithmic trading systems
              for trading in the forex market. These systems, based on
              sophisticated algorithms and big data analysis, identify the best
              trading opportunities and execute trades at high speed. This
              approach allows the company to achieve desirable profits
              automatically, without human intervention, while managing the
              risks associated with trading.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Who can invest in Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              Anyone who has reached the legal age, understands the basics of
              investing, and accepts the risks involved can easily invest in
              Titan Investments. Individuals who invest in Titan Investments are
              considered to have accepted all the terms and conditions of the
              company. For more information on the company’s terms and
              conditions, please review the Terms and Conditions section.
            </span>
          </div>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>
            Will the company start trading with my money as soon as I invest?
          </h2>
          <div className={Style.about_us_description}>
            <span>
              No! Titan Investments collects funds until the last day of each
              month, specifically on the 29th, 30th, or 31st. Then, at the
              beginning of each month, the company allocates those funds into
              its trading systems.
            </span>
          </div>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>How will profit withdrawals work?</h2>
          <div className={Style.about_us_description}>
            <span>
              After one month of trading, if the company is able to generate
              profits from the forex market, investors can request to withdraw
              their profits from the 1st to the 5th of each month. Titan
              Investments will pay investors their profits after deducting a 20%
              service fee, based on the selected withdrawal method.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>
            Why does Titan Investments deduct a percentage from profit
            withdrawals?
          </h2>
          <div className={Style.about_us_description}>
            <span>
              The fee for utilizing and benefiting from the algorithmic trading
              systems at Titan Investments is a 20% deduction from the profit
              withdrawals of its users. This means that the company’s
              profitability is tied to the profitability of its investors. In
              Titan Investments, 80% of the profits generated go to the
              investors, while 20% is retained by the company, creating a
              win-win business model.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>
            What happens if Titan Investments incurs losses after trading?
          </h2>
          <div className={Style.about_us_description}>
            <span>
              In that case, no profits will be distributed, and investors must
              give Titan Investments another month to recover the losses and
              generate profits multiple times over.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What happens if the company incurs losses again?</h2>
          <div className={Style.about_us_description}>
            <span>
              According to the company&apos;s six-year trading statement, this
              has not happened, and typically after experiencing one month of
              losses, we have made profits for several months afterward.
              However, since the forex market is unpredictable, we have
              implemented a complex and robust capital management strategy for
              all investments entrusted to us. If the company experiences four
              consecutive months of losses without a single profitable month,
              resulting in approximately 25% to 30% of investors&apos; capital
              being depleted, the company will refund all remaining funds to
              investors without deducting any fees. In other words, there is a
              provision for a maximum loss of 25% to 30%. This scenario is only
              possible if the company incurs losses for four or five consecutive
              months!
            </span>
          </div>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What are the terms and conditions of the investment contract?</h2>
          <div className={Style.about_us_description}>
            <span>
              Anyone who invests in Titan Investments enters into a two-year
              contract with the company. This means that the company commits to
              generating a minimum annual profit of 40% for its investors from
              the forex market. In return for this contract, investors must
              agree not to withdraw their principal investment amount until the
              end of the two-year contract period.
            </span>
          </div>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>
            What happens if an investor attempts to withdraw their principal
            investment before the contract ends?
          </h2>
          <div className={Style.about_us_description}>
            <span>
              In this case, the contract will be terminated by the investor. The
              company will deduct any profits that have been distributed to that
              individual from their principal investment and impose a 10%
              penalty. The remaining funds will then be refunded to the
              investor.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What are the terms of the capital increase contracts?</h2>
          <div className={Style.about_us_description}>
            <span>
              For any amount added as an increase in capital, a separate
              two-year contract will be established for that amount.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>How can we trust Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              In financial markets, there are no guarantees of profit or loss,
              which is one of the key features of this market. We don’t tell you
              to trust us for any specific reason! Instead, we ask you to
              consciously review our conditions and consider all aspects of this
              investment. Titan Investments has very ambitious goals. Together
              with you, we intend to grow bigger and stronger every day. We rely
              on powerful and profitable trading systems to trade and earn in
              this market. When we make a profit, we distribute 80% to our
              clients, and if we incur a loss, no profit is distributed. We do
              not follow unhealthy practices in trading or in the distribution
              of profits to our clients. We are honest and fully transparent in
              sharing all transactions and trades with our clients. Our trading
              systems have been developed from millions of different strategies
              and have undergone extremely rigorous testing and evaluation over
              years of performance. Now they are ready for use, allowing us to
              achieve profitability.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>How much is the investment risk in Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              Our trading systems have successfully executed trades since 2018
              and have consistently been profitable at the end of each financial
              year. The maximum loss our trading system has experienced from
              2018 to now is 5.5% in one month. Therefore, we commit to
              returning the remaining portion of your investment if the company
              incurs a loss of 20% to 25% relative to your capital and will not
              continue down that path. However, please keep in mind that the
              company must incur losses for five consecutive months without
              achieving any profit for 25% of someone’s investment to be lost,
              and this has not happened so far and is not expected to happen. It
              can be said that the investment risk in Titan Investments is a
              minimum of 20% and a maximum of 30%.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Who manages Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              We are comprised of a cohesive international team that has worked
              together for many years. After years of teamwork and effort, we
              decided to launch a powerful investment company project. Thus, we
              started our operations in the UAE, specifically in Dubai, which is
              now the heart of global commerce. Soon, we will establish
              extensive offices in various locations around the world.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>How can we contact the company in case of problems?</h2>
          <div className={Style.about_us_description}>
            <span>
              In addition to our always-online support team, investors can
              communicate with the support team directly from their accounts to
              discuss any issues they may have. The company will respond to
              their inquiries as quickly as possible.
            </span>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          className={Style.about_us_info}
          initial={{ opacity: 0, y: "20px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Can we achieve higher earnings in Titan Investments?</h2>
          <div className={Style.about_us_description}>
            <span>
              Yes! You can earn additional income through our referral plans by
              introducing friends and acquaintances. For every individual who
              invests in Titan Investments using your referral code, the company
              will deposit a 5% referral bonus to you.
            </span>
          </div>
        </motion.div>
      </div>

      <button
      onClick={()=> router.back()}
        className="p-2 w-[60%] mx-auto rounded-[1rem] mt-10 border-2 border-[#383C47] flex justify-center items-center gap-2   mx-auto text-[#383C47] dark:text-white"
      >
        Home
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12.9662C6 12.9662 7.6 14.9662 10 14.9662C12.4 14.9662 14 12.9662 14 12.9662M1 12.5662V10.0964C1 8.94767 1 8.37331 1.14805 7.84438C1.2792 7.37584 1.49473 6.93517 1.78405 6.54399C2.11067 6.10239 2.56404 5.74977 3.47078 5.04453L6.07078 3.0223C7.47608 1.92929 8.17873 1.38279 8.95461 1.17271C9.63921 0.987351 10.3608 0.987351 11.0454 1.17271C11.8213 1.38279 12.5239 1.9293 13.9292 3.02231L16.5292 5.04453C17.436 5.74977 17.8893 6.10239 18.2159 6.54399C18.5053 6.93517 18.7208 7.37584 18.8519 7.84438C19 8.37331 19 8.94767 19 10.0964V12.5662C19 14.8065 19 15.9266 18.564 16.7822C18.1805 17.5349 17.5686 18.1468 16.816 18.5303C15.9603 18.9662 14.8402 18.9662 12.6 18.9662H7.4C5.15979 18.9662 4.03969 18.9662 3.18404 18.5303C2.43139 18.1468 1.81947 17.5349 1.43597 16.7822C1 15.9266 1 14.8065 1 12.5662Z"
            stroke="#1A68FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
