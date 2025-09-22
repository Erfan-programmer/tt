"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/styles/Register/Register.css";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { ToastContainer, toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/libs/api";
import { saveUserData } from "@/components/modules/EncryptData/SavedEncryptData";

const loginSchema = z.object({
  TID: z.string().regex(/^\d{5}$/, "TID must be exactly 5 digits."),
  password: z.string().min(6, "Password must be at least 6 characters"),
  twoFaCode: z
    .string()
    .length(6, "2FA code must be 6 digits")
    .regex(/^\d{6}$/, "2FA code must be 6 digits (0-9)."),
});

type LoginFormType = z.infer<typeof loginSchema>;

const FormField = ({ name, control, label, ...props }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <CustomInput
        {...field}
        value={field.value || ""}
        onChange={field.onChange}
        readOnly={false}
        label={label}
        {...props}
        hasError={!!fieldState.error}
        errorMessage={fieldState.error?.message}
      />
    )}
  />
);

export default function Login() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    }
    if (localStorage.getItem("accessToken")) {
      router.push("/dashboard");
    }
  }, [router]);

 const onSubmit = async (data: LoginFormType) => {
  try {
    const response = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/login`,
      "POST",
      {
        tid: data.TID,
        password: data.password,
        otp: data.twoFaCode,
      }
    );

    if (response.success && response.data) {
      const userResponse = response.data.data;

      saveUserData(userResponse, userResponse.expires_in);

      toast.success(response.message || "Login successful");
      setTimeout(() => {
        location.href = "/dashbboard"
        // router.replace("/dashboard");
      }, 200);

    } else {
      toast.error(response.message || "Login failed");
    }
  } catch (err: any) {
    toast.error(err?.message || "Unexpected error");
  }
};


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme={theme}
      />
      <div className="sm:px-0">
        <div className="sm:mb-[4rem]">
          <div className="formlayout-bg-mobile flex flex-col items-start justify-end pb-[3rem] px-[1rem] sm:hidden">
            <Image
              src="/images/space-man.png"
              className="absolute w-[8rem] h-[8rem] bottom-[0rem] right-[0rem] z-[10]"
              alt=""
              width={1500}
              height={1500}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white relative z-[12]"
            >
              Create Your TITAN Account
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 block  relative z-[12]"
            >
              Unlock new opportunities with just a few clicks
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
                Welcome Back
              </motion.h2>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="titan-light-text block"
              >
                Your Path to Greatness Starts Here
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
                onSubmit={handleSubmit(onSubmit)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormField
                    name="TID"
                    control={control}
                    label="TID"
                    required
                    placeholder="Enter your TID"
                    type="text"
                    maxLength={5}
                    onlyNumber
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormField
                    name="password"
                    control={control}
                    label={
                      <div className="flex justify-between items-center w-full">
                        <span>Password:</span>
                        <Link
                          href="/reset-password"
                          className="text-xs underline text-gray-800 dark:text-gray-400 hover:text-[var(--primary-color)] transition"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    }
                    required
                    placeholder="Enter your password"
                    type="password"
                    minLength={6}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormField
                    name="twoFaCode"
                    control={control}
                    label="2FA Code"
                    required
                    placeholder="Enter 2FA code"
                    onlyNumber
                    minLength={6}
                    maxLength={6}
                    type="text"
                  />
                </motion.div>

                <div className="mt-10">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    type="submit"
                    className={`submit-register text-white w-[80%] ${
                      isValid && !isSubmitting
                        ? "cursor-pointer bg-[#030a30]"
                        : "opacity-50 bg-gray-400"
                    }`}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center items-center gap-1 have-account mt-[1rem]"
                >
                  <span className="titan-light-text">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    href="/register"
                    className="text-[var(--main-background)] dark:text-white font-bold"
                  >
                    Register
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
