import Link from "next/link";
import Image from "next/image";
import { FaRegImage } from "react-icons/fa6";
import "./Message.css";

interface MessageInfoType {
  id: number;
  title: string;
  image_path?: string;
  message_content: string;
  updated_at: string;
}

export default function Message({
  messageInfo,
}: {
  messageInfo: MessageInfoType;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Link
      href="/dashboard/support/messages"
      className="message-item bg-white dark:bg-[#19214f] rounded-lg p-2 flex flex-col sm:flex-row gap-4 items-center py-6 sm:items-start mb-4"
    >
      <div className="message-image rounded-lg overflow-hidden w-[98%] sm:w-[12rem] h-[15rem] sm:h-[10rem] flex-shrink-0 border-2 border-white flex justify-center items-center bg-gray-100 dark:bg-[#1a2145]">
        {messageInfo.image_path ? (
          <Image
            width={500}
            height={500}
            className="object-cover w-full h-full"
            src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${messageInfo.image_path}`}
            alt={messageInfo.title}
          />
        ) : (
          <FaRegImage className="text-gray-400 text-6xl" />
        )}
      </div>

      <div className="flex flex-col flex-1 gap-2 w-full">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {formatDate(messageInfo.updated_at)}
        </p>
        <div className="message-info">
          <p className="font-bold text-[var(--main-background)] break-words">
            {messageInfo.title}
          </p>
        </div>
        <div className="message-description text-sm text-gray-600 dark:text-gray-400 break-words max-h-[6rem] overflow-hidden">
          <span
            dangerouslySetInnerHTML={{
              __html:
                messageInfo.message_content.length > 40
                  ? messageInfo.message_content 
                  : messageInfo.message_content,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
