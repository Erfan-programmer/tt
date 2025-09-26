"use client";
import React, { useState } from "react";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "./AdminTable";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../EncryptData/SavedEncryptData";
import CustomAdminInput from "./CustomAdminInput";
import { Crypto } from "@/types/p-admin/Message";
import Image from "next/image";

interface CryptoTableProps {
  cryptos: Crypto[];
  fetchCryptos: () => void;
}

export default function DepositCryptosTable({
  cryptos,
  fetchCryptos,
}: CryptoTableProps) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Crypto>>({});
  const [editPreview, setEditPreview] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const token = loadEncryptedData()?.token;

  // ---------- Edit Handlers ----------
  const handleEditClick = (crypto: Crypto) => {
    setEditId(crypto.id);
    setEditData({ ...crypto });
    setEditPreview(
      crypto.icon_path
        ? typeof crypto.icon_path === "string"
          ? crypto.icon_path.startsWith("http")
            ? crypto.icon_path
            : process.env.NEXT_PUBLIC_API_URL_STORAGE + "/" + crypto.icon_path
          : ""
        : ""
    );
  };

  const handleEditChange = (field: keyof Crypto, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveIcon = () => {
    if (editData.icon_path instanceof File && editPreview) {
      URL.revokeObjectURL(editPreview);
    }
    setEditData((prev) => ({ ...prev, icon_path: "" }));
    setEditPreview("");
  };

  const handleEditIconUpload = (file: File) => {
    if (editPreview && editData.icon_path instanceof File) {
      URL.revokeObjectURL(editPreview);
    }
    setEditData((prev) => ({ ...prev, icon_path: file }));
    setEditPreview(URL.createObjectURL(file));
  };

  const saveEdit = async () => {
    if (!editId) return;
    setLoadingEdit(true);
    const formData = new FormData();
    formData.append("title", editData.title || "");
    formData.append("network", editData.network || "");
    formData.append("description", editData.description || "");
    if (editData.icon_path instanceof File)
      formData.append("icon", editData.icon_path);

    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateCrypto/${editId}`,
      "POST",
      formData,
      { Authorization: `Bearer ${token}` }
    );

    if (res.success) {
      toast.success("Crypto updated successfully!");
      fetchCryptos();
      setEditId(null);
      setEditData({});
      setEditPreview("");
    } else {
      toast.error("Error updating crypto: " + res.message);
    }
    setLoadingEdit(false);
  };

  const CircleUploader = ({
    id,
    preview,
    onUpload,
    onRemove,
  }: {
    id: number;
    preview?: string;
    onUpload: (id: number, file: File) => void;
    onRemove: (id: number) => void;
  }) => (
    <div className="relative flex items-center">
      <label
        htmlFor={`upload-${id}`}
        className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden bg-[#2a2a2a]"
      >
        {preview ? (
          <Image
            width={400}
            height={400}
            src={preview}
            alt="icon preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">Upload</span>
        )}
      </label>
      <input
        id={`upload-${id}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(id, e.target.files[0])}
      />
      {preview && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center text-xs"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );

  // ---------- Delete Handlers ----------
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoadingDelete(true);
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteCrypto/${deleteId}`,
      "POST",
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (res.success) {
      toast.success("Crypto deleted successfully!");
      fetchCryptos();
    } else {
      toast.error("Error deleting crypto: " + res.message);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
    setLoadingDelete(false);
  };

  const columns: TableColumn<Crypto>[] = [
    { title: "ID", field: "id" },
    { title: "Title", field: "title" },
    { title: "Network", field: "network" },
    { title: "Description", field: "description" },
    {
      title: "Icon",
      field: "icon_path",
      render: (value: any) =>
        value ? (
          <Image
            width={400}
            height={400}
            src={
              typeof value === "string"
                ? value.startsWith("http")
                  ? value
                  : process.env.NEXT_PUBLIC_API_URL_STORAGE + "/" + value
                : URL.createObjectURL(value)
            }
            alt="icon"
            className="w-8 h-8 rounded"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Created At",
      field: "created_at",
      render: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "Action",
      field: "id",
      render: (_value: any, row: Crypto) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => handleEditClick(row)}
          >
            <FaEdit />
          </button>
          <button
            className="p-1 rounded text-red-500"
            onClick={() => handleDeleteClick(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<Crypto> columns={columns} data={cryptos} />

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[500px] space-y-4">
            <p className="text-white text-lg font-semibold">
              Edit Withdraw Wallet
            </p>
            <motion.div
              key={editId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-4 items-end"
            >
              <CustomAdminInput
                title="Title"
                value={editData.title || ""}
                onChange={(val) => handleEditChange("title", val)}
              />
              <CustomAdminInput
                title="Network"
                value={editData.network || ""}
                onChange={(val) => handleEditChange("network", val)}
              />
              <CustomAdminInput
                title="Description"
                value={editData.description || ""}
                onChange={(val) => handleEditChange("description", val)}
              />
              <CircleUploader
                id={editId}
                preview={editPreview}
                onUpload={(id, file) => handleEditIconUpload(file)}
                onRemove={handleRemoveIcon}
              />
            </motion.div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded text-white"
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 rounded text-white"
                onClick={saveEdit}
                disabled={loadingEdit}
              >
                {loadingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl">
            <p className="text-white mb-4">
              Are you sure you want to delete this crypto?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded text-white"
                onClick={confirmDelete}
                disabled={loadingDelete}
              >
                {loadingDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
