import { toast } from "react-toastify";

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:
      typeof document !== "undefined" && document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
  });
};

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:
      typeof document !== "undefined" && document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
  });
};
