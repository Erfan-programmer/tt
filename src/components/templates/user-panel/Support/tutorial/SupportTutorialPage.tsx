import TutorialBoxContent from "@/contextApi/TutorialBoxContent";

export default function SupportTutorialPage() {
//   const { data: permissions } = usePermissions();

//   let permissionArray: string[] = [];

//   if (typeof permissions?.data?.body === "string") {
//     permissionArray = permissions.data.body.split(",");
//   } else if (Array.isArray(permissions?.data?.body)) {
//     permissionArray = permissions.data.body;
//   }

  return (
    <>
      {/* {permissionArray.includes("support.tutorial") && <TutorialBoxContent />} */}
      <TutorialBoxContent />    </>
  );
}
