"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/contextApi/HeaderContext";
import CustomInput from "@/components/Ui/inputs/CustomInput";
import { apiRequest } from "@/libs/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useAuth } from "@/contextApi/AuthContext";
import PositionSelect from "./PositionSelect";
import InvestmentPlanSelect from "./InvestmentPlanSelect";
import { FaTimes } from "react-icons/fa";

export default function TitanForm() {
  const { headerData } = useHeader();
  const { user } = useAuth();
  const [position, setPosition] = useState<string>(user?.user_type || "");
  const [amount, setAmount] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<{ id: number | string; name: string } | null>(
    user?.plan ? { id: user.plan.id, name: user.plan.name } : null
  );
  const [twoFaCode, setTwoFaCode] = useState<string>("");

  // errors
  const [errors, setErrors] = useState({ twoFaCode: "", amount: "" });
  const [touched, setTouched] = useState({ twoFaCode: false, amount: false });

  const [loading, setLoading] = useState(false);
  const token = loadUserData()?.access_token;

  useEffect(() => {
    const fetchInvestmentTerms = async () => {
      setLoading(true);
      const res = await apiRequest<{ data: string[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/investmentTerms`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (!res.success) toast.error(res.error?.message || "Failed to fetch investment terms");
      setLoading(false);
    };
    fetchInvestmentTerms();
  }, [position, headerData, token]);

  const handleTwoFaChange = (value: string) => {
    if (!/^\d{6}$/.test(value) && value.length > 0)
      setErrors((prev) => ({ ...prev, twoFaCode: "2FA code must be a 6-digit number" }));
    else setErrors((prev) => ({ ...prev, twoFaCode: "" }));
    setTwoFaCode(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value && Number(value) % 1000 !== 0) {
      setErrors((prev) => ({ ...prev, amount: "Deposit must be a multiple of 1000" }));
    } else {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleBlur = (field: "twoFaCode" | "amount") =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async () => {
    if (!twoFaCode) return toast.error("Please enter 2FA code");
    if (!selectedPlan) return toast.error("Please select a plan");
    if (!amount) return toast.error("Please enter amount");
    if (Number(amount) % 1000 !== 0) return toast.error("Deposit must be a multiple of 1000");

    try {
      setLoading(true);
      const payload = { code: twoFaCode, plan_id: selectedPlan.id, amount };
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/upgradeToInvestor`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success(res.message || "Upgraded to investor successfully");
        setTwoFaCode("");
        setAmount("");
      } else toast.error(res.error?.message || "Failed to upgrade");
    } catch (err: any) {
      toast.error(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = ["marketer", "contract free"].includes(position.toLowerCase());

  return (
    <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
      <ToastContainer
  closeButton={({ closeToast }) => (
    <button onClick={closeToast}>
      <FaTimes className="text-white" />
    </button>
  )}
/>
      <div className="titan-form-title w-[95%] mx-auto text-[var(--dark-color)] dark:text-white">
        <p>Your position & account type</p>
      </div>
      <div className="bg-standard w-full h-[2px] my-4"></div>
      <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[.3rem] items-start w-[95%] mx-auto">
        <PositionSelect
          className="w-[100%] md:w-[47%]"
          label="Position"
          value={position}
          onChange={setPosition}
          required={true}
          disabledOptions={["marketer", "contract free"]}
        />
        <CustomInput
          className="w-[100%] md:w-[47%]"
          readOnly={isFormDisabled}
          label="Deposit"
          value={amount}
          onChange={handleAmountChange}
          onBlur={() => handleBlur("amount")}
          required={true}
          placeholder="Enter deposit amount"
          type="number"
          validateLatinOnly={true}
          onlyNumber={true}
          showStar={true}
          hasError={touched.amount && !!errors.amount}
          errorMessage={touched.amount ? errors.amount : ""}
        />
        <InvestmentPlanSelect
          className="w-[100%] md:w-[47%]"
          label="Investment Plan"
          value={selectedPlan?.id || null}
          onChange={setSelectedPlan}
          required={true}
          disabled={false}
          apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/v1/client/showType?type=investor`}
        />
        <CustomInput
          className="w-[100%] md:w-[47%]"
          readOnly={false}
          label="2FA Code"
          value={twoFaCode}
          onChange={handleTwoFaChange}
          onBlur={() => handleBlur("twoFaCode")}
          required={true}
          placeholder="Enter 2FA code"
          onlyNumber={true}
          minLength={6}
          maxLength={6}
          type="text"
          hasError={touched.twoFaCode && !!errors.twoFaCode}
          errorMessage={touched.twoFaCode ? errors.twoFaCode : ""}
        />
      </div>
      <div className="titan-form-footer flex justify-center sm:justify-end items-center my-[3rem] w-[95%] mx-auto">
        <button
          className={`titan-btn ${isFormDisabled ? "opacity-50 !bg-gray-400" : "opacity-100"}`}
          onClick={handleSubmit}
          disabled={isFormDisabled || loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
