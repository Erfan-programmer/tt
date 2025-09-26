"use client";
import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  placeholder = "Type here...",
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const imageUrl = data.url;

        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection();
        if (range) {
          editor?.insertEmbed(range.index, "image", imageUrl);
        }
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  };

  return (
    <div className="w-full">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler, 
            },
          },
        }}
      />
    </div>
  );
};

export default TextEditor;
