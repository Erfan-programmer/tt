import React from "react";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { formatToTwoDecimals } from "@/components/modules/FormatToDecimal";

interface PaginationProps {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

interface Statement {
  tid: string | number;
  investment_amount: number;
  income: number;
  date: string;
  description: string;
}
function ReferralStatementSkeleton() {
  return (
    <div className="border-standard px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom mt-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg text-[var(--main-background)] dark:text-white">
      <h3 className="mb-4">
        <span className="inline-block w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </h3>
      <div className="rounded-[1em] mt-4">
        <div className="overflow-x-auto rounded-[1rem]">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#D9D9D9] rounded-t-lg">
                {["#", "Date", "TID", "Invest Amount", "Income"].map(
                  (_, idx) => (
                    <th
                      key={idx}
                      className="text-center py-4 text-black font-medium px-4"
                    >
                      <span className="inline-block w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-[#2A3246] text-[#9A9A9A]"
                      : "bg-[#f9f9fe] dark:bg-[#222631] text-[var(--main-background)] dark:text-white"
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <td key={i} className="py-4 text-center px-4">
                      <span className="inline-block w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <div className="w-full rounded-xl bg-white text-[var(--main-background)] p-3 px-4 sm:px-[2rem] flex flex-col sm:flex-row justify-between items-center font-[600] text-sm sm:text-base gap-2 sm:gap-0">
            <span className="inline-block w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <span className="inline-block w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <span className="inline-block w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function TeamReferalDetailsContentStatement({
  list = [],
  pagination,
  loading,
}: {
  list?: Statement[];
  pagination?: PaginationProps;
  loading?: boolean;
}) {
  if (loading) return <ReferralStatementSkeleton />;

  const statements = list.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    tid: item.description.match(/#\d+/)?.[0] || "-",
    invest_amount: item.investment_amount,
    income: item.income,
  }));


  console.log("statemen =>" , statements)

  return (
    <div className="team-refferal-detail border-standard px-[2rem] py-[1.5rem] bg-shadow-custom mt-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg text-[var(--main-background)] dark:text-white">
      <h3 className="text-md">Statement</h3>

      <div className="rounded-[1em] mt-4">
        <div className="overflow-x-auto rounded-[1rem]">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#D9D9D9] rounded-t-lg">
                <th className="text-center py-4 text-black font-medium px-4">
                  #
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  Date
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  TID
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  Invest Amount
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  Income
                </th>
              </tr>
            </thead>
            <tbody>
              {statements.length > 0 ? (
                statements.map((statement, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-[#2A3246] text-[#9A9A9A]"
                        : "bg-[#f9f9fe] dark:bg-[#222631] text-[var(--main-background)] dark:text-white"
                    }`}
                  >
                    <td className="py-4 text-center px-4">{index + 1}</td>
                    <td className="py-4 text-center px-4">{statement.date}</td>
                    <td className="py-4 text-center px-4">{statement.tid}</td>
                    <td className="py-4 text-center px-4">
                      {statement.invest_amount !== null ? (
                        <>$ {formatToTwoDecimals(statement.invest_amount)}</>
                      ) : (
                        <span>Tournament Bonus</span>
                      )}
                    </td>

                    <td className="py-4 text-center px-4 text-[#00FF90]">
                      ${" "}
                      {statement.income
                        ? formatToTwoDecimals(statement.income)
                        : statement.income}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center px-4">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <div className="w-full rounded-xl bg-white text-black p-3 px-4 sm:px-[2rem] flex flex-col sm:flex-row justify-between items-center font-[600] text-sm sm:text-base gap-2 sm:gap-0">
            <span className="whitespace-nowrap">Total Received Referral</span>
            <span className="whitespace-nowrap">
              ${" "}
              {statements.reduce(
                (acc, curr) => acc + (Number(curr.income) || 0),
                0
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          count={pagination?.last_page || 1}
          page={pagination?.current_page || 1}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
