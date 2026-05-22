"use client";

import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, BarChart3, PenTool, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function AuthBranding() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-brand-950 p-12 overflow-hidden text-white">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/30 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-400/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtMiAwLTItMi0yLTJzMC0yIDItMiAyIDAgMiAyIDIgMiAyIDJ6IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCTwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Top Section */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/40 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            LokalLens<span className="text-brand-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Middle Section */}
      <div className="relative z-10 max-w-lg mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">AI Commerce Assistant</span>
          </div>
          
          <h1 className="text-5xl font-black leading-[1.1] mb-6 tracking-tight">
            Tingkatkan Omzet <br/>
            UMKM Anda dengan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-white">Kecerdasan Buatan.</span>
          </h1>
          
          <p className="text-brand-100/70 text-lg leading-relaxed mb-10 max-w-md font-medium">
            LokalLens AI membantu bisnis lokal membuat visual produk profesional, copy marketing cerdas, dan analisis tren hanya dalam hitungan detik.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: ShoppingBag, title: "AI Visualizer", desc: "Foto Studio Instan" },
            { icon: PenTool, title: "Smart Copy", desc: "Caption Bahasa Lokal" },
            { icon: BarChart3, title: "Trend Analyzer", desc: "Data Pasar Real-time" },
            { icon: Sparkles, title: "Voice Assistant", desc: "Bantuan AI 24/7" },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center border border-brand-600/30">
                <feature.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{feature.title}</p>
                <p className="text-[10px] font-medium text-brand-100/60 uppercase tracking-wider">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-20">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-fit">
           <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-brand-800 border-2 border-brand-950 flex items-center justify-center font-bold text-xs z-10">
                   UMKM
                </div>
              ))}
           </div>
           <div>
              <div className="flex items-center gap-1 mb-1">
                 <CheckCircle2 className="w-4 h-4 text-green-400" />
                 <span className="text-sm font-bold text-white">Dipercaya 500+ Bisnis Lokal</span>
              </div>
              <p className="text-xs text-brand-100/60 font-medium">Bergabunglah dengan pengusaha cerdas lainnya.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
