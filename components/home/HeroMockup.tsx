"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const phoneVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
  },
};

export function HeroMockup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return (
    <motion.div
      variants={phoneVariants}
      initial="initial"
      animate="animate"
      transition={{ 
        duration: isMobile ? 0.5 : 0.8, // Mais rápido no mobile
        ease: "easeOut"
      }}
      className="mx-auto h-[550px] w-[350px] md:h-[650px] md:w-[420px] relative"
    >
      {/* Background estático no mobile */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[36px]" />
      )}
      
      <motion.div
        animate={isMobile ? {} : { y: [0, -5, 0] }}
        transition={isMobile ? {} : { 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative h-full w-full"
      >
        <Image
          src="/images/Phone.png"
          alt="Foodnect App - Beira, Moçambique"
          fill
          sizes="(min-width: 768px) 420px, 350px"
          className={`object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority
          onLoad={() => setIsLoaded(true)}
          loading="eager"
        />
        
        {/* Fallback enquanto carrega */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 rounded-[36px] animate-pulse" />
        )}
      </motion.div>
    </motion.div>
  );
}