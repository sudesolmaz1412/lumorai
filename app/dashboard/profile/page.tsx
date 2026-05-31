"use client";

import { useState, useEffect } from "react";
// Dosya yapına göre en garantili yol (3 kat yukarı)
import { supabase } from "../../lib/supabase"; 
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Save, 
  ShieldCheck 
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState<"individual" | "corporate">("individual");
  
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    tax_no: "",
  });

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const user = session.user;
          setProfile((prev) => ({ ...prev, email: user.email || "" }));
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setProfile(prev => ({ ...prev, ...data }));
            if (data.account_type) setAccountType(data.account_type);
          }
        }
      } catch (error) {
        console.error("Profil yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Oturum bulunamadı.");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          account_type: accountType,
          company_name: accountType === "corporate" ? profile.company_name : null,
          tax_no: accountType === "corporate" ? profile.tax_no : null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert("Profil başarıyla güncellendi!");
    } catch (error: any) {
      alert("Hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white font-black animate-pulse tracking-widest uppercase italic">
          Lumora Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* BAŞLIK ALANI */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-[#2563EB] decoration-4 underline-offset-8">
          HESAP AYARLARI
        </h1>
        <p className="text-slate-400 text-sm tracking-wide mt-2">
          Lumora profilinizi ve kurumsal detaylarınızı yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* SOL PANEL (MODEL VE AVATAR) */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-white/5 p-6 rounded-3xl space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
              <ShieldCheck size={18} className="text-[#2563EB]" />
              Hesap Modeli
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setAccountType("individual")}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  accountType === "individual" 
                  ? "bg-[#2563EB]/10 border-[#2563EB] text-white" 
                  : "bg-transparent border-white/5 text-slate-500 hover:border-white/10"
                }`}
              >
                <User size={20} />
                <span className="font-bold text-sm">Şahıs Hesabı</span>
              </button>
              <button
                onClick={() => setAccountType("corporate")}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  accountType === "corporate" 
                  ? "bg-[#2563EB]/10 border-[#2563EB] text-white" 
                  : "bg-transparent border-white/5 text-slate-500 hover:border-white/10"
                }`}
              >
                <Building2 size={20} />
                <span className="font-bold text-sm">Şirket Hesabı</span>
              </button>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl text-center space-y-4 shadow-2xl shadow-black/50">
             <div className="w-20 h-20 bg-gradient-to-tr from-[#2563EB] to-[#C99A3D] rounded-full flex items-center justify-center mx-auto p-0.5 shadow-lg shadow-blue-500/10">
                <div className="w-full h-full bg-[#111827] rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-black italic">
                    {profile.full_name?.charAt(0) || "L"}
                  </span>
                </div>
             </div>
             <div>
                <h3 className="text-white font-bold">{profile.full_name || "Kullanıcı"}</h3>
                <p className="text-[#C99A3D] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  Premium Stratejist
                </p>
             </div>
          </div>
        </div>

        {/* SAĞ PANEL (FORM) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl space-y-8 shadow-2xl shadow-black/50">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tam Ad */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Tam Ad Soyad</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2563EB] transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Ad Soyad"
                    className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#2563EB] outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              {/* E-Posta */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">E-Posta</label>
                <div className="relative opacity-40">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Telefon</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2563EB] transition-colors" size={18} />
                  <input 
                    type="tel" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="+90"
                    className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#2563EB] outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Kurumsal Detaylar (Koşullu) */}
            {accountType === "corporate" && (
              <div className="pt-8 border-t border-white/5 space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-[#C99A3D]" />
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest italic">Kurumsal Detaylar</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Firma Ünvanı</label>
                    <input 
                      type="text" 
                      value={profile.company_name || ""}
                      onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                      className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-[#2563EB] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Vergi No / Daire</label>
                    <input 
                      type="text" 
                      value={profile.tax_no || ""}
                      onChange={(e) => setProfile({...profile, tax_no: e.target.value})}
                      className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-[#2563EB] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Kaydet Butonu */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="group flex items-center gap-3 bg-[#2563EB] hover:bg-blue-700 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                {loading ? "GÜNCELLENİYOR..." : "KAYDET VE GÜNCELLE"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}