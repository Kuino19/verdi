"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gavel, 
  Terminal, 
  Scale, 
  Clock, 
  MessageSquare, 
  Send, 
  Loader2,
  Trophy,
  History,
  AlertCircle
} from "lucide-react";
import { useUserContext } from "@/components/app/UserContext";
import { addPoints } from "@/lib/firebase/db";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MootCourtPage() {
  const { uid, userName } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [xpAwarded, setXpAwarded] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Start a new session
  const startSession = async (scenario: string) => {
    setScenarioName(scenario);
    setMessages([{ role: "assistant", content: "👨‍⚖️ THE COURT CLERK: All-rise! The High Court of Nigerian Legal Logic is now in session. The Honorable AI Justice presiding. Counsel, you may approach the bench and state your case." }]);
    setIsGameOver(false);
    setXpAwarded(0);
    setIsThinking(true);

    try {
      const res = await fetch("/api/moot-court", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: `Start trial for case: ${scenario}` }],
          scenario 
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !input.trim() || isThinking || isGameOver) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/moot-court", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          scenario: scenarioName 
        })
      });
      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.content };
      setMessages(prev => [...prev, aiMsg]);

      // Check for Verdict
      if (data.content.includes("Verdi Verdict")) {
        setIsGameOver(true);
        // Extract XP from text (e.g. "XP Awarded: 80")
        const xpMatch = data.content.match(/XP Awarded:\s*(\d+)/i);
        if (xpMatch) {
          const earned = parseInt(xpMatch[1]);
          setXpAwarded(earned);
          await addPoints(uid, earned);
        } else {
          setXpAwarded(20); // Default participation
          await addPoints(uid, 20);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-8 relative">
      
      {/* Header Info */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-[24px] bg-primary/15 flex items-center justify-center shadow-lg shadow-primary/10">
              <Gavel className="w-8 h-8 text-primary" />
           </div>
           <div>
              <h1 className="text-4xl font-bold italic mb-1">Moot <span className="text-gradient">Court</span></h1>
              <p className="text-muted text-sm italic">Supreme Court of Nigerian Legal Logic Simulator</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {scenarioName && (
             <div className="px-5 py-3 glass rounded-2xl border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Active Session: {scenarioName}
             </div>
           )}
           <button 
             onClick={() => { setScenarioName(""); setMessages([]); }}
             className="px-5 py-3 glass rounded-2xl text-[10px] uppercase font-black tracking-widest text-muted hover:text-foreground transition-all"
           >
              Reset Tribunal
           </button>
        </div>
      </header>

      {/* Main Board */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Chat Area */}
        <div className="flex-1 flex flex-col glass rounded-[48px] border-white/5 overflow-hidden">
           
           {!scenarioName ? (
             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4"
                >
                   <Scale className="w-16 h-16 text-primary mx-auto opacity-30" />
                   <h2 className="text-3xl font-black italic">Select your Case Scenario</h2>
                   <p className="text-muted max-w-sm mx-auto italic leading-relaxed">Choose a legal grounds category to begin your oral argument before the AI Justice.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-6">
                   {[
                     { name: "Election Petition", icon: Trophy, desc: "Technical hurdles in valid voting records." },
                     { name: "Fundamental Human Rights", icon: AlertCircle, desc: "Unlawful detention and constitutional breach." },
                     { name: "Land Dispute", icon: Scale, desc: "Conflicting C of O and Customary usage." },
                     { name: "Maritime Tort", icon: Scale, desc: "Ship owner liability and coastal agency." }
                   ].map((s, i) => (
                     <button 
                       key={i}
                       onClick={() => startSession(s.name)}
                       className="p-8 glass rounded-[36px] border-white/5 hover:border-primary/30 text-left transition-all hover:bg-primary/5 group"
                     >
                        <s.icon className="w-6 h-6 mb-4 text-muted group-hover:text-primary transition-colors" />
                        <p className="font-bold mb-2 italic text-lg leading-tight">{s.name}</p>
                        <p className="text-[10px] text-muted italic leading-relaxed">{s.desc}</p>
                     </button>
                   ))}
                </div>
             </div>
           ) : (
             <>
               <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`max-w-[85%] p-8 rounded-[36px] italic leading-relaxed text-sm md:text-base border shadow-2xl relative ${
                         m.role === 'user' 
                          ? 'bg-primary text-background border-primary' 
                          : m.content.toUpperCase().includes("VERDI VERDICT") 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-50 shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'
                            : 'glass border-white/10 text-foreground'
                       }`}>
                          {m.content.toUpperCase().includes("VERDI VERDICT") && (
                            <div className="flex flex-col items-center mb-6 pt-4 border-b border-amber-500/20 pb-6">
                               <Gavel className="w-12 h-12 text-amber-500 mb-4 animate-bounce" />
                               <h2 className="text-2xl font-black text-amber-500 uppercase tracking-[0.3em]">Final Judgment</h2>
                            </div>
                          )}
                          <div className={m.role === 'assistant' && m.content.includes("👨‍⚖️") ? "font-black text-primary border-b border-primary/10 pb-4 mb-4" : ""}>
                             {m.content}
                          </div>
                          {m.role === 'assistant' && !m.content.includes("👨‍⚖️") && (
                             <div className="absolute -left-2 -top-2 w-8 h-8 glass rounded-full flex items-center justify-center border-white/10">
                                <Scale className="w-4 h-4 text-primary" />
                             </div>
                          )}
                       </div>
                    </motion.div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-start">
                       <div className="glass p-6 rounded-3xl border-white/10 flex items-center gap-3">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-xs font-bold text-muted uppercase tracking-widest italic">The Court is Deliberating...</span>
                       </div>
                    </div>
                  )}
               </div>

               <div className="p-10 pt-4 bg-slate-900/50 border-t border-white/5 relative z-10">
                  <form onSubmit={handleSend} className="relative">
                     <textarea
                       disabled={isGameOver || isThinking}
                       placeholder={isGameOver ? "Case has been Closed." : "My Lord, the facts of this case suggest..."}
                       value={input}
                       onChange={e => setInput(e.target.value)}
                       rows={2}
                       className="w-full bg-slate-800/50 border border-white/10 rounded-3xl p-6 pr-16 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none italic"
                     />
                     <button 
                       type="submit"
                       disabled={isGameOver || isThinking || !input.trim()}
                       className="absolute right-4 bottom-4 w-12 h-12 bg-primary text-background rounded-2xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                     >
                        <Send className="w-5 h-5" />
                     </button>
                  </form>
               </div>
             </>
           )}
        </div>

        {/* Right Side: Tribunal Info */}
        <div className="hidden lg:flex flex-col gap-6 w-80 shrink-0">
           
           <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
              <div>
                 <h4 className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-6 italic">
                    <History className="w-4 h-4" /> Tribunal Progress
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-muted">Turn Order</span>
                       <span className="font-bold text-primary">Supreme Court</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: isGameOver ? '100%' : '60%' }} />
                    </div>
                 </div>
              </div>

              {isGameOver && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center"
                >
                   <Trophy className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                   <h3 className="text-lg font-bold mb-1 italic">Judgment Ready</h3>
                   <p className="text-xs text-muted mb-4 uppercase font-black tracking-widest">Earned +{xpAwarded} XP</p>
                   <button 
                     onClick={() => { setScenarioName(""); setMessages([]); setIsGameOver(false); }}
                     className="w-full py-3 bg-emerald-500 text-background font-black rounded-2xl text-[10px] uppercase tracking-widest"
                   >
                     Argue New Case
                   </button>
                </motion.div>
              )}
           </div>

           <div className="glass p-8 rounded-[40px] border-amber-500/10 bg-amber-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle className="w-5 h-5 text-amber-500" />
                 <h3 className="text-sm font-bold italic">Legal Standards</h3>
              </div>
              <p className="text-[11px] text-muted leading-relaxed italic opacity-80">
                 The AI Justice evaluates your arguments based on accuracy of statutory citations and relevance of case law citing. Always maintain professional decorum.
              </p>
           </div>
        </div>
      </div>
      
    </div>
  );
}
