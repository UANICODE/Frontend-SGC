"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
}

export function KpiCard({ title, value, icon: Icon, iconColor = "text-blue-500" }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4"
    >
      {Icon && <Icon size={28} className={`${iconColor}`} />}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </motion.div>
  );
}