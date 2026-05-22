"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  RefreshCw,
  Send,
  TrendingUp,
  DollarSign
} from "lucide-react";

// Social Icons as SVGs
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CopywriterPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    caption: string;
    hashtags: string[];
    callToAction: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Pricing State
  const [basePrice, setBasePrice] = useState(25000);
  const [margin, setMargin] = useState(30);
  const [pricingStrategy, setPricingStrategy] = useState<{
    recommendedPrice: number;
    strikeThroughPrice: number;
    discountPercentage: number;
    strategyReasoning: string;
  } | null>(null);
  const [isCalculatingPricing, setIsCalculatingPricing] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Fix hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  const generateFullMarketing = async () => {
    if (!productName || !category) {
      toast.error("Nama produk dan kategori wajib diisi");
      return;
    }
    
    setIsGenerating(true);
    setIsCalculatingPricing(true);
    setErrorDetails(null);
    
    try {
      // 1. Generate Caption
      const captionRes = await fetch("/api/ai/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          sellingStyle: "Social Media",
          targetAudience: "UMKM Customers",
          tone
        }),
      });

      // 2. Generate Pricing
      const pricingRes = await fetch("/api/ai/generate-pricing-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modalPrice: basePrice,
          targetMargin: margin,
          competitorPricing: "Market average for " + category
        }),
      });

      const captionData = await captionRes.json();
      const pricingData = await pricingRes.json();

      if (!captionRes.ok) throw new Error(`Caption AI Error: ${captionData.error || "Unknown Error"}`);
      if (!pricingRes.ok) throw new Error(`Pricing AI Error: ${pricingData.error || "Unknown Error"}`);

      setGeneratedContent(captionData);
      setPricingStrategy(pricingData);
      toast.success("Marketing Hub berhasil diperbarui!");
    } catch (error: any) {
      console.error("Error generating content:", error);
      setErrorDetails(error.message);
      toast.error("Gagal menghasilkan konten. Cek detail error.");
    } finally {
      setIsGenerating(false);
      setIsCalculatingPricing(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      const fullText = `${generatedContent.caption}\n\n${generatedContent.callToAction}\n\n${generatedContent.hashtags.join(" ")}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return fullText;
    }
    return "";
  };

  const shareToInstagram = () => {
    const text = copyToClipboard();
    if (text) {
      toast.success("Caption disalin! Membuka Instagram...");
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank");
      }, 1000);
    }
  };

  const currentRecommendedPrice = pricingStrategy?.recommendedPrice || (Math.floor(basePrice * (1 + margin/100) / 100) * 100 - 100);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID").format(val);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "");
    if (rawValue === "") {
      setBasePrice(0);
      return;
    }
    const numValue = parseInt(rawValue);
    if (!isNaN(numValue)) {
      setBasePrice(numValue);
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

      <div className="relative z-10 space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-950 flex items-center gap-3">
              <PenTool className="w-8 h-8 text-brand-600" />
              Smart Price & Copywriter Hub
            </h1>
            <p className="text-brand-900/40 font-medium">Buat caption menjual dan hitung harga psikologis secara otomatis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-brand-50">
                 <CardTitle className="text-lg font-bold">Detail Produk</CardTitle>
                 <CardDescription>Berikan informasi singkat tentang produk Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-950">Nama Produk</label>
                    <Input 
                      placeholder="Contoh: Amplang Mahakam" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="rounded-xl border-brand-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-950">Kategori</label>
                    <Input 
                      placeholder="Contoh: Makanan Ringan" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="rounded-xl border-brand-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-950">Tone Suara</label>
                  <div className="flex flex-wrap gap-2">
                     {["Professional", "Casual", "Urgent", "Friendly"].map(t => (
                       <button
                         key={t}
                         onClick={() => setTone(t)}
                         className={cn(
                           "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                           tone === t 
                             ? "bg-brand-600 text-white border-brand-600" 
                             : "bg-white text-brand-900/40 border-slate-100 hover:border-brand-200"
                         )}
                       >
                         {t}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                   <div className="flex-grow h-[1px] bg-slate-100" />
                   <span className="text-xs font-bold text-brand-900/20 uppercase tracking-widest">Kalkulator Harga</span>
                   <div className="flex-grow h-[1px] bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-brand-950">Harga Modal (COGS)</label>
                      <span className="text-xs font-bold text-brand-600">Rp {formatIDR(basePrice)}</span>
                    </div>
                    <Input 
                      type="text"
                      value={formatIDR(basePrice)}
                      onChange={handlePriceChange}
                      className="rounded-xl border-brand-100 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-brand-950">Margin Keuntungan (%)</label>
                      <span className="text-xs font-bold text-brand-600">{margin}%</span>
                    </div>
                    <div className="h-10 flex items-center">
                      <input 
                        type="range" 
                        min="5" 
                        max="200" 
                        value={margin}
                        onChange={(e) => setMargin(parseInt(e.target.value))}
                        className="w-full accent-brand-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-center justify-between relative overflow-hidden">
                   {isCalculatingPricing && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                         <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
                      </div>
                   )}
                   <div>
                      <p className="text-xs font-bold text-brand-900/40 uppercase tracking-widest mb-1">Rekomendasi Harga Psikologis</p>
                      {hasMounted ? (
                        <div className="flex items-baseline gap-2">
                           <h3 className="text-3xl font-black text-brand-600">Rp {currentRecommendedPrice.toLocaleString()}</h3>
                           {pricingStrategy?.strikeThroughPrice && (
                             <span className="text-sm text-brand-900/20 line-through">Rp {pricingStrategy.strikeThroughPrice.toLocaleString()}</span>
                           )}
                        </div>
                      ) : (
                        <div className="h-9 w-32 bg-brand-200/20 animate-pulse rounded-lg" />
                      )}
                   </div>
                   <div className="text-right">
                      {hasMounted && (
                        <Badge className="bg-green-100 text-green-600 border-green-200 mb-1">
                          Profit: Rp {(currentRecommendedPrice - basePrice).toLocaleString()}
                        </Badge>
                      )}
                      <p className="text-[10px] text-brand-900/40 italic">
                        {pricingStrategy ? "Strategi AI Aktif" : "*Estimasi 99-ending"}
                      </p>
                   </div>
                </div>

                <Button 
                  onClick={generateFullMarketing} 
                  disabled={isGenerating || !productName}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-2xl py-7 text-lg font-bold shadow-xl shadow-brand-600/20 group"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Menyusun Kata-kata Sempurna...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Marketing Hub
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden min-h-[400px] flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b border-brand-50 flex flex-row items-center justify-between">
                 <div>
                   <CardTitle className="text-lg font-bold text-brand-950">Hasil AI</CardTitle>
                   <CardDescription>Gunakan ini di media sosial Anda.</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow flex flex-col">
                <AnimatePresence mode="wait">
                  {generatedContent ? (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 flex-grow flex flex-col space-y-4"
                    >
                      <div className="bg-slate-50 rounded-2xl p-6 flex-grow border border-slate-100 text-brand-950 font-medium whitespace-pre-wrap leading-relaxed relative group">
                         <p className="mb-4">{generatedContent.caption}</p>
                         <p className="text-brand-600 font-bold mb-4">{generatedContent.callToAction}</p>
                         <div className="flex flex-wrap gap-1">
                            {generatedContent.hashtags.map(h => (
                              <span key={h} className="text-brand-900/40 text-sm">{h}</span>
                            ))}
                         </div>
                         <div className="absolute top-4 right-4">
                            <Badge className="bg-brand-600 text-white border-none">AI GENERATED</Badge>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="rounded-xl py-6 border-brand-100 font-bold"
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                              Tersalin!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Salin Teks
                            </>
                          )}
                        </Button>
                        <Button 
                          className="rounded-xl py-6 bg-brand-950 text-white font-bold hover:bg-brand-900"
                          onClick={shareToInstagram}
                        >
                          <Instagram className="w-4 h-4 mr-2" />
                          Share ke IG
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mb-6">
                        <Send className="w-10 h-10 text-brand-200" />
                      </div>
                      <h4 className="text-lg font-bold text-brand-950 mb-2">Belum ada konten</h4>
                      <p className="text-sm text-brand-900/40 max-w-[240px]">
                        Isi detail produk di sebelah kiri dan klik generate untuk memulai sihir AI.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {errorDetails && (
              <Card className="border-red-100 bg-red-50/50">
                 <CardContent className="p-4 space-y-2">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Detail Kegagalan Teknis</p>
                    <pre className="text-[10px] text-red-500 bg-white p-3 rounded-lg border border-red-100 overflow-x-auto">
                      {errorDetails}
                    </pre>
                 </CardContent>
              </Card>
            )}

            {pricingStrategy && (
              <Card className="border-none shadow-sm rounded-3xl bg-brand-950 text-white overflow-hidden">
                 <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                       <DollarSign className="w-5 h-5 text-brand-600" />
                       <h3 className="font-bold">Analisis Strategi Harga</h3>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      "{pricingStrategy.strategyReasoning}"
                    </p>
                 </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
