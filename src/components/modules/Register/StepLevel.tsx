import React from 'react';
import { motion } from 'framer-motion';

interface StepLevelProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  "Choose Your Position",
  "Choose Your Investment Term",
  "Enter Your Personal Details",
  "Enable 2 Factor Authentication"
];

const StepLevel: React.FC<StepLevelProps> = ({ currentStep, totalSteps }) => {
  const stepPercent = 100 / totalSteps;
  const activeLeft = (currentStep - 1) * stepPercent;

  return (
    <div className="w-full max-w-3xl mx-auto my-10">
      <div className="relative">
        <div className="absolute top-[25px] left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

        <motion.div 
          className="absolute top-[25px] h-1 bg-blue-600 rounded-full"
          initial={{ left: '0%', width: '0%' }}
          animate={{ left: `${activeLeft}%`, width: `${stepPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        <div className="relative h-12 mb-2">
          <div className="absolute left-0 -top-6 flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-semibold shadow-md bg-blue-600 text-white scale-110"
            >
              {currentStep}
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
              {stepTitles[currentStep - 1]}
            </span>
          </div>
        </div>

        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Step {currentStep}/{totalSteps}
        </div>
      </div>
    </div>
  );
};

export default StepLevel;
