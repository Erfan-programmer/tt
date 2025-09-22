"use client";
import React, { useState, useRef } from "react";
import CustomAdminInput from "../CustomAdminInput";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import AdminToggleSwitch from "@/components/Ui/AdminToggleSwitch/AdminToggleSwitch";
import { motion, AnimatePresence } from "framer-motion";
import { VscTriangleDown } from "react-icons/vsc";
import { FaCalendar, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export default function PublicNotificationSection() {
  const [formData, setFormData] = useState<{
    rankImage: File | null;
    title: string;
    message: string;
    date: string;
  }>({
    rankImage: null,
    title: "",
    message: "",
    date: "",
  });

  const [status, setStatus] = useState<"draft" | "published">("published");
  const [type, setType] = useState<"public" | "special" | "dashboard">(
    "public"
  );
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filterOptions = [
    { label: "Public", value: "public" },
    { label: "Special", value: "special" },
    { label: "Dashboard", value: "dashboard" },
  ];
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, rankImage: file }));
    }
  }

  async function handleSubmit() {
    if (!formData.message) {
      toast.error("Message cannot be empty");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("message_content", formData.message);
    if (formData.rankImage) form.append("image", formData.rankImage);
    form.append("status", status);
    form.append("published_at", formData.date || new Date().toISOString());
    form.append("type", type);

    if (type === "special") {
      form.append("users", JSON.stringify(selectedUsers));
    }

    const token = loadEncryptedData()?.token;

    const res = await apiRequest<any>(
      `${BASE_URL}/v1/admin/createAnnouncements`,
      "POST",
      form,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (res.success) {
      toast.success("Announcement created successfully!");
      setFormData({ rankImage: null, title: "", message: "", date: "" });
      setType("public");
      setStatus("published");
      setSelectedUsers([]);
      setSelectedFilter(filterOptions[0]);
    } else {
      toast.error(res.message || "Error creating announcement");
    }
  }

  return (
    <div className="public-notification-section">
      <ToastContainer />
      <p className="text-white">Enter Your Notification</p>
      <div className="border-[2px] rounded-[.5rem] border-[#383C47] p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label
                htmlFor="rankImage"
                className="relative flex items-center justify-center h-36 w-36 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer hover:bg-[#275EDF] transition overflow-hidden"
              >
                {formData.rankImage ? (
                  <>
                    <Image
                      width={144}
                      height={144}
                      src={URL.createObjectURL(formData.rankImage)}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-[.5rem]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData((prev) => ({ ...prev, rankImage: null }));
                      }}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      <FaTrash className="text-red-400" />
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-300">Upload Image</span>
                )}
              </label>

              <input
                id="rankImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-2">
              <CustomAdminInput
                title="Enter Title"
                value={formData.title}
                onChange={(val) => handleChange("title", val)}
              />
              <div className="flex flex-col">
                <label className="text-white mb-1 text-sm">Enter Date</label>
                <div className="flex items-center gap-0 relative  border border-[#383C47] rounded-[.6rem]">
                  <DatePicker
                    placeholderText="yyyy-mm-dd:hh:mm:ss"
                    selected={formData.date ? new Date(formData.date) : null}
                    onChange={(date: Date | null) =>
                      handleChange("date", date ? date.toISOString() : "")
                    }
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="w-full p-2 rounded-md bg-transparent text-white"
                    calendarClassName="bg-[#1F2937] text-white rounded-lg"
                  />
                  <FaCalendar className="text-[#383C47] right-2 absolute"/>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-white mb-2">Enter Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Enter message"
              className="w-full p-2 rounded-md border h-32 border-[#555] bg-transparent text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <span className="text-white text-sm">Is Published ?</span>
          <AdminToggleSwitch
            checked={status === "published"}
            onChange={(checked: boolean) =>
              setStatus(checked ? "published" : "draft")
            }
          />
        </div>

        {/* Select Filter Dropdown */}
        <div className="flex items-center gap-2 my-6">
          <div className="relative w-full sm:w-64" ref={dropdownRef}>
            <label className="text-white mb-2 text-md font-medium">
              Select Filter
            </label>
            <div
              className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{selectedFilter.label}</span>
              <VscTriangleDown
                className={`transition-transform text-white text-xl ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
                >
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                      onClick={() => {
                        setSelectedFilter(option);
                        setType(
                          option.value as "public" | "special" | "dashboard"
                        );
                        setDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="admin-titan-cancel mt-2 text-white"
          onClick={handleSubmit}
        >
          Save & Send
        </button>
      </div>
    </div>
  );
}
