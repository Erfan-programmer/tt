"use client";
import React, { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export interface AdminUser {
  id: number;
  name: string;
  eid: number;
  lastName?: string;
  phone?: string;
  password?: string;
  last_login?: string;
  email: string;
  roles: string;
}

interface Role {
  id: number;
  name: string;
}

interface EmployeeListProps {
  users?: AdminUser[];
  refetch?: () => void;
}

type CodesType = {
  code: string;
  qr_code_url: string;
  secret_key: string;
};
interface TwoFAData {
  code: string | null;
  qr_code_url: string | null;
  secret_key: string | null;
}

export default function EmployeeList({ users, refetch }: EmployeeListProps) {
  const [twoFAData, setTwoFAData] = useState<TwoFAData>({
    code: null,
    qr_code_url: null,
    secret_key: null,
  });

  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | "">("");

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [selected2FAUser, setSelected2FAUser] = useState<AdminUser | null>(
    null
  );
  const [twoFACode] = useState<string | null>(null);
  const [has2FACode, setHas2FACode] = useState<boolean | null>(null);
  const [loading2FA, setLoading2FA] = useState(false);

  const token = loadEncryptedData()?.token;

  const handleEdit = async (user: AdminUser) => {
    setEditingUser(user);
    setShowEditModal(true);
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/roles`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) setRoles(res.data.data);
      const roleObj = res.data.data.find((r: Role) => r.name === user.roles);
      setSelectedRole(roleObj ? roleObj.id : "");
    } catch {
      toast.error("Failed to load roles");
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setSelectedRole("");
  };

  const handleCopy = async (secret_key: string) => {
    try {
      await navigator.clipboard.writeText(secret_key);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  const handleView = (user: AdminUser) => {
    setEditingUser(user);
    setShowViewModal(true);
  };
  const closeViewModal = () => {
    setShowViewModal(false);
    setEditingUser(null);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setLoading(true);
    try {
      await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateAdmin/${editingUser.eid}`,
        "POST",
        {
          name: editingUser.name,
          lastName: editingUser.lastName,
          phone: editingUser.phone,
          email: editingUser.email,
          password: editingUser.password,
          role: selectedRole,
        },
        { Authorization: `Bearer ${token}` }
      );
      toast.success("User updated successfully");
      closeEditModal();
      refetch?.();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setLoading(true);
    try {
      await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteAdmin/${userToDelete.eid}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("User deleted successfully");
      closeDeleteModal();
      refetch?.();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handle2FaCode = async (user: AdminUser) => {
    setSelected2FAUser(user);
    setShow2FAModal(true);
    setLoading2FA(true);
    try {
      const res = await apiRequest<{ data: CodesType }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admina/get2faCode/${user.eid}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data?.data) {
        setTwoFAData({
          code: res.data.data.code,
          qr_code_url: res.data.data.qr_code_url,
          secret_key: res.data.data.secret_key,
        });
        setHas2FACode(true);
      } else {
        setTwoFAData({ code: null, qr_code_url: null, secret_key: null });
        setHas2FACode(false);
      }
    } catch {
      toast.error("Failed to fetch 2FA code");
    } finally {
      setLoading2FA(false);
    }
  };

  const enable2FACode = async () => {
    if (!selected2FAUser) return;
    setLoading2FA(true);
    try {
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/enable2faCode/${selected2FAUser.eid}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("2FA enabled successfully!");
        handle2FaCode(selected2FAUser);
      } else {
        toast.error(res.message || "Failed to enable 2FA");
      }
    } catch {
      toast.error("Failed to enable 2FA");
    } finally {
      setLoading2FA(false);
    }
  };

  const columns: TableColumn<AdminUser>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Name", field: "name" },
    { title: "Last Name", field: "lastName" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
    { title: "Last Login", field: "last_login" },
    { title: "Roles", field: "roles" },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-blue-400 hover:text-blue-600"
            title="View"
            onClick={() => handleView(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-green-400 hover:text-green-600"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <FaEdit />
          </button>
          <button
            className="p-1 rounded text-red-400 hover:text-red-600"
            title="Delete"
            onClick={() => handleDeleteClick(row)}
          >
            <FaTrash />
          </button>
          <button
            className="p-1 rounded text-[var(--gold)] hover:text-[var(--gold)]"
            title="2FA"
            onClick={() => handle2FaCode(row)}
          >
            <BsQrCodeScan />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<AdminUser>
        columns={columns}
        data={users as any}
        loading={loading}
      />

      <AnimatePresence>
        {showEditModal && editingUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditModal}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-xl shadow-lg p-6 w-96"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Edit Admin</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={editingUser.lastName || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastName: e.target.value })
                  }
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                  placeholder="Last Name"
                />
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                  placeholder="Phone"
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={editingUser.password || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                  placeholder="Password"
                />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(Number(e.target.value))}
                  className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewModal && editingUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewModal}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-xl shadow-lg p-6 w-96"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">User Details</h2>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {editingUser.name}
                </p>
                <p>
                  <strong>Last Name:</strong> {editingUser.lastName || "-"}
                </p>
                <p>
                  <strong>Email:</strong> {editingUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {editingUser.phone || "-"}
                </p>
                <p>
                  <strong>Role:</strong> {editingUser.roles}
                </p>
                <p>
                  <strong>Last Login:</strong> {editingUser.last_login || "-"}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && userToDelete && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeleteModal}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-xl shadow-lg p-6 w-96"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{userToDelete.name}</strong>?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show2FAModal && selected2FAUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow2FAModal(false)}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-xl shadow-lg p-6 w-96"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">2FA Code</h2>
              {loading2FA && <p>Loading...</p>}
              {!loading2FA && has2FACode && twoFACode && (
                <p>
                  <strong>2FA Code:</strong> {twoFACode}
                </p>
              )}
              {!loading2FA && has2FACode === false && (
                <div className="flex flex-col gap-3">
                  <p>No 2FA code found for this user.</p>
                  <button
                    onClick={enable2FACode}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Enable 2FA
                  </button>
                </div>
              )}
              {twoFAData.qr_code_url && (
                <div className="flex items-center w-40 h-40 rounded-xl justify-center mx-auto">
                  <Image
                    src={twoFAData.qr_code_url}
                    alt=""
                    width={400}
                    height={400}
                    className="w-full h-full mx-auto"
                  />
                </div>
              )}
              <div className="flex items-center my-4">
                <input
                  type="text"
                  className="bg-transparent border-[2px] rounded-[.5rem] border-[#383C47] px-4 py-1"
                  value={twoFAData.secret_key || ""}
                />
                <button
                  className="bg-white text-[var(--box-background)] px-4 py-1 rounded-md"
                  onClick={() => handleCopy(twoFAData.secret_key || "")}
                >
                  Copy
                </button>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
