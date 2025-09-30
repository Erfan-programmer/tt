"use client";

import { useForm, Controller } from "react-hook-form";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "@/libs/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface PasswordFormFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFaCode: string;
}

export default function TitanChangePassForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<PasswordFormFields>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFaCode: "",
    },
    mode: "onChange",
  });

  const router = useRouter();
  const newPasswordValue = watch("newPassword");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PasswordFormFields) => {
    setLoading(true);
    const token = loadUserData()?.access_token
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/security/change-password`,
        "POST",
        {
          code: data.twoFaCode,
          new_password_confirmation: data.confirmPassword,
          new_password: data.newPassword,
          current_password: data.currentPassword,
        },
        { Authorization : `Bearer ${token}`}
      );

      if (res.success) {
        toast.success(res.message || "Password updated successfully");

        reset();

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(res.message || "Failed to update password");
      }
    } catch{
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFormDirty = Object.values(watch()).some((val) => val.length > 0);
  const canSubmit = isFormDirty && isValid && !loading;

  return (
    <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <div className="titan-form-title w-[95%] mx-auto text-[var(--main-background)] dark:text-white">
        <p>Change Password</p>
      </div>
      <div className="bg-standard w-full h-[2px] my-4"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[1rem] items-start w-[95%] mx-auto">
          {/* Current Password */}
          <Controller
            name="currentPassword"
            control={control}
            rules={{
              required: "Current password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^[A-Za-z0-9]*$/,
                message: "Only Latin characters and numbers are allowed",
              },
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                readOnly={false}
                label="Enter your current password"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required={true}
                type="password"
                placeholder="Enter your current password"
                validateLatinOnly={true}
                maxLength={100}
                hasError={!!errors.currentPassword}
                errorMessage={errors.currentPassword?.message as string}
              />
            )}
          />

          {/* New Password */}
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^[A-Za-z0-9]*$/,
                message: "Only Latin characters and numbers are allowed",
              },
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                readOnly={false}
                label="Enter your new password"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required={true}
                type="password"
                placeholder="Enter your new password"
                validateLatinOnly={true}
                maxLength={100}
                hasError={!!errors.newPassword}
                errorMessage={errors.newPassword?.message as string}
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^[A-Za-z0-9]*$/,
                message: "Only Latin characters and numbers are allowed",
              },
              validate: (value) =>
                value === newPasswordValue || "Passwords do not match",
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                readOnly={false}
                label="Confirm your new password"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required={true}
                type="password"
                placeholder="Confirm your new password"
                validateLatinOnly={true}
                maxLength={100}
                hasError={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message as string}
              />
            )}
          />
        </div>

        {/* 2FA Code */}
        <div className="titan-form-footer flex flex-wrap gap-3 justify-between items-end mt-[1rem] mb-[3rem] w-[95%] mx-auto">
          <Controller
            name="twoFaCode"
            control={control}
            rules={{
              required: "Please enter 2FA code",
              minLength: {
                value: 6,
                message: "2FA code must be exactly 6 digits",
              },
              maxLength: {
                value: 6,
                message: "2FA code must be exactly 6 digits",
              },
              pattern: {
                value: /^\d{6}$/,
                message: "2FA code must contain only numbers",
              },
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                readOnly={false}
                label="2FA Code"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required={true}
                placeholder="Enter 6-digit 2FA code"
                validateLatinOnly={true}
                minLength={6}
                maxLength={6}
                type="number"
                hasError={!!errors.twoFaCode}
                errorMessage={errors.twoFaCode?.message as string}
              />
            )}
          />

          <button
            className={`titan-btn ${
              !canSubmit ? "opacity-50 !bg-gray-400" : "opacity-100"
            }`}
            type="submit"
            disabled={!canSubmit}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
