export default function MessageManagementTableSkeleton() {
  return (
    <tr className="animate-pulse bg-white dark:bg-[#2A3246]">
      {Array.from({ length: 8 }).map((_, idx) => (
        <td key={idx} className="py-4 px-4 text-center">
          <div className="mx-auto h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </td>
      ))}
    </tr>
  );
} 