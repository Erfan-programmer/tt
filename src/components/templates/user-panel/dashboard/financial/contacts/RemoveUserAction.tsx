"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { toast, ToastContainer } from "react-toastify";
import { useContacts } from "@/contextApi/ContactsContext";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { FaTimes } from "react-icons/fa";

const schema = z.object({
  TID: z
    .string()
    .min(1, "TID is required")
    .regex(/^\d+$/, "TID must be only numbers"),
  twofaCode: z
    .string()
    .length(6, "2FA code must be 6 digits")
    .regex(/^\d{6}$/, "2FA code must be 6 digits (0-9)."),
});

type RemoveUserFormType = z.infer<typeof schema>;

export default function RemoveUserAction() {
  const { refreshContacts } = useContacts();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RemoveUserFormType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      TID: "",
      twofaCode: "",
    },
  });

  const onSubmit = async (data: RemoveUserFormType) => {
    const tid = parseInt(data.TID, 10);
    const code = data.twofaCode;

    try {
      const token = loadUserData()?.access_token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/deleteContact?tid=${tid}&code=${code}`,
        "POST",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success) {
        toast.success(response.message || "Contact removed successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        });
        reset();
        refreshContacts();
      } else {
        toast.error(response.error?.message || "Failed to remove contact", {
          position: "top-right",
          autoClose: 3000,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Unexpected error", {
        position: "top-right",
        autoClose: 3000,
        theme: document.documentElement.classList.contains("dark")
          ? "dark"
          : "light",
      });
    }
  };

  return (
    <div className="add-user-action-container px-2 sm:px-[2rem]">
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="add-user-action-desc my-2">
        <span className="text-[var(--gold)]">
          Please enter the information carefully.
        </span>
      </div>
      <div className="border-standard bg-[#f9f9fe] dark:bg-[#0f163a] rounded-[1em] p-5 mt-3 py-[2rem] space-y-4 ">
        <Controller
          name="TID"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-[100%]"
              readOnly={false}
              label="TID"
              value={field.value}
              onChange={field.onChange}
              required={true}
              type="text"
              placeholder="Enter TID"
              validateLatinOnly={true}
              onlyNumber={true}
              maxLength={20}
              hasError={!!errors.TID}
              errorMessage={errors.TID?.message as string}
            />
          )}
        />
        <Controller
          name="twofaCode"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-[100%]"
              readOnly={false}
              label="2FA Code"
              value={field.value}
              onChange={field.onChange}
              required={true}
              type="text"
              placeholder="Enter 2FA code"
              validateLatinOnly={true}
              onlyNumber={true}
              maxLength={6}
              hasError={!!errors.twofaCode}
              errorMessage={errors.twofaCode?.message as string}
            />
          )}
        />
      </div>

      <div className="flex items-center my-[2rem]">
        <button
          className="titan-cancel-btn text-white dark:text-[var(--main-background)] shadow-[0_1px_17px_#03071D]  dark:bg-white transition-all dark:hover:shadow-[0_1px_17px_#fff]  w-full sm:w-[90%] md:w-[70%] lg:w-[60%] disabled:!bg-gray-400"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
