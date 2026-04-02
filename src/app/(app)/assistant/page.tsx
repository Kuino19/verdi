"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, BrainCircuit, Plus, Gavel, Scale, MessageSquare, Menu, X, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore";
import { addPoints } from "@/lib/firebase/db";

const suggestedPrompts = [
  "Explain Promissory Estoppel",
  "Summarize Donoghue v Stevenson",
  "Rule in Rylands v Fletcher",
  "Murder vs Manslaughter",
];

export default function AssistantPage() {
  const { uid, userName, isPremium } = useUserContext();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Threads state
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultGreeting = { 
    role: "assistant", 
    content: `Hello ${userName || "there"}! I'm your VERDI AI tutor. Ask me anything about Nigerian law, case principles, or exam prep.`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Load All Threads
  useEffect(() => {
    if (uid) {
      const loadThreads = async () => {
        const q = query(collection(db, "users", uid, "chatThreads"), orderBy("updatedAt", "desc"));
        const snap = await getDocs(q);
        const loadedThreads = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setThreads(loadedThreads);
        
        if (loadedThreads.length > 0) {
          setActiveThreadId(loadedThreads[0].id);
          setMessages(loadedThreads[0].messages || [defaultGreeting]);
        } else {
          setMessages([defaultGreeting]);
        }
      };
      loadThreads();
    }
  }, [uid, userName]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setActiveThreadId(null);
    setMessages([defaultGreeting]);
    setIsSidebarOpen(false);
  };

  const switchThread = (thread: any) => {
    setActiveThreadId(thread.id);
    setMessages(thread.messages || [defaultGreeting]);
    setIsSidebarOpen(false);
  };

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "chatThreads", threadId));
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      handleNewChat();
    }
  };

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim() || isTyping) return;
    
    // Limits
    if (!isPremium && messages.length > 20) {
       alert("You've reached your free query limit for this chat. Please upgrade to Premium.");
       return;
    }

    const userMessage = { role: "user", content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!text) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          type: "assistant"
        }),
      });
      const data = await res.json();
      
      let finalMessages = newMessages;
      if (data.content) {
        const assistantMsg = { role: "assistant", content: data.content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        finalMessages = [...newMessages, assistantMsg];
        setMessages(finalMessages);
        
        // Award XP for engaging with the tutor
        if (uid) addPoints(uid, 2);
      } else {
        throw new Error(data.details || "No response");
      }

      if (uid) {
        // Handle Thread Saving
        let currentThreadId = activeThreadId;
        const threadTitle = content.split(" ").slice(0, 4).join(" ") + "..."; // Auto title
        
        if (!currentThreadId) {
          // Create new document reference manually so we can set its ID
          const newThreadRef = doc(collection(db, "users", uid, "chatThreads"));
          currentThreadId = newThreadRef.id;
          setActiveThreadId(currentThreadId);
          
          const newThreadData = {
            id: currentThreadId,
            title: threadTitle,
            updatedAt: serverTimestamp(),
            messages: finalMessages
          };
          await setDoc(newThreadRef, newThreadData);
          setThreads(prev => [newThreadData, ...prev]);
        } else {
          // Update existing
          const threadRef = doc(db, "users", uid, "chatThreads", currentThreadId);
          await updateDoc(threadRef, {
            messages: finalMessages,
            updatedAt: serverTimestamp()
          });
          setThreads(prev => prev.map(t => t.id === currentThreadId ? { ...t, messages: finalMessages, updatedAt: new Date() } : t));
        }
      }

    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again.", time: "Just now" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full gap-4 md:gap-6 relative" style={{ height: 'calc(100dvh - 56px - 2rem)' }}>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Threads List */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 p-4 flex flex-col shadow-2xl transition-transform duration-300 transform
        md:relative md:w-64 md:bg-transparent md:border-none md:p-0 md:transform-none md:shadow-none md:flex
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between md:hidden mb-6">
          <h2 className="font-bold">Chat History</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={handleNewChat}
          className="w-full py-3 px-4 glass rounded-xl border border-white/10 flex items-center gap-3 text-sm font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors mb-6"
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
          {threads.map(thread => (
            <div 
              key={thread.id} 
              onClick={() => switchThread(thread)}
              className={`w-full group cursor-pointer flex items-center justify-between p-3 rounded-xl transition-all border ${
                activeThreadId === thread.id 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "bg-white/[0.02] border-transparent hover:bg-white/5 text-muted"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                 <MessageSquare className="w-4 h-4 flex-shrink-0" />
                 <span className="text-xs font-medium truncate">{thread.title || "New Chat"}</span>
              </div>
              <button 
                onClick={(e) => handleDeleteThread(e, thread.id)}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col glass lg:rounded-3xl border-transparent lg:border-white/5 p-4 md:p-6 pb-2 relative z-10 w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <button className="md:hidden p-2 -ml-2 rounded-lg text-muted hover:text-foreground" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">VERDI Legal Tutor</p>
            <p className="text-xs text-emerald-500 flex items-center gap-1.5 min-h-[14px]">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto no-scrollbar space-y-6 pb-6"
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center self-end shadow-lg ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  {m.role === 'user'
                    ? <Gavel className="w-4 h-4" />
                    : <Scale className="w-4 h-4" />
                  }
                </div>
                <div>
                  <div className={`px-5 py-4 text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary/10 rounded-3xl rounded-br-sm'
                      : 'bg-white/[0.04] border border-white/[0.06] rounded-3xl rounded-bl-sm'
                  }`}>
                    {m.content}
                  </div>
                  <div className={`flex items-center gap-2 mt-2 px-1 ${m.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-[10px] uppercase tracking-widest text-muted/60 font-medium">{m.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-4 h-4 text-emerald-500 animate-pulse" />
              </div>
              <div className="px-5 py-4 bg-white/[0.04] border border-white/[0.06] rounded-3xl rounded-bl-sm flex gap-2 items-center">
                <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 pt-4 mt-auto">
          {/* Suggested prompts */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mask-edges-horizontal">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="flex-shrink-0 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-medium text-muted hover:text-foreground hover:bg-white/[0.08] transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message VERDI..."
              className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/50 shadow-inner group-hover:border-white/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center mt-3 text-[10px] text-muted/40 uppercase tracking-widest font-medium">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
