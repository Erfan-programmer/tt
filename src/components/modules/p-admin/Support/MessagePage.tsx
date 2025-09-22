"use client";
import React, { useEffect, useState, useCallback } from "react";
import LineTitle from "../LineTitle";
import MessageToturialSection from "./MessageToturialSection";
import NotificationSection from "./NotificationSection";
import PublicNotificationSection from "./PublicNotificationSection";
import AdminListMessage from "./AdminListMessage";
import AddSpecialCommissionRule from "./AddSpecialCommissionRule";
import DashboardHeaderMessage from "./DashboardHeaderMessage";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import NotificationList, { Notification } from "./NotificationList";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import Pagination from "../../UserPanel/Pagination/Pagination";
import DashboardHeaderMessageList from "./message/DashboardHeaderMessageList";

type OptionMessage = {
  message: boolean;
  notification: boolean;
  public_message: boolean;
  list_of_message: boolean;
  message_specific: boolean;
  dashboard_header_msg: boolean;
};

export interface HeaderMessage {
  id: number;
  title: string;
  message: string;
  image: string;
  color_start: string;
  color_end: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface HeaderMessageResponse {
  success: boolean;
  message: string;
  data: {
    data: HeaderMessage[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function MessagePage() {
  const [options, setOptions] = useState<OptionMessage>({
    message: true,
    notification: true,
    public_message: true,
    list_of_message: true,
    message_specific: true,
    dashboard_header_msg: true,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifPage, setNotifPage] = useState(1);
  const [notifPerPage, setNotifPerPage] = useState(10);
  const [notifTotal, setNotifTotal] = useState(0);

  const [headerMessages, setHeaderMessages] = useState<HeaderMessage[]>([]);
  const [headerPage, setHeaderPage] = useState(1);
  const [headerPerPage] = useState(10);
  const [headerTotal, setHeaderTotal] = useState(0);

  const token = loadEncryptedData()?.token;

  const fetchNotifications = useCallback(
    async (pageNumber = 1) => {
      try {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/notifications?page=${pageNumber}&perPage=${notifPerPage}`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );
        setNotifications(res?.data?.data || []);
        setNotifTotal(res?.data?.meta?.total || 0);
        setNotifPerPage(res?.data?.meta?.per_page || notifPerPage);
        setNotifPage(pageNumber);
      } catch {
        toast.error("Failed to load notifications!");
      }
    },
    [
      notifPerPage,
      token,
      setNotifications,
      setNotifTotal,
      setNotifPerPage,
      setNotifPage,
    ]
  );

  const fetchHeaderMessages = useCallback(
    async (pageNumber = 1) => {
      try {
        const res = await apiRequest<HeaderMessageResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getHeaderMessages?page=${pageNumber}&perPage=${headerPerPage}`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );
        setHeaderMessages([...(res?.data.data.data || [])]);
        setHeaderTotal(res?.data.data.total || 0);
        setHeaderPage(pageNumber);
      } catch {
        toast.error("Failed to load header messages!");
      }
    },
    [headerPerPage, token, setHeaderMessages, setHeaderTotal, setHeaderPage]
  );

  useEffect(() => {
    fetchNotifications();
    fetchHeaderMessages();
  }, [fetchHeaderMessages, fetchNotifications]);

  return (
    <>
      <LineTitle
        title="Message"
        onClick={() =>
          setOptions((prev) => ({ ...prev, message: !prev.message }))
        }
      />
      {options.message && (
        <AnimationTemplate>
          <MessageToturialSection />
        </AnimationTemplate>
      )}

      <LineTitle
        title="Notification"
        onClick={() =>
          setOptions((prev) => ({ ...prev, notification: !prev.notification }))
        }
      />
      {options.notification && (
        <AnimationTemplate>
          <NotificationSection />
          <NotificationList
            notifications={notifications}
            refetch={() => fetchNotifications(notifPage)}
          />
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(notifTotal / notifPerPage)}
              page={notifPage}
              onChange={(e, newPage) => fetchNotifications(newPage)}
            />
          </div>
        </AnimationTemplate>
      )}

      <LineTitle
        title="Public Messages"
        onClick={() =>
          setOptions((prev) => ({
            ...prev,
            public_message: !prev.public_message,
          }))
        }
      />
      {options.public_message && <PublicNotificationSection />}

      <LineTitle
        title="List Of Messages"
        onClick={() =>
          setOptions((prev) => ({
            ...prev,
            list_of_message: !prev.list_of_message,
          }))
        }
      />

      <LineTitle
        title="Messages for a Specific ID Or Ranks"
        onClick={() =>
          setOptions((prev) => ({
            ...prev,
            message_specific: !prev.message_specific,
          }))
        }
      />
      {options.message_specific && <AddSpecialCommissionRule />}

      {options.list_of_message && <AdminListMessage />}
      <LineTitle
        title="Dashboard Header Message"
        onClick={() =>
          setOptions((prev) => ({
            ...prev,
            dashboard_header_msg: !prev.dashboard_header_msg,
          }))
        }
      />
      {options.dashboard_header_msg && (
        <AnimationTemplate>
          <DashboardHeaderMessage refetch={() => fetchHeaderMessages(1)} />
          <DashboardHeaderMessageList
            key={headerPage}
            refetch={() => fetchHeaderMessages(headerPage)}
            headerMessages={headerMessages}
          />
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(headerTotal / headerPerPage)}
              page={headerPage}
              onChange={(e, newPage) => fetchHeaderMessages(newPage)}
            />
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
