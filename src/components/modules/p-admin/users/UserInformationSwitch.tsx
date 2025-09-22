"use client";
import React from "react";
import BanBox from "./BanBox";
import { useUserDocuments } from "@/contextApi/DocumentContext";

export default function UserInformationSwitch() {
  const { userInfo } = useUserDocuments();

  return (
    <div className="flex items-center justify-center sm:justify-start flex-wrap mt-10 gap-4">
      {/* Ban Account */}
      <BanBox
        title="Ban Account"
        checked={userInfo?.account_management?.ban_status}
        buttonText="Submit"
        apiPathBan="/v1/admin/banUser"
        apiPathUnban="/v1/admin/unbanUser"
      />

      {/* Ban Message */}
      <BanBox
        title="Ban Message"
        checked={userInfo?.account_management?.sync_message}
        buttonText="Submit"
        apiPathBan="/v1/admin/banMessage"
        apiPathUnban="/v1/admin/banMessage"
        getBody={(isChecked) => ({
          has_ban: isChecked ? true : false, 
        })}
      />
    </div>
  );
}
