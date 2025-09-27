"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import CustomAdminInput from "@/components/modules/p-admin/CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { toast , ToastContainer } from "react-toastify";
import "@/styles/p-admin/AdminTextEditor.css";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { AnimatePresence, motion } from "framer-motion";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import type ReactQuillType from "react-quill";
import FaqsTable, { Faq } from "./FaqTable";

const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return RQ;
}, {
  ssr: false,
}) as unknown as React.ForwardRefExoticComponent<
  ReactQuillType["props"] & React.RefAttributes<ReactQuillType>
>;

export default function FaqsPage() {
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
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
  const [showTitle, setShowTitle] = useState(true);

  const createQuillRef = useRef<ReactQuillType>(null);
  const editQuillRef = useRef<ReactQuillType>(null);

   useEffect(() => {
     if (typeof window === 'undefined') return;
 
     Promise.all([
       import("react-quill").then(m => m.Quill),
       import("quill-image-uploader").then(m => m.default)
     ]).then(([Quill, ImageUploader]) => {
       const quillAny: any = Quill;
       
       if (Quill && !quillAny.imports['modules/imageUploader']) {
         Quill.register("modules/imageUploader", ImageUploader);
       }
     }).catch(error => {
       console.error("Failed to load Quill modules:", error);
     });
     
   }, []);

  const fetchFaqs = useCallback(async (pageNumber: number = 1) => {
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
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        const faqsData: Faq[] = res.data.data.map((f) => ({
          id: f.id,
          title: f.title || f.description.slice(0, 30),
          description: f.description,
          created_at: f.created_at,
        }));
        setFaqs(faqsData);
        setPage(res.data.meta?.current_page || 1);
        setLastPage(res.data.meta?.last_page || 1);
      } else {
        toast.error(res.message || "Failed to fetch faq");
      }
    } catch {
      toast.error("Error while fetching faq");
    } finally {
      setListLoading(false);
    }
  }, []);

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
        toast.success(res.message || "faq created successfully!");
        setCreateFormData({ title: "", description: "" });
        fetchFaqs(page);
      } else toast.error(res.message || "Something went wrong!");
    } catch {
      toast.error("Error while creating faq!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditModal(faq);
    setEditFormData({ title: faq.title, description: faq.description });
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
        toast.success(res.data.message || "faq updated successfully!");
        setEditModal(null);
        fetchFaqs(page);
      } else {
        toast.error(res.error?.message || "Failed to update faq .");
      }
    } catch {
      toast.error("Unexpected error while updating faq .");
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
      } else toast.error(res.error?.message || "Failed to delete faq.");
    } catch {
      toast.error("Unexpected error while deleting faq.");
    } finally {
      setModalLoading(false);
    }
  };



  const quillModules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image"],
        ],
      imageUploader: {
          upload: (file: File) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target && e.target.result) {
                  resolve(e.target.result as string);
                } else {
                  reject("Error reading file.");
                }
              };
              reader.readAsDataURL(file);
            });
          },
        },
      },
    };
  }, []);

  return (
    <>
      <LineTitle onClick={() => setShowTitle(!showTitle)} title="Manage faqs" />
      <ToastContainer />
      {showTitle && (
        <AnimationTemplate>
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
              <ReactQuill
                ref={createQuillRef}
                theme="snow"
                value={createFormData.description}
                onChange={(val) =>
                  setCreateFormData((prev) => ({ ...prev, description: val }))
                }
                placeholder="Type here..."
                modules={quillModules}
              />
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
              {loading ? "Creating..." : "Create faq"}
            </button>
          </div>
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
                    Edit Faq &quot;{editModal.title}&quot;
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
                    <ReactQuill
                      ref={editQuillRef}
                      theme="snow"
                      value={editFormData.description}
                      onChange={(val) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          description: val,
                        }))
                      }
                      placeholder="Edit description..."
                      modules={quillModules}
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
                    {deleteModal.title || deleteModal.description.slice(0, 30)}
                    &quot;?
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
        </AnimationTemplate>
      )}
    </>
  );
}
