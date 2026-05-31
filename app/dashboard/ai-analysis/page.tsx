"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Send, Sparkles, User, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Sen Lumora Fi'nin yapay zeka finansal asistanısın. Adın "Lumora AI".
Görevin: Finansal soruları yanıtlamak, bütçe ve tasarruf önerileri vermek. Türkçe yanıt ver.`;

const SUGGESTIONS = [
  "Aylık bütçe planı nasıl yapmalıyım?",
  "Harcamalarımı nasıl kategorize edeyim?",
  "Acil fon ne kadar olmalı?",
  "Tasarruf etmenin en iyi yolları neler?",
];

export default function AIAnalysisPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Bir hata oluştu.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Bağlantı hatası." }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    // REVİZE: flex-1, h-full, bg- ve overflow ekleyerek kapsayıcıya tam oturmasını sağladım.
    <div className="flex flex-col h-full w-full bg-[#070A13] p-4 sm:p-8 text-slate-200 overflow-hidden">
      
      {/* Üst Başlık */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-blue-500" size={24} />
          <h1 className="text-white font-black text-xl italic tracking-wider">LUMORA AI</h1>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-red-500/70 hover:text-red-500 text-xs font-bold flex items-center gap-2 transition">
            <Trash2 size={14} /> TEMİZLE
          </button>
        )}
      </div>

      {/* Chat İçeriği - Scrollbar eklendi */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center scrollbar-hide">
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="bg-[#111827] border border-white/5 p-4 rounded-xl text-xs text-left hover:border-blue-500/50 transition">
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto w-full">
            {messages.map((msg, i) => (
              <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-blue-600 ml-auto" : "bg-[#111827] border border-white/5"}`}>
                <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Alanı */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="mt-4 max-w-4xl mx-auto w-full bg-[#111827] border border-white/10 rounded-2xl p-2 flex items-center shadow-lg">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="flex-1 bg-transparent p-2 outline-none text-sm text-white placeholder-slate-600" 
          placeholder="Finansal sorularınızı yazın..." 
        />
        <button type="submit" className="bg-blue-600 p-2.5 rounded-xl text-white hover:bg-blue-700 transition"><Send size={16} /></button>
      </form>
    </div>
  );
}