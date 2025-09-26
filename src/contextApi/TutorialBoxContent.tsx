"use client"
import { HiDownload } from "react-icons/hi";
import { useEffect, useState } from "react";
import { FaFileLines } from "react-icons/fa6";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

export interface Tutorial {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
  file_size?: number;
}

export default function TutorialBoxContent() {
  const [isLoading, setLoading] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});

  const token = loadUserData()?.access_token;

  useEffect(() => {
    const fetchTutorials = async () => {
      setLoading(true);
      const res = await apiRequest<{ data: Tutorial[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/getTutorials`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) setTutorials(res.data?.data);
      else console.error("Failed to fetch tutorials", res.error);
      setLoading(false);
    };
    fetchTutorials();
  }, [token]);

  const handleDownload = async (file: Tutorial) => {
    try {
      setDownloadingId(file.id);
      setProgressMap((prev) => ({ ...prev, [file.id]: 0 }));

      const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/client/downloadTutorials/${file.id}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch file");

      const reader = res.body!.getReader();
      const contentLength = Number(res.headers.get("Content-Length") || 0);
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          setProgressMap((prev) => ({
            ...prev,
            [file.id]: contentLength ? (receivedLength / contentLength) * 100 : 0,
          }));
        }
      }

      const blob = new Blob(chunks, { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.title.includes(".") ? file.title : `${file.title}.${file.file_type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
      setProgressMap((prev) => ({ ...prev, [file.id]: 0 }));
    }
  };

  return (
    <div className="support-tutorial-container py-3 sm:py-4 md:py-[1rem] bg-[#F4F7FE4D] dark:bg-[var(--sidebar-bg)] border-standard rounded-lg sm:rounded-xl mt-4 sm:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
      <div className="support-tutorial text-[var(--sidebar-bg)] dark:text-white px-3 sm:px-4 md:px-[2rem]">
        <p className="text-[.8rem] sm:text-sm md:text-base">Click on each file to download</p>
      </div>
      <div className="support-tutorial-wrapper px-3 sm:px-4 md:px-[2rem]">
        {isLoading && <>Loading...</>}
        {tutorials?.map((file) => {
          const isDownloading = downloadingId === file.id;
          const progress = progressMap[file.id] || 0;
          return (
            <div key={file.id} className="support-tutorial-content border-standard mt-3 sm:mt-4 md:mt-[2rem] rounded-lg sm:rounded-xl bg-[#0B102D] p-2 sm:p-3 flex flex-col sm:flex-row justify-between pl-3 sm:pl-4 md:pl-[3rem] items-center gap-2 sm:gap-4 w-full sm:w-[80%] md:w-[45%] text-[#383C47] dark:text-white">
              <div className="flex items-center gap-2">
                <FaFileLines className="text-red-500 text-4xl" />
                <div className="support-download w-full sm:w-auto">
                  <p className="text-[.8rem] sm:text-sm md:text-base  text-[var(--box-background)] dark:text-white">{file.title}</p>
                  <span className="text-[10px] sm:text-[.8rem] md:text-sm text-gray-400">
                    {file.file_size ? (file.file_size / 1024 / 1024).toFixed(2) + " MB" : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(file)}
                className="relative w-10 h-10 bg-white rounded-full flex justify-center items-center disabled:opacity-50"
                disabled={isDownloading}
              >
                {isDownloading && (
                  <svg className="absolute w-full h-full" viewBox="0 0 36 36">
                    <circle className="text-gray-200" stroke="currentColor" strokeWidth="3.5" fill="transparent" r="16" cx="18" cy="18" />
                    <circle className="text-blue-500" stroke="currentColor" strokeWidth="3.5" strokeDasharray="100" strokeDashoffset={100 - progress} strokeLinecap="round" fill="transparent" r="16" cx="18" cy="18" />
                  </svg>
                )}
                <HiDownload className="text-[#1A68FF] text-lg sm:text-xl md:text-[1.5rem] relative" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
