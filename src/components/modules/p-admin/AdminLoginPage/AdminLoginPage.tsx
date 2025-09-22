"use client";
import Image from "next/image";
import React, { useState } from "react";
import "./AdminLoginPage.css";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/libs/api";
import { saveEncryptedData } from "../../EncryptData/SavedEncryptData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [keepPosted, setKeepPosted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest<{
        data: {
          access_token: string;
          expires_in: number;
        };
      }>(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/login`, "POST", {
        email: formData.email,
        password: formData.password,
      });
      setLoading(false);

      console.log("response =>", response);

      const loginData = response.data?.data;

      if (response.success && loginData) {
        toast.success("Login successful 🎉", { position: "top-right" });

        saveEncryptedData(
          {
            email: formData.email,
            password: formData.password,
            token: loginData.access_token,
          },
          loginData.expires_in, 
          keepPosted
        );

        localStorage.setItem("token", loginData.access_token);

        setTimeout(() => {
          router.push("/hrtaamst2025/dashboard");
        }, 1000);
      } else {
        toast.error(response.error?.message || "Login failed.", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(`Request failed: ${error.message}`, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="admin-login-page bg-[#CCCCCC] w-fit rounded-lg pt-1 pb-4">
        {/* Header */}
        <div className="flex items-center gap-4 bg-[#000080] p-2">
          <Image
            src={"/70c35eed377fb2e246eb55c2c5f47a73a89eb9dd.png"}
            className="w-10 h-10"
            width={40}
            height={40}
            alt=""
          />
          <span className="text-lg font- text-white">Information Form</span>
        </div>

        {/* Description */}
        <div className="flex flex-col sm:flex-row items-center gap-4 px-8">
          <Image
            src={"/directory_open_file_mydocs-4 (1).png"}
            className="w-12 h-12"
            width={1000}
            height={1000}
            alt=""
          />
          <span className="text-dark-900 text-sm">
            Fill in your details to receive our latest updates and notifications.
          </span>
        </div>

        {/* Form */}
        <div className="admin-login w-fit mx-auto space-y-4">
          {/* Password */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
            <span className="flex-1 admin-login-span min-w-32">Password :</span>
            <input
              type="password"
              className="p-1 rounded-[.2rem]"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="flex-1 admin-login-span min-w-32">Email :</span>
            <input
              type="email"
              className="p-1 rounded-[.2rem]"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Keep me posted */}
          <div className="flex items-center gap-4 justify-center">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setKeepPosted(!keepPosted)}
            >
              <span className="w-4 h-4 checkbox-custom relative">
                {keepPosted && (
                  <span className="checkmark absolute bg-gray-900 select-none inset-0 flex items-center justify-center">
                    <FaCheck size={20} className="text-white" />
                  </span>
                )}
              </span>
              <span className="select-none">Keep me posted</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="h-[3px] line-admin-login w-[90%] mx-auto mt-4"></div>
        <div className="flex items-center justify-center sm:justify-end w-[90%] mx-auto gap-4 mt-4">
          <button className="admin-login-btn">Cancel</button>
          <button
            className="admin-login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
