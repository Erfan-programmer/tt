import React, { useState } from "react";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import CountrySelect from "@/components/Ui/inputs/CountrySelect";
import PhoneInput from "@/components/Ui/inputs/PhoneInput";
import { Typography } from "@mui/material";

export default function TeamReceiveCashContent() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [postalCard, setPostalCard] = useState("");
  const [select_country, setSelect_country] = useState("");
  const [shoppingAddress, setShoppingAddress] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="team-account-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 pb-[2rem]">
      <div className="team-claim-reward ">
        <p className="text-[var(--dark-color)] dark:text-white">
          Please fill in all fields carefully and completely.
        </p>
      </div>
      <div className="w-full h-[1px] bg-standard my-3"></div>
      <div className="flex flex-col sm:flex-row gap-4 justify-start sm:gap-[2rem] items-start mt-[1rem]">
        <CustomInput
          showStar={true}
          readOnly={false}
          className="w-full md:w-[50%]"
          label="first name"
          value={firstname}
          onChange={setFirstname}
          required={true}
          type="text"
          placeholder="Enter your e-mail"
          validateLatinOnly={true}
          maxLength={100}
        />
        <CustomInput
          showStar={true}
          readOnly={false}
          className="w-full md:w-[50%]"
          label="*Shipping Address"
          value={shoppingAddress}
          onChange={setShoppingAddress}
          required={true}
          type="text"
          placeholder="Enter your e-mail"
          validateLatinOnly={true}
          maxLength={100}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4  justify-start gap-[2rem] items-start mt-[1rem]">
        <CustomInput
          showStar={true}
          readOnly={false}
          label="*Last Name"
          className="w-full md:w-[50%]"
          value={lastname}
          onChange={setLastname}
          required={true}
          type="text"
          placeholder="Enter your e-mail"
          validateLatinOnly={true}
          maxLength={100}
        />
        <CustomInput
          showStar={true}
          readOnly={false}
          label="*Postal Code"
          className="w-full md:w-[50%]"
          value={postalCard}
          onChange={setPostalCard}
          required={true}
          type="tel"
          placeholder="Enter your e-mail"
          validateLatinOnly={true}
          maxLength={100}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-start sm:gap-[2rem] items-start mt-[1rem]">
        <CustomInput
          showStar={true}
          readOnly={false}
          label="*E-mail"
          value={email}
          onChange={setEmail}
          className="w-full md:w-[50%]"
          required={true}
          type="email"
          placeholder="Enter your e-mail"
          validateLatinOnly={true}
          maxLength={100}
        />
        <CountrySelect
          label="Select Country"
          value={select_country}
          className="w-full md:w-[50%]"
          onChange={setSelect_country}
          required={true}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-start sm:gap-[2rem] items-start mt-[1rem]">
        <PhoneInput
          label="Phone Number"
          value={phoneNumber}
          className="w-full md:w-[50%]"
          onChange={setPhoneNumber}
          required={true}
        />

        <div className="w-full md:w-[50%]">
          <Typography className="mb-4 pb-2 text-[var(--dark-color)] dark:text-white">
            Upload Your Selfie and Signed Contract
          </Typography>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden "
            ref={fileInputRef}
            accept="image/*,.pdf"
          />
          <div
            className="border-2 border-[#585966] rounded-2xl mt-2 p-1 cursor-pointer flex items-center justify-center bg-white dark:bg-[var(--sidebar-bg)] text-[#D9D9D9]"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex justify-center items-center w-full gap-3">
              <div className="flex items-center gap-3">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-[var(--dark-color)] dark:stroke-[#D9D9D9]"
                >
                  <path
                    d="M13.6799 16.9818L11.5585 14.8781C10.5834 13.9111 10.0958 13.4276 9.53455 13.2463C9.04077 13.0868 8.50929 13.0868 8.01551 13.2463C7.45422 13.4276 6.96668 13.9111 5.9916 14.8781L1.0518 19.8533M13.6799 16.9818L14.1016 16.5636C15.0971 15.5764 15.5949 15.0827 16.166 14.9026C16.6683 14.7441 17.2081 14.7503 17.7066 14.9203C18.2734 15.1135 18.7597 15.6185 19.7323 16.6284L20.7647 17.6766M13.6799 16.9818L18.5659 21.954M18.5659 21.954C18.1339 22 17.5793 22 16.8118 22H4.95294C3.56928 22 2.87745 22 2.34896 21.7307C1.88409 21.4939 1.50614 21.1159 1.26928 20.651C1.15544 20.4276 1.08973 20.175 1.0518 19.8533M18.5659 21.954C18.9127 21.9171 19.1804 21.8506 19.4157 21.7307C19.8806 21.4939 20.2586 21.1159 20.4954 20.651C20.7647 20.1225 20.7647 19.4307 20.7647 18.0471V13.3529M9.64706 2.23529H4.95294C3.56928 2.23529 2.87745 2.23529 2.34896 2.50457C1.88409 2.74144 1.50614 3.11939 1.26928 3.58426C1 4.11275 1 4.80458 1 6.18823V18.0471C1 18.8458 1 19.414 1.0518 19.8533M18.2941 8.41176V4.70588M18.2941 4.70588V1M18.2941 4.70588H22M18.2941 4.70588H14.5882"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {!file && (
                  <div className="text-center file-upload-text gap-3">
                    <p className="text-[var(--dark-color)] dark:text-[#D9D9D9]">
                      PNG, JPG or PDF
                    </p>
                    <p className="text-[var(--dark-color)] dark:text-[#D9D9D9] text-sm">
                      (Max 800 X 800px)
                    </p>
                  </div>
                )}
                {file && (
                  <div className="text-center  file-upload-text gap-3">
                    <p className="text-[var(--dark-color)] dark:text-[#D9D9D9]">
                      {file.name}
                    </p>
                    <p className="text-sm text-[var(--dark-color)] dark:text-[#D9D9D9]">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="mt-[2rem] titan-btn w-[95%] sm:w-[30%]">Submit</button>
    </div>
  );
}
