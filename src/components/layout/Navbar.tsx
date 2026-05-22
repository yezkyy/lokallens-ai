"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Fitur", href: "#features" },
  { name: "Demo", href: "#demo" },
  { name: "Tren", href: "#trends" },
  { name: "Harga", href: "#pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-brand-100 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-950">
              LokalLens<span className="text-brand-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-brand-900/70 hover:text-brand-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-[1px] bg-brand-200" />
            <Link href="/login">
              <Button variant="ghost" className="text-brand-900/70 hover:text-brand-600">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-6 shadow-lg shadow-brand-600/20">
                Mulai Gratis
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-brand-950"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-brand-100 p-4 md:hidden shadow-xl"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-brand-900/70 p-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-brand-100" />
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-brand-900/70">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl">
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
