"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Camera, Utensils, Car, Zap, 
  ShoppingBag, Stethoscope, Clapperboard, CreditCard, 
  Sparkles, Loader2, Trash2, Calendar, Plus, UploadCloud
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ExpensesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // -- STATE --
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const [newExpense, setNewExpense] = useState({
    store_name: "",
    amount: "",
    category: "Gıda & Yemek",
    date: new Date().toISOString().split('T')[0],
    payment_method: "Kredi Kartı",
    notes: ""
  });

  const kategoriler = [
    { id: 'food', name: 'Gıda & Yemek', icon: <Utensils size={18} /> },
    { id: 'transport', name: 'Ulaşım', icon: <Car size={18} /> },
    { id: 'bills', name: 'Faturalar', icon: <Zap size={18} /> },
    { id: 'shopping', name: 'Alışveriş', icon: <ShoppingBag size={18} /> },
    { id: 'health', name: 'Sağlık', icon: <Stethoscope size={18} /> },
    { id: 'ent', name: 'Eğlence', icon: <Clapperboard size={18} /> },
  ];

  // DB Çekme Fonksiyonu
  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/"); return; }
    const { data } = await supabase.from('expenses').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (data) setExpenses(data);
    setLoading(false);
  }, [router, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Manuel Ekleme
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.store_name) return;
    setIsAdding(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('expenses').insert([{
      user_id: session?.user.id,
      store_name: newExpense.store_name.toUpperCase(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      payment_method: newExpense.payment_method,
      notes: newExpense.notes
    }]);
    if (!error) {
      setNewExpense({ store_name: "", amount: "", category: "Gıda & Yemek", date: new Date().toISOString().split('T')[0], payment_method: "Kredi Kartı", notes: "" });
      await fetchData();
    }
    setIsAdding(false);
  };

  const deleteExpense = async (id) => {
    if(!confirm("Bu harcamayı silmek istediğine emin misin?")) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchData();
  };

  if (loading) return (
    <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-sm font-bold tracking-[0.4em] uppercase animate-pulse text-[#8B5CF6]">LUMORA</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200">
     
      <main className="flex-1 overflow-y-auto pb-24 p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
                <button onClick={() => router.back()} className="p-4 bg-[#1E293B] border border-white/5 rounded-[22px] text-slate-400 hover:text-white transition-all hover:bg-[#8B5CF6]/10">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">HARCAMALAR</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></div>
                      <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase">AI De-Code Active</p>
                    </div>
                </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 italic">
            
            {/* SOL TARAF: GİRİŞ PANELİ */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* FİŞ YÜKLEME - MOR REVİZE */}
                <div className="bg-[#1E293B] border border-dashed border-[#8B5CF6]/30 rounded-[32px] p-8 text-center group hover:border-[#8B5CF6] transition-all relative overflow-hidden">
                    <div className="bg-[#8B5CF6]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8B5CF6]">
                        <Camera size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">HIZLI FİŞ TARAMA</h3>
                    <p className="text-slate-500 text-[10px] mb-6 font-bold uppercase tracking-widest opacity-60">FOTOĞRAF İLE OTOMATİK VERİ AYIKLAMA</p>
                    
                    <label className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl font-black text-xs cursor-pointer transition-all shadow-[0_10px_30px_rgba(139,92,246,0.2)] w-full max-w-sm active:scale-95">
                        <UploadCloud size={18} />
                        <span>FİŞ YÜKLE</span>
                        <input type="file" className="hidden" accept="image/*" />
                    </label>
                </div>

                <div className="bg-[#1E293B] rounded-[40px] p-6 md:p-10 border border-white/5 space-y-8 shadow-2xl relative">
                    
                    {/* Tutar */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">İşlem Tutarı</label>
                        <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl px-8 py-6 flex items-center focus-within:border-[#8B5CF6] transition-all shadow-inner group">
                            <span className="text-[#C99A3D] text-3xl font-black mr-4 group-focus-within:scale-110 transition-transform">₺</span>
                            <input 
                                type="number" step="0.01" placeholder="0.00"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                className="w-full text-5xl font-black text-white bg-transparent outline-none placeholder:text-slate-800 tracking-tighter"
                            />
                        </div>
                    </div>

                    {/* Görseldeki Kısım - DOKUNULMADI, Sadece Buton Rengi Mor Oldu */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">AÇIKLAMA / MAĞAZA</label>
                        <div className="space-y-3">
                          <input 
                              type="text" placeholder="Örn: Whole Foods Market..."
                              value={newExpense.store_name}
                              onChange={(e) => setNewExpense({...newExpense, store_name: e.target.value})}
                              className="w-full p-5 bg-[#0F172A] border border-white/10 rounded-2xl outline-none focus:border-[#8B5CF6] text-white font-bold"
                          />

                          {/* AI SUGGESTION BOX */}
                          <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="bg-[#8B5CF6] p-2 rounded-lg text-white">
                                  <Sparkles size={16} />
                                </div>
                                <div>
                                  <p className="text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest text-center md:text-left">AI Önerisi</p>
                                  <p className="text-slate-300 text-xs font-bold mt-0.5 text-center md:text-left text-balance italic">Bu harcama "GIDA & YEMEK" kategorisine benziyor.</p>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setNewExpense({...newExpense, category: "Gıda & Yemek"})}
                                className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-lg w-full md:w-auto"
                              >
                                <Zap size={14} fill="currentColor" />
                                ÖNERİYİ UYGULA
                              </button>
                          </div>
                        </div>
                    </div>

                    {/* Kategori Seçimi */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Kategori Onayı</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {kategoriler.map((cat) => (
                                <button
                                    key={cat.id} type="button"
                                    onClick={() => setNewExpense({...newExpense, category: cat.name})}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border transition-all ${
                                        newExpense.category === cat.name 
                                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white shadow-lg' 
                                        : 'border-white/5 bg-[#0F172A] text-slate-600 hover:text-white'
                                    }`}
                                >
                                    <div className={`${newExpense.category === cat.name ? 'text-[#8B5CF6]' : 'text-slate-700'}`}>
                                        {cat.icon}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-tighter">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleAddExpense}
                        disabled={isAdding}
                        className="w-full py-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-[28px] font-black text-xl shadow-2xl shadow-[#8B5CF6]/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter"
                    >
                        {isAdding ? <Loader2 className="animate-spin" /> : "KAYDI TAMAMLA"}
                    </button>
                </div>
            </div>

            {/* SAĞ TARAF: LİSTE PANELİ */}
            <div className="lg:col-span-5">
                <div className="bg-[#1E293B] rounded-[40px] p-6 md:p-8 border border-white/5 h-full shadow-2xl min-h-[500px]">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter italic border-l-4 border-[#C99A3D] pl-4">GEÇMİŞ KAYITLAR</h3>
                      <span className="bg-[#0F172A] px-3 py-1 rounded-full text-[9px] font-black text-[#8B5CF6] border border-[#8B5CF6]/20 uppercase tracking-widest">{expenses.length} Kayıt</span>
                    </div>

                    <div className="space-y-4">
                        {expenses.length === 0 ? (
                            <div className="text-center py-24 italic">
                              <p className="text-slate-700 font-black uppercase tracking-widest text-[10px]">Veri girişi bekleniyor...</p>
                            </div>
                        ) : (
                            expenses.map((exp) => (
                                <div key={exp.id} className="group flex items-center justify-between p-5 bg-[#0F172A] border border-transparent hover:border-[#8B5CF6]/30 rounded-[28px] transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1E293B] flex items-center justify-center text-[#C99A3D] border border-white/5 group-hover:scale-110 transition-transform">
                                            {kategoriler.find(k => k.name === exp.category)?.icon || <Plus size={18}/>}
                                        </div>
                                        <div className="max-w-[120px] md:max-w-none">
                                            <p className="text-white font-black text-sm tracking-tight leading-tight truncate uppercase">{exp.store_name}</p>
                                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.1em] mt-1 italic">{exp.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-white font-black text-lg tracking-tighter">-₺{Number(exp.amount).toLocaleString('tr-TR')}</p>
                                            <p className="text-slate-700 text-[9px] font-bold mt-1 uppercase tracking-tighter">{exp.date}</p>
                                        </div>
                                        <button onClick={() => deleteExpense(exp.id)} className="p-2 text-slate-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}