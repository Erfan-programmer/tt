import { Reply } from "@/types/p-admin/Message";
import React from "react";

interface ChatMessageProps {
  msg: Reply;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg }) => {
  const isUser = msg.replier_type === "App\\Models\\Client";
  const senderName = isUser
    ? "Me"
    : "first_name" in msg.replier
    ? `${msg.replier.first_name} ${msg.replier.last_name}`
    : (msg.replier as any).name;

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[90%] px-4 py-3 rounded-2xl shadow transition-all duration-300 animate-fade-in
          ${isUser
            ? "bg-blue-500 text-white rounded-br-none self-end"
            : "bg-gray-200 dark:bg-[#23263a] text-[var(--main-background)] dark:text-white rounded-bl-none self-start"
          }
        `}
      >
        <div className={`text-[.8rem] font-bold mb-1 ${isUser ? "text-right" : "text-left"}`}>
          {senderName}
        </div>
        <div
          className={`whitespace-pre-line break-words pb-2 ${isUser ? "text-right" : "text-left"}`}
          dangerouslySetInnerHTML={{ __html: msg.message }}
        />
        {msg.attachments.length > 0 && (
          <div className="mt-2 flex flex-col gap-1 border-t border-white/20 dark:border-black/20 pt-2">
            {msg.attachments.map((att, i) => (
              <a
                key={i}
                href={att.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-blue-200 dark:text-blue-400 hover:text-blue-100"
              >
                {att.original_name}
              </a>
            ))}
          </div>
        )}
        <div className="text-[.8rem] mt-2 text-right opacity-70">
          {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
