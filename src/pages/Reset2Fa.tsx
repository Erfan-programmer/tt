"use client";
import { motion } from "framer-motion";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

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

export default function Reset2FA() {
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
  //             router("/login");
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
  //       data: { email: data.email },
  //       headers: GetHeaderWithOutAuth(),
  //     });
  //   };

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <div className="sm:mb-[4rem]">
        <div className="formlayout-bg-mobile-Titan-recover p-4 Account Recovery flex flex-col items-start justify-end px-[1rem] sm:hidden bg-black/60">
          <div className="w-full h-full bg-black/40 absolute top-0 left-0" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white relative z-10"
          >
            Titan Account Recovery
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#ddd] block relative z-10"
          >
            If you have lost access to your Titan account information,
            don&apos;t worry — our support team is fully committed to helping
            you through the recovery process. If you wish to reset your 2FA
            code, please be aware that this procedure involves a fee, requires
            patience, and you must verify your account ownership to the company.
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
              Titan Account Recovery
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="titan-light-text block"
            >
              If you have lost access to your Titan account information,
              don&apos;t worry — our support team is fully committed to helping
              you through the recovery process. <br /> If you wish to reset your
              2FA code, please be aware that this procedure involves a fee,
              requires patience, and you must verify your account ownership to
              the company.
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
              //  onSubmit={handleSubmit(onSubmit)}
            >
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
                  disabled={!isValid || isSubmitting}
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
