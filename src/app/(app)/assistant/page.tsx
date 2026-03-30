"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, BrainCircuit, RotateCcw, Gavel, Scale, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";

const suggestedPrompts = [
  "Explain Promissory Estoppel",
  "Summarize Donoghue v Stevenson",
  "Rule in Rylands v Fletcher",
  "Murder vs Manslaughter",
];

export default function AssistantPage() {
  const { userName } = useUserContext();
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: `Hello ${userName}! I'm your VERDI AI tutor. Ask me anything about Nigerian law, case principles, or exam prep.`,
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim() || isTyping) return;

    const userMessage = { role: "user", content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    if (!text) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          type: "assistant"
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: "assistant", content: data.content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        throw new Error(data.details || "No response");
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again.", time: "Just now" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 56px - 2rem)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">VERDI Legal Tutor</p>
            <p className="text-xs text-emerald-500">Online</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ role: "assistant", content: `Hello ${userName}! Ask me anything about Nigerian law.`, time: "Just now" }])}
          className="p-2 rounded-lg text-muted hover:text-foreground transition-colors"
          title="New conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto no-scrollbar space-y-4 pb-4"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2.5 max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center self-end ${m.role === 'user' ? 'bg-primary/20' : 'bg-white/[0.06]'}`}>
                {m.role === 'user'
                  ? <Gavel className="w-3.5 h-3.5 text-primary" />
                  : <Scale className="w-3.5 h-3.5 text-muted" />
                }
              </div>
              <div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary/15 rounded-br-sm'
                    : 'bg-white/[0.05] border border-white/[0.06] rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
                <div className={`flex items-center gap-2 mt-1 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-[10px] text-muted/60">{m.time}</span>
                  {m.role === 'assistant' && (
                    <div className="flex gap-1">
                      <button className="text-muted/40 hover:text-emerald-400 transition-colors"><ThumbsUp className="w-3 h-3" /></button>
                      <button className="text-muted/40 hover:text-rose-400 transition-colors"><ThumbsDown className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5 text-muted animate-pulse" />
            </div>
            <div className="px-4 py-3 bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-muted/40 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-muted/40 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-muted/40 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-3 border-t border-white/[0.06]">
        {/* Suggested prompts */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="flex-shrink-0 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-xs text-muted hover:text-foreground hover:border-white/15 transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-background hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-center mt-2 text-[10px] text-muted/40">
          Verify AI responses with official sources.
        </p>
      </div>
    </div>
  );
}
