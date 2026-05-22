"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  MagicWandIcon, 
  Megaphone01Icon, 
  GridIcon, 
  Calendar01Icon,
  Image01Icon,
  Settings02Icon,
  Logout01Icon
} from "@hugeicons/core-free-icons";
import { logoutAction } from "@/app/(auth)/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mobileMenuItems = [
    { name: "Visualizer AI", icon: MagicWandIcon, href: "/dashboard/visualizer" },
    { name: "Marketing Hub", icon: Megaphone01Icon, href: "/dashboard/copywriter" },
    { name: "Smart Scheduler", icon: Calendar01Icon, href: "/dashboard/calendar" },
    { name: "Galeri Foto", icon: Image01Icon, href: "/dashboard/gallery" },
    { name: "Dashboard", icon: GridIcon, href: "/dashboard" },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden">
      <Sidebar />
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-950/20 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-4/5 h-full bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center justify-between border-b">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden">
                    <Image src="/logo.svg" alt="LokalLens AI" width={28} height={24} />
                  </div>
                  <span className="text-xl font-black tracking-tight text-[#2354FF]">
                    LokalLens AI
                  </span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-brand-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 flex-grow overflow-y-auto">
                <p className="text-[10px] font-black text-[#2354FF]/30 uppercase tracking-[0.2em] px-4 mb-6 mt-4">Menu Utama</p>
                <nav className="space-y-3">
                  {mobileMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                          isActive 
                            ? "bg-gradient-to-r from-[#2354FF] to-[#447CFF] text-white shadow-xl shadow-blue-600/20" 
                            : "hover:bg-blue-50 text-[#2354FF]/70"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          isActive ? "bg-white/20" : "bg-blue-50/50"
                        )}>
                          <HugeiconsIcon 
                            icon={item.icon} 
                            size={20} 
                            variant={isActive ? "solid" : "stroke"}
                          />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Mobile Actions */}
              <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                 <Link 
                   href="/dashboard/settings"
                   onClick={() => setMobileMenuOpen(false)}
                   className="flex items-center gap-4 px-4 py-4 text-[#2354FF]/70 font-bold text-sm mb-2"
                 >
                    <HugeiconsIcon icon={Settings02Icon} size={20} />
                    <span>Pengaturan</span>
                 </Link>
                 <button 
                   onClick={() => logoutAction()}
                   className="flex items-center gap-4 px-4 py-4 text-red-500/70 font-bold text-sm w-full"
                 >
                    <HugeiconsIcon icon={Logout01Icon} size={20} />
                    <span>Keluar Aplikasi</span>
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col min-w-0 h-full relative">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Content Area with unified scrollbar */}
        <main className="flex-grow overflow-y-auto custom-scrollbar relative p-4 md:p-8">
          <div className={cn(
            "w-full min-h-full flex flex-col",
            pathname && (pathname.includes("/visualizer") || pathname.includes("/gallery")) 
              ? "max-w-none" 
              : "max-w-[1600px] mx-auto"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
