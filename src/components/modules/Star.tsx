"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Styles from "@/styles/Stars.module.css";

interface Star {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  duration: number;
  isFlickering: boolean; 
}

const Stars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]); 

  useEffect(() => {
    const numberOfStars = 50; 
    const starsArray: Star[] = [];
    for (let i = 0; i < numberOfStars; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100; 

      const opacity = Math.random() * 0.5 + 0.2; 
      const scale = Math.random() * 0.5 + 0.5;  
      const duration = Math.random() * 2 + 2;
      const isFlickering = Math.random() > 0.2; 

      starsArray.push({ x, y, opacity, scale, duration, isFlickering });
    }
    setStars(starsArray);
  }, []);

  return (
    <div style={{ height: 'auto', margin: 0 }}>
      <div className={Styles.stars}>
        {stars.map((star, index) => (
          <motion.div
            key={index}
            className={Styles.star}
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              opacity: star.opacity, 
            }}
            initial={{ opacity: 0 }}  
            animate={
              star.isFlickering
                ? {
                    opacity: [0, star.opacity, 0], 
                    scale: [1, star.scale, 1], 
                  }
                : { opacity: star.opacity, scale: star.scale } 
            }
            transition={{
              duration: star.duration,  
              repeat: star.isFlickering ? Infinity : 0,  
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 1, 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Stars;
