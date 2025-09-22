"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { Checkbox } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";

export interface AccountTypetSelectDropdownRef {
  getSelectedNames: () => string[];
  resetSelection: () => void;
}

interface AccountTypetSelectDropdownProps {
  label?: string;
}

interface Plan {
  id: number;
  name: string;
  is_active: boolean;
}

const AccountTypetSelectDropdown = forwardRef<
  AccountTypetSelectDropdownRef,
  AccountTypetSelectDropdownProps
>(({ label = "Account Type" }, ref) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = loadEncryptedData()?.token;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getSelectedNames: () =>
      plans?.filter((p) => selectedIds.includes(p.id)).map((p) => p.name),
    resetSelection: () => setSelectedIds([]),
  }));

  const fetchPlans = useCallback(async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/plans`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setPlans(res?.data?.data);
      } else {
        toast.error(res.message || "Failed to fetch plans");
      }
    } catch (err: any) {
      toast.error(err.message || "Error fetching plans");
    }
  }, [token, setPlans]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev?.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === plans.length ? [] : plans.map((p) => p.id)
    );
  };

  const allSelected = selectedIds.length === plans.length;

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
            : selectedIds.length
            ? `${selectedIds.length} selected`
            : `Select ${label}`}
        </span>
        <span
          className={`transition-transform text-white text-xl ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
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
              onClick={toggleSelectAll}
            >
              <Checkbox
                checked={allSelected}
                sx={{ color: "#aaa", "&.Mui-checked": { color: "#FF7B00" } }}
              />
              <span>Select All</span>
            </div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer text-white"
                onClick={() => toggleSelect(plan.id)}
              >
                <Checkbox
                  checked={selectedIds.includes(plan.id)}
                  sx={{ color: "#aaa", "&.Mui-checked": { color: "#FF7B00" } }}
                />
                <span>{plan.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AccountTypetSelectDropdown.displayName = "AccountTypetSelectDropdown";

export default AccountTypetSelectDropdown;
