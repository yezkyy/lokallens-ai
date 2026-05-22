import { AuthBranding } from "@/components/auth/AuthBranding";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-white">
      <AuthBranding />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
         {/* Subtle background decoration for the form side */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         
         <div className="w-full relative z-10">
            {/* Mobile Branding (Only visible on small screens) */}
            <div className="lg:hidden text-center mb-12">
               <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               </div>
               <span className="text-2xl font-black tracking-tight text-brand-950">
                 LokalLens<span className="text-brand-600">AI</span>
               </span>
            </div>
            
            <LoginForm />
         </div>
      </div>
    </main>
  );
}
