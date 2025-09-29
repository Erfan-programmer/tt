"use client";

import React, { useState } from "react";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import CountrySelect from "@/components/Ui/inputs/CountrySelect";
import PhoneInput from "@/components/Ui/inputs/PhoneInput";
import { Typography } from "@mui/material";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

interface Props {
  rewardId: number;
  goBack: () => void;
}

export default function TeamReceiveRewardPhysical({ rewardId, goBack }: Props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [postalCard, setPostalCard] = useState("");
  const [select_country, setSelect_country] = useState("");
  const [shoppingAddress, setShoppingAddress] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (
      !firstname ||
      !lastname ||
      !shoppingAddress ||
      !postalCard ||
      !select_country ||
      !phoneNumber ||
      !file
    ) {
      toast.error("Please fill all required fields and upload your document.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstname);
    formData.append("last_name", lastname);
    formData.append("shipping_address", shoppingAddress);
    formData.append("postal_code", postalCard);
    formData.append("country", select_country);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);
    formData.append("identification_document", file);

    setLoading(true);

    try {
      const token = loadUserData()?.access_token;
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/prizes/submitShipping/${rewardId}`,
        "POST",
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success) {
        toast.success(res.message || "Shipping info submitted successfully!");
        setTimeout(() => {
          goBack();
        }, 2000);
        goBack();
      } else {
        toast.error(res.message || "Failed to submit shipping info");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="team-account-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 pb-[2rem]">
        <div className="team-claim-reward ">
          <p className="text-[var(--main-background)] dark:text-white">
            Please fill in all fields carefully and completely.
          </p>
        </div>
        <div className="w-full h-[1px] bg-standard my-3"></div>

        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  justify-start sm:gap-[2rem] items-start mt-[1rem]">
          <CustomInput
            readOnly={false}
            showStar={true}
            label="First Name"
            value={firstname}
            onChange={setFirstname}
            required={true}
            type="text"
            placeholder="Enter your first name"
          />
          <CustomInput
            readOnly={false}
            showStar={true}
            label="Shipping Address"
            value={shoppingAddress}
            onChange={setShoppingAddress}
            required={true}
            type="text"
            placeholder="Enter your address"
          />
          <CustomInput
            showStar={true}
            label="Last Name"
            readOnly={false}
            value={lastname}
            onChange={setLastname}
            required={true}
            type="text"
            placeholder="Enter your last name"
          />
          <CustomInput
            showStar={true}
            label="Postal Code"
            readOnly={false}
            value={postalCard}
            onChange={setPostalCard}
            required={true}
            type="text"
            placeholder="Enter postal code"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  mt-4">
          <CustomInput
            showStar={true}
            label="Email"
            readOnly={false}
            value={email}
            onChange={setEmail}
            required={true}
            type="text"
            placeholder="Enter email code"
          />
          <CountrySelect
            label="Select Country"
            value={select_country}
            className="w-full"
            onChange={setSelect_country}
            required={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <Typography className="mb-2 text-[var(--main-background)] dark:text-white">
              Upload Your Selfie and Signed Contract
            </Typography>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              accept="image/*,.pdf"
            />
            <div
              className="border-2 border-[#585966] rounded-[1.5rem] mt-2 p-3 cursor-pointer flex items-center justify-center bg-white dark:bg-[var(--sidebar-bg)] text-[#D9D9D9]"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? file.name : "Click to upload PNG, JPG or PDF"}
            </div>
          </div>
          <PhoneInput
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            required={true}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 mt-[2rem]">
          <button
            className="titan-btn w-fit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            className="px-6 py-2 rounded-[.5rem] w-fit bg-gray-400 hover:bg-gray-500"
            onClick={goBack}
          >
            Back
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
    </>
  );
}
