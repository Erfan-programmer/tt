"use client"
import { useState } from "react";
import TeamTreeStructureContent, { ReferralType } from "./TeamTreeStructoreContent";
import { IoMdClose } from "react-icons/io";
import TeamTreeStructureDetails from "./TeamTreeStructureDetails";

export default function TeamTreeStructurePage() {
  const [selectedReferral, setSelectedReferral] = useState<ReferralType | null>(
    null
  );
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const handleReferralSelect = (referral: ReferralType) => {
    setSelectedReferral(referral);
    setIsMobileModalOpen(true);
  };

//   const { data: permissions } = usePermissions();

//   let permissionArray = [];

//   if (typeof permissions?.data?.body === "string") {
//     permissionArray = permissions.data.body.split(",");
//   } else if (Array.isArray(permissions?.data?.body)) {
//     permissionArray = permissions.data.body;
//   }

  return (
    <>
        <div className="flex flex-col sm:flex-row justify-center items-start gap-4">
          <TeamTreeStructureContent onReferralSelect={handleReferralSelect} />

          {/* Desktop View */}
          <div className="hidden sm:block w-[30%]">
            <TeamTreeStructureDetails selectedReferral={selectedReferral} />
          </div>

          {/* Mobile Modal */}
          {isMobileModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-[1000] sm:hidden">
              <div className="absolute bottom-0 left-0 right-0 top-16  rounded-t-xl p-4 ">
                <div className="absolute -top-4 right-0 flex justify-between items-center mb-4">
                  <button
                    onClick={() => setIsMobileModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <IoMdClose className="w-6 h-6 text-[var(--dark-color)] dark:text-white" />
                  </button>
                </div>
                <TeamTreeStructureDetails selectedReferral={selectedReferral} />
              </div>
            </div>
          )}
        </div>
    </>
  );
}
