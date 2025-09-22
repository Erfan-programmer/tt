"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import SettingToggleSwitch from "../SettingPage/SettingToggleSwitch";

interface PermissionItem {
  id: number;
  name: string;
  label: string;
}

interface PermissionsDropdownProps {
  label?: string;
  selectedPermissions: number[];
  onChange: (selected: number[]) => void;
}

const PermissionsDropdown = forwardRef<
  HTMLDivElement,
  PermissionsDropdownProps
>(({ label = "Permissions", selectedPermissions, onChange }, ref) => {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = loadEncryptedData()?.token;

  useImperativeHandle(ref, () => dropdownRef.current!);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/permissions`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res?.data?.data) {
        setPermissions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setPermissions, token]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const togglePermission = (id: number) => {
    if (selectedPermissions.includes(id)) {
      onChange(selectedPermissions?.filter((p) => p !== id));
    } else {
      onChange([...selectedPermissions, id]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <label className="text-white mb-2 text-md font-medium">{label}</label>
      <div
        className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedPermissions.length
            ? `${selectedPermissions.length} selected`
            : `Select ${label}`}
        </span>
        <span
          className={`transition-transform text-white text-xl ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-[#1F2937] border border-[#555] rounded-[.5rem] shadow-lg"
          >
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center justify-between p-2 hover:bg-[#2C2C3A] cursor-pointer text-white"
              >
                <span>{perm.name}</span>
                <SettingToggleSwitch
                  checked={selectedPermissions.includes(perm.id)}
                  onChange={() => togglePermission(perm.id)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PermissionsDropdown.displayName = "PermissionsDropdown";

export default PermissionsDropdown;
