"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomAdminInput from "../CustomAdminInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaTimes } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import { Checkbox } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import AdminCountrySelect from "../AdminCountrySelect/AdminCountrySelect";
import UserSelectDropdown from "../UserSelectDropdown";
import RankSelectDropdown, {
  RankSelectDropdownRef,
} from "../RankSelectDropdown";
import AccountTypetSelectDropdown, {
  AccountTypetSelectDropdownRef,
} from "./AccountTypeSelectDropdown";
import GenderSelectDropdown, {
  GenderSelectDropdownRef,
} from "./GenderSelectDropdown";
import Image from "next/image";

// --- Options for Dropdowns ---
const ACCOUNT_TYPE_OPTIONS = [
  "pending",
  "active",
  "suspend",
  "cancellation_pending",
  "closed",
  "delete_account",
];

interface CommissionRule {
  title: string;
  message_content: string;
  image: File | null;
  status: "published" | "draft";
  type: "special";
  published_at: Date | null;
  target_tids: number[] | null; // null means all users
  target_rank: string[];
  target_income_above: string;
  target_income_below: string;
  target_account_type: string[];
  target_deposit_above: string;
  target_deposit_below: string;
  target_gender: string;
  target_country: string;
  target_contract: string[];
}

// --- Helper Component for Multi-Select Dropdown ---
const MultiSelectDropdown = ({
  label,
  options,
  selected,
  onToggle,
  onToggleAll,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  onToggleAll: () => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSelected = selected.length === options.length;

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <label className="text-white mb-2 text-md font-medium">{label}</label>
      <div
        className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555] bg-transparent text-white cursor-pointer text-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {allSelected
            ? "All Selected"
            : selected.length
            ? `${selected.length} selected`
            : `Select ${label}`}
        </span>
        <VscTriangleDown
          className={`transition-transform text-white text-xl ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-[#1F2937] border border-[#555] rounded-[.5rem] shadow-lg"
          >
            <div
              className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer text-white font-semibold"
              onClick={onToggleAll}
            >
              <Checkbox
                checked={allSelected}
                sx={{ color: "#aaa", "&.Mui-checked": { color: "#FF7B00" } }}
              />
              <span>Select All</span>
            </div>
            {options.map((opt) => (
              <div
                key={opt}
                className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer text-white"
                onClick={() => onToggle(opt)}
              >
                <Checkbox
                  checked={selected.includes(opt)}
                  sx={{ color: "#aaa", "&.Mui-checked": { color: "#FF7B00" } }}
                />
                <span>{opt}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AddSpecialCommissionRule() {
  const [rule, setRule] = useState<CommissionRule>({
    title: "",
    message_content: "",
    image: null,
    status: "published",
    type: "special",
    published_at: null,
    target_tids: [], // Start with empty array, null means all
    target_rank: [],
    target_income_above: "",
    target_income_below: "",
    target_account_type: [],
    target_deposit_above: "",
    target_deposit_below: "",
    target_gender: "",
    target_country: "",
    target_contract: [],
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tids, setids] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { control, setValue } = useForm();

  const handleChange = (field: keyof CommissionRule, value: any) => {
    setRule((prev) => ({ ...prev, [field]: value }));
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      handleChange("image", file);
      e.target.value = "";
    }
  };

  const handleMultiSelectToggle = (
    field: "target_rank" | "target_account_type" | "target_contract",
    option: string
  ) => {
    const currentSelection = rule[field];
    const newSelection = currentSelection.includes(option)
      ? currentSelection?.filter((item) => item !== option)
      : [...currentSelection, option];
    handleChange(field, newSelection);
  };

  const handleToggleSelectAll = (
    field: "target_rank" | "target_account_type" | "target_contract",
    allOptions: string[]
  ) => {
    const currentSelection = rule[field];
    const allSelected = currentSelection.length === allOptions.length;
    handleChange(field, allSelected ? [] : allOptions);
  };
  const rankDropdownRef = useRef<RankSelectDropdownRef>(null);
  const AccountTypeDropdownRef = useRef<AccountTypetSelectDropdownRef>(null);
  const genderDropdownRef = useRef<GenderSelectDropdownRef>(null);

  const selectedRankNames = rankDropdownRef.current?.getSelectedNames() || [];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = loadEncryptedData()?.token;
    const formDataToSend = new FormData();

    formDataToSend.append("title", rule.title);
    formDataToSend.append("message_content", rule.message_content);
    if (rule.image) formDataToSend.append("image", rule.image);
    formDataToSend.append("status", rule.status);
    formDataToSend.append("type", "special");
    if (rule.published_at)
      formDataToSend.append("published_at", rule.published_at.toISOString());

    formDataToSend.append(
      "target_tids",
      rule.target_tids === null ? "" : rule.target_tids.join(",")
    );
    formDataToSend.append("target_rank", selectedRankNames.join(","));
    formDataToSend.append(
      "target_contract",
      rule.target_account_type.join(",")
    );
    formDataToSend.append(
      "target_account_type",
      AccountTypeDropdownRef.current?.getSelectedNames().join(",") || ""
    );
    formDataToSend.append(
      "target_gender",
      genderDropdownRef.current?.getSelectedValue() || ""
    );
    formDataToSend.append("target_income_above", rule.target_income_above);
    formDataToSend.append("target_income_below", rule.target_income_below);
    formDataToSend.append("target_deposit_above", rule.target_deposit_above);
    formDataToSend.append("target_deposit_below", rule.target_deposit_below);
    formDataToSend.append("target_country", rule.target_country);

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createAnnouncements/special`,
        "POST",
        formDataToSend,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Special message created successfully!");
        // --- ریست کردن فرم ---
        setRule({
          title: "",
          message_content: "",
          image: null,
          status: "published",
          type: "special",
          published_at: null,
          target_tids: [],
          target_rank: [],
          target_income_above: "",
          target_income_below: "",
          target_account_type: [],
          target_deposit_above: "",
          target_deposit_below: "",
          target_gender: "",
          target_country: "",
          target_contract: [],
        });
        setPreviewImage(null);
        rankDropdownRef.current?.resetSelection();
        AccountTypeDropdownRef.current?.resetSelection();
        genderDropdownRef.current?.resetSelection();
        setids([]);
        setSelectAll(false);
      } else {
        toast.error(res.message || "Failed to create message!");
      }
    } catch (err: any) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="Add-special-commission-rule">
      <p className="text-white text-lg font-medium mb-4">Add Special Message</p>
      <div className="border-[2px] border-[#383C47] rounded-[.5rem] p-4 flex flex-wrap gap-4">
        {/* --- Target Filters --- */}
        <label htmlFor="" className="w-[24rem]">
          <span className="text-white">Enter User TIDs</span>
          <UserSelectDropdown
            tids={tids}
            setids={setids}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
          />
        </label>

        <div className="w-full sm:w-64">
          <label className="text-white mb-2 text-md font-medium">Ranks</label>
          <RankSelectDropdown ref={rankDropdownRef} />
        </div>

        <MultiSelectDropdown
          label="Account Types"
          options={ACCOUNT_TYPE_OPTIONS}
          selected={rule.target_account_type}
          onToggle={(opt) =>
            handleMultiSelectToggle("target_account_type", opt)
          }
          onToggleAll={() =>
            handleToggleSelectAll("target_account_type", ACCOUNT_TYPE_OPTIONS)
          }
        />

        <AccountTypetSelectDropdown ref={AccountTypeDropdownRef} />

        <GenderSelectDropdown ref={genderDropdownRef} />

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <AdminCountrySelect
              className="w-full sm:w-64"
              label="Select Country"
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
                setValue("country", val);
                handleChange("target_country", val);
              }}
            />
          )}
        />

        <CustomAdminInput
          title="Income Above"
          type="text"
          value={rule.target_income_above}
          onChange={(val) => handleChange("target_income_above", val)}
        />
        <CustomAdminInput
          title="Income Below"
          type="text"
          value={rule.target_income_below}
          onChange={(val) => handleChange("target_income_below", val)}
        />
        <CustomAdminInput
          title="Deposit Above"
          type="text"
          value={rule.target_deposit_above}
          onChange={(val) => handleChange("target_deposit_above", val)}
        />
        <CustomAdminInput
          title="Deposit Below"
          type="text"
          value={rule.target_deposit_below}
          onChange={(val) => handleChange("target_deposit_below", val)}
        />

        <div className="flex flex-col w-full sm:w-64">
          <label className="text-white mb-1">Published At (Optional)</label>
          <div className="flex items-center gap-0 mt-2 relative border border-[#383C47] rounded-[.6rem]">
            <DatePicker
              placeholderText="yyyy-mm-dd hh:mm"
              selected={rule.published_at}
              onChange={(date: Date | null) =>
                handleChange("published_at", date)
              }
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full p-2 rounded-md bg-transparent text-white"
            />
            <FaCalendar className="text-[#888] right-2 absolute pointer-events-none" />
          </div>
        </div>

        {/* --- Message Content --- */}
        <div className="w-full border-t border-[#383C47] mt-4 pt-4">
          <p className="text-white text-lg font-medium mb-4">
            Create Your Special Message
          </p>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative flex flex-col items-center gap-4">
              <div
                className="flex items-center justify-center h-36 w-36 rounded-[.5rem] border border-dashed border-[#555] bg-transparent text-white cursor-pointer hover:bg-[#2c3a4f] transition relative"
                onClick={handleBoxClick}
              >
                {previewImage ? (
                  <>
                    <Image
                      width={400}
                      height={400}
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full rounded-[.5rem] object-cover"
                    />
                    <span
                      className="absolute top-1 right-1 text-white bg-black/40 bg-opacity-50 rounded-full p-1 cursor-pointer hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(null);
                        handleChange("image", null);
                      }}
                    >
                      <FaTimes />
                    </span>
                  </>
                ) : (
                  <span>Upload Image</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-4 flex-1 w-full">
              <CustomAdminInput
                title="Enter Title"
                value={rule.title}
                onChange={(val) => handleChange("title", val)}
              />
              <div className="flex flex-col w-full">
                <label className="text-white mb-2 text-md font-medium">
                  Enter Message
                </label>
                <textarea
                  value={rule.message_content}
                  onChange={(e) =>
                    handleChange("message_content", e.target.value)
                  }
                  placeholder="Enter message content here..."
                  className="w-full p-2 rounded-md border h-32 border-[#555] bg-transparent text-white resize-y"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              className="px-6 py-2 rounded-md bg-[#383C47] text-white hover:bg-[#4a505e] transition"
              type="button"
              onClick={() => {
                /* Handle cancel logic here */
              }}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2 rounded-md bg-[#FF7B00] text-white font-semibold hover:bg-[#ff8c21] transition flex items-center justify-center gap-2`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
