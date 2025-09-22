import UserActionTab from "./UserActionTab";

export default function UserDetails() {
  return (
    <div className="user-details-container border-standard rounded-xl  py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4">
      <div className="user-details-header flex items-center gap-3 px-[2rem]">
        <p className="text-[var(--main-background)] dark:text-white">Enter  user&apos;s details</p>
      </div>
      <div className=" mt-5 mb-2 lg:w-[50%]">
        <UserActionTab />
      </div>
    </div>
  );
}
