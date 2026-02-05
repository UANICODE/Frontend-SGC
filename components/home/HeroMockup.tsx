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
      className="mx-auto h-[450px] w-[240px] overflow-hidden rounded-[36px] border-2 border-borderLight/30 bg-gradient-to-br from-zinc-900 to-black p-3 shadow-2xl shadow-black/50 md:h-[520px] md:w-[270px] relative group"
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
        className="relative h-full w-full overflow-hidden rounded-[30px] bg-black"
      >
        <Image
          src="/images/app.jpeg"
          alt="Ecrã da app Foodnect - Beira, Moçambique"
          fill
          sizes="(min-width: 768px) 270px, 240px"
          className="object-cover"
          priority
        />
        {/* Shine overlay animado */}
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        />
      </motion.div>
    </motion.div>
  );
}


