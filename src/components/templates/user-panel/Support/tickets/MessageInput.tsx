import { useState } from "react";
import { FaPaperPlane, FaPaperclip, FaTimes } from "react-icons/fa";

interface MessageInputProps {
    ticketStatus: "open" | "closed" | string;
    isSending: boolean;
    onSend: (message: string, attachments: File[]) => void;
}

export default function MessageInput({ ticketStatus, isSending, onSend }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setAttachments(prev => [...prev, ...Array.from(files)]);
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(prev => prev?.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;
        onSend(message, attachments);
        setMessage("");
        setAttachments([]);
    };

    const isClosed = ticketStatus === "closed";

    return (
        <form
            className="fixed bottom-[10%] sm:bottom-0 left-0 lg:left-auto right-0 w-full lg:w-[calc(100%-20%)] flex justify-center bg-transparent z-20"
            onSubmit={handleSubmit}
            style={{ pointerEvents: isClosed ? "none" : "auto" }}
        >
            <div className="flex flex-col gap-2 max-w-xl w-full bg-white dark:bg-[#23263a] rounded-t-2xl p-4 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-700 mx-auto">
                {/* Attachment Previews */}
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                                <span>{file.name}</span>
                                <button type="button" onClick={() => handleRemoveAttachment(index)} className="text-blue-500 hover:text-blue-700">
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {/* Input and Buttons */}
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer">
                        <FaPaperclip className="w-5 h-5 text-gray-500 hover:text-blue-500" />
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isSending || isClosed}
                        />
                    </label>
                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none px-2 py-2 text-[var(--dark-color)] dark:text-white"
                        placeholder={isClosed ? "Ticket is closed" : "Type your message..."}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={isSending || isClosed}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className={`transition-all duration-200 rounded-full p-3 flex items-center justify-center ${isSending || isClosed ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                        disabled={isSending || isClosed || (!message.trim() && attachments.length === 0)}
                    >
                        <FaPaperPlane className={`w-5 h-5 text-white transition-transform duration-200 ${!isSending && "group-hover:scale-125"}`} />
                    </button>
                </div>
            </div>
        </form>
    );
} 