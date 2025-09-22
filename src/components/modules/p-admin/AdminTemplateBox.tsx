import React, { ReactNode } from "react";

export default function AdminTemplateBox({title , children}:{title:string , children:ReactNode}) {
  return (
    <div className="admin-template-box my-4">
      <p className="text-white ">{title}</p>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center flex-wrap mt-1 gap-4 p-4 border-[2px] border-[#383C47] rounded-lg ">
        {children}
      </div>
    </div>
  );
}
