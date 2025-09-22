import React from 'react'
import  "./SliderGraph"
import {motion} from "framer-motion"
export default function SliderGraph() {
  return (
    <div className='w-[100%] mx-auto top-[-6rem]  xl:relative  flex justify-center '>
     <motion.svg 
     initial={{opacity:0}}
     whileInView={{opacity:1}}
     transition={{delay:1 , duration:2.7 , type:"spring"}}
     
     className='absolute w-[50vw] right-[50%]  xl:w-auto' width="721" height="290" viewBox="0 0 721 290" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M720 1L720 209C720 222.255 709.255 233 696 233L80 233C66.7452 233 56 243.745 56 257V265C56 278.255 45.2548 289 32 289H0" stroke="url(#paint0_linear_1_687)" strokeLinecap="round"/>
        <defs>
        <linearGradient id="paint0_linear_1_687" x1="466.479" y1="1" x2="466.479" y2="289" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0A5E6E"/>
        <stop offset="1" stopColor="#18192C"/>
        </linearGradient>
        </defs>
    </motion.svg>
    <motion.svg 
      initial={{opacity:0}}
      whileInView={{opacity:1}}
      transition={{delay:1 , duration:2.5 , type:"spring"}}
      className="absolute right-[50%]  w-[40vw] xl:w-auto" width="570" height="290" viewBox="0 0 570 290" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M569 1L569 153C569 166.255 558.255 177 545 177L81 177C67.7452 177 57 187.745 57 201V265C57 278.255 46.2548 289 33 289H1" stroke="url(#paint0_linear_1_685)" strokeLinecap="round"/>
        <defs>
        <linearGradient id="paint0_linear_1_685" x1="369" y1="1" x2="369" y2="289" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0A5E6E"/>
        <stop offset="1" stopColor="#18192C"/>
        </linearGradient>
        </defs>
    </motion.svg>
    <motion.svg 
      initial={{opacity:0}}
      whileInView={{opacity:1}}
      transition={{delay:1 , duration:2.3 , type:"spring"}}
    className="absolute w-[30vw] xl:w-auto right-[50%] " width="402" height="290" viewBox="0 0 402 290" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M401 1L401 153C401 166.255 390.255 177 377 177L81 177C67.7452 177 57 187.745 57 201V265C57 278.255 46.2548 289 33 289H1" stroke="url(#paint0_linear_1_683)" strokeLinecap="round"/>
        <defs>
        <linearGradient id="paint0_linear_1_683" x1="260.155" y1="1" x2="260.155" y2="289" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0A5E6E"/>
        <stop offset="1" stopColor="#18192C"/>
        </linearGradient>
        </defs>
        </motion.svg>
        <motion.svg
          initial={{opacity:0}}
          whileInView={{opacity:2}}
          transition={{delay:1 , duration:2 , type:"spring"}}
        
        className='absolute w-[18vw] xl:w-auto right-[50%]' width="234" height="290" viewBox="0 0 234 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M233 1L233 97C233 110.255 222.255 121 209 121L81 121C67.7452 121 57 131.745 57 145L57 265C57 278.255 46.2548 289 33 289H1" stroke="url(#paint0_linear_1_681)" strokeLinecap="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_681" x1="151.31" y1="1" x2="151.31" y2="289" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A5E6E"/>
            <stop offset="1" stopColor="#18192C"/>
            </linearGradient>
            </defs>
        </motion.svg>




        <motion.svg
         initial={{opacity:0}}
         whileInView={{opacity:1}}
         transition={{ duration:1 , type:"spring"}}
         className='absolute  h-[10rem] sm:h-auto mt-[2rem] xl:mt-0 ml-[.2px]' width="2" height="290" viewBox="0 0 2 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1V289" stroke="url(#paint0_linear_1_688)" strokeLinecap="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_688" x1="1.35211" y1="1" x2="1.35211" y2="289" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A5E6E"/>
            <stop offset="1" stopColor="#18192C"/>
            </linearGradient>
            </defs>
        </motion.svg>

        <motion.svg 
         initial={{opacity:0}}
         whileInView={{opacity:1}}
         transition={{delay:1 , duration:2 , type:"spring"}}
        
        className='absolute w-[18vw] xl:w-auto left-[50%]' width="234" height="290" viewBox="0 0 234 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L1 97C1 110.255 11.7452 121 25 121L153 121C166.255 121 177 131.745 177 145L177 265C177 278.255 187.745 289 201 289H233" stroke="url(#paint0_linear_1_680)" strokeLinecap="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_680" x1="82.6901" y1="1" x2="82.6901" y2="289" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A5E6E"/>
            <stop offset="1" stopColor="#18192C"/>
            </linearGradient>
            </defs>
        </motion.svg>

        <motion.svg
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          transition={{delay:1 , duration:2.3 , type:"spring"}}
        
        className="absolute w-[30vw]  xl:w-auto left-[50%] "  width="402" height="290" viewBox="0 0 402 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L1 153C1 166.255 11.7452 177 25 177L321 177C334.255 177 345 187.745 345 201V265C345 278.255 355.745 289 369 289H401" stroke="url(#paint0_linear_1_682)" strokeLinecap="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_682" x1="141.845" y1="1" x2="141.845" y2="289" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A5E6E"/>
            <stop offset="1" stopColor="#18192C"/>
            </linearGradient>
            </defs>
        </motion.svg>

        <motion.svg 
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          transition={{delay:1 , duration:2.5 , type:"spring"}}
        className="absolute w-[40vw]  xl:w-auto left-[50%]" width="570" height="290" viewBox="0 0 570 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L1 153C1 166.255 11.7452 177 25 177L489 177C502.255 177 513 187.745 513 201V265C513 278.255 523.745 289 537 289H569" stroke="url(#paint0_linear_1_684)" strokeLinecap="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_684" x1="201" y1="1" x2="201" y2="289" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A5E6E"/>
            <stop offset="1" stopColor="#18192C"/>
            </linearGradient>
            </defs>
        </motion.svg>

         <motion.svg 
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          transition={{delay:1 , duration:2.7 , type:"spring"}}
          className='w-[50vw] left-[50%] xl:w-auto  absolute' width="721" height="290" viewBox="0 0 721 290" fill="none" xmlns="http://www.w3.org/2000/svg">7            <path d="M1 1L1 209C1 222.255 11.7452 233 25 233L641 233C654.255 233 665 243.745 665 257V265C665 278.255 675.745 289 689 289H721" stroke="url(#paint0_linear_1_686)" strokeLinecap="round"/>
            <defs>
            <linearGradient id="paint0_linear_1_686" x1="254.521" y1="1" x2="254.521" y2="289" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A5E6E"/>
            <stop offset="1" stopColor="#18192C"/>
            </linearGradient>
            </defs>
         </motion.svg>

        
        







    </div>
  )
}
