"use client";
import React, { useState, useEffect, useRef } from "react";
import CustomAdminInput from "../CustomAdminInput";
import AdminPhoneInput from "../AdminPhoneInpput/AdminPhoneInpput";
import AdminCountrySelect from "../AdminCountrySelect/AdminCountrySelect";
import { Controller, useForm } from "react-hook-form";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { VscTriangleDown } from "react-icons/vsc";
import AdminGenderSelect from "@/components/Ui/inputs/AdminGenderSelect";

interface PersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  country: any;
  prefix_number: number;
  phone: string;
  status: string;
  two_fa_enabled: boolean;
}

const statusOptions = [
  { label: "pending", value: "pending" },
  { label: "active", value: "active" },
  { label: "suspend", value: "suspend" },
  { label: "cancellation_pending", value: "cancellation_pending" },
  { label: "closed", value: "closed" },
];

const twoFaOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function UserInformationSection() {
  const { userInfo, setUserInfo, fetchUserInfo } = useUserDocuments();
  const params = useParams();
  const { id }: any = params;

  const [userData, setUserData] = useState<PersonalInfo>({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    country: null,
    phone: "",
    status: "",
    prefix_number: 0,
    two_fa_enabled: false,
  });

  const [updatedFields, setUpdatedFields] = useState<Partial<PersonalInfo>>({});
  const [loading, setLoading] = useState(false);
  const { control, setValue } = useForm();

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [twoFaDropdownOpen, setTwoFaDropdownOpen] = useState(false);
  const twoFaDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userInfo?.personal_info) {
      const info = userInfo.personal_info;
      const initialDialCode = info?.dial_code || info.dial_code || 0;
      console.log("initialDialCode =>", initialDialCode);
      setUserData({
        first_name: info.first_name || "",
        last_name: info.last_name || "",
        email: info.email || "",
        gender: info.gender || "",
        country: info.country || null,
        phone: info.phone || initialDialCode,
        status: info.status || "active",
        two_fa_enabled: info.two_fa_enabled || false,
        prefix_number: initialDialCode,
      });

      setValue("country", String(info.country?.id) || null);
      setValue("phone_number", info.phone || initialDialCode);
      setValue("gender", info.gender || "");
      setValue("prefix_number", initialDialCode);
    }
  }, [userInfo, setValue]);

  const handleChange = (field: keyof PersonalInfo, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));

    if (field === "country") {
      console.log("file country ", field, value);
      setUpdatedFields((prev) => ({ ...prev, country: value }));
    } else {
      setUpdatedFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    console.log("updatedFields ,", updatedFields);
    if (Object.keys(updatedFields).length === 0) {
      alert("No changes detected");
      return;
    }

    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      if (!token) return console.error("Token not found");

      const body: any = {};

      if (updatedFields.first_name) body.first_name = updatedFields.first_name;
      if (updatedFields.last_name) body.last_name = updatedFields.last_name;
      if (updatedFields.email) body.email = updatedFields.email;
      if (updatedFields?.gender) body.gender = updatedFields?.gender;
      if (updatedFields.status) body.status = updatedFields.status;
      if (updatedFields.country) {
        body.country_id = updatedFields.country;
        console.log(
          "updatedFields =>",
          updatedFields,
          body,
          updatedFields.country
        );
      }
      if (updatedFields.prefix_number) {
        body.dial_code = updatedFields.prefix_number;
        console.log("prefix =>", updatedFields);
      }
      if (updatedFields.phone) {
        body.mobile = updatedFields.phone;
      }
      if (updatedFields.two_fa_enabled !== undefined)
        body.two_fa_enabled = updatedFields.two_fa_enabled;

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateUser/${id}`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                personal_info: { ...prev.personal_info, ...updatedFields },
              }
            : prev
        );
        fetchUserInfo(id);
        setUpdatedFields({});
      } else {
        alert(res.message || "Failed to update user information");
      }
    } catch (err: any) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-[#383C47] rounded-xl p-6 flex flex-col gap-4 bg-[#111827]">
      <div className="flex flex-wrap gap-4">
        <CustomAdminInput
          title="First Name"
          value={userData.first_name}
          onChange={(val) => handleChange("first_name", val)}
        />
        <CustomAdminInput
          title="Last Name"
          value={userData.last_name}
          onChange={(val) => handleChange("last_name", val)}
        />
        <CustomAdminInput
          title="Email"
          type="email"
          value={userData.email}
          onChange={(val) => handleChange("email", val)}
        />
        <Controller
          name="gender"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <AdminGenderSelect
              className="w-[100%] md:w-[47%]"
              label="Gender"
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
                handleChange("gender", val);
              }}
              required
            />
          )}
        />

        <Controller
          name="country"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <AdminCountrySelect
              className="w-[100%] md:w-[47%]"
              label="Select Country"
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
                console.log("val =>", val);
                setValue("country", val, { shouldDirty: true });
                handleChange("country", val);
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
            <AdminPhoneInput
              className="w-[100%] md:w-[47%]"
              initialDialCode={userInfo?.personal_info.dial_code}
              label="Phone Number"
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
                handleChange("phone", val);
              }}
              required
              onPrefixChange={(country) => {
                setValue("prefix_number", country.dial_code, {
                  shouldDirty: true,
                });
                handleChange("prefix_number", country.dial_code);
              }}
            />
          )}
        />

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-64" ref={statusDropdownRef}>
          <label className="text-white mb-2 text-md font-medium">Status</label>
          <div
            className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          >
            <span>
              {statusOptions.find((o) => o.value === userData.status)?.label}
            </span>
            <VscTriangleDown
              className={`transition-transform text-white text-xl ${
                statusDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <AnimatePresence>
            {statusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
              >
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                    onClick={() => {
                      handleChange("status", option.value);
                      setStatusDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2FA Dropdown */}
        <div className="relative w-full sm:w-64" ref={twoFaDropdownRef}>
          <label className="text-white mb-2 text-md font-medium">
            2FA Enabled
          </label>
          <div
            className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
            onClick={() => setTwoFaDropdownOpen(!twoFaDropdownOpen)}
          >
            <span>{userData.two_fa_enabled ? "Yes" : "No"}</span>
            <VscTriangleDown
              className={`transition-transform text-xl ${
                twoFaDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <AnimatePresence>
            {twoFaDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
              >
                {twoFaOptions.map((option) => (
                  <div
                    key={String(option.value)}
                    className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                    onClick={() => {
                      handleChange("two_fa_enabled", option.value);
                      setTwoFaDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        className="titan-btn !rounded-md mt-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
