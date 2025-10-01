import { useEffect } from "react";
import ChatMessageSkeleton from "@/skeletons/User-Panel/ChatMessageSkeleton";
import ChatMessage from "./ChatMessage";
import { DepartmentType, Reply } from "@/types/p-admin/Message";

interface ChatMessageListProps {
  messages: Reply[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  department: DepartmentType;
  onScroll: () => void;
}

export default function ChatMessageList({
  messages,
  isLoading,
  department,
  chatEndRef,
  scrollContainerRef,
  onScroll,
}: ChatMessageListProps) {
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, chatEndRef]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full px-4 pt-6 pb-4">
        <ChatMessageSkeleton isUser={false} />
        <ChatMessageSkeleton isUser={true} />
        <ChatMessageSkeleton isUser={false} />
        <ChatMessageSkeleton isUser={true} />
      </div>
    );
  }
  return (
    <div
      ref={scrollContainerRef}
      onScroll={onScroll}
      className="flex flex-col gap-4 max-w-4xl mx-auto w-full px-4 pt-6 pb-4 max-h-96 overflow-y-auto"
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          This is the beginning of your conversation.
        </div>
      ) : (
        messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} department={department} />
        ))
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
