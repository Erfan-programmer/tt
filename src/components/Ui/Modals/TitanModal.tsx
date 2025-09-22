"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { LiaTimesSolid } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



type FormData = {
  name: string;
  email: string;
  wallet: string;
};

interface TitanModalProps {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}

export default function TitanModal({
  title,
  description,
  children,
  onClose,
}: TitanModalProps) {
  const { handleSubmit, formState } = useFormContext<FormData>();
  const { isValid, isSubmitting } = formState;

  const formHandler = async (data: FormData) => {
    const payload = {
      ...data,
      wallet: btoa(data.wallet),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/createForm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.status) {
        toast.success(result.message || "Form submitted successfully!", {
          position: "top-center",
          autoClose: 8000,
        });
        // The modal will no longer close automatically after a successful submission.
        // You can add a button to close the modal manually.
      } else {
        toast.error(result.error?.message || "Something went wrong!", {
          position: "top-center",
          autoClose: 8000,
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("Unexpected error. Please try again later.", {
        position: "top-right",
        autoClose: 30000, // Duration set to 30 seconds
      });
    }
  };

  return (
    <>
      {/* Toast container is now handled by react-toastify */}
      <ToastContainer />

      <AnimatePresence>
        <motion.div
          className="titan-modal fixed top-0 left-0 w-screen h-screen overflow-hidden bg-black/30 backdrop-blur-sm  flex justify-center items-center"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rounded-xl-shadow-xl border-2 min-h-80 sm:min-h-92 border-[#383C47] rounded-xl px-6 p-8 w-[90%] sm:w-[80%] lg:w-[50%] mx-auto backdrop-blur-md bg-[#58595d09]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center justify-between text-white">
              <p
                className="text-lg sm:text-2xl font-bold flex items-center gap-2"
                dangerouslySetInnerHTML={{ __html: title }}
              ></p>
              <div
                className="w-8 h-8 rounded-full bg-white flex justify-center items-center cursor-pointer"
                onClick={onClose}
              >
                <LiaTimesSolid className="text-xl text-[var(--main-background)]" />
              </div>
            </div>
            <div className="mt-4 w-[100%] sm:w-[92%]">
              <span
                className="text-[#dfdfdf] text-[1rem] sm:text-md"
                dangerouslySetInnerHTML={{ __html: description }}
              ></span>
            </div>
            <div className="my-4">
              <div className="mx-auto">
                <form
                  onSubmit={handleSubmit(formHandler)}
                  className="flex rounded-xl bg-[#151629] py-6 px-4 flex-col gap-2 sm:gap-8 sm:w-[90%] mx-auto"
                >
                  {children}
                  <button
                    type="submit"
                    className={`titan-btn mt-4 p-2 px-12 mx-auto rounded-xl w-60 ${
                      !isValid || isSubmitting
                        ? "opacity-50 !bg-gray-400 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                    }`}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
