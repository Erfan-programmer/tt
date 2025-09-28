"use client";
import AdminPagination from "@/components/modules/p-admin/AdminPagination";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaEdit,
  FaEye,
  FaMinusCircle,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BlogCategory {
  id: number;
  title: string;
  icon: string;
  createdAt: string;
}

interface Props {
  categories: BlogCategory[];
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function BlogCategoriesTable({
  categories,
  page,
  lastPage,
  onPageChange,
}: Props) {
  const [viewModal, setViewModal] = useState<BlogCategory | null>(null);
  const [editModal, setEditModal] = useState<BlogCategory | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState<BlogCategory | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditIcon(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEditPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeEditIcon = () => {
    setEditIcon(null);
    setEditPreview(null);
  };

  const handleEditSubmit = async () => {
    if (!editModal) return;
    if (!editTitle) {
      toast.error("Title cannot be empty");
      return;
    }
    const savedData = loadEncryptedData();
    const token = savedData?.token;
    const formData = new FormData();
    formData.append("title", editTitle);
    if (editIcon) formData.append("icon", editIcon);

    setLoadingEdit(true);
    const res = await apiRequest<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateBlogCategory/${editModal.id}`,
      "POST",
      formData,
      { Authorization: `Bearer ${token}` }
    );
    setLoadingEdit(false);

    if (res.success && res.data) {
      toast.success(res.data.message || "Updated successfully!");
      setEditModal(null);
      onPageChange(page);
    } else {
      toast.error(res.error?.message || "Failed to update category.");
    }
  };

  const columns: TableColumn<any>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Title", field: "title" },
    {
      title: "Icon",
      field: "icon",
      render: (value: any) => (
        <Image
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${value}`}
          alt="icon"
          className="w-16 h-16 object-cover rounded-full border border-gray-300 mx-auto"
        />
      ),
    },
    {
      title: "Created At",
      field: "createdAt",
      render: (value: any) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Action",
      field: "id",
      render: (_id: any, row: BlogCategory) => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-2 rounded text-[#6A6A6A] hover:text-yellow-500"
            onClick={() => setViewModal(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-2 rounded text-[#6A6A6A] hover:text-blue-500"
            onClick={() => {
              setEditModal(row);
              setEditTitle(row.title);
              setEditPreview(
                `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${row.icon}`
              );
              setEditIcon(null);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="p-2 rounded text-[#6A6A6A] hover:text-red-500"
            onClick={() => setDeleteModal(row)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminDynamicTable columns={columns} data={categories} />
      <AdminPagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={onPageChange}
      />

      <AnimatePresence>
        {viewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setViewModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 text-white p-8 rounded-2xl w-96 flex flex-col items-center gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-red-500 text-lg font-bold"
                onClick={() => setViewModal(null)}
              >
                ✕
              </button>
              <Image
                width={200}
                height={200}
                src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${viewModal.icon}`}
                alt="icon"
                className="w-40 h-40 object-cover rounded-full border-4 border-gray-700"
              />
              <h2 className="text-2xl font-semibold text-center">
                {viewModal.title}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setEditModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 text-white p-8 rounded-2xl w-96 relative space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-red-500 text-lg font-bold"
                onClick={() => setEditModal(null)}
              >
                ✕
              </button>

              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-medium">Icon</label>
                <div className="flex items-center gap-4 relative justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="edit-icon-upload"
                    onChange={handleIconChange}
                  />
                  <div className="relative">
                    {editPreview && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 absolute top-0 right-0 z-[2]"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEditIcon();
                        }}
                      >
                        <FaMinusCircle size={28} />
                      </button>
                    )}
                    <label
                      htmlFor="edit-icon-upload"
                      className="w-40 h-40 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:border-blue-400 transition relative"
                    >
                      {editPreview ? (
                        <Image
                          width={200}
                          height={200}
                          src={editPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <FaCloudUploadAlt size={28} className="text-gray-400" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                  onClick={() => setEditModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleEditSubmit}
                  disabled={loadingEdit}
                >
                  {loadingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-gray-900 text-white p-8 rounded-2xl w-96 flex flex-col items-center gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-red-500 text-lg font-bold"
                onClick={() => setDeleteModal(null)}
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-center">
                Are you sure you want to delete &quot;{deleteModal.title}&quot;?
              </h2>
              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                  onClick={() => setDeleteModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 disabled:opacity-50"
                  onClick={async () => {
                    if (!deleteModal) return;
                    setLoadingDelete(true);
                    const savedData = loadEncryptedData();
                    const token = savedData?.token;

                    const res = await apiRequest<{ message: string }>(
                      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteBlogCategory/${deleteModal.id}`,
                      "DELETE",
                      undefined,
                      { Authorization: `Bearer ${token}` }
                    );

                    setLoadingDelete(false);

                    if (res.success && res.data) {
                      toast.success(
                        res.data.message || "Deleted successfully!"
                      );
                      setDeleteModal(null);

                      const isLastItemOnPage =
                        categories.length === 1 && page > 1;
                      const newPage = isLastItemOnPage ? page - 1 : page;

                      onPageChange(newPage);
                    } else {
                      toast.error(
                        res.error?.message || "Failed to delete category."
                      );
                    }
                  }}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
