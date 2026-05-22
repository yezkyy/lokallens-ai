"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  MessageCircle, 
  Calculator,
  TrendingUp,
  DollarSign,
  Info,
  ChevronRight,
  Send
} from "lucide-react";

// Social Icons as SVGs to replace missing brand icons in Lucide v1
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function CopywriterPage() {
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Pricing State
  const [basePrice, setBasePrice] = useState(25000);
  const [margin, setMargin] = useState(30);
  
  const generateCaption = () => {
    if (!productName) return;
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const captions = [
        `🔥 MANTEP BANGET! 🔥\n\nKenalin nih, ${productName}! Asli Samarinda punya. ${productDesc}\n\nHarganya cuma Rp ${Math.floor(basePrice * (1 + margin/100) / 100) * 100 - 100}, murah banget buat kualitas kayak gini. \n\nCuss order sekarang sebelum kehabisan! Klik link di bio ya etam! 🚀\n\n#UMKMSamarinda #LokalLensAI #SamarindaHits`,
        `Etam jangan sampai ketinggalan! 🌟\n\n${productName} hadir buat nemenin hari-hari kamu. ${productDesc}\n\nKualitas premium, harga UMKM. Cuma Rp ${Math.floor(basePrice * (1 + margin/100) / 100) * 100 - 100} aja!\n\nLangsung DM ya kalo mau tanya-tanya. Stok terbatas! 📍\n\n#ProdukLokal #SamarindaKuliner #BeliLokal`,
      ];
      setGeneratedContent(captions[Math.floor(Math.random() * captions.length)]);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const finalPrice = Math.floor(basePrice * (1 + margin/100) / 100) * 100 - 100;

  return (
    <div className="space-y-8 pb-12">
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
        {/* Left: Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-brand-50">
               <CardTitle className="text-lg font-bold">Detail Produk</CardTitle>
               <CardDescription>Berikan informasi singkat tentang produk Anda.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Nama Produk</label>
                <Input 
                  placeholder="Contoh: Amplas Mahakam Gurih" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Deskripsi / Keunggulan</label>
                <Textarea 
                  placeholder="Sebutkan apa yang membuat produk ini spesial..." 
                  className="rounded-xl border-brand-100 min-h-[120px]"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                />
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
                    <span className="text-xs font-bold text-brand-600">Rp {basePrice.toLocaleString()}</span>
                  </div>
                  <Input 
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                    className="rounded-xl border-brand-100"
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

              <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold text-brand-900/40 uppercase tracking-widest mb-1">Rekomendasi Harga Psikologis</p>
                    <h3 className="text-3xl font-black text-brand-600">Rp {finalPrice.toLocaleString()}</h3>
                 </div>
                 <div className="text-right">
                    <Badge className="bg-green-100 text-green-600 border-green-200 mb-1">Potensi Profit: Rp {(finalPrice - basePrice).toLocaleString()}</Badge>
                    <p className="text-[10px] text-brand-900/40 italic">*Menggunakan strategi pricing 99-ending</p>
                 </div>
              </div>

              <Button 
                onClick={generateCaption} 
                disabled={isGenerating || !productName}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-2xl py-7 text-lg font-bold shadow-xl shadow-brand-600/20 group"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
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

        {/* Right: Output Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden min-h-[400px] flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b border-brand-50 flex flex-row items-center justify-between">
               <div>
                 <CardTitle className="text-lg font-bold text-brand-950">Hasil AI</CardTitle>
                 <CardDescription>Gunakan ini di media sosial Anda.</CardDescription>
               </div>
               {generatedContent && (
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setGeneratedContent(null)}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                 </div>
               )}
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col">
              <AnimatePresence mode="wait">
                {generatedContent ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 flex-grow flex flex-col"
                  >
                    <div className="bg-slate-50 rounded-2xl p-6 flex-grow border border-slate-100 text-brand-950 font-medium whitespace-pre-wrap leading-relaxed relative group">
                       {generatedContent}
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge className="bg-brand-600 text-white border-none">AI GENERATED</Badge>
                       </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
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
                      <Button className="rounded-xl py-6 bg-brand-950 text-white font-bold hover:bg-brand-900">
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

          {/* Social Preview */}
          <div className="bg-brand-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl" />
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-bold">L</div>
                <div>
                   <p className="text-sm font-bold">Pratinjau Postingan</p>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Instagram Style</p>
                </div>
             </div>
             <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4">
                <Sparkles className="w-12 h-12 text-white/10" />
             </div>
             <div className="space-y-2">
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-[80%] bg-white/10 rounded-full" />
                <div className="h-2 w-[40%] bg-white/10 rounded-full" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
