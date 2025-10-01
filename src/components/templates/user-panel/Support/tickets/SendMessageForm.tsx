"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import CustomSelect, { CustomSelectOption } from "./CustomSelect";
import { apiRequest, ApiResponse } from "@/libs/api";
import dynamic from "next/dynamic";
import "@/styles/p-admin/TextEditor.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";

interface Department {
  id: string;
  name: string;
}

interface FormData {
  department_id: string;
  subject: string;
  message: string;
  priority: string;
  attachments: File[];
}

const priorityOptions: CustomSelectOption[] = [
  { id: "low", label: "low" },
  { id: "medium", label: "medium" },
  { id: "high", label: "high" },
];

export default function SendMessageForm({
  handleReload,
}: {
  handleReload: (status: boolean) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    department_id: "",
    subject: "",
    message: "",
    priority: "",
    attachments: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const fetchDepartments = async () => {
    setIsDepartmentsLoading(true);
    setDepartmentsError(null);
    const token = loadUserData()?.access_token;
    try {
      const res = await apiRequest<{ data: Department[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/departments`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        setDepartments(res.data.data || []);
      } else {
        setDepartmentsError(res.message || "Failed to load departments");
      }
    } catch (error: any) {
      setDepartmentsError(error.message || "Error loading departments");
    } finally {
      setIsDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (name: keyof FormData, value: string | File[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.department_id) errs.department_id = "Department is required";
    if (!formData.subject) errs.subject = "Subject is required";
    if (!formData.message || formData.message === "<p><br></p>")
      errs.message = "Message is required";
    if (!formData.priority) errs.priority = "Priority is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const token = loadUserData()?.access_token;
        const form = new FormData();
        form.append("department_id", formData.department_id);
        form.append("subject", formData.subject);
        form.append("message", formData.message);
        form.append("priority", formData.priority);

        formData.attachments.forEach((file) =>
          form.append("attachments[]", file)
        );

        const res = await apiRequest<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/createTickets`,
          "POST",
          form,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          setIsUploading(false);
          toast.success(res.message || "Ticket sent successfully!");
          setFormData({
            department_id: "",
            subject: "",
            message: "",
            priority: "",
            attachments: [],
          });
          handleReload(true);
          setErrors({});
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        } else {
          setIsUploading(false);
          toast.error(res.message || "Error sending ticket.");
        }
      } catch {
        toast.error("Internal Server Error.");
      }
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

  return (
    <>
      <TitanNotice
      title="Support GuideLines"
        description={`You may write your message in the official language of your country.
        All conversations are recorded and archived; please use respectful language.
        Irrelevant, unnecessary, or disrespectful messages may result in limited access to support.
        Please check the FAQ section before submitting a ticket.
        Prior to submitting a ticket, please carefully review your message and provide a complete, detailed description of your issue. Ticket submissions are subject to time-based limits per account, and investors are not permitted to submit repeated or consecutive tickets.
        Our team will respond to your ticket as soon as possible on business days.`}
      />
      <div className="send-message-container px-[1rem] py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl mt-5 pb-[2rem]">
        <ToastContainer
          closeButton={({ closeToast }) => (
            <button onClick={closeToast}>
              <FaTimes className="text-white" />
            </button>
          )}
        />
        <div className="send-message text-[var(--main-background)] dark:text-white px-2 sm:px-[1rem]">
          <p>send new ticket</p>
        </div>
        <div className="w-full h-[1px] bg-standard my-3"></div>

        <form className="p-2 sm:px-[1rem]" onSubmit={handleSubmit}>
          {/* Department */}
          <CustomSelect
            label="Department"
            value={formData.department_id}
            onChange={(val: string) => handleChange("department_id", val)}
            options={
              isDepartmentsLoading
                ? [{ id: "", label: "Loading..." }]
                : departmentsError
                ? [{ id: "", label: "Error loading departments" }]
                : departments.map((dep) => ({ id: dep.id, label: dep.name }))
            }
            required
            placeholder={
              isDepartmentsLoading ? "Loading..." : "Select department"
            }
          />

          {errors.department_id && (
            <span className="text-[.8rem] text-red-500">
              {errors.department_id}
            </span>
          )}

          {/* Subject */}
          <div className="my-4">
            <label className="block mb-1 text-[var(--main-background)] dark:text-white">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="rounded-[2rem] p-2 border-standard border-[2px] w-full placeholder:text-gray-400 text-[var(--main-background)] dark:text-white"
              placeholder="Enter ticket subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
            />
            {errors.subject && (
              <span className="text-[.8rem] text-red-500">
                {errors.subject}
              </span>
            )}
          </div>

          {/* Message */}
          <div className={`my-4 my-quill-editor `}>
            <label className="block my-1 text-[var(--main-background)] dark:text-white">
              Message <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formData.message}
              onChange={(content) => handleChange("message", content)}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white dark:bg-gray-800 rounded-md"
            />
            {errors.message && (
              <span className="text-[.8rem] text-red-500">
                {errors.message}
              </span>
            )}
          </div>

          {/* Priority */}
          <CustomSelect
            label="Priority"
            value={formData.priority}
            onChange={(val) => handleChange("priority", val)}
            options={priorityOptions}
            required
            placeholder="Select priority"
          />
          {errors.priority && (
            <span className="text-[.8rem] text-red-500">{errors.priority}</span>
          )}

          {/* Attachments */}
          <div>
            <label className="block mb-1 text-[var(--main-background)] dark:text-white">
              Attachments (optional)
            </label>
            <input
              type="file"
              multiple
              className="block w-full text-sm text-[var(--main-background)] dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
            {formData.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.attachments.map((file, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-[.8rem] flex items-center gap-1"
                  >
                    {file.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-3">
            <button
              className="titan-btn w-full sm:w-[30%] disabled:!bg-gray-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={
                isUploading ||
                !formData.department_id ||
                !formData.subject ||
                !formData.message ||
                !formData.priority
              }
            >
              {isUploading ? "sending ..." : "Send Ticket"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
