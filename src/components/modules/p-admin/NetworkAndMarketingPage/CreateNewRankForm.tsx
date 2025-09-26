"use client";
import React, { useState, useRef, useEffect } from "react";
import { VscTriangleDown } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import CustomAdminInput from "../CustomAdminInput";
import Image from "next/image";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { FaTimes, FaTrash } from "react-icons/fa";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface Reward {
  type: "physical" | "cash" | "benefit";
  description?: string;
  cash_value?: number;
  amount?: number;
}

interface CreateNewRankFormProp {
  refetch:()=> void
}

export default function CreateNewRankForm({refetch}:CreateNewRankFormProp) {
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    min_sales_volume: "",
    prize_description: "",
    downline_rank_id: "",
    downline_rank_count: "",
    rewards: [] as Reward[],
    tournament_prize_amount: "",
    rankImage: null as File | null,
    condition: "",
    description: "",
  });

  const [rewardInput, setRewardInput] = useState<Reward>({
    type: "physical",
    description: "",
    cash_value: 0,
    amount: 0,
  });

  const [isSaving, setIsSaving] = useState(false);

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rankDropdownOpen, setRankDropdownOpen] = useState(false);
  const conditionDropdownRef = useRef<HTMLDivElement>(null);
  const rankDropdownRef = useRef<HTMLDivElement>(null);

  const conditionOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "no" },
  ];

  const [ranks, setRanks] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        conditionDropdownRef.current &&
        !conditionDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        rankDropdownRef.current &&
        !rankDropdownRef.current.contains(event.target as Node)
      ) {
        setRankDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const token = loadEncryptedData()?.token;
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ranks`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success && res.data) {
          setRanks(res.data.data);
        } else {
          toast.error("Failed to load ranks");
        }
      } catch (err: any) {
        toast.error(err.message || "Error fetching ranks");
      }
    };

    fetchRanks();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, rankImage: file }));
      setPreviewImage(URL.createObjectURL(file));
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMB} MB`);
    } else {
      setFormData((prev) => ({ ...prev, rankImage: null }));
      setPreviewImage(null);
      setFileSize(null);
    }
  };

  const handleAddReward = () => {
    if (
      rewardInput.type === "physical" &&
      !rewardInput.description &&
      !rewardInput.cash_value
    ) {
      toast.error("Fill description or cash value for physical reward");
      return;
    }
    if (rewardInput.type === "cash" && !rewardInput.amount) {
      toast.error("Enter amount for cash reward");
      return;
    }
    if (rewardInput.type === "benefit" && !rewardInput.description) {
      toast.error("Enter description for benefit reward");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      rewards: [...prev.rewards, rewardInput],
    }));
    setRewardInput({
      type: "physical",
      description: "",
      cash_value: 0,
      amount: 0,
    });
  };

  const handleRemoveReward = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rewards: prev.rewards?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.level) {
      toast.error("Name and Level are required");
      return;
    }

    setIsSaving(true); // شروع pending
    const token = loadEncryptedData()?.token;
    const payload: any = {
      name: formData.name,
      level: formData.level,
      min_sales_volume: formatToTwoDecimals(formData.min_sales_volume),
      prize_description: formData.prize_description,
      rewards: JSON.stringify(formData.rewards),
      tournament_prize_amount: formatToTwoDecimals(formData.tournament_prize_amount),
      condition: formData.condition,
      description: formData.description,
    };
    if (formData.condition === "Yes") {
      payload.downline_rank_id = formData.downline_rank_id;
      payload.downline_rank_count = formData.downline_rank_count;
    }

    const form = new FormData();
    Object.keys(payload).forEach((key) => {
      form.append(key, payload[key]);
    });
    if (formData.rankImage) {
      form.append("icon_path", formData.rankImage);
    }

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createRank`,
        "POST",
        form,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Rank created successfully!");
        setFormData({
          name: "",
          level: "",
          min_sales_volume: "",
          prize_description: "",
          downline_rank_id: "",
          downline_rank_count: "",
          rewards: [],
          tournament_prize_amount: "",
          rankImage: null,
          condition: "",
          description: "",
        });
        setPreviewImage(null);
        refetch()
        setFileSize(null);
      } else {
        toast.error(res.message || "Error creating rank");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="create-new-rank">
      <p className="text-lg font-semibold mb-3 text-white">Create New Rank</p>
      <div className="border-[2px] rounded-[.5rem] border-[#383C47] px-[1rem] py-4 flex items-start flex-wrap gap-4">
        <CustomAdminInput
          title="Name"
          value={formData.name}
          onChange={(val) => handleChange("name", val)}
        />
        <CustomAdminInput
          title="Level"
          value={formData.level}
          onChange={(val) => handleChange("level", val)}
        />
        <CustomAdminInput
          title="Min Sales Volume"
          value={formData.min_sales_volume}
          onChange={(val) => handleChange("min_sales_volume", val)}
        />
        <CustomAdminInput
          title="Tournament Prize Amount"
          value={formData.tournament_prize_amount}
          onChange={(val) => handleChange("tournament_prize_amount", val)}
        />

        {/* Rewards */}
        <div className="flex flex-col w-full">
          <p className="text-white">Rewards</p>
          <button
            className="mt-2 bg-[#275EDF] text-white px-3 py-1 rounded"
            onClick={() => setRewardModalOpen(true)}
          >
            Add Reward
          </button>

          <div className="flex flex-wrap gap-2 mt-2">
            {formData.rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-[#2d2f38] text-white rounded-full text-sm"
              >
                {reward.type}{" "}
                {reward.type === "physical" && reward.description
                  ? `(${reward.description} | $${reward.cash_value ?? 0})`
                  : reward.type === "cash"
                  ? `($${reward.amount})`
                  : reward.type === "benefit"
                  ? `(${reward.description})`
                  : ""}
                <FaTimes
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => handleRemoveReward(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reward Modal */}
        <AnimatePresence>
          {rewardModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="bg-[#1F2937] p-6 rounded-md w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    Add Reward
                  </h3>
                  <button
                    onClick={() => setRewardModalOpen(false)}
                    className="text-white text-xl"
                  >
                    ×
                  </button>
                </div>

                <select
                  value={rewardInput.type}
                  onChange={(e) =>
                    setRewardInput((prev) => ({
                      ...prev,
                      type: e.target.value as Reward["type"],
                    }))
                  }
                  className="bg-gray-700 border-[2px] border-[#383C47] rounded px-2 py-1 text-white w-full mb-3"
                >
                  <option value="physical">Physical</option>
                  <option value="cash">Cash</option>
                  {/* <option value="benefit">Benefit</option> */}
                </select>

                {rewardInput.type === "physical" && (
                  <>
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-full mb-2 px-2 py-1 bg-transparent border-[2px] border-[#383C47] text-white rounded"
                      value={rewardInput.description}
                      onChange={(e) =>
                        setRewardInput((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="Cash Value"
                      className="w-full mb-2 px-2 py-1 bg-transparent border-[2px] border-[#383C47] text-white rounded"
                      value={rewardInput.cash_value || ""}
                      onChange={(e) =>
                        setRewardInput((prev) => ({
                          ...prev,
                          cash_value: Number(e.target.value),
                        }))
                      }
                    />
                  </>
                )}
                {rewardInput.type === "cash" && (
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-full mb-2 px-2 py-1 bg-transparent border-[2px] border-[#383C47] text-white rounded"
                    value={rewardInput.amount || ""}
                    onChange={(e) =>
                      setRewardInput((prev) => ({
                        ...prev,
                        amount: Number(e.target.value),
                      }))
                    }
                  />
                )}
                {/* {rewardInput.type === "benefit" && (
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full mb-2 px-2 py-1 bg-transparent border-[2px] border-[#383C47] text-white rounded"
                    value={rewardInput.description}
                    onChange={(e) =>
                      setRewardInput((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                )} */}

                <button
                  className="mt-2 w-full bg-[#275EDF] text-white px-3 py-1 rounded"
                  onClick={() => {
                    handleAddReward();
                    setRewardModalOpen(false);
                  }}
                >
                  Add Reward
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prize Description */}
        <div className="flex flex-col w-full">
          <p className="text-white">Prize Description</p>
          <textarea
            value={formData.prize_description}
            onChange={(e) => handleChange("prize_description", e.target.value)}
            placeholder="Type about this rank..."
            className="w-full px-4 pt-2 bg-transparent placeholder:text-[#888] text-white border-[2px] rounded-[.5rem] mt-2 border-[#383C47]"
          />
        </div>

        {/* Condition dropdown */}
        <div
          className="relative w-full sm:w-auto min-w-44"
          ref={rankDropdownRef}
        >
          <label className="text-white">Condition</label>
          <div
            className="flex justify-between items-center p-2 mt-2 rounded-[.5rem] border border-[#383C47] bg-transparent text-white cursor-pointer text-md"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>
              {formData.condition
                ? conditionOptions.find(
                    (opt) => opt.value === formData.condition
                  )?.label
                : "Select Condition"}
            </span>
            <VscTriangleDown
              className={`transition-transform text-white text-xl ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#383C47] rounded-[.5rem] overflow-hidden shadow-lg"
              >
                {conditionOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-3 cursor-pointer text-white bg-[#1F2937] hover:bg-[#275EDF] text-md font-medium"
                    onClick={() => {
                      handleChange("condition", option.value);
                      setDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {formData.condition === "Yes" && (
          <>
            <div
              className="relative w-full sm:w-auto min-w-44"
              ref={rankDropdownRef}
            >
              <label className="text-white">Downline Rank</label>
              <div
                className="flex justify-between items-center p-2 mt-2 rounded-[.5rem] border border-[#383C47] bg-transparent text-white cursor-pointer text-md"
                onClick={() => setRankDropdownOpen(!rankDropdownOpen)}
              >
                <span>
                  {formData.downline_rank_id
                    ? ranks.find(
                        (r) => r.id === Number(formData.downline_rank_id)
                      )?.name
                    : "Select Rank"}
                </span>
                <VscTriangleDown
                  className={`transition-transform text-xl ${
                    rankDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {rankDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#383C47] rounded-[.5rem] overflow-hidden shadow-lg custom-scrollbar max-h-52 overflow-y-auto"
                  >
                    {ranks.map((rank) => (
                      <div
                        key={rank.id}
                        className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                        onClick={() => {
                          handleChange("downline_rank_id", String(rank.id));
                          setRankDropdownOpen(false);
                        }}
                      >
                        {rank.name}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <CustomAdminInput
              title="Downline Rank Count"
              value={formData.downline_rank_count}
              onChange={(val) => handleChange("downline_rank_count", val)}
            />
          </>
        )}

        {/* Image upload */}
        <div className="w-full relative">
          <label className="block text-white mb-2 text-md font-medium">
            Rank Image
          </label>
          <label
            htmlFor="rankImage"
            className="flex w-full sm:w-auto sm:max-w-44 items-center justify-center px-4 py-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer hover:bg-[#275EDF] transition"
          >
            {fileSize ? `Size: ${fileSize}` : "Upload Image"}
          </label>
          <input
            id="rankImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {previewImage && (
            <div className="relative mt-3 max-w-44 sm:max-w-none">
              <Image
                width={500}
                height={500}
                src={previewImage}
                alt="Preview"
                className="max-h-44 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData((prev) => ({ ...prev, rankImage: null }));
                  setFileSize(null);
                }}
                className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="create-form-container mt-4">
        <p className="text-white">Description</p>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Type about this rank..."
          className="w-full px-4 pt-2 bg-transparent placeholder:text-[#888] text-white border-[2px] rounded-[.5rem] mt-2 border-[#383C47]"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`titan-btn mt-7 self-start !rounded-[.5rem] ${
              isSaving ? "bg-gray-500 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Rank"}
          </button>
        </div>
      </div>
    </div>
  );
}
