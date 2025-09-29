interface CloseTicketModalProps {
    isOpen: boolean;
    isClosing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CloseTicketModal({ isOpen, isClosing, onConfirm, onCancel }: CloseTicketModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-[#23263a] p-6 rounded-xl shadow-xl flex flex-col items-center">
                <p className="mb-4 text-lg text-[var(--main-background)] dark:text-white">Are you sure you want to close this ticket?</p>
                <div className="flex gap-4">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-red-400 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                        disabled={isClosing}
                    >
                        {isClosing ? "Closing..." : "Yes, Close"}
                    </button>
                    <button
                        className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-4 py-2 rounded-lg"
                        onClick={onCancel}
                        disabled={isClosing}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
} 