import TabVerification from "./TabVerification";
export default function TitanSecStepVerification() {



  return (
    <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
      <div className="titan-form-wrraper w-[95%] mx-auto">
        <div className="titan-form-header flex justify-start items-center">
          <h4 className="text-[var(--main-background)] dark:text-white">Verify my identity using</h4>
        </div>
        <div className="titan-form-footer mt-[2rem]">
          <TabVerification />
        </div>
      </div>
    </div>
  );
}
