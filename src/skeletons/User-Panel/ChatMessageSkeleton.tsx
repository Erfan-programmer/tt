interface ChatMessageSkeletonProps {
  isUser: boolean;
}

export default function ChatMessageSkeleton({ isUser }: ChatMessageSkeletonProps) {
  return (
    <div className={`flex w-full animate-pulse ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`relative max-w-[70%] w-2/3 px-4 py-3 rounded-2xl ${isUser ? "bg-gray-400" : "bg-gray-300 dark:bg-gray-700"}`}>
        <div className={`h-3 w-1/4 rounded mb-2 ${isUser ? "bg-gray-500/50" : "bg-gray-400/50 dark:bg-gray-600/50"}`}></div>
        <div className={`h-4 w-full rounded mb-1 ${isUser ? "bg-gray-500/50" : "bg-gray-400/50 dark:bg-gray-600/50"}`}></div>
        <div className={`h-4 w-5/6 rounded ${isUser ? "bg-gray-500/50" : "bg-gray-400/50 dark:bg-gray-600/50"}`}></div>
        <div className={`h-2 w-1/3 rounded mt-2 float-right ${isUser ? "bg-gray-500/50" : "bg-gray-400/50 dark:bg-gray-600/50"}`}></div>
      </div>
    </div>
  );
} 