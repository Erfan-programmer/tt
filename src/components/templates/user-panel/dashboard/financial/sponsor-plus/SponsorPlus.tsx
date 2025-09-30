"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { ToastContainer, toast } from "react-toastify";
import { BsStars } from "react-icons/bs";
import { FaRegCopy, FaTimes, FaTrashAlt } from "react-icons/fa";
import { ImNewTab } from "react-icons/im";
import { MdQrCode } from "react-icons/md";
import { useHeader } from "@/contextApi/HeaderContext";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useStatements } from "@/contextApi/SponsorContext";
import Image from "next/image";

export default function SponsorPlus({refetch}:{refetch:()=> void}) {
  const [hasSponsor, setHasSponsor] = useState<boolean>(false);
  const [showLink, setShowLink] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [removing, setRemoving] = useState(false);
  const { headerData } = useHeader();
  const token = loadUserData()?.access_token;
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { fetchStatements } = useStatements();

  const schema = z.object({
    sponsorID: z
      .string()
      .min(4, "Sponsor ID is required")
      .max(20, "Sponsor ID too long")
      .regex(/^\d+$/, "Only numbers are allowed"),
    referralRecipientID: z
      .string()
      .min(4, "Referral recipient ID is required")
      .max(20, "Referral recipient ID too long")
      .regex(/^\d+$/, "Only numbers are allowed"),
  });
  type FormType = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      sponsorID: "",
      referralRecipientID: "",
    },
  });

  const sponsorIDValue = watch("sponsorID");
  const referralRecipientIDValue = watch("referralRecipientID");

  useEffect(() => {
    const tid = headerData?.t_id;
    if (hasSponsor) {
      setValue("sponsorID", "");
      setValue("referralRecipientID", "");
    } else {
      setValue("sponsorID", String(tid ?? ""));
      setValue("referralRecipientID", String(tid ?? ""));
    }
    // eslint-disable-next-line
  }, [hasSponsor, headerData]);

  // Generate referral link
  const generateLink = async (data: FormType) => {
    try {
      const payload = {
        sponsor_id: data.sponsorID,
        referrer_id: data.referralRecipientID,
      };
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/sponsor-plus/generate`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );
      setReferralCode(res.data.data);
      if (res.success) {
        setShowLink(true);
        fetchStatements();
        refetch()
        toast.success(res?.message || "Referral link generated successfully!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate referral link");
    }
  };

  // Remove referral link
  const removeLink = async () => {
    try {
      setRemoving(true);
      const code = referralCode.split("id=")[1];
      await apiRequest<any>(
        "/referral/delete",
        "POST",
        { code },
        { Authorization: `Bearer ${token}` }
      );
      setReferralCode("");
      setShowLink(false);
      toast.success("Referral link removed successfully!");
      fetchStatements();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove referral link");
    } finally {
      setRemoving(false);
    }
  };

  // Copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Show QR
  const handleShowQr = async () => {
    try {
      const url = await QRCode.toDataURL(referralCode);
      setQrImage(url);
      setShowQrModal(true);
    } catch {
      toast.error("Failed to generate QR code");
    }
  };
  const handleCloseQr = () => setShowQrModal(false);

  // Form submit handler
  const onSubmit = (data: FormType) => {
    generateLink(data);
  };

  return (
    <>
      <div className="new-account-contentainer px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
        <ToastContainer
  closeButton={({ closeToast }) => (
    <button onClick={closeToast}>
      <FaTimes className="text-white" />
    </button>
  )}
/>
        <div className="new-account">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-[var(--main-background)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
              Referral Link Setting
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-standard my-2 sm:my-2.5 md:my-3"></div>

        {!showLink ? (
          <>
            <div className="register-inputs-sponsor flex items-center gap-3 mb-4 sm:mb-6">
              <label className="custom-radio-container flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSponsor}
                  onChange={() => setHasSponsor(!hasSponsor)}
                  className="hidden"
                />
                <span
                  className={`custom-radio w-7 h-7 border-2 border-[#275edf] dark:border-white rounded-lg flex items-center justify-center relative transition-colors duration-200 ${
                    hasSponsor
                      ? "[var(--main-background)]"
                      : "bg-white dark:bg-transparent"
                  }`}
                >
                  {hasSponsor && (
                    <span className="check-icon absolute inset-0 flex items-center justify-center opacity-100 transition-opacity">
                      <svg
                        className="w-12 h-12 sm:w-8 sm:h-8  text-white "
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 4L6.5 10.5L3 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </span>
                <span className="text-[var(--main-background)] dark:text-white text-md select-none">
                  I want to manually set Sponsor And Refferal Recipient IDs
                </span>
              </label>
            </div>

            <motion.div
              className="register-inputs mt-[2rem] flex flex-col sm:flex-row items-start gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full sm:w-auto"
              >
                <Controller
                  name="sponsorID"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      readOnly={!hasSponsor}
                      label="Sponsor ID"
                      value={field.value}
                      onChange={field.onChange}
                      showStar={true}
                      required={true}
                      validateLatinOnly={true}
                      onlyNumber={true}
                      minLength={4}
                      maxLength={20}
                      hasError={!!errors.sponsorID}
                      errorMessage={errors.sponsorID?.message as string}
                    />
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full sm:w-auto"
              >
                <Controller
                  name="referralRecipientID"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      readOnly={!hasSponsor}
                      label="Referral recipient ID"
                      value={field.value}
                      onChange={field.onChange}
                      showStar={true}
                      required={true}
                      validateLatinOnly={true}
                      onlyNumber={true}
                      minLength={4}
                      maxLength={20}
                      hasError={!!errors.referralRecipientID}
                      errorMessage={
                        errors.referralRecipientID?.message as string
                      }
                    />
                  )}
                />
              </motion.div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-8">
                <button
                  className="titan-btn-reset flex justify-center gap-4 items-center px-8 disabled:!bg-gray-400"
                  type="submit"
                  disabled={
                    showLink ||
                    (hasSponsor
                      ? !isValid
                      : !(sponsorIDValue && referralRecipientIDValue))
                  }
                >
                  <BsStars />
                  <span>Generate Link</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={`mt-3 transition-all duration-400 ease-in-out`}>
            <label className="text-[var(--main-background)] dark:text-white text-sm font-medium mb-2 block">
              Generated Link:
            </label>
            <div className="flex items-skretch flex-col sm:flex-row sm:items-center gap-4 my-4 sm:my-0">
              <div className="scan-code w-full items-center border-standard overflow-x-auto p-2 text-left rounded-xl pr-[2rem] flex items-center rounded-lg bg-white dark:bg-[var(--sidebar-bg)]">
                <span className="break-all text-lg text-[var(--main-background)] dark:text-white">
                  {referralCode || "-"}
                </span>
              </div>
              <button
                className="titan-logout-btn flex justify-center gap-3 items-center  p-2 px-4 rounded-xl disabled:!bg-gray-400"
                onClick={removeLink}
                disabled={removing}
              >
                <FaTrashAlt className="" />
                <span>{removing ? "Removing..." : "Remove Link"}</span>
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-center flex-wrap justify-center sm:justify-start gap-8 sm:gap-4">
                <button
                  className="titan-btn-download-white w-full sm:w-fit !py-2 !px-4 flex justify-center items-center gap-2"
                  onClick={() => window.open(referralCode, "_blank")}
                >
                  <span>Open Link in new tab</span>
                  <ImNewTab className="text-lg" />
                </button>
                <button
                  className="titan-btn-download-white w-full sm:w-fit !py-2 !px-4 flex justify-center items-center gap-2"
                  onClick={handleCopyLink}
                >
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                  <FaRegCopy className="text-lg" />
                </button>
                <button
                  className="titan-btn-download-white w-full sm:w-fit !py-2 !px-4 flex justify-center items-center gap-2"
                  onClick={handleShowQr}
                >
                  <span>Show QR Code</span>
                  <MdQrCode className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md overflow-auto p-2"
          onClick={handleCloseQr}
        >
          <div
            className="bg-white dark:bg-[#232633ff] border border-gray-200 dark:border-gray-600 rounded-2xl p-2 px-4 relative w-full max-w-xs sm:max-w-md md:max-w-lg shadow-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1 text-2xl z-10 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={handleCloseQr}
            >
              <FaTimes className="text-[var(--main-background)] dark:text-white" />
            </button>
            {qrImage ? (
              <Image
                width={300}
                height={300}
                src={qrImage}
                alt="Referral QR Code"
                className="w-full max-w-[320px] mx-auto max-h-[60vh] sm:max-h-[90vh] rounded-lg mt-2 block"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 animate-pulse rounded-lg" />
            )}
            <div className="text-center text-[var(--main-background)] dark:text-white mt-2 break-all text-[.8rem] sm:text-sm md:text-base">
              {referralCode}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
