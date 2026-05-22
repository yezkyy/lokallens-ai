"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Image as ImageIcon, 
  Download, 
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: number;
  image_url: string;
  prompt_used: string;
  settings: any;
  created_at: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/gallery?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Gagal memuat galeri");
      const data = await response.json();
      setImages(data);
    } catch (error: any) {
      console.error("Gallery Error:", error);
      toast.error(error.message || "Gagal memuat galeri");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [searchQuery]);

  const handleDownload = async (url: string, id: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `lokallens-ai-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Gambar berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh gambar");
    }
  };

  return (
    <div className="min-h-full w-full relative">
      {/* Background Gradient Consistent with Dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             background: `linear-gradient(to bottom, #B8D3FF 50%, #F1F6FF 80%, #FFFFFF 100%)`
           }} 
      />

      <div className="relative z-10 space-y-12 pb-20 pt-6">
        
        {/* Centered Pill Search Bar - Match Galeri.png */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#2354FF]/5 rounded-full blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center">
              <div className="absolute left-6 text-[#2354FF]/40">
                <ImageIcon size={24} />
              </div>
              <Input 
                placeholder="Cari Nama Gambar Anda" 
                className="pl-16 pr-20 h-16 bg-white shadow-[0_15px_40px_rgba(35,84,255,0.1)] border-none rounded-full text-lg font-bold placeholder:text-[#2354FF]/20 focus-visible:ring-2 focus-visible:ring-[#2354FF]/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 w-12 h-12 bg-[#2354FF] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#1a44cc] transition-colors">
                <Search className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Seamless Grid - Match Galeri.png */}
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-[#2354FF]/10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                <div key={i} className="aspect-square bg-white/40 border-r border-b border-[#2354FF]/10 animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-32 space-y-4">
               <div className="w-20 h-20 bg-white/40 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/60">
                  <ImageIcon className="w-10 h-10 text-[#2354FF]/20" />
               </div>
               <h3 className="text-2xl font-black text-[#2354FF]">Belum ada koleksi</h3>
               <p className="text-[#2354FF]/40 font-bold max-w-sm mx-auto px-4">
                 Mulai buat visualisasi produk Anda di Visualizer AI untuk melihat hasilnya di sini.
               </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-[#2354FF]/10">
              {images.map((img) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={img.id}
                  className="aspect-square border-r border-b border-[#2354FF]/10 relative group overflow-hidden bg-white/20"
                >
                  <Image 
                    src={img.image_url} 
                    alt={img.prompt_used} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-[#2354FF]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="rounded-full w-14 h-14 bg-white text-[#2354FF] hover:bg-white/90 shadow-2xl transition-transform hover:scale-110 active:scale-95"
                      onClick={() => handleDownload(img.image_url, img.id)}
                    >
                      <Download size={24} />
                    </Button>
                  </div>
                  
                  {/* Prompt Preview on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                     <p className="text-white text-[10px] font-bold line-clamp-1 opacity-80 uppercase tracking-widest">
                       {img.prompt_used}
                     </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
