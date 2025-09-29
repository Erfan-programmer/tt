
interface TicketHeaderProps {
  ticketNumber: string;
  status: "open" | "closed" | string;
  isClosing: boolean;
}

export default function TicketHeader({ ticketNumber, status, isClosing }: TicketHeaderProps) {
  return (
    <div className="flex items-center flex-wrap justify-center gap-2 sm:justify-between bg-[#f4f7fd] dark:bg-[#23263a] rounded-t-xl px-6 py-4 shadow sticky top-0 z-10">
      <div className="font-bold text-lg text-[var(--main-background)] dark:text-white">Ticket #{ticketNumber}</div>
      <button
        className={`flex items-center gap-2 ${status === "open" ? "bg-green-500" : "bg-red-500"} text-white px-4 py-2 rounded-lg transition-all disabled:bg-red-400 disabled:cursor-not-allowed`}
        disabled={status === "closed" || isClosing}
      >
        {status === "open" ? "Open" : "Closed"}
      </button>
    </div>
  );
} 