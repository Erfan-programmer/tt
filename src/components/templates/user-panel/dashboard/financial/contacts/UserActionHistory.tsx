import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { useContacts } from "@/contextApi/ContactsContext";

export default function UserActionHistory() {
  const {
    contacts,
    isLoading,
    perPage,
    totalCount,
    page,
    setPage, 
  } = useContacts();

  return (
    <div className="use-action-history-container border-standard rounded-xl px-[2rem] py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
      <div className="use-action-history-header flex items-center justify-between text-[var(--main-background)] dark:text-white mb-6">
        <p className="text-xl font-semibold">Your Contact List</p>
      </div>
      <div className="overflow-x-auto rounded-[1em]">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr className="bg-white dark:bg-[#D9D9D9] rounded-t-lg">
              <th className="text-center py-4 text-black font-medium px-4">#</th>
              <th className="text-center py-4 text-black font-medium px-4">Name</th>
              <th className="text-center py-4 text-black font-medium px-4">TID</th>
              <th className="text-center py-4 text-black font-medium px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 text-center text-[var(--main-background)] dark:text-white"
                >
                  Loading...
                </td>
              </tr>
            ) : !contacts || contacts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 text-center text-[var(--main-background)] dark:text-white"
                >
                  No contacts found
                </td>
              </tr>
            ) : (
              contacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-[#2A3246]"
                      : "bg-[#f9f9fe] dark:bg-[#222631]"
                  }`}
                >
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                    {contact.id}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                    {contact.name}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                    {contact.tid}
                  </td>
                  <td className="py-4 text-[var(--main-background)] dark:text-white text-center px-4">
                    {new Date(contact.created_at).toLocaleDateString("en-US")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(totalCount / perPage)}
          page={page}
          onChange={(_, value) => setPage(value)} 
        />
      </div>
    </div>
  );
}
