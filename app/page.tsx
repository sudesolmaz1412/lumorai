"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Globe, Send, Activity, Zap, Loader2, Search, ShoppingCart, Sparkles, Terminal, Trash2, Menu, X 
} from "lucide-react";
import { supabase } from "./lib/supabase";

interface PurchaseRequest {
  id: string;
  item_name: string;
  amount: number;
  target_price?: number; 
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  ai_market_price?: string;
  ai_vendor?: string;
  ai_link?: string;
  created_at: string;
}

const statusConfig = {
  pending: { label: "BEKLEMEDE", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  approved: { label: "ONAYLANDI", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  rejected: { label: "İPTAL EDİLDİ", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
};

export default function PurchasingPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobil menü kontrolü
  
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [targetPrice, setTargetPrice] = useState(""); 
  const [lastScanResult, setLastScanResult] = useState<any>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('purchasing_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Veri hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAiSearch = async () => {
    if (itemName.length < 3) return;
    setIsAiScanning(true);
    setLastScanResult(null);
    try {
      const res = await fetch('/api/market-scan', {
        method: 'POST',
        body: JSON.stringify({ query: itemName }),
      });
      const data = await res.json();
      setLastScanResult(data);
    } catch (err) {
      console.error("AI Tarama hatası");
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload = {
        item_name: itemName,
        amount: parseFloat(amount),
        target_price: targetPrice ? parseFloat(targetPrice) : null,
        category: "Stratejik Kaynak",
        user_id: session?.user?.id,
        status: 'pending',
        ai_market_price: lastScanResult?.price || "---",
        ai_vendor: lastScanResult?.source || "---",
        ai_link: lastScanResult?.link || ""
      };

      const { data, error } = await supabase
        .from('purchasing_requests')
        .insert([payload])
        .select();

      if (error) throw error;
      
      if (data) {
        setRequests(prev => [data[0], ...prev]);
        setItemName(""); setAmount(""); setTargetPrice(""); setLastScanResult(null);
      }
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRequest = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(!confirm("Kayıt silinsin mi?")) return;
    
    const { error } = await supabase.from('purchasing_requests').delete().eq('id', id);
    if (!error) {
      setRequests(requests.filter(r => r.id !== id));
      if (lastScanResult?.id === id) setLastScanResult(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Masaüstü Sidebar */}
      <div className="hidden lg:block">
    
      </div>

      {/* Mobil Sidebar (Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">
              
            </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-x-hidden">
        {/* Mobil Header Bar */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-white border-b border-slate-200">
            <span className="font-black tracking-tighter text-[#2563EB]">LUMORA</span>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg">
                <Menu size={20} />
            </button>
        </div>

        <div className="px-6 lg:px-12 py-8 lg:py-16">
            <header className="mb-12 border-b border-slate-200 pb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-[#2563EB] uppercase tracking-widest font-black">RESOURCE ENGINE v2.0</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-[#1E293B] leading-tight">
                KAYNAK <span className="text-[#2563EB]">TERMİNALİ</span>
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              {/* TALEP FORMU */}
              <div className="lg:col-span-8 bg-white border border-slate-200 p-6 lg:p-12 rounded-[32px] lg:rounded-[40px] shadow-sm">
                <h2 className="text-xl font-black text-[#1E293B] flex items-center gap-3 uppercase tracking-tighter mb-8">
                  <Terminal className="text-[#2563EB]" size={24} /> SATIN ALMA EMRİ
                </h2>

                <form onSubmit={handleCreateRequest} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">ÜRÜN / HİZMET ADI</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        required value={itemName} 
                        onChange={(e) => setItemName(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#1E293B] font-bold focus:ring-2 ring-blue-100 outline-none uppercase transition-all"
                        placeholder="ÖRN: CLOUD SERVER..."
                      />
                      <button 
                        type="button"
                        onClick={handleAiSearch}
                        disabled={isAiScanning || itemName.length < 3}
                        className="px-6 py-4 bg-[#2563EB] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1d4ed8] flex items-center justify-center gap-2 disabled:opacity-30 transition-all"
                      >
                        {isAiScanning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        TARA
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">OPERASYONEL BÜTÇE (₺)</label>
                      <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#1E293B] font-mono font-bold text-lg outline-none focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-emerald-600 uppercase flex items-center gap-2">
                        <Activity size={12} /> HEDEF BİRİM FİYAT
                      </label>
                      <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl px-5 py-4 text-emerald-700 font-mono font-bold text-lg outline-none focus:bg-white transition-all"
                        placeholder="Hedef..."
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting} 
                    className="w-full py-5 bg-[#1E293B] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#2563EB] shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? "İŞLENİYOR..." : "TALEBİ SİSTEME GÖNDER"} <Send size={16} />
                  </button>
                </form>
              </div>

              {/* AI ANALİZ PANELİ */}
              <div className="lg:col-span-4 bg-white border border-slate-200 p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] shadow-sm flex flex-col min-h-[300px]">
                <h4 className="text-[10px] font-mono font-black text-[#1E293B] flex items-center gap-3 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                  <Globe size={16} className="text-[#2563EB]" /> GLOBAL ANALİZ
                </h4>

                <div className="flex-1 flex flex-col justify-center">
                  {lastScanResult ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 relative group transition-all">
                            <p className="text-[10px] font-mono text-slate-400 mb-3 uppercase font-black">EN UYGUN OPSİYON</p>
                            <h3 className="text-3xl font-black text-[#1E293B] tracking-tighter">{lastScanResult.price}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[11px] text-slate-500 uppercase font-black flex items-center gap-2">
                                    <Globe size={12} className="text-[#2563EB]" /> {lastScanResult.source}
                                </span>
                                {lastScanResult.link && (
                                    <a href={lastScanResult.link} target="_blank" className="bg-[#2563EB] p-3 rounded-xl text-white hover:scale-105 transition-transform">
                                        <ShoppingCart size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search size={40} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">VERİ SORGUSU BEKLENİYOR</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABLO - MOBİL UYUMLU KART GÖRÜNÜMÜ */}
            <div className="mt-12 bg-white border border-slate-200 rounded-[32px] lg:rounded-[40px] shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-[10px] font-mono font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-3">
                        <Activity size={16} className="text-[#2563EB]" /> KAYNAK AKIŞI
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 text-center font-mono text-[10px] text-slate-400 uppercase">Yükleniyor...</div>
                    ) : (
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/30 border-b border-slate-100 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">DETAY</th>
                                    <th className="px-8 py-5 text-right">BÜTÇE</th>
                                    <th className="px-8 py-5 text-right">PİYASA</th>
                                    <th className="px-8 py-5 text-center">DURUM</th>
                                    <th className="px-8 py-5 text-right">İŞLEM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-black text-[#1E293B] text-sm tracking-tight uppercase">{req.item_name}</div>
                                            <div className="text-[9px] font-mono text-slate-400 mt-0.5">{new Date(req.created_at).toLocaleDateString('tr-TR')}</div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-mono font-black text-slate-700">₺{req.amount.toLocaleString('tr-TR')}</td>
                                        <td className="px-8 py-5 text-right font-mono font-black text-[#2563EB]">{req.ai_market_price || "---"}</td>
                                        <td className="px-8 py-5">
                                            <div className={`mx-auto w-28 py-1.5 rounded-lg text-[8px] font-black text-center border ${statusConfig[req.status].bg} ${statusConfig[req.status].color} ${statusConfig[req.status].border}`}>
                                                {statusConfig[req.status].label}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={(e) => deleteRequest(e, req.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}