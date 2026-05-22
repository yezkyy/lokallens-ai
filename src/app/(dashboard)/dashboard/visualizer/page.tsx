"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Sparkles, 
  Download, 
  RefreshCw,
  Settings2,
  Image as ImageIcon,
  ChevronDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Options based on design requirements
const visualStyles = [
  "Cinematic (Film)",
  "Commercial Photo",
  "Product Catalog",
  "Artistic/Creative",
  "Minimalist White"
];

const studioStyles = [
  "Cinematic (Film)",
  "Modern Cafe",
  "Luxury Marble",
  "Rustic Wood",
  "Nature Garden",
  "Professional Studio"
];

const lightingStyles = [
  "Cinematic Lighting (High Contrast)",
  "Soft Studio Light",
  "Warm Sunlight",
  "Neon Purple",
  "Natural Window Light"
];

const sizes = [
  "16:9 Cinema",
  "1:1 Square",
  "9:16 Mobile/Story",
  "4:3 Presentation"
];

export default function VisualizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form States
  const [visualStyle, setVisualStyle] = useState(visualStyles[0]);
  const [studioStyle, setStudioStyle] = useState(studioStyles[0]);
  const [lighting, setLighting] = useState(lightingStyles[0]);
  const [size, setSize] = useState(sizes[0]);
  const [customInstruction, setCustomInstruction] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResultImage(null);
    }
  };

  const processImage = async () => {
    if (!file) {
      toast.error("Unggah foto produk terlebih dahulu!");
      return;
    }
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("quality", "high");
    formData.append("aspectRatio", size.split(" ")[0]);
    formData.append("visualStyle", visualStyle);
    formData.append("studioStyle", studioStyle);
    formData.append("lighting", lighting);
    formData.append("customInstruction", customInstruction);

    try {
      const response = await fetch("/api/ai/enhance-product-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Gagal memproses gambar.");

      const finalUrl = data.base64 ? `data:image/png;base64,${data.base64}` : data.url;
      
      if (finalUrl) {
        setResultImage(finalUrl);
        toast.success("Visualisasi Berhasil!");

        // Save to Gallery
        try {
          await fetch("/api/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: finalUrl,
              prompt_used: customInstruction || `Visualisasi ${visualStyle} di ${studioStyle}`,
              settings: { visualStyle, studioStyle, lighting, size }
            })
          });
        } catch (saveError) {
          console.error("Gagal menyimpan ke galeri:", saveError);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = async () => {
    if (!resultImage) return;
    
    try {
      // If it's a data URI (base64)
      if (resultImage.startsWith('data:')) {
        const link = document.createElement("a");
        link.href = resultImage;
        link.download = `LokalLens-Visualizer-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // If it's a URL, fetch it first to avoid navigation issues
        const response = await fetch(resultImage);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `LokalLens-Visualizer-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
      toast.success("Gambar berhasil diunduh!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Gagal mengunduh gambar.");
    }
  };

  return (
    <div className="min-h-full w-full relative">
      {/* Dynamic Background Gradient - Consistent with Dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             background: `linear-gradient(to bottom, #B8D3FF 50%, #F1F6FF 80%, #FFFFFF 100%)`
           }} 
      />
      
      {/* Blueprint Grid Background - More subtle integration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: `linear-gradient(#2354FF 1px, transparent 1px), linear-gradient(90deg, #2354FF 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }} 
      />
      
      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-full">
        {/* Sidebar Settings - Responsive: Stacked on mobile, Sidebar on desktop */}
        <aside className="w-full lg:w-[380px] bg-white/80 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-brand-100 flex flex-col z-10 shadow-xl lg:m-4 lg:rounded-[2rem] overflow-hidden shrink-0">
          <div className="p-4 lg:p-6 flex-grow overflow-y-auto space-y-6 custom-scrollbar max-h-[50vh] lg:max-h-none">
            
            {/* Upload Section */}
            <div 
              className={cn(
                "relative aspect-[16/10] rounded-2xl border-2 border-dashed border-brand-200 bg-white flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-brand-50 transition-all overflow-hidden",
                preview && "border-none p-0"
              )}
              onClick={() => !preview && fileInputRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-brand-600" />
                  </div>
                  <h4 className="font-bold text-brand-950 text-sm lg:text-base">Taruh Foto Produk Kamu Disini!</h4>
                  <p className="text-[10px] text-brand-900/40 mt-1">Silahkan masukkan file PNG, JPG, atau JPEG</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
            </div>

            {/* Pengaturan Header */}
            <div className="bg-brand-600 rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Pengaturan Visual</span>
              <Settings2 className="w-4 h-4 text-white" />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Gaya Visual */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Gaya Visual</label>
                <div className="relative group">
                  <select 
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-brand-100 rounded-xl text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  >
                    {visualStyles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none group-hover:text-brand-600 transition-colors" />
                </div>
              </div>

              {/* Gaya Studio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Gaya Studio</label>
                <div className="relative group">
                  <select 
                    value={studioStyle}
                    onChange={(e) => setStudioStyle(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-brand-100 rounded-xl text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  >
                    {studioStyles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none group-hover:text-brand-600 transition-colors" />
                </div>
              </div>

              {/* Cahaya */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Cahaya</label>
                <div className="relative group">
                  <select 
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-brand-100 rounded-xl text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  >
                    {lightingStyles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none group-hover:text-brand-600 transition-colors" />
                </div>
              </div>

              {/* Ukuran */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Ukuran</label>
                <div className="relative group">
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-brand-100 rounded-xl text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  >
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none group-hover:text-brand-600 transition-colors" />
                </div>
              </div>
            </div>

            {/* Instruksi */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Instruksi (Opsional)</label>
              <Textarea 
                placeholder="Misal: Tambahkan bunga di samping produk"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                className="min-h-[80px] lg:min-h-[100px] bg-slate-50 border-brand-100 rounded-xl text-xs font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 lg:p-6 bg-slate-50/50 border-t border-brand-50">
            <Button 
              onClick={processImage} 
              disabled={isProcessing || !file}
              className="w-full h-12 lg:h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-600/30 group"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>Mulai <Sparkles className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-4 lg:p-8 flex flex-col relative min-h-[500px]">
          {/* Header Tools */}
          <div className="flex justify-end mb-4 lg:mb-8 relative z-10">
            <Button 
              onClick={downloadResult}
              disabled={!resultImage}
              className="h-10 lg:h-12 px-6 lg:px-8 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-600/20 transition-all flex items-center gap-3"
            >
              Unduh Gambar <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* Canvas / Result Area */}
          <div className="flex-grow flex items-center justify-center relative">
            <div className="w-full max-w-4xl aspect-square bg-[#FFF0F0] rounded-[2rem] lg:rounded-[3rem] shadow-2xl border-4 border-white/50 overflow-hidden flex items-center justify-center relative group">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-brand-900/40 font-black uppercase tracking-widest text-[10px] lg:text-xs">Menganalisis...</p>
                  </motion.div>
                ) : resultImage ? (
                  <motion.img 
                    key="result"
                    src={resultImage} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full object-contain" 
                    alt="Hasil Visualisasi" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    className="text-center"
                  >
                    <h3 className="text-lg lg:text-xl font-black text-brand-950/40 uppercase tracking-[0.3em]">Hasil Gambar</h3>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Blueprint Crosshairs/Markers */}
              <div className="absolute top-6 lg:top-8 left-6 lg:left-8 w-6 h-6 border-t-2 border-l-2 border-brand-200/50" />
              <div className="absolute top-6 lg:top-8 right-6 lg:right-8 w-6 h-6 border-t-2 border-r-2 border-brand-200/50" />
              <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 w-6 h-6 border-b-2 border-l-2 border-brand-200/50" />
              <div className="absolute bottom-6 lg:bottom-8 right-6 lg:right-8 w-6 h-6 border-b-2 border-r-2 border-brand-200/50" />
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}
