"use client";
import React, { useEffect, useState } from "react";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import { FaTable, FaThLarge, FaThList } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogTableView from "./views/BlogTableView";
import BlogBoxView from "./views/BlogBoxView";
import BlogInlineBoxView from "./views/BlogInlineBoxView";
import { apiRequest } from "@/libs/api";
import { Blog } from "@/types/p-admin/dashoard";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AnimationTemplate from "../AnimationTemplate";
import Image from "next/image";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "box" | "inline">("table");
  const [deleteModal, setDeleteModal] = useState<Blog | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();
  const [showLineTitle, setShowLineTile] = useState({
    blog_list: true,
  });
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/blogs`,
        "GET"
      );
      if (res.success && res.data) {
        setBlogs(res.data.data);
      }
    } catch {
      toast.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (blog: Blog) => setDeleteModal(blog);

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setLoadingDelete(true);
    const savedData = loadEncryptedData();
    const token = savedData?.token;

    try {
      const res = await apiRequest<{ message: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteBlogs/${deleteModal.id}`,
        "DELETE",
        undefined, // body هیچ چیزی نیست
        { Authorization: `Bearer ${token}` } // token در هدر
      );

      if (res.success && res.data) {
        toast.success(res.data.message || "Deleted successfully!");
        setDeleteModal(null);
        await fetchBlogs();
      } else {
        toast.error(res.error?.message || "Failed to delete blog.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    router.push(`/hrtaamst2025/blogs/edit/${blog.id}`);
  };
  const handleView = (blog: Blog) => {
    router.push(`/hrtaamst2025/blogs/show/${blog.id}`);
  };

  const renderSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl bg-gray-800 animate-pulse h-40 flex flex-col gap-2"
        >
          <div className="w-full h-24 bg-gray-700 rounded-lg"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center mt-10 gap-4 text-gray-400">
      <p className="text-xl">No blogs found</p>
      <div className="w-full h-20 bg-gray-700 rounded-lg"></div>
    </div>
  );

  return (
    <div>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            blog_list: !showLineTitle.blog_list,
          }));
        }}
        title="Blogs List"
      />
      {showLineTitle.blog_list && (
        <AnimationTemplate>
          <div className="flex items-center justify-end my-4 gap-3">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${
                viewMode === "table"
                  ? "bg-[var(--admin-bg-main)] text-blue-400 shadow-xl"
                  : "bg-[var(--admin-bg-color)] text-white"
              }`}
            >
              <FaTable />
            </button>
            <button
              onClick={() => setViewMode("box")}
              className={`p-2 rounded ${
                viewMode === "box"
                  ? "bg-[var(--admin-bg-main)] text-blue-400 shadow-xl"
                  : "bg-[var(--admin-bg-color)] text-white"
              }`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("inline")}
              className={`p-2 rounded ${
                viewMode === "inline"
                  ? "bg-[var(--admin-bg-main)] text-blue-400 shadow-xl"
                  : "bg-[var(--admin-bg-color)] text-white"
              }`}
            >
              <FaThList />
            </button>
          </div>

          {loading ? (
            renderSkeleton()
          ) : blogs.length === 0 ? (
            renderEmpty()
          ) : viewMode === "table" ? (
            <BlogTableView
              blogs={blogs}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ) : viewMode === "box" ? (
            <BlogBoxView
              blogs={blogs}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ) : (
            <BlogInlineBoxView
              blogs={blogs}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}

          <AnimatePresence>
            {deleteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setDeleteModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 text-white p-6 rounded-2xl w-96 flex flex-col gap-4 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-3 right-3 text-red-500 text-lg font-bold"
                    onClick={() => setDeleteModal(null)}
                  >
                    ✕
                  </button>

                  {deleteModal.image && (
                    <Image
                      width={400}
                      height={400}
                      src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${deleteModal.image}`}
                      alt={deleteModal.title as string}
                      className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-blue-500"
                    />
                  )}

                  <h2 className="text-xl font-semibold text-center mt-2">
                    {deleteModal.title}
                  </h2>

                  <p className="text-gray-400 text-sm text-center">
                    {deleteModal.short_description}
                  </p>

                  <div className="flex flex-col gap-2 text-sm mt-2">
                    <div className="flex justify-between">
                      {deleteModal.author && (
                        <span className="text-gray-500">
                          <strong>Author:</strong> {deleteModal.author}
                        </span>
                      )}
                      {deleteModal.created_at && (
                        <span className="text-gray-500">
                          <strong>Date:</strong>{" "}
                          {new Date(
                            deleteModal.created_at
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {deleteModal.category?.title && (
                      <div className="flex justify-between">
                        <span className="text-blue-400">
                          <strong>Category:</strong>{" "}
                          {deleteModal.category.title}
                        </span>
                      </div>
                    )}

                    {deleteModal.tags && deleteModal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {deleteModal.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[.8rem] bg-[#2a2f3a] text-blue-400 px-2 py-1 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-4 justify-end">
                    <button
                      className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                      onClick={() => setDeleteModal(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 disabled:opacity-50"
                      onClick={confirmDelete}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimationTemplate>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
