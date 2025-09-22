import React from 'react';
interface RegisterOptionBoxProps {
  title?: string;
  description?: string;
  value?: string;
  isSelected: boolean;
  onChange?: (value: string) => void;
  index: number;
}

export default function RegisterOptionBox({
  title = "Investor",
  description = "Earn passive income by letting Titan's trading systems work for you All features and full potential are unlocked Profit sharing: 20/80",
  value = "investor",
  isSelected,
  onChange
}: RegisterOptionBoxProps) {

  const handleChange = () => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div
      className={`register-positions-box bg-[#f4f7fd] dark:bg-[var(--main-background)] hover:shadow-[0px_4px_15px_#275edf] px-[1.5rem] py-[1rem] min-h-[10rem] mb-4 ${isSelected ? 'selected' : 'unselected'}`}
      onClick={() => onChange && onChange(value)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-[var(--main-background)] dark:text-[#fff]">{title}</h3>
        <label className="custom-radio-container">
          <input 
            type="radio" 
            name="position" 
            value={value}
            checked={isSelected}
            onChange={handleChange}
            className="hidden" 
          />
          <span className="custom-radio w-6 h-6 border-2 border-[#275edf] dark:border-white rounded-full flex items-center justify-center relative">
            <span className="check-icon absolute inset-0 flex items-center justify-center opacity-0 transition-opacity">
              <svg className={`w-5 h-5 ${isSelected ? "text-white dark:text-[var(--main-background)]" : ""}`} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </span>
        </label>
      </div>
      <div className="register-position-description mt-[1rem]">
        <span className="titan-light-text block sm:w-[80%] md:w-[80%]">
          {description}
        </span>
      </div>
    </div>
  );
}
