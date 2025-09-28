"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import "@/styles/Register/Register.css";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState<string>("");
  const [isLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    newPasswordConfirmation: false,
  });

  const handleBlur = (
    field: "currentPassword" | "newPassword" | "newPasswordConfirmation"
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    if (value && value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, currentPassword: "" }));
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value && value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  const handleNewPasswordConfirmationChange = (value: string) => {
    setNewPasswordConfirmation(value);
    if (value !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPasswordConfirmation: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, newPasswordConfirmation: "" }));
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsLoading(true);

  //     if (!currentPassword || !newPassword || !newPasswordConfirmation) {
  //       toast.error("Please fill in all fields");
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (newPassword.length < 6) {
  //       toast.error("New password must be at least 6 characters");
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (newPassword !== newPasswordConfirmation) {
  //       toast.error("New passwords do not match");
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`${import.meta.env.API_URL}/auth/password/change`, {
  //         method: "POST",
  //         headers:GetHeaderWithAuth(),
  //         body: JSON.stringify({
  //           current_password: currentPassword,
  //           new_password: newPassword,
  //           new_password_confirmation: newPasswordConfirmation
  //         })
  //       });

  //       const data = await response.json();

  //       if (response.ok && data.status === "success") {
  //         toast.success(data.message);
  //         setTimeout(() => {
  //           navigate('/dashboard', { state: { from: "/change-password" } });
  //         }, 3000);
  //       } else if (response.status === 422) {
  //         toast.error("Current password is incorrect");
  //       } else {
  //         toast.error(data.message || "Failed to change password");
  //       }
  //     } catch (error) {
  //       console.error("Error during password change:", error);
  //       toast.error("Server connection error");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const validateForm = (): boolean => {
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !newPasswordConfirmation.trim()
    ) {
      return false;
    }

    if (newPassword.trim().length < 6) {
      return false;
    }

    if (newPassword !== newPasswordConfirmation) {
      return false;
    }

    if (
      errors.currentPassword ||
      errors.newPassword ||
      errors.newPasswordConfirmation
    ) {
      return false;
    }

    return true;
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
      <div className="sm:mb-[4rem]">
        <div className="formlayout-bg-mobile-reset-password flex flex-col items-start justify-end pb-4 px-[1rem] sm:hidden">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[var(--main-background)] dark:text-white"
          >
            Change Password
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#ddd] block"
          >
            Enter your current and new password
          </motion.span>
        </div>
        <div className="px-4">
          <div className="hidden sm:block">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[var(--main-background)] dark:text-white"
            >
              Change Password
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="titan-light-text block"
            >
              Enter your current and new password
            </motion.span>
          </div>

          <motion.div
            className="register-inputs mt-[2rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <form className="sm:mt-[5rem] sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-[1rem]"
              >
                <CustomInput
                  readOnly={false}
                  label="Current Password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  onBlur={() => handleBlur("currentPassword")}
                  required={true}
                  placeholder="Enter current password"
                  type="password"
                  minLength={6}
                  hasError={touched.currentPassword && !!errors.currentPassword}
                  errorMessage={
                    touched.currentPassword ? errors.currentPassword : ""
                  }
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-[1rem]"
              >
                <CustomInput
                  readOnly={false}
                  label="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  onBlur={() => handleBlur("newPassword")}
                  required={true}
                  placeholder="Enter new password"
                  type="password"
                  minLength={6}
                  hasError={touched.newPassword && !!errors.newPassword}
                  errorMessage={touched.newPassword ? errors.newPassword : ""}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-[1rem]"
              >
                <CustomInput
                  readOnly={false}
                  label="Confirm New Password"
                  value={newPasswordConfirmation}
                  onChange={handleNewPasswordConfirmationChange}
                  onBlur={() => handleBlur("newPasswordConfirmation")}
                  required={true}
                  placeholder="Confirm new password"
                  type="password"
                  minLength={6}
                  hasError={
                    touched.newPasswordConfirmation &&
                    !!errors.newPasswordConfirmation
                  }
                  errorMessage={
                    touched.newPasswordConfirmation
                      ? errors.newPasswordConfirmation
                      : ""
                  }
                />
              </motion.div>

              <div className="mt-10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  type="submit"
                  className={`submit-register text-white w-[80%] ${
                    !validateForm() || isLoading
                      ? "opacity-50"
                      : "cursor-pointer"
                  }`}
                  disabled={!validateForm() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Changing...</span>
                    </div>
                  ) : (
                    "Change Password"
                  )}
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center gap-1 have-account mt-[1rem]"
              >
                <span className="titan-light-text">Back to </span>
                <Link
                  href="/dashboard"
                  className="text-[var(--main-background)] dark:text-white font-bold"
                >
                  Dashboard
                </Link>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
