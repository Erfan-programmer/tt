// src/components/modules/VerificationStepBox.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import "@/styles/VerificationBox.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify"; // Ensure react-toastify is imported

// Assuming this interface exists somewhere in your project
interface FileSectionPair {
  file: File;
  section: number;
  title: string;
  status?: "approved" | "rejected" | "pending";
  reject_reason?: string;
}

interface VerificationStepBoxProps {
  title: string;
  section: number;
  image: string;
  fileSectionPairs: FileSectionPair[];
  setFileSectionPairs: React.Dispatch<React.SetStateAction<FileSectionPair[]>>;
}

export default function VerificationStepBox({
  title,
  section,
  image,
  fileSectionPairs,
  setFileSectionPairs,
}: VerificationStepBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState("");

  const currentFile = fileSectionPairs.find(
    (file) => file.section === section
  );
  const status = currentFile?.status;

  // ✅ Move state update to a useEffect to avoid infinite re-renders
  useEffect(() => {
    if (status === "rejected") {
      setBorderColor("border-1 border-[var(--loss)] border-solid");
    } else if (status === "approved") {
      setBorderColor("border-1 border-[var(--profit)] border-solid");
    } else if (status === "pending") {
      setBorderColor("border-1 border-[var(--normal)] border-solid");
    } else {
      setBorderColor(
        "border-1 dark:border-[#f0f0f0] border-[var(--main-background)] border-dashed"
      );
    }
  }, [status]); // Dependency array to trigger only when 'status' changes

  useEffect(() => {
    if (currentFile?.file) {
      const url = URL.createObjectURL(currentFile.file);
      setUploadedURL(url);

      return () => {
        URL.revokeObjectURL(url);
        setUploadedURL(null);
      };
    }
  }, [currentFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentFile?.status === "approved") {
      toast.error("You cannot change the file after approval.");
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && !file.type.includes("pdf")) { // Added pdf
        toast.error("Only image and PDF files are allowed");
        e.target.value = "";
        return;
      }

      setFileSectionPairs((prev) => [
        ...prev?.filter((item) => item.section !== section),
        { file, section, title: title, status: "pending" }, // Add a default status
      ]);

      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreviewURL("");
    setUploadedURL(""); // Also clear the uploaded URL
    setFileSectionPairs((prev) =>
      prev?.filter((item) => item.section !== section)
    );
  };

  const finalImage = previewURL || uploadedURL;

  return (
    <div
      data-key={section}
      className={`verification-box-container ${borderColor} relative text-[var(--main-background)] dark:text-white text-center`}
      onClick={handleClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <ToastContainer
  closeButton={({ closeToast }) => (
    <button onClick={closeToast}>
      <FaTimes className="text-white" />
    </button>
  )}
/>
      {(currentFile?.status === "approved" ||
        currentFile?.status === "rejected") && (
        <div className="w-10 h-10 rounded-full flex justify-center items-center absolute top-2 right-2 bg-[var(--main-background)] dark:bg-white">
          {currentFile?.status === "approved" ? (
            <FaCheck className="text-white dark:text-[var(--main-background)]" />
          ) : (
            <FaXmark className="text-white dark:text-[var(--main-background)]" />
          )}
        </div>
      )}
      <div className="verification-box-title mb-3">
        <p>{title}</p>
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg, image/webp, application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        onClick={(e) => e.stopPropagation()}
      />

      {finalImage ? (
        <div className="relative inline-block w-full h-32">
          <Image
            width={300}
            height={300}
            src={finalImage}
            alt="preview"
            className="w-full h-32 rounded-lg object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold transition"
            aria-label="Remove file"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <>
          <div className="verification-box-img flex justify-center items-center h-16">
            {image ? (
              <Image
                width={500}
                height={500}
                src={image}
                alt=""
                className="w-20"
              />
            ) : (
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.1902 39.0519L26.1392 34.043C23.8176 31.7407 22.6568 30.5896 21.3204 30.1579C20.1447 29.778 18.8793 29.778 17.7036 30.1579C16.3672 30.5896 15.2064 31.7408 12.8848 34.043L1.12333 45.8888M31.1902 39.0519L32.1943 38.0562C34.5646 35.7056 35.7497 34.5303 37.1096 34.1014C38.3055 33.7241 39.5906 33.7389 40.7775 34.1435C42.1271 34.6037 43.285 35.8059 45.6006 38.2104L48.0587 40.7062M31.1902 39.0519L42.8235 50.8906M42.8235 50.8906C41.795 51 40.4745 51 38.6471 51H10.4118C7.11734 51 5.47013 51 4.21182 50.3589C3.10499 49.7949 2.2051 48.895 1.64114 47.7882C1.3701 47.2562 1.21364 46.6548 1.12333 45.8888M42.8235 50.8906C43.6492 50.8027 44.2867 50.6444 44.847 50.3589C45.9538 49.7949 46.8537 48.895 47.4177 47.7882C48.0588 46.5299 48.0588 44.8827 48.0588 41.5882V30.4118M21.5882 3.94118H10.4118C7.11734 3.94118 5.47013 3.94118 4.21182 4.58231C3.10499 5.14628 2.2051 6.04616 1.64114 7.153C1 8.4113 1 10.0585 1 13.3529V41.5882C1 43.49 1 44.8428 1.12333 45.8888M42.1765 18.6471V9.82353M42.1765 9.82353V1M42.1765 9.82353H51M42.1765 9.82353H33.3529"
                  stroke="#D9D9D9"
                  stroke-width="2"
                  stroke-linecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <div className="verification-footer">
            <div className="verification-box-footer-top mt-[1rem] mb-1">
              <p>Drop file here or upload</p>
            </div>
            <div className="verification-box-footer-bottom">
              <span>PNG, JPG or WEBP (Max 800x800px)</span>
            </div>
            {currentFile?.status === "rejected" && (
              <div className="text-[var(--loss)] !text-[.9rem] mb-1">
                <span>
                  {currentFile?.status === "rejected" &&
                    currentFile?.reject_reason}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}