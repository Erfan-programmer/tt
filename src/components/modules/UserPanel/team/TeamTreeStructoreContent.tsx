"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTimes } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "../../EncryptData/SavedEncryptData";
import Image from "next/image";
import ReferralTreeSkeleton from "@/skeletons/User-Panel/dashboard/ReferralTreeSkeleton";

export interface ReferralType {
  children?: ReferralType[];
  name: string;
  id: string;
  rank: string;
  rank_icon: string;
  status: "pending" | "closed" | "active";
  tid: string;
}

const ReferralNode: React.FC<{
  referral: ReferralType;
  level?: number;
  selectedTID: string | null;
  highlightedTID: string | null;
  expandedNodes: Set<string>;
  toggleExpand: (tid: string) => void;
  onSelect: (referral: ReferralType) => void;
}> = ({
  referral,
  level = 0,
  selectedTID,
  highlightedTID,
  expandedNodes,
  toggleExpand,
  onSelect,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isHighlighted = highlightedTID === referral.tid;
  const isExpanded = expandedNodes.has(referral.tid);

  useEffect(() => {
    if (isHighlighted && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);
  console.log("selectedTID === referral.tid =>", selectedTID, referral?.tid);
  return (
    <div className="relative" ref={nodeRef}>
      <div className="flex items-center">
        {isExpanded && referral.children && (
          <div
            className="absolute left-[14px] w-[2px] border-l-[2px] border-dashed border-[var(--main-background)] dark:border-white/30"
            style={{ top: "42px", height: "calc(100% - 42px)" }}
          />
        )}

        {referral.children && referral.children.length > 0 && (
          <button
            onClick={() => toggleExpand(referral.tid)}
            className="absolute left-[2px] w-6 h-6 rounded-full bg-[#275edf] dark:bg-white flex items-center justify-center transition-transform duration-300 z-20"
          >
            <span className="text-white dark:text-[#0f163a] text-lg font-bold leading-none flex items-center justify-center">
              {isExpanded ? "-" : <FaPlay className="text-[.9rem]" />}
            </span>
          </button>
        )}

        <div className="w-8 relative h-[2px] border-t-[2px] border-dashed border-[var(--main-background)] dark:border-white/30 ml-3"></div>
        {referral.children?.length === 0 && (
          <div className="w-14 rotate-90 absolute -left-4 bottom-12 border-t-[2px] border-dashed border-[var(--main-background)] dark:border-white/30" />
        )}

        <div
          onClick={() => onSelect(referral)}
          className={`flex ${
            selectedTID === referral.tid
              ? "bg-[#ddd] dark:bg-[#223060]"
              : "bg-[#f0f0f059] dark:bg-[#22306076]"
          } items-center gap-2 rounded-lg h-[42px] px-6 relative z-100 cursor-pointer transition-colors
            ${
              referral.status === "pending"
                ? "border border-[var(--normal)]"
                : referral.status === "closed"
                ? "border border-[var(--loss)]"
                : "border border-none"
            }
            `}
        >
          <div className="w-12 h-12 rounded-full overflow-auto">
            <Image
              width={300}
              height={300}
              src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${referral.rank_icon}`}
              alt={referral.tid}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/titan-logo.svg";
              }}
            />
          </div>
          <span
            className={`text-[var(--main-background)] dark:text-white text-sm font-medium min-w-[120px] px-2 py-1 rounded ${
              isHighlighted ? "bg-yellow-500" : ""
            }`}
          >
            {referral.tid}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && referral.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
            style={{ marginLeft: "3rem" }}
          >
            {referral.children.map((subReferral) => (
              <ReferralNode
                key={subReferral.tid}
                referral={subReferral}
                level={level + 1}
                selectedTID={selectedTID}
                highlightedTID={highlightedTID}
                expandedNodes={expandedNodes}
                toggleExpand={toggleExpand}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TeamTreeStructureContentProps {
  onReferralSelect: (referral: ReferralType | null) => void;
}

export default function TeamTreeStructureContent({
  onReferralSelect,
}: TeamTreeStructureContentProps) {
  const [selectedTID, setSelectedTID] = useState<string | null>(null);
  const [highlightedTID, setHighlightedTID] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showScroll, setShowScroll] = useState(true);
  const [data, setData] = useState<ReferralType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = (tid: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tid)) newSet.delete(tid);
      else newSet.add(tid);
      return newSet;
    });
  };

  const findReferralByTID = useCallback(
    (node: ReferralType, tid: string): ReferralType | null => {
      if (node.tid === tid) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findReferralByTID(child, tid);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const expandPathToNode = useCallback(
    (
      node: ReferralType,
      tid: string,
      expanded: Set<string> = new Set()
    ): boolean => {
      if (node.tid === tid) return true;
      if (!node.children) return false;

      for (const child of node.children) {
        if (expandPathToNode(child, tid, expanded)) {
          expanded.add(node.tid);
          return true;
        }
      }
      return false;
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearch(searchTerm.trim()),
      400
    );
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearch || !data) return;

    const searchTid = debouncedSearch.startsWith("TID-")
      ? debouncedSearch
      : `TID-${debouncedSearch}`;

    const found = findReferralByTID(data, searchTid);
    if (found) {
      const newExpanded = new Set<string>();
      expandPathToNode(data, found.tid, newExpanded);
      setExpandedNodes(newExpanded);
      setHighlightedTID(found.tid);
    } else {
      setHighlightedTID(null);
    }
  }, [debouncedSearch, data, findReferralByTID, expandPathToNode]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const token = loadUserData()?.access_token;
      try {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/downline/tree`,
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        );
        if (res.success) {
          setData(res?.data?.data);
        } else {
          setError(res.message || "Failed to fetch data");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <ReferralTreeSkeleton />;
  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>No data found</div>;

  const referrals: ReferralType[] = data?.children ?? [];

  return (
    <div className="bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] min-h-screen w-[95%] sm:w-[75%] border-standard rounded-xl bg-shadow-custom overflow-x-auto">
      <div className="flex items-center justify-between px-2 sm:px-[2rem] mt-3">
        <div className="relative w-[300px] block">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter TID to view details"
            className="w-full bg-transparent border border-[#192879] rounded-full px-4 py-2 text-[var(--main-background)] dark:text-white text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setHighlightedTID(null);
                onReferralSelect(null);
                inputRef.current?.blur();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--main-background)] dark:text-white"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-standard my-3"></div>

      <div
        className={`relative mt-8 mx-[1rem] overflow-x-auto transition-all duration-500 w-fit max-h-[86vh] overflow-y-auto custom-scroll ${
          showScroll
            ? ""
            : "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        }`}
      >
        <div className="flex flex-col mt-2 relative pl-[2rem]">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${data.rank_icon}`}
            width={400}
            height={400}
            alt=""
            className="w-16 h-16 relative scale-[1.4] -translate-x-4"
          />
          <span className="text-[var(--main-background)] dark:text-white text-sm">
            You
          </span>
          <div className="w-8 h-[2rem] border-l-[2px] border-dashed border-[var(--main-background)] dark:border-white/30 ml-[.85rem]" />
        </div>

        <div className="space-y-6 ml-[2rem]">
          {referrals.map((referral: ReferralType) => (
            <ReferralNode
              key={referral.tid}
              referral={referral}
              selectedTID={selectedTID}
              highlightedTID={highlightedTID}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
              onSelect={(referral) => {
                setSelectedTID(referral.tid);
                onReferralSelect(referral);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
