"use client";
import SendMessageForm from "./SendMessageForm";
import MessageManagement from "./MessageManagement";
import { useRef } from "react";

export default function SupportSendMessage() {
  const messageManagementRef = useRef<any>(null);

  const handleReloadTickets = () => {
    messageManagementRef.current?.fetchTickets();
  };

  return (
    <>
      <SendMessageForm handleReload={handleReloadTickets} />
      <MessageManagement ref={messageManagementRef} />
    </>
  );
}
