"use client";
import React, { useState, useRef, useEffect } from "react";
import { VscTriangleDown } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import CustomAdminInput from "../CustomAdminInput";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

interface DropdownOption {
  label: string;
  value: string;
  tid: number;
}

interface LevelData {
  id: number;
  level: number;
  percentage: string;
}

interface AddSpecialCommision {
  refetch: () => void;
}

export default function AddSpecialCommissionRule({
  refetch,
}: AddSpecialCommision) {
  const [formData, setFormData] = useState({
    user: "",
    level: "",
    percentage: "",
    twoFA: "",
  });
  const [users, setUsers] = useState<DropdownOption[]>([]);
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<DropdownOption>({
    label: "-- Choose User --",
    value: "",
    tid: 0,
  });
  const [selectedLevel, setSelectedLevel] = useState<DropdownOption>({
    label: "-- Choose Level --",
    value: "",
    tid: 0,
  });
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        levelDropdownRef.current &&
        !levelDropdownRef.current.contains(event.target as Node)
      ) {
        setLevelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchUsers = async (query: string) => {
    try {
      setLoadingUsers(true);
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/searchUser?tid=${query}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        const userOptions = res.data.data.map((user: any) => ({
          label: user.name,
          value: user.user,
          tid: user.user,
        }));
        setUsers(userOptions);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!userDropdownOpen) return;
    const handler = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, userDropdownOpen]);

  const fetchLevels = async () => {
    if (levels.length > 0) return;
    try {
      setLoadingLevels(true);
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/commissionLevels`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        setLevels(res.data.data);
      } else {
        toast.error(res.message || "Failed to load commission levels");
      }
    } catch (err: any) {
      toast.error(err.message || "Error fetching commission levels");
    } finally {
      setLoadingLevels(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = loadEncryptedData()?.token;
      if (!token) return toast.error("User token not found");
      if (!formData.user) return toast.error("Please select a user");
      if (!formData.level) return toast.error("Please select a level");
      if (!formData.percentage) return toast.error("Please enter percentage");
      const payload = {
        tid: formData.user,
        level: formData.level,
        percentage: formData.percentage,
      };
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createSpecialCommission`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success(
          res.message || "Special commission rule created successfully!"
        );
        setFormData({ user: "", level: "", percentage: "", twoFA: "" });
        setSelectedUser({ label: "-- Choose User --", value: "", tid: 0 });
        setSelectedLevel({ label: "-- Choose Level --", value: "", tid: 0 });
        refetch();
      } else {
        toast.error(res.message || "Failed to create special commission rule");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="add-special-commission-rule space-y-4 mt-8">
        <p className="text-lg font-semibold text-white">
          Add Special Commission Rule
        </p>
        <div className="border-[2px] border-[#383C47] rounded-[.5rem] px-6 py-4 bg-[#111827]">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
            <div className="relative w-full lg:w-1/5" ref={userDropdownRef}>
              <span className="text-white block font-bold mb-1">
                Select User
              </span>
              <div
                className="flex justify-between items-center p-2 px-3 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  if (!userDropdownOpen && searchTerm === "") {
                    fetchUsers("");
                  }
                }}
              >
                <span>{selectedUser.label}</span>
                <VscTriangleDown
                  className={`transition-transform text-white text-xl ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 mt-2 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg max-h-72 overflow-y-auto"
                  >
                    <div className="p-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by TID..."
                        className="w-full p-2 rounded bg-[#111827] text-white border border-[#555] text-sm"
                      />
                    </div>
                    {loadingUsers ? (
                      <div className="px-4 py-3 text-white text-md">
                        Loading...
                      </div>
                    ) : users.length === 0 ? (
                      <div className="px-4 py-3 text-gray-400 text-md">
                        No results
                      </div>
                    ) : (
                      users.map((option) => (
                        <div
                          key={option.value}
                          className="px-4 py-2 cursor-pointer hover:bg-[#275EDF] text-md font-medium text-white"
                          onClick={() => {
                            setSelectedUser(option);
                            handleChange("user", option.value);
                            setUserDropdownOpen(false);
                          }}
                        >
                          <p className="text-white">{option.label}</p>
                          <p className="text-[.8rem] text-gray-400">
                            TID: {option.tid}
                          </p>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative w-full lg:w-1/5" ref={levelDropdownRef}>
              <span className="text-white block font-bold mb-1">
                Select Level
              </span>
              <div
                className="flex justify-between items-center p-2 px-3 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
                onClick={async () => {
                  setLevelDropdownOpen(!levelDropdownOpen);
                  await fetchLevels();
                }}
              >
                <span>{selectedLevel.label}</span>
                <VscTriangleDown
                  className={`transition-transform text-white text-xl ${
                    levelDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {levelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 mt-2 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg max-h-60 overflow-y-auto"
                  >
                    {loadingLevels ? (
                      <div className="px-4 py-3 text-white text-md">
                        Loading...
                      </div>
                    ) : (
                      levels.map((level) => (
                        <div
                          key={level.id}
                          className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                          onClick={() => {
                            const option: DropdownOption = {
                              label: `Level ${level.level} (${level.percentage}%)`,
                              value: level.level.toString(),
                              tid: level.id,
                            };
                            setSelectedLevel(option);
                            handleChange("level", level.level.toString());
                            handleChange("percentage", level.percentage);
                            setLevelDropdownOpen(false);
                          }}
                        >
                          {`Level ${level.level} (${level.percentage}%)`}
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-full lg:w-1/5">
              <CustomAdminInput
                title="Enter Percentage"
                value={formData.percentage}
                onChange={(val) => handleChange("percentage", val)}
              />
            </div>
            <div className="w-full lg:w-1/5">
              <CustomAdminInput
                title="2FA Code"
                value={formData.twoFA}
                onChange={(val) => handleChange("twoFA", val)}
              />
            </div>
            <div className="w-full lg:w-auto">
              <button
                onClick={handleSubmit}
                className="titan-btn rounded text-white w-full lg:w-auto"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
