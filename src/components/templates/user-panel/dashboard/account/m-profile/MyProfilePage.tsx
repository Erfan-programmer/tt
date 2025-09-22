"use client";

import { useEffect, useState } from "react";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import TitanPassForm from "@/components/templates/user-panel/dashboard/account/m-profile/TitanPassForm";
import TitanChangePassForm from "@/components/templates/user-panel/dashboard/account/m-profile/TitanChangePassForm";
import TitanForm from "@/components/templates/user-panel/dashboard/account/m-profile/TitanForm";
import TitanEmailForm from "@/components/templates/user-panel/dashboard/account/m-profile/TitanEmailForm";
import { apiRequest } from "@/libs/api";
import { UserProfileType } from "@/types/p-admin/dashoard";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

export default function MyProfile() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = loadUserData()?.access_token
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/profile`,
        "GET",
        undefined,
        { Authorization : `Bearer ${token}`}
      );

      if (res.success) {
        setProfile(res.data.data);
        console.log("data reponse =>" , res.data.data)
      } else {
        setError(res.message || "Failed to load profile");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <>
      <TitanNotice
        title="Notice"
        description="Investors can update their account details according to their official identification documents before verifying their identity. After submitting the documents and verifying their identity, this section will be deactivated."
      />

      {loading && <p className="text-gray-500">Loading profile...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {profile && (
        <>
          <TitanForm />

          {/* permissionArray.includes("account.profile.personal_info") && <TitanPassForm /> */}
       <TitanPassForm profile={profile} />

          {/* permissionArray.includes("account.profile.change_email") && <TitanEmailForm /> */}
          <TitanEmailForm />

          {/* permissionArray.includes("account.profile.change_password") && <TitanChangePassForm /> */}
          <TitanChangePassForm />
        </>
      )}
    </>
  );
}
