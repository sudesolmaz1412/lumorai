"use client";

import { useRouter } from "next/navigation";
import { 
  Compass, ArrowRight, ShieldCheck, Globe, Zap, 
  BarChart3, CheckCircle2, Menu, X 
} from "lucide-react";
import { useState } from "react";

export default function MarketingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Compass className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">LUMORA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Çözümler</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">Kurumsal</a>
            <button 
              onClick={() => router.push('/auth')}
              className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
            >
              TERMİNALE GİRİŞ
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
            <Zap size={14} className="text-blue-600 fill-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Yapay Zeka Destekli Finans</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]">
            FİNANSIN <span className="text-blue-600">YENİ NESİL</span> <br /> MİMARİSİ.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed">
            Lumora, bireysel ve ticari operasyonlarınızı AI gücüyle optimize eden, 
            piyasa verilerini anlık analiz eden küresel bir finans pusulasıdır.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/auth')}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              Hemen Başla <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
              Sistemi Tanı
            </button>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR (QNB & OTHERS) --- */}
      <section className="py-10 border-y border-slate-50 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">GÜVEN VE ENTEGRASYON</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
             {/* Buraya QNB, Supabase gibi logolar gelecek */}
             <span className="text-2xl font-black">QNB FINANSBANK</span>
             <span className="text-2xl font-black">SUPABASE</span>
             <span className="text-2xl font-black">STRIPE</span>
             <span className="text-2xl font-black">AWS</span>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <BarChart3 className="text-blue-600" />,
                title: "Akıllı Analiz",
                desc: "Harcamalarınızı kategorize eder, tasarruf noktalarınızı AI ile belirler."
              },
              {
                icon: <Globe className="text-blue-600" />,
                title: "Global Tarama",
                desc: "Dünya genelindeki pazar fiyatlarını sizin yerinize saniyeler içinde sorgular."
              },
              {
                icon: <ShieldCheck className="text-blue-600" />,
                title: "Varlık Koruması",
                desc: "Finansal verilerinizi askeri düzeyde şifreleme ile güvende tutar."
              }
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-white border border-slate-100 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
                <div className="mb-6">{f.icon}</div>
                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 text-white">
            <Compass size={200} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            GELECEĞİN <span className="text-blue-500">FİNANSAL</span> <br /> DÜNYASINA KATILIN.
          </h2>
          <button 
            onClick={() => router.push('/auth')}
            className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
          >
            Terminali Şimdi Aç
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <Compass className="text-white" size={14} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">LUMORA © 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#">Gizlilik</a>
            <a href="#">Şartlar</a>
            <a href="#">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}