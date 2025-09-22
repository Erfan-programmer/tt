"use client"
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStar = (id: number, maxY: number, minY: number = 0) => ({
      id,
      x: Math.random() * 100,
      y: minY + (Math.random() * (maxY - minY)),
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 8
    });

    const topStars = Array.from({ length: 8 }, (_, i) => 
      generateStar(i, 35)
    );

    const bottomStars = Array.from({ length: 25 }, (_, i) => 
      generateStar(i + 8, 100, 35) 
    );

    setStars([...topStars, ...bottomStars]);
  }, []);

  return (
    <div className="stars-container z-[100]">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0] 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: star.delay,
              repeatDelay: Math.random() * 5 + 2, 
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size + 2}px`,
              height: `${star.size + 2}px`,
              borderRadius: '50%',
            }}
            className=' bg-[var(--main-background)] dark:bg-white shadow-[0_0_8px_#004ada] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]'
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 