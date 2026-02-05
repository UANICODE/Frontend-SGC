"use client";

import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "default" | "hero" | "section" | "gradient";
  intensity?: "light" | "medium" | "strong";
}

export function AnimatedBackground({ 
  variant = "default", 
  intensity = "medium" 
}: AnimatedBackgroundProps) {
  const opacityMap = {
    light: { primary: 0.03, secondary: 0.02 },
    medium: { primary: 0.06, secondary: 0.04 },
    strong: { primary: 0.12, secondary: 0.08 },
  };

  const opacity = opacityMap[intensity];

  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes animados principais */}
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 30%, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(102, 187, 106, ${opacity.secondary}) 0%, transparent 60%)`,
              `radial-gradient(circle at 30% 40%, rgba(244, 81, 30, ${opacity.primary * 1.5}) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(102, 187, 106, ${opacity.secondary * 1.5}) 0%, transparent 60%)`,
              `radial-gradient(circle at 25% 35%, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 60%), radial-gradient(circle at 75% 65%, rgba(102, 187, 106, ${opacity.secondary}) 0%, transparent 60%)`,
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
        
        {/* Bolhas flutuantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: i % 2 === 0 
                ? `rgba(244, 81, 30, ${opacity.primary})` 
                : `rgba(102, 187, 106, ${opacity.secondary})`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Linhas de gradiente animadas */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(45deg, 
              transparent 0%, 
              rgba(244, 81, 30, ${opacity.primary}) 25%, 
              transparent 50%, 
              rgba(102, 187, 106, ${opacity.secondary}) 75%, 
              transparent 100%)`,
            backgroundSize: "200% 200%",
          }}
        />
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              `linear-gradient(135deg, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%, rgba(102, 187, 106, ${opacity.secondary}) 100%)`,
              `linear-gradient(225deg, rgba(244, 81, 30, ${opacity.primary * 1.3}) 0%, transparent 50%, rgba(102, 187, 106, ${opacity.secondary * 1.3}) 100%)`,
              `linear-gradient(315deg, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%, rgba(102, 187, 106, ${opacity.secondary}) 100%)`,
              `linear-gradient(45deg, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%, rgba(102, 187, 106, ${opacity.secondary}) 100%)`,
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes radiais animados */}
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 10% 20%, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(102, 187, 106, ${opacity.secondary}) 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 30%, rgba(244, 81, 30, ${opacity.primary * 1.4}) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(102, 187, 106, ${opacity.secondary * 1.4}) 0%, transparent 50%)`,
              `radial-gradient(circle at 15% 25%, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%), radial-gradient(circle at 85% 75%, rgba(102, 187, 106, ${opacity.secondary}) 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
        
        {/* Partículas flutuantes menores */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              background: i % 2 === 0 
                ? `rgba(244, 81, 30, ${opacity.primary})` 
                : `rgba(102, 187, 106, ${opacity.secondary})`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(102, 187, 106, ${opacity.secondary}) 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 60%, rgba(244, 81, 30, ${opacity.primary * 1.3}) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(102, 187, 106, ${opacity.secondary * 1.3}) 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, rgba(244, 81, 30, ${opacity.primary}) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(102, 187, 106, ${opacity.secondary}) 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />
    </div>
  );
}





