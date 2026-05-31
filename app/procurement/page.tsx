"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  TrendingUp, Globe, Send, Activity, Zap, Loader2, Search, 
  ShoppingCart, Sparkles, Trash2, Heart, Bell, Cpu,
  Plus
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../components/Sidebar";

// DB Tipleri aynı kalıyor
interface PurchaseRequest {
  id: string;
  item_name: string;
  amount: number;
  target_price?: number; 
  status: 'pending' | 'approved' | 'rejected';
  ai_market_price?: string;
  ai_vendor?: string;
  ai_link?: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string, color: string, bg: string, border: string }> = {
  pending: { label: "BEKLEMEDE", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  approved: { label: "ALINABİLİR", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]/20" },
  rejected: { label: "ERTELENDİ", color: "text-[#F43F5E]", bg: "bg-[#F43F5E]/10", border: "border-[#F43F5E]/20" },
};

export default function PurchasingPage() {
  const supabase = createClientComponentClient();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [targetPrice, setTargetPrice] = useState(""); 
  const [lastScanResult, setLastScanResult] = useState<any>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('purchasing_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [supabase]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAiSearch = async () => {
    if (itemName.length < 3) return;
    setIsAiScanning(true);
    try {
      const res = await fetch('/api/market-scan', { method: 'POST', body: JSON.stringify({ query: itemName }) });
      const data = await res.json();
      setLastScanResult(data);
    } catch (err) { console.error("AI Tarama hatası"); } finally { setIsAiScanning(false); }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !itemName || !amount) return;
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = {
        item_name: itemName,
        amount: parseFloat(amount),
        target_price: targetPrice ? parseFloat(targetPrice) : null,
        user_id: session?.user?.id,
        status: 'pending',
        ai_market_price: lastScanResult?.price || "---",
        ai_vendor: lastScanResult?.source || "---",
        ai_link: lastScanResult?.link || ""
      };
      const { data, error } = await supabase.from('purchasing_requests').insert([payload]).select();
      if (!error && data) {
        setRequests(prev => [data[0], ...prev]);
        setItemName(""); setAmount(""); setTargetPrice(""); setLastScanResult(null);
      }
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  const deleteRequest = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(!confirm("Bu hedefi silmek istediğine emin misin?")) return;
    const { error } = await supabase.from('purchasing_requests').delete().eq('id', id);
    if (!error) setRequests(requests.filter(r => r.id !== id));
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] gap-6">
      <div className="relative">
        <Zap className="h-12 w-12 text-[#C99A3D] animate-pulse" />
        <div className="absolute inset-0 bg-[#C99A3D] blur-2xl opacity-20 animate-pulse"></div>
      </div>
      <p className="text-[10px] font-mono tracking-[0.5em] text-[#C99A3D]">LUMORA HAZIRLANIYOR...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-[#94A3B8] font-sans overflow-x-hidden">
  

      <main className="flex-1 p-4 md:p-10 lg:p-16 max-w-[1400px] mx-auto w-full">
        <header className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <div className="w-2 h-2 bg-[#C99A3D] rounded-full animate-ping shadow-[0_0_8px_#C99A3D]" />
            <span className="text-[10px] font-mono text-[#C99A3D] uppercase tracking-widest font-black">LUMORA AI ASSISTANT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            SATIN <span className="text-[#C99A3D]">ALMA</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {/* FORM ALANI */}
          <div className="md:col-span-7 bg-[#0F172A]/40 border border-white/5 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-[#C99A3D]/10 rounded-lg"><Plus className="text-[#C99A3D]" size={20}/></div>
               <h2 className="text-xl font-bold text-white tracking-tight uppercase">Plan Oluştur</h2>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase ml-1">Ürün Detayı</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    required value={itemName} 
                    onChange={(e) => setItemName(e.target.value)}
                    className="flex-1 bg-[#020617]/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-[#C99A3D] transition-all outline-none"
                    placeholder="Almak istediğiniz ürün..."
                  />
                  <button 
                    type="button"
                    onClick={handleAiSearch}
                    disabled={isAiScanning || itemName.length < 3}
                    className="bg-[#C99A3D] text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-[#C99A3D]/20"
                  >
                    {isAiScanning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span className="sm:hidden lg:inline font-black">FİYAT BUL</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase ml-1">Bütçen (₺)</label>
                  <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#020617]/50 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-[#10B981] uppercase ml-1 flex items-center gap-1">
                    <Bell size={10} /> Beklenen Fiyat
                  </label>
                  <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full bg-[#020617]/50 border border-[#10B981]/20 rounded-2xl px-5 py-4 text-[#10B981] font-mono outline-none focus:border-[#10B981]"
                    placeholder="İndirim takibi..."
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting} 
                className="w-full py-5 bg-[#2563EB] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? "KAYDEDİLİYOR..." : "LİSTEYE EKLE"} <Send size={16} />
              </button>
            </form>
          </div>

          {/* AI ANALİZ KARTI */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#020617] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden h-full min-h-[250px] flex flex-col justify-center shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Cpu size={100} className="text-[#C99A3D]" />
              </div>

              {lastScanResult ? (
                <div className="relative z-10 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center gap-2 text-[#C99A3D] mb-4">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">En İyi Teklif</span>
                  </div>
                  <h3 className="text-5xl font-black text-white tracking-tighter mb-2">{lastScanResult.price}</h3>
                  <p className="text-sm text-slate-400 flex items-center gap-2 mb-6 font-medium">
                    <ShoppingCart size={14} className="text-[#C99A3D]" /> {lastScanResult.source}
                  </p>
                  {lastScanResult.link && (
                    <a href={lastScanResult.link} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-bold text-white bg-[#2563EB] px-5 py-3 rounded-full hover:brightness-110 transition-all shadow-lg shadow-blue-500/20">
                      ÜRÜNE GİT <Globe size={12} />
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center opacity-40">
                  <div className="relative inline-block mb-4">
                    <Search size={40} className="text-[#C99A3D]" />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-widest leading-relaxed font-bold">
                    Piyasa Taraması İçin<br/>Ürün Detayı Girin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LİSTELEME */}
        <div className="mt-10 bg-[#0F172A]/20 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity size={14} className="text-[#2563EB]" /> Takip Listesi
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-8 py-5">Ürün</th>
                  <th className="px-8 py-5 text-right font-black">Bütçe</th>
                  <th className="px-8 py-5 text-center">Durum</th>
                  <th className="px-8 py-5 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-sm tracking-tight uppercase">{req.item_name}</div>
                      <div className="text-[9px] font-mono text-slate-600 mt-0.5">Piyasa: {req.ai_market_price || '---'}</div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-white">₺{req.amount.toLocaleString('tr-TR')}</td>
                    <td className="px-8 py-6">
                      <div className={`mx-auto px-3 py-1 rounded-full text-[8px] font-black text-center border w-fit ${statusConfig[req.status]?.bg} ${statusConfig[req.status]?.color} ${statusConfig[req.status]?.border}`}>
                        {statusConfig[req.status]?.label}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={(e) => deleteRequest(e, req.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}