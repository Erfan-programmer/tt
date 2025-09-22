"use client";
import React from "react";
import CustomAdminInput from "../CustomAdminInput";
import Image from "next/image";

export default function CreateSpecialMessage() {
  const [formData, setFormData] = React.useState<{ rankImage: File | null }>({
    rankImage: null,
  });
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [wallet, setWallet] = React.useState({ id: 1, title: "", date: "" });
  const [message, setMessage] = React.useState("");

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, rankImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  function handleWithdrawChange(id: number, field: string, value: string) {
    setWallet((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="public-notification-section mt-8">
      <p className="text-white">Create Your Spacial Message </p>
      <div className="border-[2px] rounded-[.5rem] border-[#383C47] p-4 mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label
                htmlFor="rankImage"
                className="flex items-center justify-center px-4 py-2 h-36 w-36 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer hover:bg-[#275EDF] transition"
              >
                {formData.rankImage ? formData.rankImage.name : "Upload Image"}
              </label>
              <input
                id="rankImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {previewImage && (
                <Image
                  width={500}
                  height={500}
                  src={previewImage}
                  alt="Preview"
                  className="mt-3 h-24 rounded-md border"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <CustomAdminInput
                title="Enter Title"
                value={wallet.title}
                onChange={(val) =>
                  handleWithdrawChange(wallet.id, "title", val)
                }
              />
              <CustomAdminInput
                title="Enter Date"
                value={wallet.date}
                onChange={(val) => handleWithdrawChange(wallet.id, "date", val)}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-white mb-2">Enter Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className="w-full p-2 rounded-md border h-32 border-[#555] bg-transparent text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <CustomAdminInput
            title="Set Date & Time"
            value={wallet.date}
            onChange={(val) => handleWithdrawChange(wallet.id, "date", val)}
          />
          <CustomAdminInput
            title="Enter 2FA"
            value={wallet.date}
            onChange={(val) => handleWithdrawChange(wallet.id, "date", val)}
          />
          <button className="admin-titan-cancel  mt-8 text-white">
            Save & Send
          </button>
        </div>
      </div>
    </div>
  );
}
