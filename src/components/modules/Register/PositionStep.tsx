import {motion} from "framer-motion"
import RegisterOptionBox from "./position/RegisterOptionBox";
import { positions } from "@/data/Positions";
import Link from "next/link";
import { useEffect } from "react";
export default function PositionStep({ selectedPosition, setSelectedPosition, handleNextStep ,setValue }: any) {
  useEffect(()=> {
    setValue("user_type" , selectedPosition)
  } , [selectedPosition , setValue])  
  return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mt-[1rem] sm:mt-[2rem]"
      >
        <motion.p className="text-[var(--main-background)] dark:text-white font-[600] text-[1.5rem] sm:text-[2rem] mb-3 text-center sm:text-left">
          Choose Your Position:
        </motion.p>
        <div className="register-positions-container grid grid-cols-1 gap-4">
          {positions.map((position, index) => (
            <RegisterOptionBox
              key={position.value}
              title={position.title}
              description={position.description}
              value={position.value}
              isSelected={selectedPosition === position.value}
              onChange={setSelectedPosition}
              index={index + 1}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            type="button"
            className="submit-register text-white w-[80%] order-1 lg:order-0 md:w-full bg-gray-500 hover:bg-gray-600"
            disabled
          >
            Back
          </motion.button>
          <motion.input
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            type="button"
            value="Confirm & Continue"
            onClick={handleNextStep}
            className={`submit-register text-white w-[80%] md:w-full ${!selectedPosition ? "opacity-50 bg-gray-400" : "cursor-pointer bg-[#030a30]"}`}
            disabled={!selectedPosition}
          />
        </div>
        <div className="mt-4 flex items-center justify-center  gap-2 text-[var(--main-background)] dark:text-[#ddd]">
          <span className="text-[.9rem]" style={{fontSize:"1rem !important"}}>Do You Have Account Yet ?</span>
          <Link href="/login" className="text-blue-500">Login</Link>
        </div>
      </motion.div>
    );
  }
  