"use client";

import { useForm, Controller } from "react-hook-form";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "@/libs/api";
import { useState } from "react";
import {
  loadUserData,
  removeUserData,
} from "@/components/modules/EncryptData/SavedEncryptData";
import { useRouter } from "next/navigation";

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.toLowerCase().endsWith("@gmail.com");
}

interface EmailFormFields {
  currentEmail: string;
  newEmail: string;
  confirmEmail: string;
  twoFaCode: string;
}

export default function TitanEmailForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<EmailFormFields>({
    defaultValues: {
      currentEmail: "",
      newEmail: "",
      confirmEmail: "",
      twoFaCode: "",
    },
    mode: "onChange",
  });

  const newEmailValue = watch("newEmail");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const onSubmit = async (data: EmailFormFields) => {
    if (!validateEmail(data.currentEmail)) {
      toast.error("Current email must be a valid Gmail address");
      return;
    }
    if (!validateEmail(data.newEmail)) {
      toast.error("New email must be a valid Gmail address");
      return;
    }
    if (!validateEmail(data.confirmEmail)) {
      toast.error("Confirm email must be a valid Gmail address");
      return;
    }
    if (data.newEmail !== data.confirmEmail) {
      toast.error("New email and confirm email must match");
      return;
    }

    setLoading(true);
    const token = loadUserData()?.access_token;

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/security/change-email`,
        "POST",
        {
          code: data.twoFaCode,
          new_email_confirmation: data.confirmEmail,
          new_email: data.newEmail,
          current_email: data.currentEmail,
        },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Email updated successfully");
        removeUserData();
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(res.message || "Failed to update email");
      }
    } catch  {
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
        <p>Change E-mail</p>
      </div>
      <div className="bg-standard w-full h-[2px] my-4"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[1rem] items-start w-[95%] mx-auto">
          {/* Current Email */}
          <Controller
            name="currentEmail"
            control={control}
            rules={{
              required: "Current email is required",
              validate: {
                validEmail: (value) =>
                  validateEmail(value) ||
                  "Please enter a valid Gmail address (e.g., user@gmail.com)",
              },
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                label="Enter your current email address"
                readOnly={false}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required
                type="email"
                placeholder="Enter your current Gmail address"
                hasError={!!errors.currentEmail}
                errorMessage={errors.currentEmail?.message as string}
              />
            )}
          />

          {/* New Email */}
          <Controller
            name="newEmail"
            control={control}
            rules={{
              required: "New email is required",
              validate: {
                validEmail: (value) =>
                  validateEmail(value) ||
                  "Please enter a valid Gmail address (e.g., user@gmail.com)",
                differentFromCurrent: (value) =>
                  value !== watch("currentEmail") ||
                  "New email must be different from current email",
              },
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                label="Enter your new email address"
                value={field.value}
                readOnly={false}
                onChange={(val) => field.onChange(val)}
                required
                type="email"
                placeholder="Enter your new Gmail address"
                hasError={!!errors.newEmail}
                errorMessage={errors.newEmail?.message as string}
              />
            )}
          />

          {/* Confirm Email */}
          <Controller
            name="confirmEmail"
            control={control}
            rules={{
              required: "Confirm email is required",
              validate: {
                matchesNewEmail: (value) =>
                  value === newEmailValue ||
                  "Confirm email must match new email exactly",
              },
            }}
            render={({ field }) => (
              <CustomInput
                className="w-full sm:w-[47%]"
                label="Confirm your new email address"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required
                readOnly={false}
                type="email"
                placeholder="Confirm your new Gmail address"
                hasError={!!errors.confirmEmail}
                errorMessage={errors.confirmEmail?.message as string}
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
                label="2FA Code"
                type="number"
                value={field.value}
                onChange={(val) => field.onChange(val)}
                required
                placeholder="Enter 6-digit 2FA code"
                hasError={!!errors.twoFaCode}
                readOnly={false}
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
