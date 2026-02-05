"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";

interface StoreBadgeProps {
  variant: "play" | "app";
  disabled?: boolean;
}

const baseClasses =
  "inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-200";

export function StoreBadge({ variant, disabled }: StoreBadgeProps) {
  const isPlay = variant === "play";

  const content = (
    <>
      <div className={`flex h-8 w-8 items-center justify-center rounded-2xl overflow-hidden ${disabled ? "bg-white/10" : "bg-white/20 shadow-md"}`}>
        {isPlay ? (
          // Imagem da Play Store
          <div className="relative h-6 w-6">
            <NextImage
              src="/images/playstore.png"
              alt="Play Store"
              fill
              sizes="24px"
              className="object-contain"
            />
          </div>
        ) : (
          // Ícone colorido da App Store
          <svg className="h-5 w-5" viewBox="0 0 384 512" aria-hidden="true">
            <path
              d="M318.7 268.6c-.3-32.7 14.6-57.5 44.6-75.8-16.8-24.4-42.3-37.8-76.2-40.2-32-2.5-67.2 18.7-79.8 18.7-13.1 0-43.1-17.9-66.8-17.9C98.9 154.5 51 192.5 51 265.6c0 23.2 4.2 47.1 12.7 71.6 11.3 32.7 52.1 112.7 94.6 111.4 22.3-.6 38-15.8 67-15.8 28.6 0 43.1 15.8 67.9 15.3 42.8-.7 79.6-73.1 90.5-105.9-57.5-27.1-64.9-79.6-65-98.6z"
              fill="#0F9DFF"
            />
            <path
              d="M260.3 96.7C280.6 72 293.2 39.3 290.1 8c-26.5 1.1-58.5 18.2-77.4 40.5-17 19.7-31.9 51.5-28 82 29.7 2.3 60.2-15.1 75.6-33.8z"
              fill="#00C3FF"
            />
          </svg>
        )}
      </div>
      <div className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-90">
          {disabled ? "Em breve" : "Disponível"}
        </span>
        <span className="block text-sm font-bold">
          {isPlay ? "Download na Play Store" : "Download na App Store"}
        </span>
      </div>
    </>
  );

  if (disabled) {
    return (
      <div
        className={`${baseClasses} cursor-not-allowed border-2 border-borderLight bg-white/80 text-textSecondaryLight backdrop-blur-sm`}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.a
      whileHover={{ y: -3, scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.97 }}
      href="#"
      className={`${baseClasses} bg-gradient-to-br from-zinc-900 to-black text-white hover:from-zinc-800 hover:to-zinc-900 shine-effect`}
    >
      {content}
    </motion.a>
  );
}



