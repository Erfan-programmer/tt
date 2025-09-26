// hooks/useQuillModules.ts
"use client";

import { useMemo } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

export const useQuillModules = () => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      imageUploader: {
        upload: async (file: File) => {
          const formData = new FormData();
          formData.append("image", file);

          const token = loadEncryptedData()?.token;

          const res = await apiRequest<{ data: string }>(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/upload-ck-image`,
            "POST",
            formData,
            { Authorization: `Bearer ${token}` }
          );

          if (res.success && res.data?.data) {
            return `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${res.data.data}`;
          } else {
            throw new Error("Image upload failed");
          }
        },
      },
    }),
    []
  );

  return modules;
};
