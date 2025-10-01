// Skeleton component for loading state
const StatementSkeleton = () => (
  <div className="overflow-x-auto rounded-[1em] mt-4">
    <table className="w-full border-collapse rounded-lg">
      <thead>
        <tr className="bg-[#D9D9D9] rounded-t-lg">
          <th className="text-center py-4 text-black font-medium px-4">#</th>
          <th className="text-center py-4 text-black font-medium px-4">Date</th>
          <th className="text-center py-4 text-black font-medium px-4">
            Level
          </th>
          <th className="text-center py-4 text-black font-medium px-4">%</th>
          <th className="text-center py-4 text-black font-medium px-4">
            Income
          </th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5].map((index) => (
          <tr
            key={index}
            className={`transition-colors ${
              index % 2 === 0
                ? "bg-white dark:bg-[#2A3246]"
                : "bg-[#f9f9fe] dark:bg-[#222631]"
            }`}
          >
            <td className="py-4 text-center px-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto w-6"></div>
            </td>
            <td className="py-4 text-center px-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto w-24"></div>
            </td>
            <td className="py-4 text-center px-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto w-8"></div>
            </td>
            <td className="py-4 text-center px-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto w-12"></div>
            </td>
            <td className="py-4 text-center px-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto w-16"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export interface Statement {
  date: string;
  level: number;
  investor_count: number;
  percentage: number;
  income: number;
}

interface TeamCommissionDetailsContentStatementProps {
  statements?: Statement[];
  total_resivied_commission?: number;
}

export default function TeamCommissionDetailsContentStatement({
  statements,
}: TeamCommissionDetailsContentStatementProps) {
  return (
    <div className="border-standard team-commission-detail px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom mt-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg text-[var(--main-background)] dark:text-white">
      <h3>Statement</h3>

      <div className="overflow-x-auto rounded-[1em] mt-4">
        {!statements ? (
          <StatementSkeleton />
        ) : statements.length > 0 ? (
          <table className="w-full border-collapse rounded-lg">
            <thead>
              <tr className="bg-[#D9D9D9] rounded-t-lg">
                <th className="text-center py-4 text-black font-medium px-4">
                  #
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  Date
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  Level
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  investor count
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  %
                </th>
                <th className="text-center py-4 text-black font-medium px-4">
                  Income
                </th>
              </tr>
            </thead>
            <tbody>
              {statements.map((statement: Statement, index: number) => (
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
                  <td className="py-4 text-center px-4">{statement.level}</td>
                  <td className="py-4 text-center px-4">
                    {statement.investor_count}
                  </td>
                  <td className="py-4 text-center px-4">
                    {parseFloat(String(statement.percentage)).toFixed(0)}
                  </td>
                  <td
                    className={`py-4  text-center px-4 ${
                      statement.income > 0 && "text-[#00FF90]"
                    }`}
                  >
                    $ {parseFloat(String(statement.income)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No statements found
          </div>
        )}
      </div>
      {statements && statements.length > 0 && (
        <div className="mt-4">
          <div className="w-full overflow-x-auto rounded-xl bg-white text-black  p-3 sm:px-[2rem] flex justify-between items-center font-[600]">
            <span>Total Received Commissions</span>
            <span>
              ${" "}
              {statements
                ?.reduce((acc, statement) => acc + Number(statement.income), 0)
                .toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
