// CkEditorClient.tsx
"use client";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapterPlugin from "../Ui/Modals/p-admin/blog/CustomUploadAdapterPlugin";

type Props = {
  data: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function CkEditorClient({ data, onChange, disabled }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      disabled={disabled}
      config={{
        extraPlugins: [CustomUploadAdapterPlugin],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "undo",
          "redo",
          "|",
          "imageUpload",
          "|",
          "fontColor",
          "fontBackgroundColor",
        ],
        image: {
          toolbar: [
            "imageStyle:alignLeft",
            "imageStyle:alignCenter",
            "imageStyle:alignRight",
            "|",
            "resizeImage",
            "|",
            "imageTextAlternative",
          ],
        },
        mediaEmbed: { previewsInData: true },
      }}
      onChange={(_, editor) => onChange(editor.getData())}
    />
  );
}
