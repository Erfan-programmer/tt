import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import './Pagination.css';

const NextButton = () => (
  <div className="flex items-center justify-center gap-2">
    <span className="text-white transition-colors duration-300">Next</span>
    <FaArrowRight className="w-5 h-5 text-[var(--primary-color)] transition-colors duration-300" />
  </div>
);

const BackButton = () => (
  <div className="flex items-center justify-center gap-2">
    <FaArrowLeft className="w-5 h-5 text-[var(--primary-color)] transition-colors duration-300" />
    <span className="text-white transition-colors duration-300">Back</span>
  </div>
);

interface YearPaginationProps {
  years: number[];
  currentYear: number;
  onYearChange: (year: number) => void;
}

export default function YearPagination({ years, currentYear, onYearChange }: YearPaginationProps) {
  // Sort years in descending order (newest first)
  const sortedYears = [...years].sort((a, b) => b - a);
  const currentIndex = sortedYears.indexOf(currentYear);
  
  const handlePrevious = () => {
    if (currentIndex < sortedYears.length - 1) {
      onYearChange(sortedYears[currentIndex + 1]); // Go to older year
    }
  };

  const handleNext = () => {
    if (currentIndex > 0) {
      onYearChange(sortedYears[currentIndex - 1]); // Go to newer year
    }
  };

  return (
    <div className="pagination-container">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === sortedYears.length - 1}
          className={`pagination-btn flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
            currentIndex === sortedYears.length - 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[var(--primary-color)] hover:text-white'
          }`}
        >
          <BackButton />
        </button>

        <div className="flex items-center">
          <button
            className="px-6 py-2 rounded-lg bg-[var(--primary-color)] text-[var(--main-background)] dark:text-white font-medium"
          >
            {currentYear}
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === 0}
          className={`pagination-btn flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
            currentIndex === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[var(--primary-color)] hover:text-white'
          }`}
        >
          <NextButton />
        </button>
      </div>
    </div>
  );
} 