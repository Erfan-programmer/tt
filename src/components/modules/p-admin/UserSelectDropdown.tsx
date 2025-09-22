"use client";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import Checkbox from "@mui/material/Checkbox";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../EncryptData/SavedEncryptData";

export interface User {
  user: number;
  name: string;
  email: string;
}

export interface UserSelectDropdownRef {
  refetchUsers: () => Promise<void>;
  getSelectedIds: () => number[] | null;
  resetSelection: () => void;
}

interface Props {
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  tids: number[];
  setids: React.Dispatch<React.SetStateAction<number[]>>;
}

const UserSelectDropdown = forwardRef<UserSelectDropdownRef, Props>(
  ({ selectAll, setSelectAll, tids, setids }, ref) => {
    const [users, setUsers] = useState<any>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const token = loadEncryptedData()?.token;

    const fetchUsers = useCallback(async () => {
      try {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/users`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );
        const userData = res?.data?.data || [];
        setUsers(userData);
        setAllUsers(userData);
      } catch {
        toast.error("Failed to load users!");
      }
    }, [token]);

    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        if (!search.trim()) {
          setUsers(allUsers);
          return;
        }
        try {
          const res = await apiRequest<any>(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/searchUser?tid=${search}`,
            "GET",
            undefined,
            { Authorization: `Bearer ${token}` }
          );
          if (res?.data?.data) {
            setUsers(
              Array.isArray(res.data.data) ? res.data.data : [res.data.data]
            );
          }
        } catch {
          toast.error("Failed to search users!");
        }
      }, 500);
      return () => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
      };
    }, [search, allUsers, token]);

    const toggleTid = (tid: number) => {
      if (selectAll) return;
      setids((prev) =>
        prev.includes(tid) ? prev?.filter((id) => id !== tid) : [...prev, tid]
      );
    };

    const isTidSelected = (tid: number) => selectAll || tids.includes(tid);

    const toggleAll = () => {
      setSelectAll((prev) => !prev);
      setids([]);
    };

    useImperativeHandle(ref, () => ({
      refetchUsers: fetchUsers,
      getSelectedIds: () => (selectAll ? null : tids),
      resetSelection: () => {
        setids([]);
        setSelectAll(false);
      },
    }));

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative min-w-32" ref={dropdownRef}>
        <button
          className="w-full border-[2px] border-[var(--admin-border-color)] text-white px-4 py-2 rounded-[.5rem] bg-transparent flex justify-between"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {selectAll
            ? "All users selected"
            : tids.length > 0
            ? `${tids.length} user(s) selected`
            : "Select Users"}
          <span>▼</span>
        </button>
        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full bg-[#1E1E2F] border-[2px] border-[var(--admin-border-color)] rounded-[.5rem] max-h-60 overflow-y-auto shadow-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full p-2 border-b border-[#383C47] bg-transparent text-white focus:outline-none"
            />
            <ul>
              {!search.trim() && (
                <li className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer font-semibold text-white">
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleAll();
                    }}
                    sx={{
                      color: "#aaa",
                      "&.Mui-checked": { color: "#FF7B00" },
                    }}
                  />
                  <span>Select All</span>
                </li>
              )}
              {users.map((u:any) => (
                <li
                  key={u.user}
                  className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer"
                >
                  <Checkbox
                    checked={isTidSelected(u.user)}
                    onChange={() => toggleTid(u.user)}
                    sx={{
                      color: "#aaa",
                      "&.Mui-checked": { color: "#FF7B00" },
                    }}
                  />
                  <span className="text-white">
                    {u.name} ({u.email})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

UserSelectDropdown.displayName = "UserSelectDropdown";

export default UserSelectDropdown;
