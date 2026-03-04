"use client";

import { motion } from "framer-motion";

export function KpiCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-borderLight"
    >
      <p className="text-sm text-textSecondaryLight">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-primary mt-2">
        {value}
      </h3>
    </motion.div>
  );
}