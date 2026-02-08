"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const phoneVariants = {
  initial: { opacity: 0, y: 50, rotate: -8, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    rotate: 0, 
    scale: 1,
  },
};

export function HeroMockup() {
  return (
    <motion.div
      variants={phoneVariants}
      initial="initial"
      animate="animate"
      transition={{ 
        duration: 0.8, 
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -10,
        rotate: 2,
        transition: { duration: 0.3 }
      }}
      className="mx-auto h-[550px] w-[350px] md:h-[650px] md:w-[420px] relative group"
    >
      {/* Glow effect animado */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-[36px] blur-xl -z-10"
      />
      <motion.div
        animate={{
          opacity: [0, 0.4, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 rounded-[36px] blur-2xl -z-10"
      />
      
      <motion.div
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
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
          className="object-contain"
          priority
        />
      </motion.div>
    </motion.div>
  );
}


