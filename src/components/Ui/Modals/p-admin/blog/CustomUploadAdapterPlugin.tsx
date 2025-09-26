// CustomUploadAdapterPlugin.ts
"use client";

import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";

export default function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader);
  };
}

class CustomUploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      const formData = new FormData();
      formData.append("image", file);

      const token = loadEncryptedData()?.token;

      const res = await apiRequest<{ data: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/upload-ck-image`,
        "POST",
        formData,
        { Authorization: `Bearer ${token}` }
      );

      if (!res.success || !res.data?.data) {
        throw new Error(res.message || "Upload failed");
      }

      return {
        default: `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${res.data.data}`,
      };
    } catch (err: any) {
      console.error("CKEditor upload error:", err);
      throw err;
    }
  }

  abort() {
  }
}
