"use client"
import { motion } from "framer-motion";
import "@/styles/Register/Register.css";
import CustomInput from "@/components/Ui/inputs/CustomInput";
// import { toast, ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const schema = z.object({
  tid: z
    .string()
    .min(4, { message: "TID must be 4 digits" })
    .max(4, { message: "TID must be 4 digits" })
    .regex(/^\d{4}$/, { message: "TID must be 4 digits" }),
  email: z
    .string()
    .email({ message: "Enter a valid email" }),
  twofa: z
    .string()
    .regex(/^(\d{4}|\d{6})$/, { message: "2FA code must be 4 or 6 digits" }),
});

type ForgotPasswordForm = z.infer<typeof schema>;

export default function ResetPassword() {
  const {
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

//   const mutation = useApiMutation<any>(
//     "/auth/password/forgot",
//     "POST",
//     {
//       onSuccess: (data: any) => {
//         if (data.status === "success") {
//           toast.success(data.message);
//           setTimeout(() => {
//             navigate("/login");
//           }, 3000);
//         } else {
//           toast.error(data.message || "Failed to send reset instructions");
//         }
//       },
//       onError: (error: any) => {
//         if (error?.response?.status === 422) {
//           toast.error("This email is not registered in our system");
//         } else {
//           toast.error(error?.message || "Server connection error");
//         }
//       },
//     }
//   );

//   const onSubmit = (data: ForgotPasswordForm) => {
//     mutation.mutate({
//       data: { email: data.email , tid: data.tid , code: data.twofa },
//       headers:GetHeaderWithOutAuth(),
//     });
//   };

  return (
    <>
      {/* <ToastContainer
  closeButton={({ closeToast }) => (
    <button onClick={closeToast}>
      <FaTimes className="text-white" />
    </button>
  )}
/> */}
      <div className="sm:mb-[4rem]">
        <div className="formlayout-bg-mobile-forgot-password flex flex-col items-start justify-end pb-8 mb-4 px-[1rem] sm:hidden">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#383C47] dark:text-white"
          >
            Reset Password
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#ddd] block"
          >
            Together, We’ll Tackle Any Issue and Move Forward
          </motion.span>
        </div>
        <div className="px-4">
          <div className="hidden sm:block">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[var(--main-background)] dark:text-white"
            >
              Reset Password
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="titan-light-text block"
            >
              Together, We’ll Tackle Any Issue and Move Forward
            </motion.span>
          </div>

          <motion.div
            className="register-inputs mt-[2rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <form className="sm:mt-[5rem] sm:space-y-6" >
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
                      customValidation={{
                        validate: (val: string) => /^\d{4}$/.test(val),
                        errorMessage: "TID must be 4 digits",
                      }}
                      hasError={!!errors.tid}
                      errorMessage={errors.tid?.message as string}
                    />
                  )}
                />
              </motion.div>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Controller
                  name="twofa"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      readOnly={false}
                      label="2FA"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      required={true}
                      placeholder="Enter your 2FA code"
                      type="text"
                      onlyNumber={true}
                      validateLatinOnly={true}
                      hasError={!!errors.twofa}
                      errorMessage={errors.twofa?.message as string}
                      customValidation={{
                        validate: (val: string) => /^\d{6}$/.test(val),
                        errorMessage: "2fa code is not valid",
                      }}
                    />
                  )}
                />
              </motion.div>
              <div className="mt-10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  type="submit"
                  className={`submit-register text-white w-[80%] ${
                    !isValid || isSubmitting 
                      ? "opacity-50 disabled:!bg-gray-400 cursor-not-allowed"
                      : "bg-[#275edf] cursor-pointer"
                  }`}
                  disabled={!isValid || isSubmitting }
                >
                  {isSubmitting  ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </motion.button>
              </div>

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
