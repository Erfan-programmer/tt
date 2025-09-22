import { ReactNode } from "react";

export default function TitanNotice({
  title,
  description,
  alert,
  warning,
}: {
  title: string;
  description: string;
  alert?: string | ReactNode;
  warning?: string | ReactNode;
}) {
  return (
    <div className="flex justify-start gap-[1rem] bg-[#f4f7fd] dark:bg-[var(--notif-color)] border-l-4 border-[#1A68FF] rounded-xl p-2 py-4">
      <div className="notice-svg">
        <svg
          width="29"
          height="29"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5 8.5H14.515M14.5 13V20.5M28 14.5C28 21.9558 21.9558 28 14.5 28C7.04416 28 1 21.9558 1 14.5C1 7.04416 7.04416 1 14.5 1C21.9558 1 28 7.04416 28 14.5Z"
            stroke="#FFC857"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className="info-title">
          <p className="text-[var(--gold)] font-semibold">{title}</p>
        </div>
        <div className="info-description !text-[.9rem]">
          <span
            className="text-[var(--main-background)] dark:text-[#B9B9B9]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        {warning && (
          <div className="text-[var(--gold)]">
            {typeof warning === "string" ? (
              <span dangerouslySetInnerHTML={{ __html: warning }} />
            ) : (
              warning
            )}
          </div>
        )}
        {alert && (
          <div className="text-red-400">
            {typeof alert === "string" ? (
              <span dangerouslySetInnerHTML={{ __html: alert }} />
            ) : (
              alert
            )}
          </div>
        )}
      </div>
    </div>
  );
}
