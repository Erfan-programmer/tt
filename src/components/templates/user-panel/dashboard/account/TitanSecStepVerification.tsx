import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useVerify } from "@/contextApi/TitanContext";
import TabVerification from "./TabVerification";

export default function TitanSecStepVerification() {
  const { setFileSectionPairs } = useVerify();

  const deleteVerificationMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.VITE_API_URL}/profile/delete_all`,
        {},
        {
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "All verification documents deleted successfully");
      setFileSectionPairs([]);
    },
    onError: (error: any) => {
      console.error("Delete verification error:", error);
      toast.error(error.response?.data?.message || "Failed to delete verification documents");
    },
  });

  const handleRemoveVerification = () => {
    deleteVerificationMutation.mutate();
  };

  return (
    <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
      <ToastContainer />
      <div className="titan-form-wrraper w-[95%] mx-auto">
        <div className="titan-form-header flex justify-between items-center">
          <h4 className="text-[var(--main-background)] dark:text-white">Verify my identity using</h4>
          <button 
            className="titan-form-right flex item-center gap-1 text-[var(--main-background)] dark:text-white" 
            onClick={handleRemoveVerification}
            disabled={deleteVerificationMutation.isPending}
          >
            <RiDeleteBin6Line className="text-[var(--loss)] text-[1.2rem] mt-1" />
            <p className="underline">
              {deleteVerificationMutation.isPending ? "Deleting..." : "Delete All"}
            </p>
          </button>
        </div>
        <div className="titan-form-footer mt-[2rem]">
          <TabVerification />
        </div>
      </div>
    </div>
  );
}
