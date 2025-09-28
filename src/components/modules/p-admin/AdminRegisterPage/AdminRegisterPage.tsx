"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./../AdminLoginPage/AdminLoginPage.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveEncryptedData } from "../../EncryptData/SavedEncryptData";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [keepPosted, setKeepPosted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/register`;
    const body = {
      name: formData.name,
      email: formData.email,
      password: formData.lastName,
    };

    try {
      const response = await apiRequest<{
        data: {
          token: string;
          expires_in: number;
          name: string;
          email: string;
        };
      }>(url, "POST", body);

      const registerData = response.data?.data;

      if (response.success && registerData) {
        toast.success("Registration successful 🎉", { position: "top-right" });

        saveEncryptedData(
          {
            email: formData.email,
            password: formData.lastName,
            token: registerData.token,
          },
          registerData.expires_in,
          keepPosted
        );

        localStorage.setItem("token", registerData.token);

        setTimeout(() => {
          router.push("/hrtaamst2025/dashboard");
        }, 1000);
      } else {
        toast.error(response.error?.message || "Registration failed.", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      toast.error(`Request failed: ${error.message}`, {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="admin-login-page bg-[#CCCCCC] w-fit rounded-lg pt-1 pb-4 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-[#000080] p-2">
          <Image
            src={"/70c35eed377fb2e246eb55c2c5f47a73a89eb9dd.png"}
            className="w-10 h-10"
            width={40}
            height={40}
            alt="logo"
          />
          <span className="text-lg font- text-white">Information Form</span>
        </div>

        {/* Intro */}
        <div className="flex items-center gap-4 px-4 sm:px-8 mt-6">
          <Image
            src={"/directory_open_file_mydocs-4 (1).png"}
            className="w-12 h-12"
            width={1000}
            height={1000}
            alt="form-icon"
          />
          <span className="text-dark-900 text-sm">
            Fill in your details to receive our latest updates and
            notifications.
          </span>
        </div>

        {/* Form */}
        <div className="admin-login w-full max-w-md mx-auto space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="flex-1 label-text">Name:</span>
            <input
              type="text"
              className="p-1 rounded-[.2rem]"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="flex-1 label-text">Lastname:</span>
            <input
              type="password"
              className="p-1 rounded-[.2rem]"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="flex-1 label-text">Email:</span>
            <input
              type="email"
              className="p-1 rounded-[.2rem]"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center justify-start gap-2 mt-2">
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

        {/* Footer */}
        <div className="h-[3px] line-admin-login w-full mx-auto mt-4"></div>
        <div className="flex items-center justify-end w-full mx-auto gap-4 mt-4">
          <button className="admin-login-btn" disabled={isLoading}>
            Cancel
          </button>
          <button
            className="admin-login-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

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
