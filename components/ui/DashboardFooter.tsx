"use client";

import { Info, Coffee } from "lucide-react";

interface DashboardFooterProps {
  version?: string;
  showGitHub?: boolean;
  className?: string;
}

export function DashboardFooter({
  version = "v1.0",
  showGitHub = true,
  className = "",
}: DashboardFooterProps) {
  return (
    <footer
      className={`flex items-center justify-between px-6 py-4 border-t border-borderLight bg-gray-200 ${className}`}
    >
      {/* Left side */}
      <div className="flex items-center gap-2 text-gray-800 text-sm font-medium">
        <Info size={18} /> <span>SGC {version}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-gray-800 text-sm">
       
        <span className="flex items-center gap-1">
          <Coffee size={18} /> Powered by UANICODE
        </span>
      </div>
    </footer>
  );
}