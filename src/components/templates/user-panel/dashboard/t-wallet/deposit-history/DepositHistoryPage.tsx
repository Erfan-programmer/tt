import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import DepositHistoryList from "../action/DepositHistory";

export default function DepositHistoryPage() {
  // const { data: permissions } = usePermissions();

  // let permissionArray: string[] = [];

  // if (typeof permissions?.data?.body === "string") {
  //   permissionArray = permissions.data.body.split(",");
  // } else if (Array.isArray(permissions?.data?.body)) {
  //   permissionArray = permissions.data.body;
  // }
  return (
    <>
      <TitanNotice
        title="Notice"
        description="This page displays a complete record of your deposit activities, including successful, pending, failed, and expired transactions.<br /> Please allow up to 30 minutes for blockchain-based deposits to be confirmed and reflected here.<br/> If a transaction does not appear or shows an error, please contact support with your transaction ID."
      />
      {/* {permissionArray.includes("twallet.deposit_history") && ( */}
      <DepositHistoryList />
      {/* )} */}
    </>
  );
}
