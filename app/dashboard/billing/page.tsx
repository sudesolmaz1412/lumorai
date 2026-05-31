"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, Trash2, CreditCard, ChevronRight, ChevronLeft, 
  Sparkles, Loader2, Zap, X, Download, Clock, Lightbulb, FileText, Wallet
} from 'lucide-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Tipler
type Card = {
  id: string;
  card_holder: string;
  last_four: string;
  card_type: 'Mastercard' | 'Visa' | 'Troy';
  bank_name?: string; // Banka bilgisi eklendi
  color_theme: string;
};

type Bill = {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  card_id?: string;
};

const BillingPage = () => {
  const supabase = createClientComponentClient();
  
  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState<Bill[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [magicValue, setMagicValue] = useState('');

  const [newCard, setNewCard] = useState({
    last_four: '',
    card_type: 'Mastercard' as 'Mastercard' | 'Visa' | 'Troy',
    card_holder: 'OGİ',
    bank_name: '' // Banka inputu için state
  });

  // --- VERİ ÇEKME ---
  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: bills } = await supabase
      .from('billings')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: true });
    
    const { data: userCards } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', session.user.id);

    if (bills) setBillingData(bills);
    if (userCards) setCards(userCards);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- BUTON FONKSİYONLARI ---

  // 1. Üstteki Hızlı Ekleme (Magic Bar) Butonu
  const handleMagicAdd = async () => {
    if (!magicValue.trim()) return;
    setIsProcessing(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    // Basit bir parse: "Kira 5000" yazılırsa tutarı ayırmaya çalışır
    const amountMatch = magicValue.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const title = magicValue.replace(/\d+/g, '').trim() || "Yeni Ödeme";

    const { error } = await supabase.from('billings').insert([{
      user_id: session?.user.id,
      title: title.toUpperCase(),
      amount: amount,
      due_date: new Date().toISOString().split('T')[0], // Bugünün tarihi
      card_id: cards[currentIndex]?.id || null // Seçili kartı bağla
    }]);

    if (!error) {
      setMagicValue('');
      await fetchData();
    }
    setIsProcessing(false);
  };

  // 2. Yeni Kart Ekleme Butonu
  const addCard = async () => {
    if (newCard.last_four.length !== 4) return;
    setIsProcessing(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('cards').insert([{
      user_id: session?.user.id,
      last_four: newCard.last_four,
      card_type: newCard.card_type,
      card_holder: newCard.card_holder,
      bank_name: newCard.bank_name.toUpperCase(),
      color_theme: 'from-[#1E293B] to-[#0F172A]' // Premium koyu tema
    }]);

    if (!error) {
      await fetchData();
      setIsModalOpen(false);
      setNewCard({ ...newCard, last_four: '', bank_name: '' });
    }
    setIsProcessing(false);
  };

  // 3. Kart Silme Butonu
  const deleteCard = async (id: string) => {
    if(!confirm("Bu kartı cüzdanından çıkarmak istediğine emin misin?")) return;
    const { error } = await supabase.from('cards').delete().eq('id', id);
    if (!error) {
      await fetchData();
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    }
  };

  // --- DİNAMİK HESAPLAMALAR ---
  const totalMonthlyBurden = useMemo(() => {
    return billingData.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  }, [billingData]);

  const aiSuggestion = useMemo(() => {
    if (totalMonthlyBurden === 0) return "Henüz ödeme planlanmamış. Harcamalarını girerek bütçe disiplini oluşturmaya başlayabilirsin.";
    if (totalMonthlyBurden > 40000) return "Bu ayki yükün ortalamanın üzerinde. Sabit giderlerini optimize etmeyi düşünebilirsin.";
    return "Ödemelerin şu an dengeli görünüyor. Lumora ile takipte kal!";
  }, [totalMonthlyBurden]);

  if (loading) return (
    <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-sm font-black tracking-[0.4em] uppercase animate-pulse text-[#8B5CF6]">LUMORA</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans italic">
     
      <main className="flex-1 overflow-y-auto pb-24 p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex flex-col gap-2 mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              ÖDEMELER
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></div>
              <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase">Finansal Akış Yönetimi</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SOL KOLON: YAKLAŞAN ÖDEMELER */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#C99A3D] rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#1E293B] border border-white/5 rounded-[22px] p-2 flex items-center shadow-2xl">
                  <div className="pl-4 text-[#C99A3D]"><Sparkles size={24} /></div>
                  <input 
                    type="text" value={magicValue}
                    onChange={(e) => setMagicValue(e.target.value)}
                    placeholder="Örn: 'Kira 15000'"
                    className="w-full bg-transparent border-none focus:ring-0 text-base md:text-lg p-4 placeholder-gray-600 font-bold text-white outline-none"
                  />
                  <button 
                    onClick={handleMagicAdd}
                    disabled={isProcessing}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-xl transition-all font-black uppercase text-xs tracking-tighter active:scale-95"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : "EKLE"}
                  </button>
                </div>
              </div>

              <div className="bg-[#1E293B] rounded-[40px] p-6 md:p-10 border border-white/5 shadow-2xl">
                <h3 className="text-xl font-black mb-10 text-white uppercase tracking-tighter border-l-4 border-[#C99A3D] pl-4 italic">YAKLAŞANLAR</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:w-0.5 before:bg-gradient-to-b before:from-[#8B5CF6] before:to-transparent">
                  {billingData.length === 0 ? (
                    <div className="ml-14 text-slate-600 font-bold uppercase text-[10px] tracking-widest py-4">Veri girişi bekleniyor...</div>
                  ) : (
                    billingData.map((bill) => {
                      const linkedCard = cards.find(c => c.id === bill.card_id);
                      return (
                        <div key={bill.id} className="relative flex items-center justify-between group hover:bg-white/[0.02] p-3 rounded-2xl transition-all">
                          <div className="flex items-center">
                            <div className="absolute left-0 w-10 h-10 bg-[#0F172A] border-2 border-[#8B5CF6] rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                              <Clock size={16} className="text-[#8B5CF6]" />
                            </div>
                            <div className="ml-14">
                              <div className="flex items-center gap-2">
                                <p className="font-black text-white text-lg uppercase tracking-tight">{bill.title}</p>
                                {linkedCard ? (
                                  <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[8px] font-black text-[#8B5CF6] uppercase">
                                    • {linkedCard.bank_name || linkedCard.card_type} ({linkedCard.last_four})
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[8px] font-black text-slate-500 uppercase">Nakit</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{bill.due_date}</p>
                            </div>
                          </div>
                          <p className="text-[#C99A3D] font-black text-xl tracking-tighter">₺{Number(bill.amount).toLocaleString('tr-TR')}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: KARTLAR */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative w-full h-[280px] group">
                {cards.length > 0 ? (
                  <div className="relative w-full h-full">
                    {cards.map((card, index) => {
                      const isActive = index === currentIndex;
                      const offset = index - currentIndex;
                      return (
                        <div
                          key={card.id}
                          className={`absolute w-full h-[240px] transition-all duration-500 rounded-[35px] p-8 border border-white/20 shadow-2xl bg-gradient-to-br ${card.color_theme} ${
                            isActive ? 'z-30 scale-100 opacity-100 translate-y-0 rotate-0' : 
                            Math.abs(offset) === 1 ? 'z-10 scale-90 opacity-40 translate-y-8 rotate-1' : 'opacity-0 scale-75'
                          }`}
                        >
                          <div className="absolute top-0 right-0 p-6 opacity-30 text-white"><Zap size={40} fill="white" /></div>
                          <p className="text-[10px] font-black tracking-[0.3em] text-white/60 mb-14 uppercase italic">{card.bank_name || 'LUMORA PREMIUM'}</p>
                          <p className="text-2xl font-black tracking-[0.2em] text-white italic drop-shadow-md">**** **** **** {card.last_four}</p>
                          <div className="flex justify-between items-end mt-12">
                            <div>
                                <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Kart Sahibi</p>
                                <p className="text-sm font-black text-white uppercase italic">{card.card_holder}</p>
                            </div>
                            <p className="text-[10px] font-black text-white/80 uppercase tracking-tighter">{card.card_type}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full h-[240px] border-2 border-dashed border-white/10 rounded-[35px] flex flex-col items-center justify-center text-slate-700">
                    <CreditCard size={40} className="mb-2 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Cüzdan Boş</p>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4">
                  <button onClick={() => setCurrentIndex(c => Math.max(0, c-1))} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><ChevronLeft size={20}/></button>
                  <button onClick={() => setIsModalOpen(true)} className="p-2 bg-[#8B5CF6] text-white rounded-full shadow-lg shadow-[#8B5CF6]/40 hover:scale-110 transition-all"><Plus size={20}/></button>
                  {cards.length > 0 && <button onClick={() => deleteCard(cards[currentIndex].id)} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>}
                  <button onClick={() => setCurrentIndex(c => Math.min(cards.length-1, c+1))} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><ChevronRight size={20}/></button>
                </div>
              </div>

              {/* ANALİZ PANELİ */}
              <div className="bg-[#1E293B] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Aylık Toplam Yük</span>
                  <span className="text-white font-black text-2xl tracking-tighter italic">
                    ₺{totalMonthlyBurden.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="w-full bg-[#0F172A] h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#C99A3D] h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    style={{ width: `${Math.min((totalMonthlyBurden / 50000) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="p-2 bg-[#8B5CF6]/10 rounded-lg text-[#8B5CF6]">
                    <Lightbulb size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.2em] mb-1">Lumora AI Analizi</p>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed italic">"{aiSuggestion}"</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-[#8B5CF6]/10 border border-white/5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white group">
                  <FileText size={18} className="group-hover:scale-110 transition-transform" /> 
                  PDF Olarak Al
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-sm">
          <div className="bg-[#1E293B] w-full max-w-md rounded-[32px] p-8 border border-white/10 italic">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">YENİ KART TANIMLA</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Banka Adı</label>
                <input 
                  type="text" placeholder="ÖR: GARANTİ, AKBANK..."
                  value={newCard.bank_name}
                  onChange={(e) => setNewCard({...newCard, bank_name: e.target.value})}
                  className="w-full p-4 bg-[#0F172A] border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#8B5CF6] transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Son 4 Hane</label>
                <input 
                  type="text" maxLength={4} placeholder="4242"
                  value={newCard.last_four}
                  onChange={(e) => setNewCard({...newCard, last_four: e.target.value.replace(/\D/g,'')})}
                  className="w-full p-4 bg-[#0F172A] border border-white/5 rounded-2xl text-white font-bold tracking-[0.4em] outline-none focus:border-[#8B5CF6] transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Kart Tipi</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mastercard', 'Visa', 'Troy'].map(t => (
                    <button key={t} onClick={() => setNewCard({...newCard, card_type: t as any})} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${newCard.card_type === t ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'bg-[#0F172A] text-slate-600 border border-white/5'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={addCard} disabled={isProcessing} className="w-full py-5 bg-[#8B5CF6] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#8B5CF6]/20 active:scale-95 transition-all">
                {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : "CÜZDANA EKLE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;