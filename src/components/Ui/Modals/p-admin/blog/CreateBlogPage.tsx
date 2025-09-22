"use client";
import "@/styles/p-admin/CkEditor.css";
import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import CustomAdminInput from "@/components/modules/p-admin/CustomAdminInput";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import { apiRequest } from "@/libs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CkEditorWrapper = dynamic(() => import("@/components/modules/CkEditor"), {
  ssr: false,
});
import { FaTimes } from "react-icons/fa";
// import CustomUploadAdapterPlugin from "./CustomUploadAdapterPlugin";
import CategoryDropdown from "./CategoryDropDown";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AnimationTemplate from "../AnimationTemplate";
import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

interface FormData {
  title: string;
  short_description: string;
  references: string;
  author: string;
  tags: string[];
  blog_category_id: string;
  image: File | null;
  long_description: string;
}

export default function CreateBlogPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    short_description: "",
    references: "",
    author: "",
    tags: [],
    blog_category_id: "",
    image: null,
    long_description: "",
  });

  const router = useRouter();

  const [tagInput, setTagInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [showLineTitle, setShowLineTile] = useState({
    create_blog: true,
  });
  const handleChange = (
    key: keyof FormData,
    value: FormData[keyof FormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "blog_category_id" ? String(value) : value,
    }));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const isFormValid =
    formData.title.trim() &&
    formData.short_description.trim() &&
    formData.references.trim() &&
    formData.author.trim() &&
    formData.blog_category_id.trim() &&
    formData.long_description.trim() &&
    formData.image;

  const handleSubmit = async () => {
    if (!isFormValid || isPending) return;

    setIsPending(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createBlogs`;
    const body = new FormData();

    body.append("title", formData.title);
    body.append("long_description", formData.long_description);
    body.append("short_description", formData.short_description);
    body.append("references", formData.references);
    body.append("author", formData.author);
    body.append("blog_category_id", formData.blog_category_id);

    if (formData.image) body.append("image", formData.image);
    formData.tags.forEach((tag, index) => body.append(`tags[${index}]`, tag));

    const savedData = loadEncryptedData();
    const token = savedData?.token;

    try {
      const response = await apiRequest<any>(url, "POST", body, {
        Authorization: `Bearer ${token}`,
      });
      if (response.success) {
        toast.success(response.message || "Blog created successfully ✅", {
          position: "top-right",
        });
      } else {
        toast.error(`Error: ${response.error?.message}`, {
          position: "top-right",
        });
      }
    } catch (error: any) {
      toast.error(`Request failed: ${error.message}`, {
        position: "top-right",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            create_blog: !showLineTitle.create_blog,
          }));
        }}
        title="Create Blog"
      />
      {showLineTitle.create_blog && (
        <AnimationTemplate>
          <div className="mt-1 gap-4 p-4 border-[2px] border-[#383C47] rounded-lg flex items-start flex-wrap">
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="mb-4">
                <label className="block font-medium text-white">Title</label>
                <CustomAdminInput
                  title=""
                  value={formData.title}
                  onChange={(val) => handleChange("title", val)}
                  type="text"
                />
              </div>

              <div className="mb-4">
                <CategoryDropdown
                  selectedCategoryId={formData.blog_category_id}
                  onChange={(id) => handleChange("blog_category_id", id)}
                />
              </div>

              <CustomAdminInput
                title="Short Description"
                value={formData.short_description}
                onChange={(val) => handleChange("short_description", val)}
                type="text"
              />

              <CustomAdminInput
                title="Author"
                value={formData.author}
                onChange={(val) => handleChange("author", val)}
                type="text"
              />
            </div>

            <div className="grid grid-cols-2 w-full gap-4">
              <CustomAdminInput
                title="References"
                value={formData.references}
                onChange={(val) => handleChange("references", val)}
                type="text"
              />
              <div className="flex flex-col w-full">
                <label className="block font-medium text-white">Tags</label>
                <textarea
                  className="w-full border border-gray-600 rounded p-2 bg-transparent mt-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-500 bg-transparent border-[2px] border-blue-400 px-2 py-1 rounded flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-400 font-bold"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-col w-full">
              <label className="block font-medium mt-4 text-white">Image</label>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg w-full h-48 relative cursor-pointer hover:border-blue-500">
                {!formData.image ? (
                  <label className="flex flex-col w-full items-center justify-center h-full cursor-pointer text-gray-400 relative">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      width={400}
                      height={400}
                      src={URL.createObjectURL(formData.image)}
                      alt="preview"
                      className="object-contain max-h-full max-w-full"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 w-full">
              <label className="block font-medium mb-2 text-white">
                Long Description
              </label>
              <CkEditorWrapper
                data={formData.long_description}
                onChange={(data) => handleChange("long_description", data)}
              />
            </div>
            <div className="flex items-center mt-6 gap-4">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isPending}
                className={`titan-btn px-4 py-2 rounded text-white titan-tn transition ${
                  !isFormValid || isPending
                    ? "!bg-gray-400 cursor-not-allowed"
                    : ""
                }`}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Create Blog"
                )}
              </button>
              <button
                onClick={() => router.back()}
                className="titan-btn !bg-gray-400"
              >
                Back
              </button>
            </div>
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
