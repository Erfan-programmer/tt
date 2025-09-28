"use client";
import CustomAdminInput from "@/components/modules/p-admin/CustomAdminInput";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import React, { useCallback, useEffect, useState } from "react";
import BlogCategoriesTable from "./BlogCategoriesTable";
import LoaderSkeleton from "@/skeletons/my-admin/blogs/CategoryBlog";
import { FaCloudUploadAlt, FaMinusCircle, FaTimes } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimationTemplate from "../AnimationTemplate";
import Image from "next/image";

interface BlogCategory {
  id: number;
  title: string;
  icon: string;
  createdAt: string;
}

interface CategoryApiData {
  id: number;
  title: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export default function BlogCategoriesPage() {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [fetchingList, setFetchingList] = useState(false);
  const [showLineTitle, setShowLineTile] = useState({
    create_cat: true,
    create_list: true,
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIcon(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeSelectedImage = () => {
    setIcon(null);
    setPreview(null);
    const fileInput = document.getElementById(
      "icon-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const mapCategory = (apiData: CategoryApiData): BlogCategory => ({
    id: apiData.id,
    title: apiData.title,
    icon: apiData.icon,
    createdAt: apiData.created_at,
  });

  const fetchCategories = useCallback(async (pageNumber: number = 1) => {
    setFetchingList(true);
    try {
      const res = await apiRequest<{ data: CategoryApiData[]; meta: any }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/blogCategory?page=${pageNumber}`,
        "GET"
      );

      if (res.success && res.data?.data) {
        setCategories(res.data.data.map(mapCategory));
        setPage(pageNumber);
        setLastPage(res.data.meta?.last_page || 1);
      } else {
        toast.error(res.error?.message || "Failed to fetch categories.", {
          position: "top-right",
        });
      }
    } catch {
      toast.error("Failed to fetch categories.", { position: "top-right" });
    } finally {
      setFetchingList(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !icon) {
      toast.error("Please enter both title and icon.", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("icon", icon);

    const savedData = loadEncryptedData();
    const token = savedData?.token;

    setLoading(true);

    const res = await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createBlogCategory`,
      "POST",
      formData,
      { Authorization: `Bearer ${token}` }
    );

    setLoading(false);

    if (res.success && res.data) {
      toast.success(res.data.message || "Category created successfully!", {
        position: "top-right",
      });
      setTitle("");
      setIcon(null);
      setPreview(null);
      fetchCategories(page); // Refresh list
    } else {
      toast.error(res.error?.message || "Failed to create category.", {
        position: "top-right",
      });
    }
  };

  const isCreateEnabled = !!title && !!icon && !loading;

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            create_cat: !showLineTitle.create_cat,
          }));
        }}
        title="Create New Category"
      />
      {showLineTitle.create_cat && (
        <AnimationTemplate>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <CustomAdminInput
                title="Title"
                value={title}
                onChange={setTitle}
              />

              {/* Image uploader */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Icon
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    id="icon-upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="icon-upload"
                    className="w-16 h-16 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:border-blue-400 transition relative overflow-hidden"
                  >
                    {preview ? (
                      <Image
                        width={200}
                        height={200}
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaCloudUploadAlt size={28} className="text-gray-400" />
                    )}
                  </label>

                  {preview && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaMinusCircle size={28} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end my-8">
              <button
                type="submit"
                disabled={!isCreateEnabled}
                className={`titan-btn px-6 py-2 rounded-xl shadow-md ${
                  isCreateEnabled
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "!bg-gray-600 cursor-not-allowed"
                }`}
              >
                {loading ? "Submitting..." : "Create"}
              </button>
            </div>
          </form>
        </AnimationTemplate>
      )}

      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            create_list: !showLineTitle.create_list,
          }));
        }}
        title="Categories List"
      />
      {showLineTitle.create_list && (
        <AnimationTemplate>
          {fetchingList ? (
            <LoaderSkeleton rows={5} columns={5} />
          ) : (
            <BlogCategoriesTable
              categories={categories}
              page={page}
              lastPage={lastPage}
              onPageChange={fetchCategories}
            />
          )}
        </AnimationTemplate>
      )}

      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
    </>
  );
}
