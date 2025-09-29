"use client";
import { useVerify } from "@/contextApi/TitanContext";
import { toast } from "react-toastify";
import { useVerificationList } from "@/contextApi/VerificationListContext";
import VerificationStepBox from "./VerificationStepBox";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { useState } from "react";

export interface StepItem {
  key: string;
  title: string;
  image: string;
}

interface TabItemVerificationProps {
  type: "passport" | "national_id" | "driver_license";
  steps: StepItem[];
}

export default function DynamicVerificationTab({
  type,
  steps,
}: TabItemVerificationProps) {
  const { fileSectionPairs, setFileSectionPairs } = useVerify();
  const { refetch } = useVerificationList();
  const [isLoading , setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const currentTypeFiles = fileSectionPairs?.filter(
      (item) => item.type === type
    );

    const rejectedFiles = currentTypeFiles?.filter(
      (item) => item.status === "rejected"
    );

    const formData = new FormData();

    formData.append("documentType", type);
    // filesToUpload = currentTypeFiles?.filter((f) => f.file);
    // if (missingSteps.length > 0) {
    //   const missingTitles = missingSteps.map((s) => s.title);
    //   toast.error(`Please upload ${missingTitles.join(" and ")}`);
    //   return;
    // }
    if (rejectedFiles.length > 0) {

      rejectedFiles.map((item, index) => {
        // const fileObj = filesToUpload.find(
        //   (f) => f.key === `document[${stepIndex}]`
        // );
        if (item?.path) formData.append(`documents[${index}]`, item.path);
      });
    } else {
      const missingSteps = steps?.filter((step, index) => { 
        return !currentTypeFiles.find((file) => file.key === `document[${index}]` && file.path);
    });

      if (missingSteps.length > 0) {
        const missingTitles = missingSteps.map((s) => s.title);
        toast.error(`Please upload ${missingTitles.join(" and ")}`);
        return;
      }

      currentTypeFiles.map((item, index) => {
        if (item?.path) formData.append(`documents[${index}]`, item.path);
      });
    }

    try {
      setIsLoading(true)
      const token = loadUserData()?.access_token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/documents/upload`,
        "POST",
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      
      if (response.success) {
        setIsLoading(false)
        toast.success(response.message);
        setFileSectionPairs([]);
        refetch();
      } else {
        toast.error(`${response.message}`);
        setIsLoading(false)
        console.error(response.error);
      }
    } catch (err: any) {
      console.error("Unexpected Error:", err);
      setIsLoading(false)
      toast.error("Error uploading documents.");
    }
  };

  return (
    <div className="tabItemVerification-container">
      <div className="tabItemVerification-wrapper text-[var(--main-background)] dark:text-white">
        <div className="tabItemVerification-wrapper-top">
          <p>
            {type === "passport"
              ? "Upload a photo of your passport, then upload a selfie holding the same passport."
              : type === "national_id"
              ? "Upload front and back of your ID card."
              : "Upload front and back of your Driver’s License."}
          </p>
        </div>

        <div className="tabItemVerification-wrapper-top mt-[1.5rem] flex-wrap justify-center md:justify-start flex items-center gap-3">
          {steps.map((step, index) => (
            <VerificationStepBox
              key={step.key}
              title={step.title}
              index={index}
              type={type}
              image={step.image}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center my-4 md:justify-end">
        <button className={`titan-btn ${isLoading ? "!bg-gray-400" : ""} w-[80%] md:w-[25%]`} onClick={handleSubmit}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
