"use client";
import React, { useCallback, useEffect, useState } from "react";
import AdminTemplateBox from "@/components/modules/p-admin/AdminTemplateBox";
import CustomAdminInput from "@/components/modules/p-admin/CustomAdminInput";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import BlockUsersSuspendedList from "@/components/modules/p-admin/users/BlockUsersSuspendedList";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

export interface SuspendedUser {
  id: number;
  tid: number;
  referrer_id: number;
  sponsor_id: number;
  first_name: string;
  last_name: string;
  dial_code: string;
  email: string;
  mobile: string;
  sales_volume: string;
  two_factor_confirmed: boolean;
  sync_message_status: boolean;
  gender: "male" | "female" | string;
  user_type: string;
  status: "suspend" | string;
  rank_id: number;
  verify_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SuspendedUsersResponse {
  suspend_count: number;
  suspended_users: SuspendedUser[];
}

// ApiResponse wrapper type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export default function BlockUsersPage() {
  const [banTid, setBanTid] = useState("");
  const [banTwoFa, setBanTwoFa] = useState("");
  const [unbanTid, setUnbanTid] = useState("");
  const [unbanTwoFa, setUnbanTwoFa] = useState("");
  const [deleteTid, setDeleteTid] = useState("");
  const [deleteTwoFa, setDeleteTwoFa] = useState("");
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUsersResponse>({
    suspend_count: 0,
    suspended_users: [],
  });

  const [loadingBan, setLoadingBan] = useState(false);
  const [loadingUnban, setLoadingUnban] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const token = loadEncryptedData()?.token;

  const handleAction = async (
    action: "ban" | "unban" | "delete",
    tid: string,
    twoFaCode: string,
    reset: () => void,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!tid || !twoFaCode) {
      toast.error("Please fill in all fields.");
      return;
    }

    let url = "";
    if (action === "ban") url = `/v1/admin/banUser/${tid}`;
    if (action === "unban") url = `/v1/admin/unbanUser/${tid}`;
    if (action === "delete") url = `/v1/admin/userDeleteAccount/${tid}`;

    setLoading(true);
    try {
      const res = await apiRequest<
        ApiResponse<{
          suspend_count?: number;
          suspended_users?: SuspendedUser[];
        }>
      >(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        "POST",
        { two_fa_code: twoFaCode },
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Action completed successfully");
        fetchSuspendedUsers();
        reset();
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuspendedUsers = useCallback(async () => {
    try {
      const res = await apiRequest<ApiResponse<SuspendedUsersResponse>>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/banedUsers`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success && res.data) {
        setSuspendedUsers(res.data.data);
      } else {
        toast.error("Error fetching suspended users: " + res.message);
      }
    } catch (err: any) {
      toast.error("Error fetching suspended users: " + err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchSuspendedUsers();
  }, [fetchSuspendedUsers]);

  return (
    <>
      <LineTitle onClick={() => {}} title="Block Users" />
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />

      {/* Ban */}
      <AdminTemplateBox title="Ban Account">
        <CustomAdminInput
          title="TID"
          value={banTid}
          onChange={setBanTid}
          type="text"
        />
        <CustomAdminInput
          title="2FA Code"
          value={banTwoFa}
          onChange={setBanTwoFa}
          type="text"
        />
        <div className="flex items-center mt-4">
          <button
            onClick={() =>
              handleAction(
                "ban",
                banTid,
                banTwoFa,
                () => {
                  setBanTid("");
                  setBanTwoFa("");
                },
                setLoadingBan
              )
            }
            disabled={loadingBan}
            className="titan-cancel-btn bg-[#FF6060] text-white hover:opacity-90 transition mt-2 disabled:opacity-50"
          >
            {loadingBan ? "Submitting..." : "Submit"}
          </button>
        </div>
      </AdminTemplateBox>

      {/* Unban */}
      <AdminTemplateBox title="Unban Account">
        <CustomAdminInput
          title="TID"
          value={unbanTid}
          onChange={setUnbanTid}
          type="text"
        />
        <CustomAdminInput
          title="2FA Code"
          value={unbanTwoFa}
          onChange={setUnbanTwoFa}
          type="text"
        />
        <div className="flex items-center mt-4">
          <button
            onClick={() =>
              handleAction(
                "unban",
                unbanTid,
                unbanTwoFa,
                () => {
                  setUnbanTid("");
                  setUnbanTwoFa("");
                },
                setLoadingUnban
              )
            }
            disabled={loadingUnban}
            className="titan-btn text-white hover:opacity-90 transition mt-2 disabled:opacity-50"
          >
            {loadingUnban ? "Submitting..." : "Submit"}
          </button>
        </div>
      </AdminTemplateBox>

      {/* Suspended Users */}
      <div className="rounded-[.5rem] border-[2px] border-[#383C47] px-4 p-2 flex justify-center items-center w-fit mt-12 gap-2">
        <span className="text-[#707070]">Number of suspended users:</span>
        <span className="text-white">{suspendedUsers.suspend_count}</span>
      </div>
      <BlockUsersSuspendedList transactions={suspendedUsers.suspended_users} />

      {/* Delete */}
      <AdminTemplateBox title="Delete Account">
        <CustomAdminInput
          title="TID"
          value={deleteTid}
          onChange={setDeleteTid}
          type="text"
        />
        <CustomAdminInput
          title="2FA Code"
          value={deleteTwoFa}
          onChange={setDeleteTwoFa}
          type="text"
        />
        <div className="flex items-center mt-4">
          <button
            onClick={() =>
              handleAction(
                "delete",
                deleteTid,
                deleteTwoFa,
                () => {
                  setDeleteTid("");
                  setDeleteTwoFa("");
                },
                setLoadingDelete
              )
            }
            disabled={loadingDelete}
            className="titan-cancel-btn bg-[#FF6060] text-white hover:opacity-90 transition mt-2 disabled:opacity-50"
          >
            {loadingDelete ? "Submitting..." : "Submit"}
          </button>
        </div>
      </AdminTemplateBox>
    </>
  );
}
