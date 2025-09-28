"use client";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import CustomAdminInput from "../CustomAdminInput";
import LineTitle from "../LineTitle";
import SettingToggleSwitch from "./SettingToggleSwitch";
import PermissionsDropdown from "../Support/PermissionDropdown";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

interface PermissionItem {
  id: number;
  name: string;
  label: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface RoleItem {
  id: number;
  name: string;
  label: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: PermissionItem[];
}

export default function RolesConfig() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [activeRole, setActiveRole] = useState<number | null>(null);
  const [deleteRole, setDeleteRole] = useState<{
    id: number;
    show?: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const [newRole, setNewRole] = useState({
    name: "",
    label: "",
    ceo2fa: "",
    permissions: [] as number[],
  });

  const [editRole, setEditRole] = useState<{
    id: number;
    name: string;
    label: string;
    permissions: number[];
    show: boolean;
  } | null>(null);

  const handleChangeNewRole = (
    field: keyof typeof newRole,
    value: string | number[]
  ) => {
    setNewRole((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeEditRole = (field: any, value: string | number[]) => {
    if (!editRole) return;
    setEditRole({ ...editRole, [field]: value });
  };

  const handleSaveRole = async () => {
    const token = loadEncryptedData()?.token;
    try {
      const payload = {
        name: newRole.name,
        label: newRole.label,
        ceo2fa: newRole.ceo2fa,
        permissions: newRole.permissions,
      };
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createRoles`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success) {
        toast.success(response.message);
        setNewRole({ name: "", label: "", ceo2fa: "", permissions: [] });
        fetchRoles();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error("Failed to create role", error);
    }
  };
  const handleDeleteRole = async () => {
    if (!deleteRole) return;
    const token = loadEncryptedData()?.token;
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteRoles/${deleteRole.id}`,
        "DELETE",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (response.success) {
        toast.success(response.message);
        setDeleteRole(null);
        fetchRoles();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error("Failed to delete role", error);
    }
  };

  const handleUpdateRole = async () => {
    if (!editRole) return;
    const token = loadEncryptedData()?.token;
    try {
      const payload = {
        name: editRole.name,
        label: editRole.label,
        permissions: editRole.permissions,
      };
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateRoles/${editRole.id}`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (response.success) {
        toast.success(response.message);
        setEditRole(null);
        fetchRoles();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error("Failed to update role", error);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = loadEncryptedData()?.token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/roles`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (response?.data?.data) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) return <p>Loading roles...</p>;

  const allPermissions = roles.flatMap((r) => r.permissions);

  return (
    <div className="space-y-6 mt-6">
      <LineTitle title="Create New Role" onClick={() => {}} />
      <div className="border-[2px] rounded-[.5rem] border-[#383C47] px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <CustomAdminInput
            title="Role Name"
            value={newRole.name}
            onChange={(val) => handleChangeNewRole("name", val)}
          />
          <CustomAdminInput
            title="Role Label"
            value={newRole.label}
            onChange={(val) => handleChangeNewRole("label", val)}
          />
          <CustomAdminInput
            title="CEO 2FA Code"
            value={newRole.ceo2fa}
            onChange={(val) => handleChangeNewRole("ceo2fa", val)}
          />
          <div className="w-full md:w-64">
            <PermissionsDropdown
              selectedPermissions={newRole.permissions}
              onChange={(ids) => handleChangeNewRole("permissions", ids)}
            />
          </div>
        </div>

        {newRole.permissions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {newRole.permissions.map((id) => {
              const perm = allPermissions.find((p) => p.id === id);
              return (
                <span
                  key={id}
                  className="bg-[#1A68FF] text-white px-2 py-1 rounded-[.25rem] text-sm"
                >
                  {perm?.name || id}
                </span>
              );
            })}
          </div>
        )}

        <button
          onClick={handleSaveRole}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-fit mt-4"
        >
          + Add Role
        </button>
      </div>

      {roles.map((role, index) => (
        <div key={role.id} className="space-y-1">
          <div
            className="flex items-center gap-2 cursor-pointer pl-2 py-1"
            onClick={() => setActiveRole(activeRole === index ? null : index)}
          >
            <span className="text-[#1A68FF] font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
              {role.name}
            </span>
            <div className="flex-1 h-[2px] bg-[#1A68FF] ml-2"></div>
            <GoTriangleDown
              size={20}
              className={`transition-transform duration-300 ${
                activeRole === index ? "rotate-0" : "-rotate-90"
              } text-[#1A68FF]`}
            />
          </div>
          <AnimatePresence>
            {activeRole === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-4 mt-2 space-y-2 overflow-hidden"
              >
                {role.permissions.length > 0 ? (
                  role.permissions.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between bg-[#1A1A1A] px-4 py-1 rounded"
                    >
                      <span className="text-white whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {perm.name}
                      </span>
                      <div className="flex gap-2">
                        <SettingToggleSwitch
                          checked={true}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#9A9A9A] text-sm">
                    No permissions assigned
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <button
                    className="titan-btn my-6 mt-10 text-white px-2 py-1 rounded text-sm"
                    onClick={() =>
                      setEditRole({
                        id: role.id,
                        name: role.name,
                        label: role.label,
                        permissions: role.permissions.map((p) => p.id),
                        show: true,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="titan-cancel-btn my-6 mt-10 text-white px-2 py-1 rounded text-sm"
                    onClick={() =>
                      setDeleteRole({
                        id: role.id,
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Edit Role Modal */}
      {editRole?.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#1F2937] p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-white text-lg font-medium">Edit Role</h2>
            <CustomAdminInput
              title="Role Name"
              value={editRole.name}
              onChange={(val) => handleChangeEditRole("name", val)}
            />
            <CustomAdminInput
              title="Role Label"
              value={editRole.label}
              onChange={(val) => handleChangeEditRole("label", val)}
            />
            <PermissionsDropdown
              selectedPermissions={editRole.permissions}
              onChange={(ids) => handleChangeEditRole("permissions", ids)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditRole(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateRole}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {deleteRole && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#1F2937] p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-white text-lg font-medium">Confirm Delete</h2>
            <p className="text-white">
              Are you sure you want to delete this role?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setDeleteRole(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeleteRole}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
    </div>
  );
}
