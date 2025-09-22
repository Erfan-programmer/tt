import { IoMdClose } from "react-icons/io";
import { useState } from "react";

interface LogoutProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Logout({ isOpen, onClose, onLogout }: LogoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogout();  
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen backdrop-blur-sm w-screen bg-black/30 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#d9d9d9] dark:bg-[#2A2C38] rounded-xl w-full max-w-[500px] p-4 sm:p-8 relative border border-[#275edf] shadow-[0_0_15px_rgba(39,94,223,.5)]">
        
        <button
          onClick={onClose}
          className="absolute right-2 sm:right-4 top-2 sm:top-4 text-[var(--main-background)] dark:text-white"
        >
          <IoMdClose size={24} />
        </button>

        <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <h2 className="text-[var(--main-background)] dark:text-white text-md sm:text-2xl font-medium">
            Are you sure you want to log out?
          </h2>
          <p className="text-[var(--main-background)] dark:text-[#fff] text-sm sm:text-base">
            We&apos;ll be here when you come back
          </p>
        </div>

        <div className="flex justify-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="px-6 sm:px-12 py-2.5 sm:py-3 rounded-full bg-[#3F4149] text-white hover:bg-opacity-90 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-6 sm:px-12 py-2.5 sm:py-3 rounded-full bg-[#FF4747] text-white hover:bg-opacity-90 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging out...</span>
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
