"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaTimes, FaFilePdf, FaFileAlt, FaEdit, FaTrash } from "react-icons/fa";

interface ToturialBoxProps {
  title: string;
  isEditing: boolean;
  file: File | string | null;
  file_size: number;
  onChangeTitle: (val: string) => void;
  onChangeFile: (val: File | null) => void;
  onRemove: () => void;
  onSave: () => void;
  isApiBox: boolean;
  onEditToggle?: () => void;
}

export default function ToturialBox({
  title,
  file,
  isEditing,
  file_size,
  onChangeTitle,
  onChangeFile,
  onRemove,
  onSave,
}: ToturialBoxProps) {
  const [localFile, setLocalFile] = useState<File | null>(file instanceof File ? file : null);
  const [localTitle, setLocalTitle] = useState(title);
  const [editExist, setEditExist] = useState(isEditing);
  const [deleteFile, setDeleteFile] = useState(false);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setEditExist(isEditing);
  }, [isEditing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editExist) return;
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setLocalFile(newFile);
      setDeleteFile(false);
      onChangeFile(newFile);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editExist) return;
    setLocalTitle(e.target.value);
    onChangeTitle(e.target.value);
  };

  const handleDeleteFile = () => {
    setLocalFile(null);
    setDeleteFile(true);
    onChangeFile(null);
  };
const renderFilePreview = () => {
  const currentFile = localFile || (typeof file === "string" ? file : null);

  if (!currentFile || deleteFile) return "Upload File";

  if (currentFile instanceof File) {
    const type = currentFile.type;
    if (type.startsWith("image/")) {
      return <Image src={URL.createObjectURL(currentFile)} alt="preview" width={500} height={500} className="max-h-40 object-contain rounded" />;
    }
    if (type.startsWith("video/")) {
      return <video src={URL.createObjectURL(currentFile)} controls className="max-h-40 rounded" />;
    }
    if (type === "application/pdf") {
      return (
        <div className="flex flex-col items-center gap-2">
          <FaFilePdf className="text-5xl text-blue-400" />
          <span className="text-[.8rem] text-gray-400">PDF File</span>
          <span>{(currentFile.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <FaFileAlt className="text-4xl text-gray-400" />
        <span className="text-[.8rem] text-gray-400">{currentFile.name}</span>
        <span>{(currentFile.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>
    );
  }

  if (typeof currentFile === "string") {
    const lower = currentFile.toLowerCase();
    if (lower.endsWith(".pdf")) {
      return (
        <div className="flex flex-col items-center gap-2">
          <FaFilePdf className="text-5xl text-blue-400" />
          <span className="text-[.8rem] text-gray-400">PDF File</span>
          <span>Existing File</span>
          <span>{(file_size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      );
    } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".gif")) {
      return <Image src={currentFile} alt="preview" width={500} height={500} className="max-h-40 object-contain rounded" />;
    } else if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov")) {
      return <video src={currentFile} controls className="max-h-40 rounded" />;
    } else {
      const name = currentFile.split("/").pop();
      return (
        <div className="flex flex-col items-center gap-2">
          <FaFileAlt className="text-4xl text-gray-400" />
          <span className="text-[.8rem] text-gray-400">{name}</span>
          <span>Existing File</span>
          <span>{(file_size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      );
    }
  }

  return "Upload File";
};


  return (
    <div className="toturial-box">
      <div className="flex flex-col gap-2 relative">
        {/* Toggle Edit */}
        <div
          className="absolute z-[999] top-1 right-1 w-8 h-8 bg-[#383C47] border-[2px] rounded-full border-[#383C47] flex items-center justify-center cursor-pointer"
          onClick={() => setEditExist((prev) => !prev)}
        >
          {editExist ? <FaTimes className="text-white" /> : <FaEdit className="text-white" />}
        </div>

        {/* File Upload / Preview */}
        <label className="w-full flex items-center justify-center max-w-80 h-40 border-[2px] rounded-[.5rem] border-[#383C47] text-white font-bold cursor-pointer overflow-hidden relative">
          <div className="flex flex-col items-center gap-2 text-sm text-gray-300 p-2">
            {renderFilePreview()}
          </div>

          {(localFile || typeof file === "string") && !deleteFile && (
            <button
              type="button"
              className="absolute top-1 left-1 text-red-500 bg-[#383C47] w-8 h-8 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault()
                handleDeleteFile();
              }}
              disabled={!editExist}
            >
              <FaTrash />
            </button>
          )}

          <input
            type="file"
            accept="*/*"
            className="hidden"
            readOnly={!editExist} 
            disabled={!editExist}
            onChange={handleFileChange}
          />
        </label>

        {/* Title */}
        <textarea
          className={`bg-transparent ${!editExist ? "bg-[#383C47]" : "bg-transparent"} rounded-[.5rem] border-[2px] border-[#383C47] px-2 py-2 text-white`}
          placeholder="Enter Title"
          value={localTitle}
          readOnly={!editExist}
          onChange={handleTitleChange}
        />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button className="titan-cancel-btn bg-[#FF6060] text-white !rounded-[.5rem] w-full" onClick={onRemove}>
            Remove
          </button>
          <button
            className={`titan-btn w-full ${!editExist ? "opacity-50 !bg-gray-400" : "opacity-100"}`}
            onClick={onSave}
            disabled={!localTitle || (!localFile && !(typeof file === "string"))}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
