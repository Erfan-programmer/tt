"use client";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import UserDetails from "./UserDetails";
import UserActionHistory from "./UserActionHistory";
import { ContactsProvider } from "@/contextApi/ContactsContext";

export default function ContractPage() {
  return (
    <>
      <TitanNotice
        title="Notice"
        description="You can save a user's name by entering their T-ID, allowing you to quickly and easily access your contact list or team members when needed"
      />
        <ContactsProvider>
          <UserDetails />
          <UserActionHistory />
        </ContactsProvider>
    </>
  );
}
