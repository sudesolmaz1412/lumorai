"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, Trash2, Loader2, Save, TrendingUp, 
  Briefcase, Laptop, PieChart, ShoppingBag, Layers,
  Cpu, Sparkles, Activity, ArrowUpRight, ChevronRight
} from "lucide-react";
import { supabase } from "../../lib/supabase";


interface Income {
  id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
}

const catStyles: Record<string, { icon: any, color: string, bg: string }> = {
  "Maaş": { icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  "Freelance": { icon: Laptop, color: "text-blue-400", bg: "bg-blue-400/10" },
  "Yatırım": { icon: PieChart, color: "text-[#C99A3D]", bg: "bg-[#C99A3D]/10" },
  "Satış": { icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-400/10" },
  "Diğer": { icon: Layers, color: "text-slate-400", bg: "bg-slate-400/10" },
};

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newIncome, setNewIncome] = useState({ title: "", amount: "", category: "Maaş" });

  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setIncomes(data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncome.amount) return;
    setIsAdding(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const finalTitle = newIncome.title.trim() === "" ? newIncome.category.toUpperCase() : newIncome.title.toUpperCase();
    const { error } = await supabase.from('incomes').insert([{
      user_id: session.user.id,
      title: finalTitle,
      amount: parseFloat(newIncome.amount),
      category: newIncome.category 
    }]);
    if (!error) {
      setNewIncome({ title: "", amount: "", category: "Maaş" });
      fetchData(); 
    }
    setIsAdding(false);
  };

  const deleteIncome = async (id: string) => {
    if(!confirm("Bu kaydı silmek istediğine emin misin?")) return;
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (!error) fetchData();
  };

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const filteredIncomes = incomes.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <div className="w-8 h-8 border-2 border-[#C99A3D]/20 border-t-[#C99A3D] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-400 font-sans overflow-x-hidden">
     
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header - Compact */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-[#C99A3D] rounded-full shadow-[0_0_8px_#C99A3D]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Finansal Pusula</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              PORTFÖY<span className="text-[#C99A3D]">LERİM</span>
            </h1>
          </div>
          
          <div className="bg-[#0F172A]/60 border border-white/5 p-5 rounded-3xl backdrop-blur-xl min-w-[220px]">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Varlık Toplamı</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-black text-white tracking-tighter">₺{totalIncome.toLocaleString('tr-TR')}</span>
              <span className="text-emerald-400 text-[10px] font-bold">+11.15%</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 relative z-10">
          {/* Giriş Formu - Daha Kibar */}
          <div className="lg:col-span-5 bg-[#0F172A]/40 border border-white/5 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6 flex items-center gap-2">
              <Plus size={14} /> Yeni Varlık Girişi
            </h3>
            
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-600 uppercase ml-1">Kategori</label>
                  <select value={newIncome.category} onChange={(e) => setNewIncome({...newIncome, category: e.target.value})} 
                    className="w-full bg-[#020617] border border-white/5 rounded-xl py-3 px-4 text-[11px] font-bold text-[#C99A3D] outline-none focus:border-[#C99A3D]/30 transition-all cursor-pointer">
                    {Object.keys(catStyles).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-600 uppercase ml-1">Açıklama</label>
                  <input type="text" placeholder="Tanım..." value={newIncome.title} onChange={(e) => setNewIncome({...newIncome, title: e.target.value})} 
                    className="w-full bg-[#020617] border border-white/5 rounded-xl py-3 px-4 text-[11px] font-bold text-white outline-none focus:border-blue-500/30 placeholder:text-slate-800" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-600 uppercase ml-1">Tutar (₺)</label>
                <div className="flex gap-2">
                  <input type="number" required step="0.01" placeholder="0.00" value={newIncome.amount} onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})} 
                    className="flex-1 bg-[#020617] border border-white/5 rounded-xl py-4 px-6 text-2xl font-mono font-black text-emerald-400 outline-none focus:border-emerald-500/30" />
                  <button disabled={isAdding} className="w-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-900/20">
                    {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* AI Analiz & Grafik - Kompakt ve Mobil Uyumlu */}
          <div className="lg:col-span-7 bg-[#0F172A]/40 border border-[#C99A3D]/20 p-6 md:p-8 rounded-[2.5rem] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2 text-[#C99A3D]">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Lumora AI</span>
              </div>
              <div className="flex gap-1">
                {['1D', '1W', '1M'].map(t => (
                  <span key={t} className={`text-[8px] font-bold px-2 py-1 rounded-md border ${t === '1D' ? 'bg-[#C99A3D] border-[#C99A3D] text-black' : 'border-white/5 text-slate-600'}`}>{t}</span>
                ))}
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <p className="text-sm md:text-base text-white leading-snug font-bold italic">
                "{totalIncome > 0 ? "Büyüme ivmesi %11.15 pozitif yönde." : "Veri girişi bekleniyor."}"
              </p>
            </div>

            {/* Arka Plan Grafik */}
            <div className="mt-auto h-24 w-full opacity-40">
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,80 Q50,75 100,50 T200,60 T300,20 T400,40 L400,100 L0,100 Z" fill="#C99A3D" fillOpacity="0.2" />
                <path d="M0,80 Q50,75 100,50 T200,60 T300,20 T400,40" fill="none" stroke="#C99A3D" strokeWidth="2" />
                {/* Random Bars */}
                {[...Array(10)].map((_, i) => (
                  <rect key={i} x={i * 40} y={80 - Math.random()*30} width="10" height="20" rx="2" fill="white" opacity="0.1" />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Liste - Mobil Uyumlu Kart Yapısı */}
        <div className="bg-[#0F172A]/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
               <Activity size={14} /> Kayıtlar
             </div>
             <div className="flex items-center gap-3 bg-[#020617] px-4 py-2 rounded-xl border border-white/5 w-full sm:w-64">
                <Search size={14} className="text-slate-600" />
                <input type="text" placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[11px] font-bold text-white placeholder:text-slate-800 w-full" />
             </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {filteredIncomes.map((income) => {
              const Style = catStyles[income.category] || catStyles["Diğer"];
              return (
                <div key={income.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${Style.bg} ${Style.color} rounded-xl flex items-center justify-center`}>
                      <Style.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-wider leading-none mb-1">{income.category}</h4>
                      <p className="text-[10px] font-bold text-slate-600">{income.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-base font-mono font-black text-white block leading-none">₺{income.amount.toLocaleString('tr-TR')}</span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">İşlendi</span>
                    </div>
                    <button onClick={() => deleteIncome(income.id)} className="p-2 text-slate-700 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}