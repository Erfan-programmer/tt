"use client";
import React, { useState, useEffect, useCallback } from "react";
import CustomAdminInput from "../CustomAdminInput";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArchive } from "react-icons/io";
import AdminToggleSwitch from "@/components/Ui/AdminToggleSwitch/AdminToggleSwitch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import UserSelectDropdown from "../UserSelectDropdown";

export interface User {
  user: number;
  name: string;
  email: string;
}

interface ArchiveNote {
  id: number;
  note: string;
}

export default function NotificationSection() {
  const [description, setDescription] = useState("");
  const [archive, setArchive] = useState<ArchiveNote[]>([]);
  const [hasExpire, setHasExpire] = useState(false);
  const [expireTime, setExpireTime] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [tids, setids] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const token = loadEncryptedData()?.token;

  const fetchArchiveNotes = useCallback(async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/archiveNotes`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      setArchive(res?.data?.data || []);
    } catch {
      toast.error("Failed to load archive notes!");
    }
  }, [setArchive, token]);

  useEffect(() => {
    fetchArchiveNotes();
  }, [fetchArchiveNotes]);

  const handleSendNotification = async () => {
    if (!description.trim()) {
      toast.error("Please enter a notification note!");
      return;
    }
    if (!date) {
      toast.error("Please select publish date!");
      return;
    }
    if (hasExpire) {
      if (!expireTime) {
        toast.error("Please select an expire time!");
        return;
      }
      if (expireTime <= date) {
        toast.error("Expire time must be later than publish date!");
        return;
      }
    }
    const payload = {
      user_ids: selectAll ? null : tids.length > 0 ? tids : undefined,
      expires_at: hasExpire && expireTime ? expireTime.toISOString() : null,
      publish_at: date.toISOString(),
      message: description.trim(),
    };
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createNotifications`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (response.success) {
        setDescription("");
        setExpireTime(null);
        setHasExpire(false);
        setids([]);
        setSelectAll(false);
        toast.success("Notification sent successfully!");
      } else {
        toast.error(response.error?.message || "Failed to send notification!");
      }
    } catch {
      toast.error("Failed to send notification!");
    }
  };

  const handleArchiveNotification = async () => {
    if (!description.trim()) {
      toast.error("Please enter a notification note to archive!");
      return;
    }
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createArchiveNote`,
        "POST",
        { note: description },
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setDescription("");
        fetchArchiveNotes();
        toast.success("Note archived successfully!");
      } else {
        toast.error((res.error as any) || "Failed to archive note!");
      }
    } catch {
      toast.error("Failed to archive note!");
    }
  };

  const handleRemoveFromArchive = async (id: number) => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteArchiveNote/${id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        fetchArchiveNotes();
        toast.success("Note removed from archive!");
      } else {
        toast.error((res.error as any) || "Failed to remove note!");
      }
    } catch {
      toast.error("Failed to remove note!");
    }
  };

  return (
    <div className="notification-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <p className="text-white">Enter your Notification</p>
      <div className="border-[2px] rounded-[.5rem] border-[var(--admin-border-color)] py-6 mt-2">
        <div className="w-[95%] md:w-[80%] mx-auto">
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <span className="font-semibold text-white text-lg block mb-2">
                Archived Notes
              </span>
              <ul className="flex flex-col gap-1">
                <AnimatePresence>
                  {archive.map((note) => (
                    <motion.li
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center w-full justify-center gap-4"
                    >
                      <div
                        className="flex items-center flex-1 border-[2px] p-2 rounded-[.5rem] border-[var(--admin-border-color)] cursor-pointer"
                        onClick={() => setDescription(note.note)}
                      >
                        <span className="text-[#FF7B00]">{note.note}</span>
                      </div>
                      <button
                        className="text-red-400 hover:text-red-600 text-xs"
                        onClick={() => handleRemoveFromArchive(note.id)}
                      >
                        <FaTimes />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#383C47]"></div>

        <div className="mt-8 w-[95%] md:w-[80%] mx-auto flex flex-col gap-4">
          <CustomAdminInput
            title="Enter Your Notif Note"
            value={description}
            onChange={(val) => setDescription(val)}
          />

          <UserSelectDropdown
            tids={tids}
            setids={setids}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
          />

          <div className="relative w-full">
            <label className="text-white block mb-1">Publish At:</label>
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full rounded-[.5rem] border-[2px] border-[var(--admin-border-color)] px-10 py-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FF7B00]"
              calendarClassName="bg-[#1E1E2F] text-white border-[2px] border-[#383C47] rounded-[.5rem] shadow-lg"
              popperClassName="shadow-lg"
            />
          </div>

          <div className="flex items-center gap-3">
            <p className="text-white">Has Expired Time :</p>
            <AdminToggleSwitch
              checked={hasExpire}
              onChange={() => setHasExpire((prev) => !prev)}
            />
          </div>

          {hasExpire && (
            <div className="relative w-full">
              <DatePicker
                selected={expireTime}
                onChange={(date: Date | null) => setExpireTime(date)}
                showTimeSelect
                dateFormat="Pp"
                className="w-full rounded-[.5rem] border-[2px] border-[var(--admin-border-color)] px-10 py-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FF7B00]"
                calendarClassName="bg-[#1E1E2F] text-white border-[2px] border-[#383C47] rounded-[.5rem] shadow-lg"
                popperClassName="shadow-lg"
              />
              <FaRegCalendarAlt
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                onClick={() => {
                  document
                    .querySelector<HTMLInputElement>(
                      ".react-datepicker__input-container input"
                    )
                    ?.focus();
                }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              className="titan-btn bg-[#FF7B00] text-white w-fit rounded-[.5rem] px-4 py-2"
              onClick={handleSendNotification}
            >
              Send
            </button>
            <button
              className="border-[2px] border-[var(--admin-border-color)] text-white w-fit rounded-[.5rem] px-4 py-2"
              onClick={handleArchiveNotification}
            >
              <IoMdArchive className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
