interface TicketHeaderProps {
  ticketNumber: string;
  status: "open" | "client_reply" | "admin_reply" | "closed" | string;
  isClosing: boolean;
}

type StatusKey = TicketHeaderProps["status"];

function getStatusConfig(): Record<StatusKey, { label: string; bgColor: string }> {
  return {
    open: { label: "Open", bgColor: "bg-green-500" },
    client_reply: { label: "Client Reply", bgColor: "bg-blue-500" },
    admin_reply: { label: "Admin Reply", bgColor: "bg-yellow-500" },
    closed: { label: "Closed", bgColor: "bg-red-500" },
  };
}

export default function TicketHeader({ ticketNumber, status, isClosing }: TicketHeaderProps) {
  const statusConfig = getStatusConfig();
  const config = statusConfig[status];

  return (
    <div className="flex items-center flex-wrap justify-center gap-2 sm:justify-between bg-[#f4f7fd] dark:bg-[#23263a] rounded-t-xl px-6 py-4 shadow sticky top-0 z-10">
      <div className="font-bold text-lg text-[var(--main-background)] dark:text-white">
        Ticket #{ticketNumber}
      </div>
      <button
        className={`flex items-center gap-2 ${config.bgColor} text-white px-4 py-2 rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed`}
        disabled={status === "closed" || isClosing}
      >
        {config.label}
      </button>
    </div>
  );
}
