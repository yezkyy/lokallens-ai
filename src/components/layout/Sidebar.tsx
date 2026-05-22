"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  MagicWandIcon, 
  Megaphone01Icon, 
  GridIcon, 
  Layers01Icon,
  Settings02Icon,
  Logout01Icon,
  Hexagon01Icon,
  Calendar01Icon
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Visualizer AI", icon: MagicWandIcon, href: "/dashboard/visualizer" },
  { name: "Marketing Hub", icon: Megaphone01Icon, href: "/dashboard/copywriter" },
  { name: "Smart Scheduler", icon: Calendar01Icon, href: "/dashboard/calendar" },
  { name: "Dashboard", icon: GridIcon, href: "/dashboard" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 w-[80px] bg-gradient-to-b from-[#A5C6FB] via-[#B8D3FF] to-[#D1E3FF] z-40 items-center py-6 shadow-inner"
      )}
    >
      {/* Logo Section */}
      <div className="mb-8">
        <Link href="/dashboard">
          <div className="w-12 h-12 bg-white rounded-[16px] flex items-center justify-center shadow-lg shadow-blue-500/10 transition-transform hover:scale-105 active:scale-95">
             <HugeiconsIcon icon={Hexagon01Icon} size={24} className="text-[#2354FF]" />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow flex flex-col gap-4 items-center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} title={item.name}>
              <div
                className={cn(
                  "w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-300 relative group",
                  isActive 
                    ? "bg-gradient-to-br from-[#2354FF] to-[#447CFF] text-white shadow-lg shadow-blue-600/30" 
                    : "text-[#2354FF]/70 hover:bg-white/30 hover:text-[#2354FF]"
                )}
              >
                <HugeiconsIcon 
                  icon={item.icon}
                  size={22}
                  variant={isActive ? "solid" : "stroke"}
                  className={cn(
                    "transition-all",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} 
                />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-2 py-1 bg-brand-950 text-white text-[10px] font-bold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 uppercase tracking-widest">
                  {item.name}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 items-center pb-2">
        <Link href="/dashboard/settings" title="Pengaturan">
          <div className="w-10 h-10 flex items-center justify-center text-[#2354FF]/70 hover:text-[#2354FF] transition-all group">
            <HugeiconsIcon icon={Settings02Icon} size={22} className="group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </Link>
        <button title="Keluar" className="w-10 h-10 flex items-center justify-center text-[#2354FF]/70 hover:text-red-500 transition-all group">
          <HugeiconsIcon icon={Logout01Icon} size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
}
