"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";
import { Menu, X, Bell, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
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
              className="w-4/5 h-full bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center justify-between border-b">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-brand-950">
                    LokalLens<span className="text-brand-600">AI</span>
                  </span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-brand-900" />
                </button>
              </div>
              <div className="p-4">
                {/* Reuse items or simplify for mobile */}
                <p className="text-xs font-bold text-brand-900/30 uppercase tracking-widest px-4 mb-4 mt-6">Menu Utama</p>
                <nav className="space-y-2">
                  {[
                    { name: "Dashboard", href: "/dashboard" },
                    { name: "Visualizer AI", href: "/dashboard/visualizer" },
                    { name: "Marketing Hub", href: "/dashboard/copywriter" },
                    { name: "Marketing Calendar", href: "/dashboard/calendar" },
                  ].map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-brand-50 text-brand-900 font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-100 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <button 
              className="md:hidden p-2 hover:bg-brand-50 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-brand-900" />
            </button>
            
            <div className="relative flex-grow hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <Input 
                placeholder="Cari fitur, produk, atau bantuan..." 
                className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-brand-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100 mr-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-brand-600">AI AKTIF</span>
            </div>
            
            <Button variant="ghost" size="icon" className="text-brand-900/50 hover:text-brand-600 hover:bg-brand-50 rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            
            <div className="h-8 w-[1px] bg-brand-100 mx-1 hidden sm:block" />
            
            <Button className="hidden sm:flex bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-600/10 gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade Pro
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Floating AI Assistant Button */}
        <div className="fixed bottom-8 right-8 z-50">
           <motion.button
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             className="w-14 h-14 bg-brand-600 rounded-2xl shadow-2xl shadow-brand-600/40 flex items-center justify-center text-white relative group"
           >
              <Sparkles className="w-6 h-6" />
              <div className="absolute right-full mr-4 px-3 py-1.5 bg-brand-950 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                 Tanya AI LokalLens
              </div>
           </motion.button>
        </div>
      </div>
    </div>
  );
}
