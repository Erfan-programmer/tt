"use client";
import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import LineTitle from "../LineTitle";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import CustomAdminInput from "../CustomAdminInput";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import SettingToggleSwitch from "./SettingToggleSwitch";

interface SettingItem {
  id: number;
  key: string;
  label: string;
  value: string;
}

export default function ConfigsPage() {
  const [showConfigs, setShowConfigs] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = loadEncryptedData()?.token;

  // States for grouped fields
  const [referralBonus, setReferralBonus] = useState(0);
  const [twoFaFee, setTwoFaFee] = useState(0);
  const [bonusShieldMonths, setBonusShieldMonths] = useState(0);
  const [bonusShieldPercentage, setBonusShieldPercentage] = useState(0);
  const [renewalFee, setRenewalFee] = useState(0);

  // Auto Release
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(false);

  // Payment Method
  const [paymentMode, setPaymentMode] = useState<"gateway" | "wallet">(
    "gateway"
  );

  // Annual Max Level Depth
  const [annualMaxDepth, setAnnualMaxDepth] = useState(0);

  // Can Cancel Contract
  const [canCancelContract, setCanCancelContract] = useState(false);
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ data: SettingItem[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {

        // Initialize grouped states
        const getVal = (key: string) =>
          res.data.data.find((i) => i.key === key)?.value;
        setReferralBonus(Number(getVal("referral_bonus_percentage") || 0));
        setTwoFaFee(Number(getVal("2fa_reset_fee") || 0));
        setBonusShieldMonths(
          Number(getVal("bonus_shield_trigger_months") || 0)
        );
        setBonusShieldPercentage(
          Number(getVal("bonus_shield_percentage") || 0)
        );
        setRenewalFee(Number(getVal("renewal_fee_percentage") || 0));
        setAutoReleaseEnabled(getVal("auto_release_enabled") === "1");
        setPaymentMode(
          (getVal("payment_mode") as "gateway" | "wallet") || "gateway"
        );
        setAnnualMaxDepth(Number(getVal("annual_max_level_depth") || 0));
        setCanCancelContract(getVal("can_cancel_contract") === "1");
      } else {
        toast.error(res.message || "Failed to fetch settings");
      }
    } catch (err: any) {
      toast.error(err.message || "Error fetching settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Generic POST
  const postData = async (url: string, body: any, successMsg?: string) => {
    try {
      const res = await apiRequest(url, "POST", body, {
        Authorization: `Bearer ${token}`,
      });
      if (res.success) {
        toast.success(successMsg || "Updated successfully!");
        fetchSettings();
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating");
    }
  };

  if (loading) return <div className="p-8 text-white">Loading settings...</div>;

  return (
    <>
      <LineTitle
        title="Titan Config"
        onClick={() => setShowConfigs(!showConfigs)}
      />
      {showConfigs && (
        <AnimationTemplate>
          <div className="flex flex-col gap-6 p-4">
            {/* Titan Config Group */}
            <div className="border border-gray-700 p-4 rounded-xl space-y-4">
              <h3 className="text-white font-semibold">Titan Config</h3>
              <CustomAdminInput
                title="Referral Bonus Percentage"
                value={String(referralBonus)}
                onChange={(val) => setReferralBonus(Number(val))}
              />
              <CustomAdminInput
                title="2FA Reset Fee"
                value={String(twoFaFee)}
                onChange={(val) => setTwoFaFee(Number(val))}
              />
              <CustomAdminInput
                title="Bonus Shield Trigger Months"
                value={String(bonusShieldMonths)}
                onChange={(val) => setBonusShieldMonths(Number(val))}
              />
              <CustomAdminInput
                title="Bonus Shield Percentage"
                value={String(bonusShieldPercentage)}
                onChange={(val) => setBonusShieldPercentage(Number(val))}
              />
              <CustomAdminInput
                title="Renewal Fee Percentage"
                value={String(renewalFee)}
                onChange={(val) => setRenewalFee(Number(val))}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() =>
                  postData(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings`,
                    {
                      referral_bonus_percentage: referralBonus,
                      two_fa_reset_fee: twoFaFee,
                      bonus_shield_trigger_months: bonusShieldMonths,
                      bonus_shield_percentage: bonusShieldPercentage,
                      renewal_fee_percentage: renewalFee,
                    },
                    "Titan Config updated!"
                  )
                }
              >
                Save
              </button>
            </div>

            {/* Auto Release */}
            <div className="flex items-center justify-between border border-gray-700 p-4 rounded-xl">
              <span className="text-white">Auto Release</span>
              <div className="flex gap-2">
                <SettingToggleSwitch
                  checked={autoReleaseEnabled}
                  onChange={() => setAutoReleaseEnabled(!autoReleaseEnabled)}
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() =>
                    postData(
                      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/updateAutoRelease`,
                      {
                        enabled: autoReleaseEnabled,
                      }
                    )
                  }
                >
                  Save
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between border border-gray-700 p-4 rounded-xl">
              <span className="text-white">Payment Method</span>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    paymentMode === "gateway"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => setPaymentMode("gateway")}
                >
                  Gateway
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    paymentMode === "wallet"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => setPaymentMode("wallet")}
                >
                  Wallet
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() =>
                    postData(
                      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/changePaymentMode`,
                      {
                        payment_mode: paymentMode,
                      }
                    )
                  }
                >
                  Save
                </button>
              </div>
            </div>

            {/* Annual Max Level Depth */}
            <div className="border border-gray-700 p-4 rounded-xl space-y-2">
              <h3 className="text-white font-semibold">
                Annual Max Level Depth
              </h3>
              <CustomAdminInput
                title="Level"
                value={String(annualMaxDepth)}
                onChange={(val) => setAnnualMaxDepth(Number(val))}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() =>
                  postData(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/updateAnnualMaxLevelDepth`,
                    {
                      level: annualMaxDepth,
                    }
                  )
                }
              >
                Save
              </button>
            </div>

            {/* Can Cancel Contract */}
            <div className="flex items-center justify-between border border-gray-700 p-4 rounded-xl">
              <span className="text-white">Can Cancel Contract</span>
              <div className="flex gap-2">
                <SettingToggleSwitch
                  checked={canCancelContract}
                  onChange={() => setCanCancelContract(!canCancelContract)}
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() =>
                    postData(
                      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/settings/canCancelContract`,
                      {
                        can_cancel_contract: canCancelContract,
                      }
                    )
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
