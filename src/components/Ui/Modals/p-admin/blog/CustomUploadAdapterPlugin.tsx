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
    const file = await this.loader.file;
    const formData = new FormData();
    formData.append("image", file);
    const token = loadEncryptedData()?.token
    const res = await apiRequest<{data: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/upload-ck-image`,
      "POST",
      formData,
      {Authorization : `Bearer ${token}`}
    );
    return {
      default: `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${res.data.data}`,
    };
  }

  abort() {}
}
