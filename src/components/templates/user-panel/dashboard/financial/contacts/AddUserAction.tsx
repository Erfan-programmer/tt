"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { toast, ToastContainer } from "react-toastify";
import { useContacts } from "@/contextApi/ContactsContext";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useHeader } from "@/contextApi/HeaderContext";
import { FaTimes } from "react-icons/fa";

export default function AddUserAction() {
  const { refreshContacts } = useContacts();
  const { headerData } = useHeader();
  const userTID = headerData?.t_id?.toString() || "";

  const schema = z.object({
    TID: z
      .string()
      .min(1, "TID is required")
      .regex(/^\d+$/, "TID must be only numbers")
      .refine((val) => val !== userTID, "You cannot enter your own TID"),
    name: z.string().min(1, "Name is required"),
    twofaCode: z
      .string()
      .length(6, "2FA code must be 6 digits")
      .regex(/^\d{6}$/, "2FA code must be 6 digits (0-9)."),
  });

  type AddUserFormType = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AddUserFormType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      TID: "",
      name: "",
      twofaCode: "",
    },
  });

  const onSubmit = async (data: AddUserFormType) => {
    const body = {
      tid: parseInt(data.TID, 10),
      name: data.name,
      code: data.twofaCode,
    };
    const token = loadUserData()?.access_token;
    try {
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/createContact`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (response.success) {
        toast.success(response.message || "Contact created successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        });
        reset();
        refreshContacts();
      } else {
        toast.error(response.error?.message || "Failed to create contact", {
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
        <span className="text-[var(--gold)] dark:text-yellow-400">
          Please enter the information carefully.
        </span>
      </div>
      <div className="border-standard bg-white dark:bg-[#0f163a] rounded-[1em] mt-3 p-5 py-[2rem] space-y-4 shadow-sm dark:shadow-none">
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
          name="name"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-[100%]"
              readOnly={false}
              label="Name"
              value={field.value}
              onChange={field.onChange}
              required={true}
              type="text"
              placeholder="Enter name"
              validateLatinOnly={true}
              maxLength={50}
              hasError={!!errors.name}
              errorMessage={errors.name?.message as string}
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
              type="number"
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

      <div className="flex items-center my-[2em]">
        <button
          className="titan-btn w-full sm:w-[90%] md:w-[70%] disabled:!bg-gray-400 lg:w-[60%] bg-[#275edf] hover:bg-[#1a4db5] text-white dark:bg-[#275edf] dark:hover:bg-[#1a4db5] dark:text-white transition-colors duration-200"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
