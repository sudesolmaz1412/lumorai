"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Wallet, LogOut, ShoppingBag, Menu, ChevronLeft, ChevronRight, Sparkles, CreditCard, User } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const menuItems = [
  { name: "Genel Bakış", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Lumora AI", icon: Sparkles, href: "/dashboard/ai-analysis" },
  { name: "Harcamalar", icon: Receipt, href: "/dashboard/expenses" },
  { name: "Satın Alma", icon: ShoppingBag, href: "/procurement" }, 
  { name: "Portföy", icon: Wallet, href: "/dashboard/incomes" }, 
  { name: "Ödemeler", icon: CreditCard, href: "/dashboard/billing" }, 
  { name: "Hesabım", icon: User, href: "/dashboard/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; initial: string } | null>(null);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggingOutRef.current) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !isLoggingOutRef.current) {
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Kullanıcı";
        setUserData({ name: name, initial: name.charAt(0).toUpperCase() });
      }
    };
    fetchUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    isLoggingOutRef.current = true;
    await supabase.auth.signOut();
    window.location.href = "https://lumorafi.com";
  };

  return (
    <>
      <button onClick={() => setIsMobileOpen(true)} className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-[#2563EB] text-white rounded-xl shadow-lg">
        <Menu size={24} />
      </button>

      {isMobileOpen && <div className="fixed inset-0 bg-black/60 z-[70] lg:hidden" onClick={() => setIsMobileOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-[80] bg-[#111827] border-r border-white/5 flex flex-col transition-all duration-300 ${isOpen ? "w-72" : "w-24"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 100 100" className="w-10 h-10"><circle cx="50" cy="50" r="45" fill="none" stroke="#C99A3D" strokeWidth="5" /><path d="M50 20 L62 50 L50 80 L38 50 Z" fill="white" /><circle cx="50" cy="50" r="4" fill="#C99A3D" /></svg>
            {isOpen && <div className="flex flex-col"><span className="text-white font-black italic text-xl">LUMORA</span><span className="text-[#C99A3D] text-[10px] font-bold tracking-[0.4em]">F I</span></div>}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="hidden lg:flex"><ChevronLeft size={16} className={!isOpen ? "rotate-180" : ""} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl ${pathname === item.href ? "bg-[#2563EB] text-white" : "text-slate-400 hover:text-white"}`}>
              <item.icon size={20} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4"><button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3 text-red-500"><LogOut size={20} /> {isOpen && "Oturumu Kapat"}</button></div>
      </aside>
    </>
  );
}