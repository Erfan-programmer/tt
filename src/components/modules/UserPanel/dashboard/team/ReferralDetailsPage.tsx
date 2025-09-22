import TeamReferralDetailsContent from "@/skeletons/User-Panel/dashboard/TeamReferralDetailsContent";
import TitanNotice from "../../TitanNotice/TitanNotice";

export default function ReferralDetailsPage() {

    // const { data: permissions } = usePermissions();
  // let permissionArray = [];

  // if (typeof permissions?.data?.body === "string") {
  //   permissionArray = permissions.data.body.split(",");
  // } else if (Array.isArray(permissions?.data?.body)) {
  //   permissionArray = permissions.data.body;
  // }
  return (
    <>
      <TitanNotice
        title="Notice"
        description="You will receive a 5% commission relative to the investment amount from individuals who have invested in Titan Investments through you."
      />
      {/* <TeamReferralDetailsContent permissionsStatement={permissionArray.includes("network.referral_detail.statement")} permissionsInvite={permissionArray.includes("network.referral_detail.invite")}/> */}
      <TeamReferralDetailsContent />
    </>
  );
}
