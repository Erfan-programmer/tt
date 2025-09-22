"use client";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Checkbox } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../EncryptData/SavedEncryptData";

export interface Rank {
  id: number;
  name: string;
  level: number;
  min_sales_volume: number;
}

export interface RankSelectDropdownRef {
  getSelectedNames: () => string[];
  resetSelection: () => void;
  refetchRanks: () => Promise<void>;
}

const RankSelectDropdown = forwardRef<RankSelectDropdownRef>((props, ref) => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = loadEncryptedData()?.token;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRanks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ranks`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success && res.data) {
        setRanks(res.data.data);
      } else {
        toast.error(res.message || "Failed to load ranks");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error fetching ranks");
      } else {
        toast.error("Unknown error fetching ranks");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRanks();
  }, [fetchRanks]);

  const toggleRank = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev?.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === ranks.length ? [] : ranks.map((r) => r.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  useImperativeHandle(ref, () => ({
    getSelectedNames: () =>
      selectedIds
        .map((id) => ranks.find((r) => r.id === id)?.name)
        ?.filter((name): name is string => Boolean(name)),
    resetSelection: () => setSelectedIds([]),
    refetchRanks: fetchRanks,
  }));

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <button
        className="w-full border-[2px] border-[var(--admin-border-color)] text-white px-4 py-2 rounded-[.5rem] bg-transparent flex justify-between"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        {selectedIds.length === ranks.length
          ? "All Ranks Selected"
          : selectedIds.length
          ? `${selectedIds.length} selected`
          : "Select Ranks"}
        <span>▼</span>
      </button>
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-[#1E1E2F] border-[2px] border-[var(--admin-border-color)] rounded-[.5rem] shadow-lg"
          >
            <div
              className="flex items-center justify-between p-2 border-b border-[#555] hover:bg-[#2C2C3A] cursor-pointer font-semibold text-white"
              onClick={clearSelection}
            >
              <span>Clear Selection</span>
              <span>✕</span>
            </div>
            <div
              className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer font-semibold text-white"
              onClick={toggleAll}
            >
              <Checkbox
                checked={selectedIds.length === ranks.length}
                sx={{ color: "#aaa", "&.Mui-checked": { color: "#FF7B00" } }}
              />
              <span>Select All</span>
            </div>
            {ranks.map((rank) => (
              <div
                key={rank.id}
                className="flex items-center gap-2 p-2 hover:bg-[#2C2C3A] cursor-pointer text-white"
                onClick={() => toggleRank(rank.id)}
              >
                <Checkbox
                  checked={selectedIds.includes(rank.id)}
                  sx={{ color: "#aaa", "&.Mui-checked": { color: "#FF7B00" } }}
                />
                <span>{rank.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {loading && <p className="text-white mt-2 text-sm">Loading ranks...</p>}
    </div>
  );
});

RankSelectDropdown.displayName = "RankSelectDropdown";

export default RankSelectDropdown;
