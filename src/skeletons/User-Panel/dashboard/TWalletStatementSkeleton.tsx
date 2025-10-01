export default function TWalletStatementSkeleton() {
  return (
    <div className="withdraw-transaction-container border-standard rounded-lg px-4 py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4 w-full animate-pulse">
      <div className="withdraw-transaction-header flex items-center justify-between text-[var(--main-background)] dark:text-white mb-6">
        <div className="team-claim-reward flex items-center gap-2">
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-white text-black text-sm font-medium">
              <th className="text-center py-3 px-4">#</th>
              <th className="text-center py-3 px-4">Type</th>
              <th className="text-center py-3 px-4">Amount</th>
              <th className="text-center py-3 px-4">Commission Fee</th>
              <th className="text-center py-3 px-4">Receiver</th>
              <th className="text-center py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr
                key={i}
                className={`transition-colors ${
                  i % 2 === 0
                    ? "bg-white dark:bg-[#2A3246]"
                    : "bg-[#f9f9fe] dark:bg-[#222631]"
                }`}
              >
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}