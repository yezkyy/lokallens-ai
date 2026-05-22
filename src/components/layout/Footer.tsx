import Link from "next/link";
import { Sparkles } from "lucide-react";

// Social Icons as SVGs to replace missing brand icons in Lucide v1
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export function Footer() {
  return (
    <footer className="bg-brand-950 text-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                LokalLens<span className="text-brand-600">AI</span>
              </span>
            </Link>
            <p className="text-brand-200/60 text-sm leading-relaxed mb-6">
              Empowering Indonesian UMKM with professional AI product visuals, marketing copy, and trend analysis.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-brand-100">Produk</h4>
            <ul className="space-y-4 text-sm text-brand-200/60">
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Visualizer AI</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Smart Copywriter</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Kalender Konten</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Analisis Tren</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-brand-100">Perusahaan</h4>
            <ul className="space-y-4 text-sm text-brand-200/60">
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Karir</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Kontak</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Privasi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-brand-100">Dukungan</h4>
            <ul className="space-y-4 text-sm text-brand-200/60">
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Dokumentasi</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-brand-400 transition-colors">Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-200/40">
          <p>© 2026 LokalLens AI. Dibuat untuk UMKM Indonesia.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-brand-400 transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-brand-400 transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
