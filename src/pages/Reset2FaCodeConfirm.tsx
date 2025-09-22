"use client";
import { motion } from "framer-motion";
import "@/styles/Register/Register.css";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
// Assuming you have a file for toast and navigation setup
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation'; // or 'next/router' for Pages Router

const schema = z.object({
  tid: z
    .string()
    .min(4, { message: "TID must be 4 digits" })
    .max(4, { message: "TID must be 4 digits" })
    .regex(/^\d{4}$/, { message: "TID must be 4 digits" }),
  email: z.string().email({ message: "Enter a valid email" }),
  twofa: z
    .string()
    .regex(/^(\d{4}|\d{6})$/, { message: "2FA code must be 4 or 6 digits" }),
});

type ForgotPasswordForm = z.infer<typeof schema>;

export default function Reset2FAConfirm() {
  // const navigate = useRouter(); // Example for App Router

  const {
    control,
    handleSubmit, // ✅ Added handleSubmit
    formState: { errors, isValid, isSubmitting }, // ✅ Added isValid
    // watch, // ✅ Added watch
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  // Watch for changes in the 'tid' and 'email' fields to enable/disable the button
  // const formValues = watch(["tid", "email"]);

  // The 'canSubmit' logic should check if the form is valid, not just if fields are filled
  const canSubmit = isValid; // ✅ More robust check

  const onSubmit = (data: ForgotPasswordForm) => {
    // Implement your API call here
    // mutation.mutate({
    //   data: { email: data.email },
    //   headers: GetHeaderWithAuth(),
    // });
    console.log("Form submitted with data:", data);
  };

  return (
    <>
      <ToastContainer />
      <div className="sm:mb-[4rem]">
        {/* Mobile Background and Text (OK) */}
        <div className="formlayout-bg-mobile-Titan-recover-confirm Account relative Recovery flex flex-col items-start justify-center px-[1rem] sm:hidden">
          <div className="w-full h-full bg-black/40 absolute top-0 left-0" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white relative z-10"
          >
            Upload Your Verification Selfie
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#ddd] block relative z-10"
          >
            Please upload a clear and high-quality selfie of yourself holding
            the required information sheet. <br /> Make sure your face and all text are
            fully visible and readable.{" "}
          </motion.span>
        </div>

        {/* Desktop Text (OK) */}
        <div className="px-4">
          <div className="hidden sm:block">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[var(--main-background)] dark:text-white"
            >
              Upload Your Verification Selfie
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="titan-light-text block"
            >
              Please upload a clear and high-quality selfie of yourself holding
              the required information sheet. <br /> Make sure your face and all text
              are fully visible and readable.
            </motion.span>
          </div>

          <motion.div
            className="register-inputs mt-[2rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <form
              className="sm:mt-[5rem] sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)} // ✅ Added handleSubmit
            >
              {/* TID Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Controller
                  name="tid"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      readOnly={false}
                      label="TID"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      required={true}
                      placeholder="Enter your TID"
                      type="text"
                      maxLength={4}
                      onlyNumber={true}
                      validateLatinOnly={true}
                      // customValidation removed, Zod handles it
                      hasError={!!errors.tid}
                      errorMessage={errors.tid?.message as string}
                    />
                  )}
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      readOnly={false}
                      label="Email"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      required={true}
                      placeholder="Enter your email"
                      type="email"
                      hasError={!!errors.email}
                      errorMessage={errors.email?.message as string}
                    />
                  )}
                />
              </motion.div>
              <div className="my-10 flex justify-center items-center">
                {/* <VerificationStepBox title="Choose File" section={1} image="" /> */}
              </div>

              {/* Submit Button */}
              <div className="mt-10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  type="submit"
                  className={`submit-register text-white w-[80%] ${
                    !canSubmit
                      ? "opacity-50 disabled:!bg-gray-400 cursor-not-allowed"
                      : "bg-[#030A30] cursor-pointer"
                  }`}
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </motion.button>
              </div>

              {/* Back to Login Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center gap-1 have-account mt-[1rem]"
              >
                <span className="titan-light-text">Back to </span>
                <Link
                  href="/login"
                  className="text-[var(--main-background)] dark:text-white font-bold"
                >
                  Login
                </Link>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}