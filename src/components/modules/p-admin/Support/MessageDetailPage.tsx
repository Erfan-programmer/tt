"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/libs/api";
import "@/styles/p-admin/AdminTextEditor.css"; // Note: This should ideally be renamed to a generic editor style or Quill style
import DatePicker from "react-datepicker";
// import { CKEditor } from "@ckeditor/ckeditor5-react"; // REMOVED
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // REMOVED
// import CustomUploadAdapterPlugin from "@/components/Ui/Modals/p-admin/blog/CustomUploadAdapterPlugin"; // REMOVED
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import LineTitle from "../LineTitle";
import CustomAdminInput from "../CustomAdminInput";
import TypeDropdown from "./TypeDropdown";
import { FaCalendar, FaTrash } from "react-icons/fa";
import AdminToggleSwitch from "@/components/Ui/AdminToggleSwitch/AdminToggleSwitch";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic"; // NEW

// 💡 NEW: Dynamic import for ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { 
    ssr: false,
    loading: () => <p className="text-white p-4">Loading text editor...</p>,
});
import "react-quill/dist/quill.snow.css"; // Import Quill styles

interface Announcement {
  id: string;
  title: string;
  message_content: string;
  type?: string;
  image_path?: string;
  status?: "draft" | "published";
  published_at?: string;
}

export default function MessageDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [editData, setEditData] = useState<Partial<Announcement>>({});
  const [editImage, setEditImage] = useState<File | string | null>(null);
  const [initialData, setInitialData] = useState<Partial<Announcement>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [initialPublishedAt, setInitialPublishedAt] = useState<Date | null>(
    null
  );

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // 💡 NEW: Define the Quill modules/toolbar configuration inline
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }), []);

  // handleChange helper
  const handleChange = (key: keyof Announcement, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // NOTE: CKEditor config is no longer needed
  // const editorConfig = { ... }

  const fetchMessage = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<{ data: Announcement }>(
        `${BASE_URL}/v1/admin/showAnnouncements/${id}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        const data = res.data.data;
        setEditData(data);
        setInitialData(data);
        setEditImage(data.image_path || null);
        setStatus(data.status || "draft");
        setPublishedAt(data.published_at ? new Date(data.published_at) : null);
        setInitialPublishedAt(
          data.published_at ? new Date(data.published_at) : null
        );
      } else {
        toast.error(res.message || "Failed to fetch announcement");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch announcement");
    } finally {
      setLoading(false);
    }
  }, [
    id,
    setEditData,
    setInitialData,
    setEditImage,
    BASE_URL,
    setStatus,
    setPublishedAt,
    setInitialPublishedAt,
    setLoading,
  ]);

  const handleSubmit = async () => {
    if (!id) return toast.error("Invalid ID");
    
    // Trimming the content before submission is a good practice, especially after switching editors
    const contentToSubmit = editData.message_content?.trim() || "";
    if (!contentToSubmit && editData.title) {
      // Optionally check for minimum content length or throw error if content is mandatory
    }


    const token = loadEncryptedData()?.token;
    const form = new FormData();
    form.append("title", editData.title || "");
    form.append("message_content", contentToSubmit);
    form.append("type", editData.type || "");
    form.append("status", status);
    if (publishedAt) form.append("published_at", publishedAt.toISOString());
    if (editImage instanceof File) form.append("image", editImage);

    try {
      const res = await apiRequest<any>(
        `${BASE_URL}/v1/admin/updateAnnouncements/${id}`,
        "POST",
        form,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Updated successfully!");
        // Update initial data to reflect the latest saved state
        setInitialData({
            ...editData,
            message_content: contentToSubmit, // Use the trimmed version
            status: status,
        });
        setInitialPublishedAt(publishedAt);
        if (!(editImage instanceof File)) setEditImage(editImage);
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error: any) {
        toast.error(`Request failed: ${error.message}`);
    }
  };

  const hasChanged = useMemo(() => {
    return (
      editData.title !== initialData.title ||
      editData.message_content !== initialData.message_content ||
      editData.type !== initialData.type ||
      status !== (initialData.status || "draft") ||
      publishedAt?.toISOString() !== initialPublishedAt?.toISOString() ||
      (editImage !== initialData.image_path &&
        !(editImage === null && !initialData.image_path))
    );
  }, [
    editData,
    status,
    publishedAt,
    initialData,
    editImage,
    initialPublishedAt,
  ]);

  useEffect(() => {
    fetchMessage();
  }, [id, fetchMessage]);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-4">
      <ToastContainer />
      <LineTitle onClick={() => {}} title={`Edit Message`} />

      {/* Image Upload */}
      <div className="mb-12">
        <label className="text-sm text-white mb-2 block">
          Announcement Image
        </label>
        <div className="flex items-center justify-center gap-2">
          {editImage ? (
            <div className="relative w-72 h-60 rounded-xl overflow-hidden border border-gray-600">
              {typeof editImage === "string" ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${editImage}`}
                  alt="Preview"
                  fill
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  width={400}
                  height={400}
                  src={URL.createObjectURL(editImage)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 w-6 h-6 flex items-center justify-center text-white rounded-full p-1 hover:bg-red-600"
                onClick={() => setEditImage(null)}
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            <label className="relative w-72 h-60 flex items-center justify-center cursor-pointer rounded-xl border-2 border-dashed border-gray-500 text-white bg-transparent hover:bg-gray-700 transition">
              <span className="text-center pointer-events-none">
                Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) =>
                  e.target.files && setEditImage(e.target.files[0])
                }
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 flex-wrap mt-6">
        {/* Title */}
        <CustomAdminInput
          title="Title"
          value={editData.title || ""}
          onChange={(val) => handleChange("title", val)}
        />

        {/* Published Date */}
        <div className="flex flex-col">
          <label className="text-white mb-1">Published At</label>
          <div className="flex items-center gap-0 mt-2 relative border border-[#383C47] rounded-[.6rem]">
            <DatePicker
              placeholderText="yyyy-mm-dd:hh:mm:ss"
              selected={publishedAt}
              onChange={(date: Date | null) => setPublishedAt(date)}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full p-2 rounded-md bg-transparent text-white"
              calendarClassName="bg-[#1F2937] text-white rounded-lg"
            />
            <FaCalendar className="text-[#383C47] right-2 absolute" />
          </div>
        </div>

        {/* Type */}
        <TypeDropdown
          value={editData.type || ""}
          onChange={(val) => handleChange("type", val)}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-4 my-12">
        <span className="text-white text-sm">Is Published ?</span>
        <AdminToggleSwitch
          checked={status === "published"}
          onChange={(checked: boolean) =>
            setStatus(checked ? "published" : "draft")
          }
        />
      </div>

      {/* Message Content - REPLACED WITH REACTQUILL */}
      <div className="mt-4 w-full">
        <label className="block font-medium mb-2 text-white">
          Message Content
        </label>
        <ReactQuill
          theme="snow"
          value={editData.message_content || ""}
          onChange={(content) => handleChange("message_content", content)}
          modules={quillModules}
          className="react-quill-editor"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={() => router.back()}
        >
          Back
        </button>
        <button
          className={`px-4 py-2 rounded ${
            hasChanged
              ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={!hasChanged}
        >
          Save
        </button>
      </div>
    </div>
  );
}