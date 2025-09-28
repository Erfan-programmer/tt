// MessageToturialSection.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import ToturialBox from "./ToturialBox";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

interface ToturialFile {
  file_path: string | null;
  file_size: number;
  file_type: string;
  isEditing?: boolean;
  id: number;
  is_active: boolean;
  title: string;
  isNew?: boolean;
  file?: File | string | null;
}

export default function MessageToturialSection() {
  const [toturials, setToturials] = useState<ToturialFile[]>([]);
  const [addLoading] = useState(false);
  const token = loadEncryptedData()?.token;

  const fetchToturial = useCallback(async () => {
    try {
      const res = await apiRequest<{ data: ToturialFile[]; meta: any }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getTutorials?page=1`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        const toturialsData: ToturialFile[] = res.data.data.map((f) => ({
          id: f.id,
          title: f.title || "",
          file_path: f.file_path
            ? `${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${f.file_path}`
            : null,
          file_size: f.file_size,
          file_type: f.file_type,
          is_active: Boolean(f.is_active),
          isNew: false,
          isEditing: false,
        }));
        setToturials(toturialsData);
      } else {
        toast.error(res.message || "Failed to fetch tutorials");
      }
    } catch {
      toast.error("Error while fetching tutorials");
    }
  }, [setToturials, token]);

  useEffect(() => {
    fetchToturial();
  }, [fetchToturial]);

  const addBox = () => {
    setToturials([
      ...toturials,
      {
        id: Date.now(),
        title: "",
        file_path: null,
        file_size: 0,
        file_type: "",
        is_active: true,
        isNew: true,
        isEditing: true,
        file: null,
      },
    ]);
  };

  const removeBox = async (index: number) => {
    const item = toturials[index];
    if (item.id && !item.isNew) {
      try {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteTutorials/${item.id}`,
          "DELETE",
          undefined,
          { Authorization: `Bearer ${token}` }
        );
        if (res.success) {
          toast.success("Deleted successfully");
          setToturials(toturials?.filter((_, i) => i !== index));
        } else {
          toast.error(res.message || "Failed to delete");
        }
      } catch {
        toast.error("Error while deleting");
      }
    } else {
      setToturials(toturials?.filter((_, i) => i !== index));
    }
  };

  const saveBox = async (index: number) => {
    const item = toturials[index];
    if (!item.title) {
      toast.error("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", item.title);

    if (item.file && item.file instanceof File) {
      formData.append("file", item.file);
    }

    try {
      if (item.isNew) {
        if (!item.file || !(item.file instanceof File)) {
          toast.error("Please select a file");
          return;
        }
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/creatTutorials`,
          "POST",
          formData,
          { Authorization: `Bearer ${token}` }
        );
        if (res.success) {
          toast.success("Created successfully");
          fetchToturial();
        } else {
          toast.error(res.message || "Failed to create");
        }
      } else if (item.id) {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateTutorials/${item.id}`,
          "POST",
          formData,
          { Authorization: `Bearer ${token}` }
        );
        if (res.success) {
          toast.success("Updated successfully");
          fetchToturial();
        } else {
          toast.error(res.message || "Failed to update");
        }
      }
    } catch {
      toast.error("Error while saving");
    }
  };

  const handleChange = (
    index: number,
    key: "title" | "file",
    value: string | File | null
  ) => {
    const updated = [...toturials];
    updated[index] = { ...updated[index], [key]: value };
    setToturials(updated);
  };

  const handleEditToggle = (index: number) => {
    const updated = [...toturials];
    updated[index].isEditing = !updated[index].isEditing;
    setToturials(updated);
  };

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="message-toturial-container">
        <p className="text-white mb-4">Tutorials</p>

        <div className="flex items-start gap-8 flex-wrap mt-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {toturials.map((box, index) => (
              <ToturialBox
                key={box.id || index}
                title={box.title}
                file={box.file_path}
                file_size={box.file_size}
                onChangeTitle={(val) => handleChange(index, "title", val)}
                onChangeFile={(val) => handleChange(index, "file", val)}
                onRemove={() => removeBox(index)}
                onSave={() => saveBox(index)}
                isApiBox={!box.isNew}
                isEditing={!!box.isEditing}
                onEditToggle={() => handleEditToggle(index)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="admin-titan-cancel"
              onClick={addBox}
              disabled={addLoading}
            >
              {addLoading ? "Loading..." : "Add More"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
