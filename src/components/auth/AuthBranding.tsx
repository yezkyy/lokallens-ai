"use client";

import { ReactNode } from "react";

interface AuthBrandingProps {
  children?: ReactNode;
  activeTab: 'masuk' | 'daftar';
}

export function AuthBranding({ children, activeTab }: AuthBrandingProps) {
  const isDaftar = activeTab === 'daftar';

  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-x-hidden relative">

      {/* ── SISI KIRI: Blue Panel (Tempat Card Login & Daftar) ── */}
      <div
        className={`flex items-center justify-center p-4 sm:p-6 relative overflow-hidden min-h-screen z-10 transition-all duration-500 ease-in-out ${
          isDaftar ? "w-full lg:w-full" : "w-full lg:w-[45%]"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, #93C5FD 0%, #3B82F6 40%, #1D4ED8 100%)",
        }}
      >
        {/* Soft glow overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.18) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.12) 0%, transparent 55%)",
          }}
        />
        
        {/* Container Utama */}
        <div className="relative z-10 w-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* ── SISI KANAN: Grid-Paper Branding Panel (Slide Out ke Kanan) ── */}
      <div
          className={`hidden lg:flex w-[55%] flex-col absolute top-0 bottom-0 right-0 bg-white items-center justify-center p-12 transition-all duration-500 ease-in-out z-0 ${
          isDaftar ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
          }`}
          style={{
          backgroundImage: `
              linear-gradient(to right, #E2E8F0 1px, transparent 1.5px),
              linear-gradient(to bottom, #E2E8F0 1px, transparent 1.5px)
          `,
          backgroundSize: "24px 24px",
          }}
      >
          <div className="w-full max-w-lg flex flex-col">
            {/* Teks Sambutan Branding */}
            <div className="mb-10">
                <p className="text-[#2563EB] text-[14px] md:text-[16px] font-medium mb-1 tracking-wide">
                Selamat datang di
                </p>
                <h1 className="text-4xl md:text-[56px] font-bold text-[#1D4ED8] tracking-tight leading-tight mb-4">
                LokalLens AI<span className="text-[#2563EB]">.</span>
                </h1>
                <p className="text-[#2563EB] font-medium text-xs md:text-[15px] max-w-sm leading-relaxed opacity-80">
                Satu tempat untuk segala kebutuhan visual dan promosi usahamu.
                </p>
            </div>

            {/* Block Placeholder Gambar Utama */}
            <div className="w-full mb-10 flex flex-col items-center">
                <div className="w-full aspect-[16/9] bg-[#94A3B8] rounded-[20px] shadow-inner" />
                <div className="flex justify-center gap-1.5 mt-6">
                  <span className="w-10 h-1.5 bg-[#2563EB] rounded-full transition-all" />
                  <span className="w-10 h-1.5 bg-[#BFDBFE] rounded-full transition-all" />
                  <span className="w-10 h-1.5 bg-[#BFDBFE] rounded-full transition-all" />
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-center w-full">
                <p className="text-[10px] font-bold text-slate-400 tracking-wide">
                Copyright © 2026 LokalLens AI
                </p>
            </div>
          </div>
      </div>    </div>
  );
}
