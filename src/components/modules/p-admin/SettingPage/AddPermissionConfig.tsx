"use client";
import React from "react";

import PermisssionsList from "./PermisssionsList";
import LineTitle from "../LineTitle";


export default function AddPermissionConfig() {
  // const [formData, setFormData] = useState<PermissionData>({
  //   permissionName: "",
  //   description: "",
  //   ceo2fa: "",
  // });

  // const [loading, setLoading] = useState(false);
  // const [refresh, setRefresh] = useState(false);
  // const [data, setData] = useState<any>({});

  // const handleChange = (field: keyof PermissionData, value: string) => {

  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

  // const handleSave = async () => {
  //   if (!formData.permissionName || !formData.description || !formData.ceo2fa) {
  //     alert("لطفاً همه فیلدها را پر کنید.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const token = await loadEncryptedData()?.token;

  //     const payload = {
  //       name: formData.permissionName,
  //       label: formData.description,
  //       ceo2fa: formData.ceo2fa,
  //     };

  //     alert("Permission added successfully!");
  //     setFormData({ permissionName: "", description: "", ceo2fa: "" });

  //     setRefresh((prev) => !prev);
  //   } catch (error) {
  //     console.error("Failed to add permission:", error);
  //     alert("Failed to add permission.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div className="space-y-6">
        <LineTitle onClick={() => {}} title="Set Permission" />
{/* 
        <div className="border-[2px] rounded-[.5rem] border-[#383C47] px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <CustomAdminInput
              title="Enter Permission Name"
              value={formData.permissionName}
              onChange={(val) => handleChange("permissionName", val)}
            />
            <CustomAdminInput
              title="Permission Description"
              value={formData.description}
              onChange={(val) => handleChange("description", val)}
            />
            <CustomAdminInput
              title="Enter CEO 2FA Code"
              value={formData.ceo2fa}
              onChange={(val) => handleChange("ceo2fa", val)}
            />
          </div>

          <button
            onClick={handleSave}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-fit mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            + Add New Permission
          </button>
        </div> */}
      </div>

      <PermisssionsList />
    </>
  );
}
