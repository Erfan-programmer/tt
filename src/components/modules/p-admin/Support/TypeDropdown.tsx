import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VscTriangleDown } from "react-icons/vsc";

const typeOptions = [
  { label: "Select type", value: "" },
  { label: "Public", value: "public" },
  { label: "Special", value: "special" },
  { label: "Dashboard", value: "dashboard" },
];

export default function TypeDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    typeOptions.find((opt) => opt.value === value) || typeOptions[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: typeof typeOptions[0]) => {
    setSelectedFilter(option);
    onChange(option.value);
    setDropdownOpen(false);
  };

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <label className="text-white mb-4 ">Select Type</label>
      <div
        className="flex justify-between items-center p-2 px-2 rounded-[.5rem] border border-[#555]  mt-2 bg-transparent text-white cursor-pointer text-md"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{selectedFilter.label}</span>
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
            className="absolute z-10 mt-1 w-full bg-[#1F2937] border border-[#555] rounded-[.5rem] overflow-hidden shadow-lg"
          >
            {typeOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#275EDF] text-md font-medium"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
