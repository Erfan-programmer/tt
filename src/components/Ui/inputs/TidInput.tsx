"use client"
import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { z } from "zod";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface TidInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  mainTID?: number;
}

function TIDSuggestions({
  onSelect,
}: {
  onSelect: (tid: string, name: string) => void;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [data, setData] = useState<
    { tid: string; name: string; contact?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [firstLoad] = useState(true);

  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null>(null);


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const token = loadUserData()?.access_token;

        const res = await apiRequest<{
          data: { tid: string; name: string; contact?: string }[];
          meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
          };
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contacts?page=${page}&per_page=${perPage}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (res.success) {
          setData(res.data.data || []);
          setMeta(res.data.meta);
        } else {
          setData([]);
          setMeta(null);
        }
      } catch {
        setData([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [page, perPage]);


  function LoadingSkeleton() {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-[#080d23] text-white p-4 rounded-[1.5rem] shadow-[0px_4px_15px_#275edf] border border-[#004ada] z-50"
      style={{ top: "-1.5rem", bottom: "auto" }}
    >
      <div className="flex flex-col gap-2 p-2 px-4 relative z-50">
        <div className="flex items-center gap-2 text-[var(--main-background)] dark:text-white mb-2">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            className="stroke-[var(--main-background)] dark:stroke-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 17.25C4.75 17.25 6 13.5 11 13.5C16 13.5 17.25 17.25 17.25 17.25M13.5 7.25C13.5 8.63071 12.3807 9.75 11 9.75C9.61929 9.75 8.5 8.63071 8.5 7.25C8.5 5.86929 9.61929 4.75 11 4.75C12.3807 4.75 13.5 5.86929 13.5 7.25ZM11 21L14.1642 17.8358C14.3804 17.6196 14.4885 17.5115 14.6146 17.4342C14.7265 17.3657 14.8484 17.3152 14.976 17.2845C15.1198 17.25 15.2727 17.25 15.5784 17.25H17C18.4001 17.25 19.1002 17.25 19.635 16.9775C20.1054 16.7378 20.4878 16.3554 20.7275 15.885C21 15.3502 21 14.6501 21 13.25V5C21 3.59987 21 2.8998 20.7275 2.36502C20.4878 1.89462 20.1054 1.51217 19.635 1.27248C19.1002 1 18.4001 1 17 1H5C3.59987 1 2.8998 1 2.36502 1.27248C1.89462 1.51217 1.51217 1.89462 1.27248 2.36502C1 2.8998 1 3.59987 1 5V13.25C1 14.6501 1 15.3502 1.27248 15.885C1.51217 16.3554 1.89462 16.7378 2.36502 16.9775C2.8998 17.25 3.59987 17.25 5 17.25H6.42157C6.72731 17.25 6.88018 17.25 7.02404 17.2845C7.15159 17.3152 7.27352 17.3657 7.38536 17.4342C7.5115 17.5115 7.6196 17.6196 7.83579 17.8358L11 21Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-bold">Select Recipient</span>
        </div>
        {firstLoad && loading ? (
          <LoadingSkeleton />
        ) : (
          data.map((item) => (
            <div
              key={item.tid}
              className="flex flex-col gap-0.5 tId-desc cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 rounded px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item.tid || "", item.name);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{item.tid}</span>
                <span>{item.name.slice(0,10)}</span>
              </div>
            </div>
          ))
        )}
 
 
        {/* Pagination controls */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-[.8rem] disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-[.8rem] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}

const TidInput: React.FC<TidInputProps> = ({
  value,
  onChange,
  className,
  mainTID,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string>("");

  const iconRef = useRef<HTMLDivElement>(null);
  const tidSchema = z.string().regex(/^\d*$/, "Only numbers are allowed");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalVal = e.target.value;
    const val = originalVal.replace(/\D/g, "");

    if (originalVal !== val) {
      setLocalError("Only numeric characters are allowed");
    } else if (val === "") {
      setLocalError("");
    } else if (val === String(mainTID)) {
      setLocalError("You can not transfer amount to your wallet");
    } else {
      const result = tidSchema.safeParse(val);
      if (!result.success) {
        setLocalError(result.error.issues[0].message);
        onChange(val);
        return;
      } else {
        setLocalError("");
      }
    }

    onChange(val);
  };

  const handleBlur = () => setIsFocused(false);

  return (
    <>
      <div className={`custom-input-form ${className}`}>
        <label className="sponsor-label flex justify-start items-start gap-2">
          <span className="text-[var(--main-background)] dark:text-white text-md w-full">
            TID of the Recipient
          </span>
        </label>
        <label
          className={`titan-input-custom-container relative text-[var(--main-background)] dark:text-white mt-2 rounded-[1.5rem] ${
            localError
              ? "border-[#FF6060]"
              : value
              ? "border-success"
              : "border-standard"
          } ${isFocused ? "titan-input-custom-container-focus" : ""}`}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          tabIndex={0}
          role="textbox"
          aria-label="TID input"
        >
          <input
            type="text"
            value={value || ""}
            onChange={handleInputChange}
            className="titan-input-custom w-full border-none outline-none bg-transparent"
            placeholder="Enter TID"
            required
            maxLength={10}
            aria-label="Enter your TID"
            onBlur={handleBlur}
          />
          <div className="flex items-center gap-2">
            {localError ? (
              <>
                <IoMdCloseCircle className="w-7 h-7 text-[#FF6060]" />
              </>
            ) : (
              value && (
                <FaCheckCircle className="w-7 h-7 text-[#00CB08] transition-opacity duration-300" />
              )
            )}

            <div
              className="cursor-pointer relative"
              ref={iconRef}
              onClick={() => setShowTooltip(true)}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1667 19.0556C15.757 17.4073 13.9726 16.1667 11.8333 16.1667C9.69411 16.1667 7.9097 17.4073 7.5 19.0556M27 3.88889V6.77778M27 12.5556V15.4444M27 21.2222V24.1111M5.62222 27H18.0444C19.6624 27 20.4713 27 21.0893 26.6851C21.6329 26.4082 22.0748 25.9662 22.3518 25.4226C22.6667 24.8047 22.6667 23.9957 22.6667 22.3778V5.62222C22.6667 4.00429 22.6667 3.19533 22.3518 2.57736C22.0748 2.03378 21.6329 1.59184 21.0893 1.31487C20.4713 1 19.6624 1 18.0444 1H5.62222C4.00429 1 3.19533 1 2.57736 1.31487C2.03378 1.59184 1.59184 2.03378 1.31487 2.57736C1 3.19533 1 4.00429 1 5.62222V22.3778C1 23.9957 1 24.8047 1.31487 25.4226C1.59184 25.9662 2.03378 26.4082 2.57736 26.6851C3.19533 27 4.00429 27 5.62222 27ZM13.2778 10.3889C13.2778 11.1866 12.6311 11.8333 11.8333 11.8333C11.0356 11.8333 10.3889 11.1866 10.3889 10.3889C10.3889 9.59114 11.0356 8.94444 11.8333 8.94444C12.6311 8.94444 13.2778 9.59114 13.2778 10.3889Z"
                  stroke="white"
                  stroke-width="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {showTooltip && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTooltip(false)}
              />
              <TIDSuggestions
                onSelect={(tid) => {
                  onChange(tid);
                  setShowTooltip(false);
                }}
                onClose={() => setShowTooltip(false)}
              />
            </>
          )}
        </label>
      </div>
      {localError && (
        <div className="text-red-500 w-[95%] mx-auto">{localError}</div>
      )}
    </>
  );
};

export default TidInput;
