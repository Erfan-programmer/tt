"use client";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import CustomAdminInput from "../CustomAdminInput";

interface Department {
  id: number;
  name: string;
  created_at: string;
}

interface DepartmentListProps {
  departments: Department[];
  fetchDepartments: () => void;
}

export default function DepartmentList({
  departments,
  fetchDepartments,
}: DepartmentListProps) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const token = loadEncryptedData()?.token;

  const handleEditClick = (dep: Department) => {
    setEditId(dep.id);
    setEditName(dep.name);
  };

  const saveEdit = async () => {
    if (!editId) return;
    setLoadingEdit(true);
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/editDepartment/${editId}`,
      "POST",
      { name: editName },
      { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    );
    if (res.success) {
      toast.success("Department updated successfully!");
      fetchDepartments();
      setEditId(null);
      setEditName("");
    } else {
      toast.error(res.message);
    }
    setLoadingEdit(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoadingDelete(true);
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteDepartment/${deleteId}`,
      "POST",
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (res.success) {
      toast.success("Department deleted successfully!");
      fetchDepartments();
    } else {
      toast.error(res.message);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
    setLoadingDelete(false);
  };

  const columns: TableColumn<Department>[] = [
    { title: "ID", field: "id" },
    { title: "Name", field: "name" },
    {
      title: "Created At",
      field: "created_at",
      render: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "Action",
      field: "id",
      render: (_value: any, row: Department) => (
        <div className="flex gap-2 justify-center">
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
      <AdminDynamicTable<Department>
        columns={columns}
        data={departments}
        title="Department List"
      />

      {editId && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[400px] space-y-4">
            <p className="text-white text-lg font-semibold">Edit Department</p>
            <motion.div
              key={editId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <CustomAdminInput
                title="Title"
                value={editName}
                onChange={(val) => setEditName(val)}
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

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl">
            <p className="text-white mb-4">
              Are you sure you want to delete this department?
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
