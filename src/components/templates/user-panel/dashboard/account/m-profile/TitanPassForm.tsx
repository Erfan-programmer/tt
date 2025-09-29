"use client";
import { useForm, Controller } from "react-hook-form";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import GenderSelect from "@/components/Ui/inputs/GenderSelect";
import PhoneInput from "@/components/Ui/inputs/PhoneInput";
import CountrySelect from "@/components/Ui/inputs/CountrySelect";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useHeader } from "@/contextApi/HeaderContext";

interface TitanPassFormProps {
  profile: {
    mobile: string;
    dial_code: string;
    id: number;
    gender: string;
    country: {
      id: number;
      name: string;
      code: string;
      dial_code: string;
    };
    last_name: string;
    email: string;
    first_name: string;
  };
}

interface UpdatePersonalInfoRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  country: string;
  gender: string;
  fa_code: string;
  prefix_number: number;
}

export default function TitanPassForm({ profile }: TitanPassFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdatePersonalInfoRequest>({
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone_number: profile.mobile || "",
      country: profile.country?.id ? String(profile.country.id) : "",
      gender: profile.gender || "",
      fa_code: "",
      prefix_number: profile?.id,
    },
  });

  const maskValue = (value: string, visibleChars = 2) => {
    if (!value) return "";
    if (value.length <= visibleChars) return value;
    return (
      value.slice(0, visibleChars) + "*".repeat(value.length - visibleChars)
    );
  };

  const first_name = watch("first_name");
  const last_name = watch("last_name");
  const country = watch("country");
  const gender = watch("gender");
  const mobile = watch("phone_number");
  const prefix_number = watch("prefix_number");
  const fa_code = watch("fa_code");

  const [isLoading, setIsLoading] = useState(false);
  const { headerData } = useHeader();
  const onSubmit = async () => {
    const changedFields: Partial<{
      first_name: string;
      last_name: string;
      country_id: string;
      gender: string;
      mobile: string;
      dial_code: number;
      code: string;
    }> = {};

    if (first_name !== profile.first_name)
      changedFields.first_name = first_name;
    if (last_name !== profile.last_name) changedFields.last_name = last_name;
    if (String(profile.country?.id) !== country)
      changedFields.country_id = country;
    if (gender !== profile.gender) changedFields.gender = gender;
    if (mobile !== profile.mobile) changedFields.mobile = mobile;
    if (prefix_number !== profile.country?.id)
      changedFields.dial_code = prefix_number;
    if (fa_code) changedFields.code = fa_code;

    if (!Object.keys(changedFields).length) {
      toast.error("No changes detected.");
      return;
    }
    const token = loadUserData()?.access_token;
    try {
      setIsLoading(true);
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/editProfile`,
        "POST",
        changedFields,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error("An error occurred while updating profile.");
    }
  };
  const [isFocusedFirstName, setIsFocusedFirstName] = useState(false);
  const [isFocusedLastName, setIsFocusedLastName] = useState(false);

  return (
    <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="titan-form-title w-[95%] mx-auto text-[var(--main-background)] dark:text-white">
        <p>Personal Information</p>
      </div>
      <div className="bg-standard w-full h-[2px] my-4"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[.3rem] items-start w-[95%] mx-auto">
          <Controller
            name="first_name"
            control={control}
            rules={{ required: true, maxLength: 100 }}
            render={({ field }) => {
              const displayValue = isFocusedFirstName
                ? field.value
                : maskValue(field.value, 2);

              return (
                <CustomInput
                  className="w-[100%] md:w-[47%]"
                  label="Firstname"
                  readOnly={headerData?.verified as any}
                  {...field}
                  value={displayValue}
                  onChange={field.onChange}
                  onFocus={() =>  setIsFocusedFirstName(headerData?.verified ? false : true )}
                  onBlur={() => setIsFocusedFirstName(false)}
                  required
                  type="text"
                  placeholder="Enter your First name"
                  hasError={!!errors.first_name}
                  errorMessage={
                    errors.first_name ? "Firstname is required" : ""
                  }
                />
              );
            }}
          />

          <Controller
            name="last_name"
            control={control}
            rules={{ required: true, maxLength: 100 }}
            render={({ field }) => {
              const displayValue = isFocusedLastName
                ? field.value
                : maskValue(field.value, 2);

              return (
                <CustomInput
                  className="w-[100%] md:w-[47%]"
                  label="Lastname"
                  readOnly={headerData?.verified as any}
                  {...field}
                  value={displayValue}

                  onChange={field.onChange}
                  onFocus={() => setIsFocusedLastName(headerData?.verified ? false : true)}
                  onBlur={() => setIsFocusedLastName(false)}
                  required
                  type="text"
                  placeholder="Enter your Last name"
                  hasError={!!errors.last_name}
                  errorMessage={errors.last_name ? "Lastname is required" : ""}
                />
              );
            }}
          />

          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <GenderSelect
                className="w-[100%] md:w-[47%]"
                label="Gender"
                value={field.value || ""}
                onChange={field.onChange}
                disbaled={headerData?.verified as any}
                required
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomInput
                readOnly={true}
                className="w-[100%] md:w-[47%]"
                label="Email"
                value={maskValue(field.value, 3)}
                onChange={field.onChange}
                required
              />
            )}
          />
          <Controller
            name="country"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CountrySelect
                className="w-[100%] md:w-[47%]"
                label="Select Country"
                disbaled={headerData?.verified as any}
                value={field.value || ""}
                onChange={(val) => {
                  field.onChange(val);
                  // update prefix_number on country change
                  const selectedCountry = profile.country;
                  if (selectedCountry?.dial_code) {
                    setValue("prefix_number", selectedCountry.id, {
                      shouldDirty: true,
                    });
                  }
                }}
                required
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PhoneInput
                className="w-[100%] md:w-[47%]"
                label="Phone Number"
                value={field.value || ""}
                disabled={headerData?.verified as any}
                onChange={ field.onChange}
                required
                defaultDialCode={profile.dial_code}
                onPrefixChange={(country) => {
                  console.log("country =>", country);
                  setValue("prefix_number", country.id, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />

          <Controller
            name="fa_code"
            control={control}
            rules={{
              required: true,
              minLength: 6,
              maxLength: 6,
              pattern: /^\d{6}$/,
            }}
            render={({ field }) => (
              <CustomInput
                className="w-[100%] md:w-[47%]"
                label="2FA Code"
                {...field}
                readOnly={headerData?.verified as any}
                value={field.value || ""}
                onChange={field.onChange}
                required
                placeholder="Enter 2FA code"
                onlyNumber={true}
                minLength={6}
                maxLength={6}
                type="text"
                hasError={!!errors.fa_code}
                errorMessage={
                  errors.fa_code ? "2FA code must be a 6-digit number" : ""
                }
              />
            )}
          />
        </div>

        <div className="titan-form-footer flex justify-center sm:justify-end items-center my-[3rem] w-[95%] mx-auto">
          <button
            disabled={headerData?.verified as any}
            className={`titan-btn ${
              isLoading || headerData?.verified ? "!bg-gray-400" : ""
            } opacity-100`}
            type="submit"
          >
            {isLoading ? "Saving ..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
