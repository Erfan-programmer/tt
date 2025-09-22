"use client";
import React, { useState, useEffect, useCallback } from "react";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import CustomAdminInput from "@/components/modules/p-admin/CustomAdminInput";
const CkEditorWrapper = dynamic(() => import("@/components/modules/CkEditor"), {
  ssr: false,
});
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import "@/styles/p-admin/CkEditor.css";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import FaqsTable, { Faq } from "./FaqTable";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

export default function AdminFaqsPage() {
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
  });
  const [editModal, setEditModal] = useState<Faq | null>(null);

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [deleteModal, setDeleteModal] = useState<Faq | null>(null);
  const [modalLoading, setModalLoading] = useState(false);


  const fetchFaqs = useCallback(
    async (pageNumber: number = 1) => {
      setListLoading(true);
      const token = loadEncryptedData()?.token;
      try {
        const res = await apiRequest<{
          data: any[];
          meta: { current_page: number; last_page: number };
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/faqs?page=${pageNumber}`,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (res.success && res.data) {
          const faqsData: Faq[] = res.data.data.map((f) => ({
            id: f.id,
            title: f.title || f.content.slice(0, 30),
            content: f.content,
            created_at: f.created_at,
          }));
          setFaqs(faqsData);
          setPage(res.data.meta?.current_page || 1);
          setLastPage(res.data.meta?.last_page || 1);
        } else {
          toast.error(res.message || "Failed to fetch FAQs");
        }
      } catch {
        toast.error("Error while fetching FAQs");
      } finally {
        setListLoading(false);
      }
    },
    [setFaqs, setPage, setLastPage, setListLoading]
  );

  useEffect(() => {
    fetchFaqs(page);
  }, [fetchFaqs, page]);

  const handleSubmit = async () => {
    if (!createFormData.title.trim() || !createFormData.description.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    setLoading(true);
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createFaqs`,
        "POST",
        createFormData,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success(res.message || "FAQ created successfully!");
        setCreateFormData({ title: "", description: "" });
        fetchFaqs(page);
      } else toast.error(res.message || "Something went wrong!");
    } catch {
      toast.error("Error while creating FAQ!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditModal(faq);
    setEditFormData({ title: faq.title, description: faq.content });
  };

  const handleUpdate = async () => {
    if (!editModal) return;
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    setModalLoading(true);
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<{ message: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateFaqs/${editModal.id}`,
        "POST",
        editFormData,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        toast.success(res.data.message || "FAQ updated successfully!");
        setEditModal(null);
        fetchFaqs(page);
      } else {
        toast.error(res.error?.message || "Failed to update FAQ.");
      }
    } catch {
      toast.error("Unexpected error while updating FAQ.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setModalLoading(true);
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<{ message: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteFaqs/${deleteModal.id}`,
        "DELETE",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        toast.success(res.data.message || "Deleted successfully!");
        setDeleteModal(null);
        const newPage = faqs.length === 1 && page > 1 ? page - 1 : page;
        fetchFaqs(newPage);
      } else toast.error(res.error?.message || "Failed to delete FAQ.");
    } catch {
      toast.error("Unexpected error while deleting FAQ.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <LineTitle onClick={() => {}} title="Manage FAQs" />
      {/* 🔹 Create Form */}
      <div className="flex flex-col gap-4 mb-4">
        <CustomAdminInput
          title="Title"
          type="text"
          value={createFormData.title}
          onChange={(val) =>
            setCreateFormData((prev) => ({ ...prev, title: val }))
          }
          readOnly={loading}
        />
        <div className="mt-4 w-full">
          <label className="block font-medium mb-2 text-white">
            Long Description
          </label>
          {isMounted && (
            <CkEditorWrapper
              data={createFormData.description}
              onChange={(val) =>
                setCreateFormData((prev) => ({
                  ...prev,
                  description: val,
                }))
              }
            />
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded w-fit text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create FAQ"}
        </button>
      </div>

      {/* 🔹 Table */}
      <FaqsTable
        faqs={faqs}
        loading={listLoading}
        page={page}
        lastPage={lastPage}
        onPageChange={(p) => {
          setPage(p);
          fetchFaqs(p);
        }}
        onEdit={handleEdit}
        onDelete={(faq) => setDeleteModal(faq)}
      />

      {/* 🔹 Edit Modal */}
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
              className="bg-gray-900 text-white p-8 rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto flex flex-col gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-red-500 text-lg font-bold"
                onClick={() => setEditModal(null)}
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-center">
                Edit FAQ &quot;{editModal.title}&quot;
              </h2>

              <CustomAdminInput
                title="Title"
                type="text"
                value={editFormData.title}
                onChange={(val) =>
                  setEditFormData((prev) => ({ ...prev, title: val }))
                }
                readOnly={modalLoading}
              />

              <div className="w-full">
                <label className="block font-medium mb-2 text-white">
                  Description
                </label>
                <CkEditorWrapper
                  data={createFormData.description}
                  onChange={(val) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: val,
                    }))
                  }
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                  onClick={() => setEditModal(null)}
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleUpdate}
                  disabled={modalLoading}
                >
                  {modalLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Delete Modal */}
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
                Are you sure you want to delete &quot;
                {deleteModal.title || deleteModal.content.slice(0, 30)}&quot;?
              </h2>
              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                  onClick={() => setDeleteModal(null)}
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={modalLoading}
                >
                  {modalLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
