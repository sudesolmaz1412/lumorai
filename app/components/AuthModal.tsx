"use client";

import React, { useState } from 'react';
import { Mail, Lock, X, User, Loader2 } from 'lucide-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (isLogin) {
        // 1. ADIM: Giriş Denemesi
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        // 2. ADIM: Kullanıcı var mı kontrolü
        if (data?.user) {
          // Oturumu Next.js tarafında doğrula ve yönlendir
          await router.refresh();
          router.replace('/dashboard');
        }
      } else {
        // KAYIT SİSTEMİ
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: name,
              display_name: name 
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        if (data?.session) {
          await router.refresh();
          router.replace('/dashboard');
        } else {
          alert("Kayıt başarılı! Lütfen e-postanızı onaylayın veya giriş yapın.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      alert(err.message || "Erişim reddedildi. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    navy: '#1E293B',
    gold: '#C99A3D',
    blue: '#2563EB',
    text: '#94A3B8',
    inputBg: '#F8FAFC'
  };

  const inputStyle = {
    width: '100%', 
    padding: '18px 15px 18px 52px', 
    borderRadius: '18px', 
    border: '1px solid #E2E8F0',
    backgroundColor: theme.inputBg, 
    outline: 'none', 
    fontWeight: 600, 
    fontSize: '13px', 
    color: theme.navy
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div style={{
        backgroundColor: 'white', borderRadius: '40px', padding: '45px 40px', width: '100%',
        maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
          <X size={24} />
        </button>

        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', marginBottom: '12px' }}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke={theme.gold} strokeWidth="4" />
              <path d="M50 25 L60 50 L50 75 L40 50 Z" fill={theme.blue} />
              <circle cx="50" cy="50" r="3" fill={theme.gold} />
            </svg>
          </div>
          <div style={{ lineHeight: 1.2 }}>
              <div style={{ color: theme.navy, fontWeight: 900, fontSize: '20px', letterSpacing: '1px' }}>LUMORA</div>
              <div style={{ color: theme.gold, fontWeight: 800, fontSize: '12px', letterSpacing: '4px' }}>FİNANS</div>
          </div>
        </div>

        <h2 style={{ color: theme.navy, fontWeight: 800, fontSize: '16px', marginBottom: '25px', textTransform: 'uppercase' }}>
          {isLogin ? 'SİSTEME ERİŞİM' : 'HESAP OLUŞTUR'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={20} color={theme.text} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" required placeholder="AD SOYAD" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={20} color={theme.text} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="email" required placeholder="E-POSTA" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color={theme.text} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="password" required placeholder="ŞİFRE" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{
            backgroundColor: loading ? '#94A3B8' : theme.navy,
            color: 'white', border: 'none', padding: '18px', borderRadius: '20px', fontWeight: 800, fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'GİRİŞ YAP' : 'ÜYE OL')}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: theme.text, fontSize: '11px', fontWeight: 700, cursor: 'pointer', marginTop: '25px' }}>
          {isLogin ? 'HESABINIZ YOK MU? KAYIT OLUN' : 'ZATEN ÜYE MİSİNİZ? GİRİŞ YAPIN'}
        </button>
      </div>
    </div>
  );
}