"use client";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import NotActiveAccountsList from "@/components/modules/p-admin/users/NotActiveAccountsList";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { apiRequest } from "@/libs/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface UserType {
  id: number;
  date: string;
  email: string;
  account_type: string;
  full_name: string;
  country: {
    id: number;
    name: number;
    code: number;
    dial_code: number;
  };
}

export default function NotActiveAccount() {
  const [notActiveUsers, setNotActiveUsers] = useState<UserType[]>([]);
  const [showTitleLine, setShowTitleLine] = useState(false);

  const fetchNonActiveUsers = async (
    filter_by?: string,
    filter_value?: string
  ) => {
    try {
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<{ data: UserType[] }>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/notActiveUsers?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setNotActiveUsers(res.data?.data || []);
        console.log(res.data?.data || []);
      } else {
        setNotActiveUsers([]);
        toast.error("Error fetching users: " + res.message);
      }
    } catch (err: any) {
      setNotActiveUsers([]);
      toast.error("Error fetching users: " + err.message);
    }
  };

  useEffect(() => {
    fetchNonActiveUsers();
  }, []);

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowTitleLine(!showTitleLine);
        }}
        title="Not Active Account"
      />
      {!showTitleLine && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              { label: "Email", value: "email", placeholder: "Enter Email..." },
              {
                label: "Full Name",
                value: "full_name",
                placeholder: "Enter Full Name...",
              },
              {
                label: "Account Type",
                value: "account_type",
                placeholder: "Enter Account Type...",
              },
              {
                label: "Country",
                value: "country",
                placeholder: "Enter Country...",
              },
            ]}
            onSearch={(filter_by, filter_value) =>
              fetchNonActiveUsers(filter_by, filter_value)
            }
            onClear={() => fetchNonActiveUsers()}
          />
          <NotActiveAccountsList data={notActiveUsers} />
        </AnimationTemplate>
      )}
    </>
  );
}
