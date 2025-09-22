"use client";
import React, { useState, useEffect, KeyboardEvent } from "react";
import { useParams } from "next/navigation";
import "./../../../styles/p-admin/CkEditor.css";

import CustomAdminInput from "@/components/modules/p-admin/CustomAdminInput";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import { apiRequest } from "@/libs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { FaTimes } from "react-icons/fa";
import CustomUploadAdapterPlugin from "@/components/Ui/Modals/p-admin/blog/CustomUploadAdapterPlugin";
import CategoryDropdown from "@/components/Ui/Modals/p-admin/blog/CategoryDropDown";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import EditBlogSkeleton from "@/skeletons/my-admin/blog/EditBlogSkeleton";
import Image from "next/image";

type BlogData = {
  title: string;
  short_description: string;
  references: string;
  author: string;
  tags: string[];
  blog_category_id: string;
  categoryTitle?: string;
  image: File | string | null;
  long_description: string;
};

export default function EditBlogDetailPage() {
  const params = useParams();
  const blogId = params?.id as string | undefined;

  const [formData, setFormData] = useState<BlogData>({
    title: "",
    short_description: "",
    references: "",
    author: "",
    tags: [],
    blog_category_id: "",
    image: null,
    long_description: "",
  });
  const [initialData, setInitialData] = useState<BlogData | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!blogId) {
      setLoading(false);
      return;
    }
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await apiRequest<{ data: any }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/showBlog/${blogId}`
        );
        if (res.success && res.data) {
          const data = res.data.data;
          const formatted: BlogData = {
            ...data,
            blog_category_id: String(data.blog_category_id),
            categoryTitle: data.category?.title || "",
            image: data.image || null,
          };
          setFormData(formatted);
          setInitialData(formatted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleChange = (key: keyof BlogData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "blog_category_id" ? String(value) : value,
    }));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();

      const currentTags = Array.isArray(formData?.tags) ? formData.tags : [];

      if (!currentTags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...currentTags, tagInput.trim()],
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
  };

  const removeImage = () => setFormData((prev) => ({ ...prev, image: null }));

  const isFormValid: boolean =
    Boolean(formData?.title?.trim()) &&
    Boolean(formData?.short_description?.trim()) &&
    Boolean(formData?.references?.trim()) &&
    Boolean(formData?.author?.trim()) &&
    Boolean(String(formData?.blog_category_id || "").trim()) &&
    Boolean(formData?.long_description?.trim());

  const isDirty: boolean =
    initialData !== null &&
    JSON.stringify({ ...formData, image: null }) !==
      JSON.stringify({ ...initialData, image: null });

  const handleSave = async () => {
    if (!isFormValid || !isDirty || isPending) return;
    setIsPending(true);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateBlogs/${blogId}`;
    const body = new FormData();

    const fields: (keyof BlogData)[] = [
      "title",
      "short_description",
      "references",
      "author",
      "blog_category_id",
      "long_description",
    ];

    fields.forEach((field) => {
      if (formData[field] !== initialData?.[field]) {
        body.append(field, formData[field] as string);
      }
    });

    if (formData.image && formData.image !== initialData?.image) {
      body.append("image", formData.image as File);
    }

    const initialTags = initialData?.tags || [];
    if (JSON.stringify(formData.tags) !== JSON.stringify(initialTags)) {
      formData.tags.forEach((tag, index) => body.append(`tags[${index}]`, tag));
    }

    const token = loadEncryptedData()?.token;

    try {
      const response = await apiRequest<any>(url, "POST", body, {
        Authorization: `Bearer ${token}`,
      });

      if (response.success) {
        toast.success(response.message || "Blog updated successfully ✅", {
          position: "top-right",
        });
        setInitialData(formData);
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

  const formattedDescription = formData?.long_description.replace(
    /src="\/uploads\/([^"]+)"/g,
    `src="${process.env.NEXT_PUBLIC_API_URL_STORAGE}/$1"`
  );

  if (loading) return <EditBlogSkeleton />;

  return (
    <>
      <ToastContainer />
      <LineTitle onClick={() => {}} title="Edit Blog" />
      <div className="mt-1 gap-4 p-4 border-[2px] border-[#383C47] rounded-lg flex items-start flex-wrap">
        <div className="grid grid-cols-2 gap-2 w-full">
          <CustomAdminInput
            title="Title"
            value={formData?.title}
            onChange={(val) => handleChange("title", val)}
            type="text"
          />
          <CategoryDropdown
            selectedCategoryId={formData?.blog_category_id}
            initialTitle={formData?.categoryTitle}
            onChange={(id, title) => {
              setFormData((prev) => ({
                ...prev,
                blog_category_id: id,
                categoryTitle: title,
              }));
            }}
          />
          <CustomAdminInput
            title="Short Description"
            value={formData?.short_description}
            onChange={(val) => handleChange("short_description", val)}
            type="text"
          />
          <CustomAdminInput
            title="Author"
            value={formData?.author}
            onChange={(val) => handleChange("author", val)}
            type="text"
          />
        </div>
        <div className="grid grid-cols-2 w-full gap-4">
          <CustomAdminInput
            title="References"
            value={formData?.references}
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
          {formData?.tags?.map((tag, index) => (
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
          <div className="mt-2 flex flex-col w-full items-center justify-center border-2 border-dashed border-gray-600 rounded-lg w-full h-48 relative cursor-pointer hover:border-blue-500">
            {!formData?.image ? (
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
                  src={
                    formData?.image instanceof File
                      ? URL.createObjectURL(formData?.image)
                      : `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${formData?.image}`
                  }
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
          <CKEditor
            editor={ClassicEditor}
            data={formattedDescription}
            config={{
              extraPlugins: [CustomUploadAdapterPlugin],
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "undo",
                "redo",
                "|",
                "imageUpload",
              ],
              image: {
                toolbar: [
                  "imageStyle:alignLeft",
                  "imageStyle:alignCenter",
                  "imageStyle:alignRight",
                  "|",
                  "resizeImage",
                  "|",
                  "imageTextAlternative",
                ],
              },
              mediaEmbed: { previewsInData: true },
            }}
            onChange={(_, editor) => {
              handleChange("long_description", editor.getData());
            }}
          />
          {/* <textarea
            name=""
            id=""
            value={formData.long_description}
            onChange={() => {
              handleChange("long_description", editor.getData());
            }}
          ></textarea> */}
        </div>
        <button
          onClick={handleSave}
          disabled={!isFormValid || !isDirty || isPending}
          className={`mt-6 titan-btn px-4 py-2 rounded text-white titan-tn transition ${
            !isFormValid || !isDirty || isPending
              ? "!bg-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
