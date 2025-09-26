"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import { AnimatePresence , motion } from "framer-motion";

interface LevelItem {
  id?: number;
  level: number;
  percentage: string;
}

export default function CreateCommissionLevel() {
  const [existingLevels, setExistingLevels] = useState<LevelItem[]>([]);
  const [newLevels, setNewLevels] = useState<LevelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    level?: LevelItem;
  }>({ open: false });
  const [editPercentageValue, setEditPercentageValue] = useState("");

  const token = loadEncryptedData()?.token;

 const fetchLevels = useCallback(async () => {
  if (!token) {
    toast.error("User token not found");
    return;
  }
  setLoading(true);
  try {
    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/commissionLevels`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (res.success && res.data) {
      const fetchedLevels: LevelItem[] = res.data.data.map((item:any, index:number) => ({
        id: item.id,
        level: index + 1,
        percentage: item.percentage.toString(),
      }));
      setExistingLevels(fetchedLevels);
    } else {
      toast.error(res.message || "Failed to fetch commission levels");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message || "Something went wrong while fetching levels");
    } else {
      toast.error("Something went wrong while fetching levels");
    }
  } finally {
    setLoading(false);
  }
}, [token, setExistingLevels, setLoading]);


  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const addLevel = () => {
    const nextLevel = existingLevels.length + newLevels.length + 1;
    setNewLevels([...newLevels, { level: nextLevel, percentage: "10" }]);
  };

  const handleChangeNewLevel = (index: number, value: string) => {
    const updated = [...newLevels];
    updated[index].percentage = value;
    setNewLevels(updated);
  };

  const handleSaveNewLevels = async () => {
    if (!token) return toast.error("User token not found");
    for (let i = 0; i < newLevels.length; i++) {
      if (
        !newLevels[i].percentage ||
        isNaN(parseFloat(newLevels[i].percentage))
      ) {
        return toast.error(
          `Percentage for level ${newLevels[i].level} is required`
        );
      }
    }

    try {
      const payload = {
        commission: newLevels.map((item) => ({
          level: item.level,
          percentage: parseFloat(item.percentage),
        })),
      };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/createCommissionLevel`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "New commission levels added ✅");
        setNewLevels([]);
        fetchLevels();
      } else {
        if (res.data?.errors) {
          const firstError = Object.values(res.data.errors)[0] as string[];
          toast.error(firstError?.[0] || "Failed to add commission levels");
        } else {
          toast.error(res.message || "Failed to add commission levels");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Something went wrong while saving new levels"
      );
    }
  };

  const openEditModal = (level: LevelItem) => {
    setEditPercentageValue(level.percentage);
    setEditModal({ open: true, level });
  };

  const handleUpdateExistingLevel = async () => {
    if (!token || !editModal.level) return toast.error("User token not found");

    if (!editPercentageValue || isNaN(parseFloat(editPercentageValue))) {
      return toast.error(
        `Percentage for level ${editModal.level.level} is required`
      );
    }

    try {
      const payload = {
        level: editModal.level.level,
        percentage: parseFloat(editPercentageValue),
      };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateCommissionLevel/${editModal.level.id}`,
        "POST",
        payload,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Commission level updated ✅");
        setEditModal({ open: false });
        fetchLevels();
      } else {
        toast.error(res.message || "Failed to update commission level");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong while updating level");
    }
  };

  return (
    <div className="border-[2px] rounded-[.5rem] border-[#383C47] flex flex-col mt-1 gap-4 p-4">
      {loading ? (
        <div className="text-white text-center py-6">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {existingLevels.map((item) => (
              <div
                key={item.level}
                className="flex flex-wrap gap-3 rounded-lg items-end relative"
              >
                <div className="custom-admin-input flex flex-col flex-1">
                  <label className="text-white">Level {item.level}</label>
                  <input
                    type="text"
                    value={`Level ${item.level}`}
                    disabled
                    className="bg-[#383C47] mt-2 rounded-lg p-2 text-white cursor-not-allowed"
                  />
                </div>

                <div className="custom-admin-input min-w-40 flex flex-col flex-1 relative">
                  <label className="text-white">Percentage</label>
                  <div className="flex items-center border mt-2 border-[#383C47] bg-transparent rounded-lg px-2">
                    <input
                      type="text"
                      value={item.percentage}
                      className="bg-transparent flex-1 p-2 outline-none text-white"
                    />
                    <span className="text-gray-400 ml-1">%</span>
                  </div>
                </div>

                <div
                  className="absolute top-6 right-0 bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => openEditModal(item)}
                >
                  <FaEdit className="text-gray-900" />
                </div>
              </div>
            ))}

            {newLevels.map((item, index) => (
              <div
                key={`new-${index}`}
                className="flex flex-wrap gap-3 rounded-lg items-end"
              >
                <div className="custom-admin-input flex flex-col flex-1">
                  <label className="text-white">Level {item.level}</label>
                  <input
                    type="text"
                    value={`Level ${item.level}`}
                    disabled
                    className="bg-[#383C47] mt-2 rounded-lg p-2 text-white cursor-not-allowed"
                  />
                </div>
                <div className="custom-admin-input min-w-40 flex flex-col flex-1 relative">
                  <label className="text-white">Percentage</label>
                  <div className="flex items-center border mt-2 border-[#383C47] bg-transparent rounded-lg px-2">
                    <input
                      type="text"
                      value={item.percentage}
                      onChange={(e) =>
                        handleChangeNewLevel(index, e.target.value)
                      }
                      className="bg-transparent flex-1 p-2 outline-none text-white"
                    />
                    <span className="text-gray-400 ml-1">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div
              onClick={addLevel}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="rounded-lg p-[2px] flex items-center justify-center bg-white">
                <FaPlus className="text-dark-900" />
              </span>
              <span className="text-white">Add more</span>
            </div>

            {newLevels.length > 0 && (
              <button onClick={handleSaveNewLevels} className="titan-btn">
                Save
              </button>
            )}
          </div>

          <AnimatePresence>
            {editModal.open && (
              <motion.div
                className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-[#1F2028] p-6 rounded-md w-80 flex flex-col gap-4 text-white"
                  initial={{ y: -50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-white text-lg">
                    Edit Level {editModal.level?.level}
                  </h2>
                  <label className="text-white">
                    Level {editModal.level?.level}
                  </label>
                  <input
                    type="text"
                    value={editModal.level?.level}
                    disabled
                    className="bg-[#383C47] rounded p-2 text-white"
                  />
                  <label className="text-white">Percentage:</label>
                  <input
                    type="number"
                    value={editPercentageValue}
                    onChange={(e) => setEditPercentageValue(e.target.value)}
                    className="bg-[#383C47] rounded p-2 text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditModal({ open: false })}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateExistingLevel}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Update
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
