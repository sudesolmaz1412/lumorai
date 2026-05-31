"use client";

import { useState } from "react";
import { 
  Target, Plus, Compass, Trophy, Flame, 
  Trash2, CheckCircle2, Sparkles, Loader2, Zap
} from "lucide-react";
export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    item_name: "",
    target_amount: "",
    saved_amount: "",
    daily_sacrifice_amount: ""
  });

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      item_name: formData.item_name.toUpperCase(),
      target_amount: Number(formData.target_amount),
      saved_amount: Number(formData.saved_amount) || 0,
      daily_sacrifice_amount: Number(formData.daily_sacrifice_amount) || 0
    };

    setTimeout(() => {
      setGoals([newGoal, ...goals]);
      setFormData({ item_name: "", target_amount: "", saved_amount: "", daily_sacrifice_amount: "" });
      setIsModalOpen(false);
      setIsAdding(false);
    }, 400);
  };

  const deleteGoal = (id: string) => {
    if(!confirm("Bu vizyonu silmek istediğine emin misin?")) return;
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-purple-500/30">
    

      <main className="flex-1 px-8 lg:px-16 py-12 max-w-[1600px] overflow-y-auto">
        
        <header className="mb-20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="relative">
              <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.75] text-white">
                VİZYON <br /> <span className="text-[#A855F7]">HEDEFLERİ</span>
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-[#C99A3D] to-transparent mt-8 opacity-50" />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-12 py-6 bg-[#C99A3D] text-[#020617] rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] hover:brightness-110 transition-all active:scale-95 flex items-center gap-4 shadow-2xl shadow-[#C99A3D]/10 border border-white/10"
            >
              <span className="flex items-center gap-4"><Plus size={20} strokeWidth={3} /> SİSTEME HEDEF EKLE</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {goals.length > 0 ? goals.map((goal) => {
              const remaining = goal.target_amount - goal.saved_amount;
              const progress = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
              const daysLeft = goal.daily_sacrifice_amount > 0 ? Math.ceil(remaining / goal.daily_sacrifice_amount) : null;

              return (
                <div key={goal.id} className="group bg-[#0B1120] border border-slate-800/50 rounded-[45px] p-12 hover:border-[#A855F7]/40 transition-all duration-700 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/5 blur-3xl rounded-full" />
                  
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#C99A3D]">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">VARLIK ANALİZİ</span>
                      </div>
                      <h3 className="text-5xl font-black uppercase tracking-tighter group-hover:text-white transition-colors duration-500 leading-none">{goal.item_name}</h3>
                      <div className="flex items-baseline gap-3 pt-2">
                        <span className="text-4xl font-mono font-bold text-white">₺{goal.saved_amount.toLocaleString('tr-TR')}</span>
                        <span className="text-xl font-mono font-bold text-slate-600">/ ₺{goal.target_amount.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteGoal(goal.id)} className="p-5 bg-slate-900/80 rounded-2xl text-slate-600 hover:text-red-500 hover:bg-red-500/5 transition-all border border-slate-800">
                      <Trash2 size={22} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="flex items-center gap-6 p-8 bg-[#020617] rounded-[30px] border border-slate-800/40">
                      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Flame size={28} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">OPERASYONEL SÜRE</p>
                        <p className="text-lg font-mono font-bold text-white uppercase">{daysLeft ? `${daysLeft} GÜN KALDI` : "STRATEJİ TANIMSIZ"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-8 bg-[#020617] rounded-[30px] border border-slate-800/40">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-emerald-500/60">KALAN İHTİYAÇ</p>
                        <p className="text-lg font-mono font-bold text-white">₺{remaining.toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-500">FİNANSAL OLGUNLUK SEVİYESİ</span>
                      <span className="text-2xl font-mono font-bold text-white">%{progress.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full p-1 border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="py-48 border-2 border-dashed border-slate-800/50 rounded-[45px] flex flex-col items-center justify-center text-slate-700">
                <Target size={80} strokeWidth={1} className="opacity-20 mb-8" />
                <p className="text-[14px] font-black uppercase tracking-[0.6em]">VİZYON ANALİZİ BEKLENİYOR</p>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-10">
            <div className="bg-[#A855F7] p-12 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
              <Trophy size={180} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
              <h4 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">VİZYON <br/> DİSİPLİNİ</h4>
              <p className="text-[12px] font-bold uppercase tracking-wider mb-10 opacity-90 leading-relaxed">
                Büyük hedefler, küçük ama istikrarlı fedakarlıklarla inşa edilir.
              </p>
              <div className="pt-8 border-t border-white/20">
                <p className="text-[10px] font-black uppercase opacity-70 mb-2 tracking-widest">AKTİF ANALİZ SAYISI</p>
                <p className="text-8xl font-mono font-bold tracking-tighter">{goals.length}</p>
              </div>
            </div>

            <div className="bg-[#0B1120] border border-slate-800 p-12 rounded-[50px] shadow-xl">
              <div className="flex items-center gap-4 text-purple-500 mb-8">
                <div className="flex items-center gap-4">
                  <Zap size={24} />
                  <h5 className="text-xl font-black uppercase tracking-tighter text-white">STRATEJİ NOTU</h5>
                </div>
              </div>
              <p className="text-base font-medium text-slate-500 leading-relaxed">
                "Paranızı kontrol etmezseniz, o sizi kontrol etmeye başlar. Planlı kalın."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/98 backdrop-blur-2xl p-6">
          <div className="bg-[#0B1120] w-full max-w-2xl rounded-[60px] border border-white/5 p-16 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-[#C99A3D]" />
            <header className="mb-12 text-center">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-3 text-white">YENİ VİZYON KUR</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">LUMORA DATABASE INPUT</p>
            </header>
            
            <form onSubmit={handleSaveGoal} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-purple-500 ml-6 tracking-widest">VİZYON ADI</label>
                <input 
                  required autoFocus placeholder="ÖR: LUXURY INVEST"
                  className="w-full bg-[#020617] border border-slate-800 rounded-[24px] px-8 py-6 text-white font-black uppercase outline-none focus:border-purple-500 transition-all text-lg placeholder:opacity-10"
                  value={formData.item_name}
                  onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-6 tracking-widest">HEDEF TUTAR (₺)</label>
                  <input 
                    required type="number"
                    className="w-full bg-[#020617] border border-slate-800 rounded-[24px] px-8 py-6 text-white font-mono font-bold outline-none focus:border-[#C99A3D]/40 transition-all"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-6 tracking-widest">MEVCUT (₺)</label>
                  <input 
                    type="number"
                    className="w-full bg-[#020617] border border-slate-800 rounded-[24px] px-8 py-6 text-white font-mono font-bold outline-none focus:border-[#C99A3D]/40 transition-all"
                    value={formData.saved_amount}
                    onChange={(e) => setFormData({...formData, saved_amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-[#C99A3D] ml-6 tracking-widest flex items-center gap-3">
                  <Flame size={16} /> GÜNLÜK TASARRUF PLANI (₺)
                </label>
                <input 
                  type="number"
                  placeholder="GÜNLÜK DİSİPLİN MİKTARI"
                  className="w-full bg-[#020617] border border-[#C99A3D]/20 rounded-[24px] px-8 py-6 text-white font-mono font-bold outline-none focus:border-[#C99A3D] transition-all placeholder:opacity-10"
                  value={formData.daily_sacrifice_amount}
                  onChange={(e) => setFormData({...formData, daily_sacrifice_amount: e.target.value})}
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 border border-slate-800 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-slate-500">İPTAL</button>
                <button type="submit" disabled={isAdding} className="flex-[2] py-6 bg-purple-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-purple-700 transition-all flex items-center justify-center gap-3 shadow-2xl">
                  {isAdding ? <Loader2 className="animate-spin" /> : "VİZYONU AKTİFLEŞTİR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}