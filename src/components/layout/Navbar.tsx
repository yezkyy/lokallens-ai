"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Pemantau Tren Pasar";
    if (path.includes("/visualizer")) return "Visualizer Studio";
    if (path.includes("/copywriter")) return "Marketing Hub";
    if (path.includes("/calendar")) return "Smart Scheduler";
    if (path.includes("/gallery")) return "Galeri Foto AI";
    return "LokalLens AI";
  };

  return (
    <nav className="w-full bg-[#B8D3FF] border-t-[3px] border-[#2354FF] h-[80px] min-h-[80px] flex items-center px-4 md:px-8 shadow-sm sticky top-0 z-30">
      <button 
        className="md:hidden mr-4 p-2 hover:bg-white/20 rounded-lg text-[#2354FF]"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <h2 className="text-[#2354FF] font-black text-lg md:text-[22px] tracking-tight">
        {getPageTitle(pathname)}
      </h2>
    </nav>
  );
}
