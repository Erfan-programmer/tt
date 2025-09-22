import Image from "next/image";

interface MessagePropType {
  image?: string;
  title: string;
  date: string;
  description: string;
}

const truncateWords = (text: string, wordCount: number) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ");
};

export default function MessagesContent({
  image,
  title,
  date,
  description,
}: MessagePropType) {
  return (
    <div className="messages message-container px-[1rem] py-[1rem] bg-white dark:bg-[#1A1B26] bg-shadow-custom border-standard rounded-xl mt-5 pb-[2rem]">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="sm:w-[30%] min-w-[200px] h-[15rem] bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
          {image ? (
            <Image
              width={200}
              height={200}
              src={image}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-400 text-lg">No Image</span>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <h3
            className="text-yellow-400 font-semibold text-sm"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-gray-400 text-xs">{date}</p>
          <p
            className="message-notif hidden sm:block text-gray-900 dark:text-gray-300 text-sm mt-4"
            dangerouslySetInnerHTML={{
              __html: truncateWords(description, 70),
            }}
          />
        </div>
      </div>

      <div className="hidden sm:block">
        <p
          className="message-notif text-gray-900 dark:text-gray-300 text-sm"
          dangerouslySetInnerHTML={{
            __html: description.split(" ").slice(50).join(" "),
          }}
        />
      </div>

      <div className="block sm:hidden">
        <p
          className="message-notif text-gray-900 dark:text-gray-300 text-sm"
          dangerouslySetInnerHTML={{ __html: truncateWords(description, 30) }}
        />
      </div>
    </div>
  );
}
