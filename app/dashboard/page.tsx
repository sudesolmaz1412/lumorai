  "use client";

  import { useEffect, useState, useCallback } from "react";
  import { useRouter } from "next/navigation";
  import {
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Bell,
    MoreHorizontal,
  } from "lucide-react";

  import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

  export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [userName, setUserName] = useState("...");
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [categoryStats, setCategoryStats] = useState<any[]>([]);
    const [stats, setStats] = useState({ income: 0, expense: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Middleware olduğu için normalde buraya gelmemeli ama güvenlik katmanı olarak kalsın
        if (!session) {
          router.replace("/");
          return;
        }

        const userId = session.user.id;

        // Verileri paralel çekerek hızı artırıyoruz
        const [profileRes, incomesRes, expensesRes] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("id", userId).single(),
          supabase.from("incomes").select("amount").eq("user_id", userId),
          supabase.from("expenses").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        ]);

        // İsim ayarı (Sude için özel selamlamayı hatırla)
        setUserName(profileRes.data?.full_name?.split(" ")[0] || "Stratejist");

        const totalIncome = incomesRes.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
        const expenses = expensesRes.data || [];
        const totalExpense = expenses.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;

        setStats({ income: totalIncome, expense: totalExpense });
        setRecentTransactions(expenses.slice(0, 5));

        if (expenses.length > 0) {
          const catMap = expenses.reduce((acc: any, curr: any) => {
            acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
            return acc;
          }, {});

          const processedCats = Object.keys(catMap).map((cat) => ({
            name: cat,
            total: catMap[cat],
            percentage: totalExpense > 0 ? (catMap[cat] / totalExpense) * 100 : 0,
          })).sort((a, b) => b.total - a.total).slice(0, 4);

          setCategoryStats(processedCats);
        }
      } catch (error) {
        console.error("Lumora Terminal Veri Hatası:", error);
      } finally {
        setLoading(false);
      }
    }, [router, supabase]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // Premium Yükleme Ekranı
    if (loading) {
      return (
        <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white font-sans">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-sm font-bold tracking-[0.4em] uppercase animate-pulse text-blue-400">
            Lumora Terminal
          </h2>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 lg:p-8 font-sans">
        <div className="max-w-[1600px] mx-auto flex gap-8 h-full">
          
        
          <main className="flex-1 space-y-8 overflow-y-auto pr-2">
            
            {/* Header */}
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight">Hoş Geldin, {userName} 👋</h1>
                <p className="text-slate-500 font-medium italic">Finansal rotan bugün oldukça istikrarlı.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input placeholder="Hızlı arama..." className="bg-[#1E293B] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all" />
                </div>
                <button className="p-3 bg-[#1E293B] border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-[#2D3748] transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1E293B]"></span>
                </button>
              </div>
            </header>

            {/* Kartlar */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1E293B] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500"><ArrowDownRight size={24} /></div>
                  <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest">+100%</span>
                </div>
                <p className="text-slate-400 font-medium mb-1">Toplam Gelir</p>
                <h2 className="text-4xl font-bold text-white">₺{stats.income.toLocaleString("tr-TR")}</h2>
              </div>

              <div className="bg-[#1E293B] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[80px]"></div>
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-red-500/10 rounded-2xl text-red-500"><ArrowUpRight size={24} /></div>
                  <span className="text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest">-1.29%</span>
                </div>
                <p className="text-slate-400 font-medium mb-1">Toplam Gider</p>
                <h2 className="text-4xl font-bold text-white">₺{stats.expense.toLocaleString("tr-TR")}</h2>
              </div>
            </section>

            {/* Analiz ve Kategoriler */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-[#1E293B] rounded-[40px] p-8 border border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-bold text-white px-2 border-l-4 border-blue-500 uppercase tracking-tighter">Finansal Akış</h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Gelir</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-400"></span> Gider</div>
                  </div>
                </div>
                <div className="h-[280px] flex items-end gap-3 px-2">
                  {[40, 60, 35, 85, 50, 75, 45, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex items-end gap-1.5 h-full group/bar">
                      <div className="w-full bg-blue-600/60 rounded-t-lg transition-all group-hover/bar:bg-blue-500" style={{ height: `${h}%` }}></div>
                      <div className="w-full bg-cyan-400/60 rounded-t-lg transition-all group-hover/bar:bg-cyan-400" style={{ height: `${h - 20}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1E293B] rounded-[40px] p-8 border border-white/5 flex flex-col items-center shadow-xl">
                <div className="w-full flex justify-between mb-8 items-center">
                  <h3 className="text-xl font-bold text-white">Dağılım</h3>
                  <MoreHorizontal className="text-slate-500 cursor-pointer" />
                </div>
                <div className="relative w-48 h-48 mb-8">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2D3748" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="75, 100" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">75%</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Harcanan</span>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  {categoryStats.map((cat) => (
                    <div key={cat.name} className="flex justify-between items-center px-2">
                      <span className="text-sm font-medium text-slate-400 capitalize">{cat.name}</span>
                      <span className="text-sm font-bold text-white">%{cat.percentage.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* İşlemler */}
            <section className="bg-[#1E293B] rounded-[40px] p-8 border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white">Son İşlemler</h3>
                <button className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest border border-blue-500/20 px-4 py-2 rounded-xl">Tümünü İncele</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="group flex items-center justify-between p-5 bg-[#141B44] border border-transparent hover:border-blue-500/20 rounded-3xl transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#1E293B] flex items-center justify-center font-bold text-blue-500 border border-white/5">
                        {tx.store_name?.charAt(0).toUpperCase() || "L"}
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg leading-tight">{tx.store_name}</p>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{tx.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-lg">-₺{Number(tx.amount).toLocaleString("tr-TR")}</p>
                      <p className="text-slate-500 text-xs font-medium mt-1 opacity-60">
                        {new Date(tx.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }