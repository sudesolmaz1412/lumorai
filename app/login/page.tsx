"use client";

import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Landmark, Star, ChevronLeft, ChevronRight, Bell, Wallet, PieChart, Menu, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import AuthModal from "../components/AuthModal";

export default function LumoraFinal() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeSide, setActiveSide] = useState('right');

  const theme = {
    navy: '#1E293B',
    gold: '#C99A3D',
    blue: '#2563EB',
    brandIndigo: '#5D5FEF',
    vibrant: 'linear-gradient(135deg, #1E293B 0%, #2563EB 100%)',
    white: '#F8FAFC'
  };

  const allTestimonials = [
    { name: 'Selim Aksoy', color: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', textColor: 'white', comment: "Birkaç yıldır Lumora kullanıyorum. Mobil uygulama finans yönetimimi inanılmaz kolaylaştırdı. Rotamı artık daha net görüyorum.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    { name: 'Merve Aydın', color: 'white', textColor: '#1E293B', comment: "Arayüzü çok sade ve şık. Tüm harcamalarımı tek bir yerden takip edebiliyorum, tam istediğim gibi bir pusula.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { name: 'Caner Özkan', color: 'white', textColor: '#1E293B', comment: "Güvenlik benim için öncelikliydi, Lumora bu konuda tüm beklentilerimi karşıladı. Analizler gerçekten çok başarılı.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    { name: 'Ebru Yılmaz', color: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', textColor: 'white', comment: "E-ticaret danışmanlığım için finansal verileri Lumora ile takip etmek iş yükümü yarı yarıya azalttı. Kesinlikle profesyonel.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" },
    { name: 'Deniz Kaya', color: 'white', textColor: '#1E293B', comment: "Sade tasarımı ve hızlı işlem kapasitesiyle favori finans uygulamam oldu. Premium hissini her ekranda alıyorsunuz.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" },
    { name: 'Zeynep Demir', color: 'white', textColor: '#1E293B', comment: "Kredi kartı ekstrelerimi analiz etme özelliği sayesinde gereksiz aboneliklerimi fark ettim. Çok teşekkürler Lumora Fi!", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop" }
  ];

  const currentTestimonials = allTestimonials.slice(testimonialIndex, testimonialIndex + 3);

  const nextTestimonials = () => {
    setActiveSide('right');
    setTestimonialIndex((prev) => (prev + 3 >= allTestimonials.length ? 0 : prev + 3));
  };

  const prevTestimonials = () => {
    setActiveSide('left');
    setTestimonialIndex((prev) => (prev - 3 < 0 ? 3 : prev - 3));
  };

  return (
    <div style={{ backgroundColor: theme.white, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: theme.navy, margin: 0, padding: 0, overflowX: 'hidden' }}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; scroll-behavior: smooth; }
        * { box-sizing: border-box; }
      `}</style>

      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 8%', position: 'absolute', width: '100%', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke={theme.gold} strokeWidth="5" />
              <path d="M50 20 L62 50 L50 80 L38 50 Z" fill="white" />
              <circle cx="50" cy="50" r="4" fill={theme.gold} />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '22px', letterSpacing: '2px' }}>LUMORA</span>
            <span style={{ color: theme.gold, fontWeight: 800, fontSize: '14px', letterSpacing: '4px' }}>Fİ</span>
          </div>
        </div>

        <button onClick={() => setIsAuthOpen(true)} style={{ backgroundColor: theme.gold, color: theme.navy, border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(201, 154, 61, 0.3)' }}>
          GİRİŞ YAP
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" style={{ padding: '160px 8% 100px 8%', background: theme.vibrant, color: 'white', position: 'relative' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
          
          <div style={{ flex: '1.2', minWidth: '320px' }} className="hero-text">
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1, marginBottom: '24px' }}>
              Finansal Geleceğine <br /> 
              <span style={{ color: theme.gold, textShadow: '0 0 20px rgba(201,154,61,0.2)' }}>Yön Ver.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '40px', maxWidth: '580px', lineHeight: 1.6 }}>
              Lumora Fi, yapay zeka destekli analizleri ve premium arayüzü ile harcamalarınızı asistanınız gibi yönetir. Pusulanız hep kazancı göstersin.
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button onClick={() => setIsAuthOpen(true)} style={{ backgroundColor: 'white', color: theme.navy, border: 'none', padding: '20px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                Hemen Keşfet
              </button>
            </div>
          </div>
          
          <div style={{ flex: '1', position: 'relative', display: 'flex', justifyContent: 'center', perspective: '1500px' }} className="hero-visual">
            <div className="phone-container" style={{ 
              width: '320px', height: '640px', background: '#0F172A', borderRadius: '50px', border: '12px solid #334155', 
              position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.6)', transform: 'rotateY(-10deg) rotateX(5deg)', overflow: 'hidden'
            }}>
                <div style={{ height: '100%', width: '100%', background: '#F1F5F9', padding: '40px 18px', color: theme.navy, overflowY: 'auto' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Hoş geldin,</div>
                      <div style={{ fontWeight: 900, fontSize: '20px' }}>Merhaba, Deniz!</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                       <Bell size={20} color={theme.blue} />
                    </div>
                  </div>

                  <div style={{ background: theme.vibrant, borderRadius: '24px', padding: '20px', color: 'white', marginBottom: '20px', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)' }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>Toplam Bakiye</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '15px' }}>₺42.550,00</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowUpRight size={14} color="#4ADE80" />
                        <span style={{ fontSize: '11px', fontWeight: 700 }}>₺12.4k</span>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowDownLeft size={14} color="#F87171" />
                        <span style={{ fontSize: '11px', fontWeight: 700 }}>₺8.2k</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '24px', padding: '15px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px' }}>Harcama Dağılımı</span>
                      <PieChart size={16} color={theme.gold} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <svg width="70" height="70" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke={theme.blue} strokeWidth="4" strokeDasharray="60 100" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke={theme.gold} strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-60" strokeLinecap="round" />
                       </svg>
                       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: '#64748B' }}>Market</span>
                            <span style={{ fontWeight: 700 }}>%60</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: '#F1F5F9', borderRadius: '2px' }}>
                            <div style={{ width: '60%', height: '100%', background: theme.blue, borderRadius: '2px' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: '#64748B' }}>Eğitim</span>
                            <span style={{ fontWeight: 700 }}>%30</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: '#F1F5F9', borderRadius: '2px' }}>
                            <div style={{ width: '30%', height: '100%', background: theme.gold, borderRadius: '2px' }} />
                          </div>
                       </div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>Son Harcamalar</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { label: 'Netflix', price: '-₺159', date: 'Bugün', icon: '🍿' },
                      { label: 'Starbucks', price: '-₺85', date: 'Dün', icon: '☕' },
                      { label: 'Hepsiburada', price: '-₺1.250', date: '12 May', icon: '📦' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '18px' }}>{item.icon}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px' }}>{item.label}</div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>{item.date}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: theme.navy }}>{item.price}</div>
                      </div>
                    ))}
                  </div>

                </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 8%', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900 }}>Profesyonel Çözümler</h2>
          <div style={{ width: '60px', height: '4px', background: theme.gold, margin: '20px auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { icon: <Landmark size={35} />, title: 'Varlık Yönetimi', desc: 'Tüm banka ve yatırım hesaplarınızı tek bir güvenli panelden izleyin.' },
            { icon: <ShieldCheck size={35} />, title: 'Üstün Güvenlik', desc: 'Verileriniz banka seviyesinde şifreleme ve 2FA ile her an koruma altında.' },
            { icon: <TrendingUp size={35} />, title: 'Akıllı Analiz', desc: 'Yapay zeka, harcama alışkanlıklarınızı öğrenerek size tasarruf rotaları çizer.' }
          ].map((f, i) => (
            <div key={i} style={{ padding: '50px 40px', background: 'white', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9', transition: 'transform 0.3s ease' }}>
              <div style={{ color: theme.blue, marginBottom: '25px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '15px' }}>{f.title}</h3>
              <p style={{ color: '#64748B', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 8%', background: '#F1F5F9' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Kullanıcı Deneyimleri</h2>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={prevTestimonials} style={{ width: '50px', height: '50px', borderRadius: '15px', background: activeSide === 'left' ? theme.blue : 'white', color: activeSide === 'left' ? 'white' : theme.navy, border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><ChevronLeft /></button>
              <button onClick={nextTestimonials} style={{ width: '50px', height: '50px', borderRadius: '15px', background: activeSide === 'right' ? theme.blue : 'white', color: activeSide === 'right' ? 'white' : theme.navy, border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><ChevronRight /></button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {currentTestimonials.map((t, idx) => (
              <div key={idx} style={{ padding: '40px', background: t.color, borderRadius: '32px', color: t.textColor, boxShadow: '0 20px 40px rgba(0,0,0,0.06)', animation: 'slideIn 0.5s ease-out' }}>
                <p style={{ fontSize: '17px', lineHeight: 1.8, marginBottom: '30px', fontWeight: 500 }}>"{t.comment}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={t.img} style={{ width: '55px', height: '55px', borderRadius: '18px', objectFit: 'cover' }} alt={t.name} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '18px' }}>{t.name}</div>
                    <div style={{ display: 'flex', color: theme.gold }}><Star size={14} fill={theme.gold} /> <Star size={14} fill={theme.gold} /> <Star size={14} fill={theme.gold} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 8%', textAlign: 'center', background: theme.navy, color: 'white' }}>
        <p style={{ opacity: 0.5, fontSize: '14px' }}>&copy; 2026 Lumora Fi. Tüm Hakları Saklıdır.</p>
      </footer>

      {isAuthOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ width: '95%', maxWidth: '420px', animation: 'modalIn 0.3s ease-out' }}>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        
        @media (max-width: 992px) {
          .hero-visual { transform: scale(0.8); }
        }

        @media (max-width: 768px) {
          .hero { padding-top: 140px; text-align: center; }
          .hero-text { flex: none; width: 100%; }
          .hero-text p { margin: 0 auto 40px auto; }
          .hero-visual { transform: scale(0.7) translateY(-40px); min-height: 550px; margin-top: 40px; }
        }
      `}</style>
    </div>
  );
}