"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Camera, 
  PenTool, 
  Calendar, 
  BarChart3, 
  Mic, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Visualizer AI", icon: Camera, href: "/dashboard/visualizer" },
  { name: "Smart Copywriter", icon: PenTool, href: "/dashboard/copywriter" },
  { name: "Marketing Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { name: "Trend Analyzer", icon: BarChart3, href: "/dashboard/trends" },
  { name: "AI Voice", icon: Mic, href: "/dashboard/voice" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 border-r border-brand-100 bg-white transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-950">
              LokalLens<span className="text-brand-600">AI</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </Link>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-brand-100 rounded-full flex items-center justify-center text-brand-400 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-grow px-3 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-brand-50 text-brand-600" 
                    : "text-brand-900/50 hover:bg-brand-50/50 hover:text-brand-600"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-brand-600" : "text-brand-900/40 group-hover:text-brand-600"
                )} />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-brand-600 rounded-r-full"
                  />
                )}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-brand-950 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-brand-50 space-y-1">
        <Link href="/dashboard/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-brand-900/50 hover:bg-brand-50/50 hover:text-brand-600 transition-all group relative">
            <Settings className="w-5 h-5 text-brand-900/40 group-hover:text-brand-600" />
            {!collapsed && <span className="font-medium text-sm">Pengaturan</span>}
          </div>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 transition-all group relative">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Keluar</span>}
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 m-3 bg-brand-50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 overflow-hidden">
            <User className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-brand-950 truncate">Budi Santoso</p>
            <p className="text-xs text-brand-900/40 truncate">UMKM Juara</p>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="p-3 mb-2 flex justify-center">
          <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-600">
            <User className="w-6 h-6" />
          </div>
        </div>
      )}
    </aside>
  );
}
