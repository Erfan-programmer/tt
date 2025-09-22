"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image Container with Aspect Ratio */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Use a container with a fixed aspect ratio */}
        <div className="relative w-full h-full">
          <Image
            src="/404.png"
            alt="404 Error"
            fill // Fills the parent container
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw" // Add sizes prop for better performance
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 bg-opacity-40"></div>
      </div>
      
      {/* Rest of your content remains the same */}
      {/* Logos - Top Left */}
      <motion.div
        className="absolute top-4 sm:top-8 left-4 sm:left-8 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {/* You can add your logo or other content here */}
      </motion.div>

      {/* Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center text-white w-full max-w-md sm:max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            404 - Page Not Found!
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 px-4 sm:px-0">
            Looks like you&apos;ve drifted off course. The page you&apos;re searching for is nowhere to be found.
          </p>

          {/* Action Button */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link href={"/"} className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-white text-white rounded-lg hover:text-black font-semibold hover:bg-white transition-colors duration-200 text-sm sm:text-base">
              Go to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}