"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  BrainCircuit, 
  PlusCircle, 
  History, 
  Bookmark, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Gavel,
  Scale
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const suggestedPrompts = [
  "Explain Promissory Estoppel in Nigeria",
  "Summarize Donoghue v Stevenson",
  "What is the Rule in Rylands v Fletcher?",
  "Difference between Murder and Manslaughter",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello Adeyemi! I'm your VERDI AI tutor. I've been trained on Nigerian legal materials and past exam questions. How can I help you simplify your legal studies today?",
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim() || isTyping) return;

    const userMessage = { 
      role: "user", 
      content: messageContent, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!text) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          type: "assistant"
        }),
      });

      const data = await response.json();
      
      if (data.content) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error. Please try again.",
        time: "Just now"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8">
      {/* Sidebar: History & Tips */}
      <div className="hidden lg:flex flex-col w-72 space-y-6">
        <button className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
          <PlusCircle className="w-5 h-5" /> New Chat
        </button>

        <div className="flex-grow glass p-6 rounded-[32px] border-white/5 space-y-6 overflow-y-auto no-scrollbar">
          <div>
            <h4 className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-4 italic">
              <History className="w-3.5 h-3.5" /> Recent Sessions
            </h4>
            <div className="space-y-3">
              {[
                "Doctrine of Laches",
                "Case: Smith v Hughes",
                "Exam Tips: Tort Law",
                "Vicarious Liability"
              ].map((item, i) => (
                <button key={i} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-xs font-bold text-muted truncate transition-all">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
             <h4 className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-4 italic">
              <Sparkles className="w-3.5 h-3.5" /> Learning Tips
            </h4>
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
               <p className="text-[10px] text-emerald-500 font-black italic mb-2 tracking-wide uppercase">AI Pro-Tip</p>
               <p className="text-[11px] text-muted leading-relaxed">Ask me to "simultaneously summarize and compare" two cases to see how their ratios differ.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col glass rounded-[40px] border-white/5 relative overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center relative">
                 <BrainCircuit className="w-6 h-6 text-primary" />
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B1120]"></span>
              </div>
              <div>
                 <h3 className="text-lg font-bold">VERDI Legal Tutor</h3>
                 <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest italic">AI Study Mode Active</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2.5 glass rounded-xl text-muted hover:text-foreground transition-all">
                 <Bookmark className="w-4 h-4" />
              </button>
              <button className="p-2.5 glass rounded-xl text-muted hover:text-foreground transition-all">
                 <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto space-y-8 no-scrollbar scroll-smooth"
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-primary text-background' : 'glass border-white/10 text-primary'}`}>
                    {m.role === 'user' ? <Gavel className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
                 </div>
                 <div className="space-y-2">
                    <div className={`p-6 rounded-[28px] text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-primary/10 border border-primary/20 rounded-tr-none' 
                        : 'glass border-white/5 rounded-tl-none'
                    }`}>
                      {m.content}
                    </div>
                    <div className={`flex items-center gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
                       <span className="text-[10px] text-muted font-bold tracking-widest uppercase">{m.time}</span>
                       {m.role === 'assistant' && (
                         <div className="flex items-center gap-2">
                            <button className="text-muted hover:text-emerald-500 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                            <button className="text-muted hover:text-rose-500 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div className="p-4 glass border-white/5 rounded-[20px] rounded-tl-none flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
             </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50">
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestedPrompts.map((p, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(p)}
                className="px-4 py-2 glass rounded-full text-[11px] font-bold text-muted hover:text-primary hover:border-primary/20 transition-all border-white/5"
              >
                {p}
              </button>
            ))}
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your legal question here..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-6 pr-16 text-sm italic focus:outline-none focus:border-primary/50 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-background rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center mt-4 text-[10px] text-muted italic">
             VERDI AI can make mistakes. Always verify critical information with your official text books and lecture notes.
          </p>
        </div>
      </div>
    </div>
  );
}
