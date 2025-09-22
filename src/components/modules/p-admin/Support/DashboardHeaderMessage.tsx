"use client";
import React, { useEffect, useState, useRef } from "react";
import CustomAdminInput from "../CustomAdminInput";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HexColorPicker } from "react-colorful";
import { Dialog } from "@headlessui/react";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
interface DashboardHeaderMessageProps {
  refetch: () => void;
}
export default function DashboardHeaderMessage({ refetch }: DashboardHeaderMessageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{ rankImage: File | null }>({ rankImage: null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [wallet, setWallet] = useState({ id: 1, title: "", date: "" });
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [colorArray, setColorArray] = useState<string[]>(["#FF7B00", "#FFB800"]);
  const [tempColor1, setTempColor1] = useState(colorArray[0]);
  const [tempColor2, setTempColor2] = useState(colorArray[1]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const token = loadEncryptedData()?.token;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (previewImage) URL.revokeObjectURL(previewImage);
      setFormData((prev) => ({ ...prev, rankImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  function handleWithdrawChange(id: number, field: string, value: string) {
    setWallet((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!wallet.title || !message || !selectedDate || !formData.rankImage) {
      toast.error("Please fill all required fields");
      return;
    }
    const data = new FormData();
    data.append("title", wallet.title);
    data.append("message_content", message);
    data.append("image", formData.rankImage);
    data.append("color_start", colorArray[0]);
    data.append("color_end", colorArray[1]);
    data.append("published_at", selectedDate.toISOString());

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createHeaderMessage`,
        "POST",
        data,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Message created successfully");
        setWallet({ id: 1, title: "", date: "" });
        setMessage("");
        setFormData({ rankImage: null });
        setPreviewImage(null);
        setSelectedDate(null);
        setColorArray(["#FF7B00", "#FFB800"]);
        refetch();
      } else {
        toast.error(res.message || "Failed to create message");
      }
    } catch (err: any) {
      toast.error(err.message || "Error sending request");
    }
  }

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className="public-notification-section mt-8">
      <p className="text-white text-lg font-medium mb-2">Create Your Special Message</p>
      <div className="border-[2px] rounded-[.5rem] border-[#383C47] p-4 mt-2">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex items-start gap-8">
            <div className="flex flex-col">
              <div className="w-92 relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-44 h-36 border border-[#555] rounded-[.5rem] bg-transparent cursor-pointer hover:bg-[#275EDF] flex items-center justify-center transition"
                >
                  {!previewImage && <span className="text-white">Upload Image</span>}
                  {previewImage && (
                    <>
                      <Image src={previewImage} alt="Preview" fill className="object-contain rounded-[.5rem]" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-white bg-black/50 rounded-full p-1 hover:bg-red-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(null);
                          setFormData({ rankImage: null });
                        }}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} id="rankImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <button className="titan-btn mt-2" onClick={() => setColorPickerOpen(true)}>BG Color</button>
            </div>
            <div className="flex flex-col gap-2">
              <CustomAdminInput
                title="Enter Title"
                value={wallet.title}
                onChange={(val) => handleWithdrawChange(wallet.id, "title", val)}
              />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-white mb-2">Enter Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className="w-full p-2 rounded-md border h-32 border-[#555] text-white bg-transparent"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="w-full sm:w-64">
            <label className="text-white mb-1 block">Set Date & Time</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select date & time"
              className="w-full p-2 rounded-md text-white border bg-transparent"
            />
          </div>
          <CustomAdminInput
            title="Enter 2FA"
            value={wallet.date}
            onChange={(val) => handleWithdrawChange(wallet.id, "date", val)}
          />
          <button className="admin-titan-cancel mt-8 text-white" onClick={handleSubmit}>Save & Send</button>
        </div>
      </div>
      <Dialog open={colorPickerOpen} onClose={() => setColorPickerOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1F2937] rounded-lg p-4 w-full max-w-md">
            <Dialog.Title className="text-white text-lg mb-2">Select Gradient Colors</Dialog.Title>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-white mb-1">Color 1</span>
                <HexColorPicker color={tempColor1} onChange={setTempColor1} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white mb-1">Color 2</span>
                <HexColorPicker color={tempColor2} onChange={setTempColor2} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => setColorPickerOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded" onClick={() => { setColorArray([tempColor1, tempColor2]); setColorPickerOpen(false); }}>Apply</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
