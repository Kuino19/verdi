"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchCaseById, addPoints } from "@/lib/firebase/db";
import { useUserContext } from "@/components/app/UserContext";
import { db } from "@/lib/firebase/client";
import { collection, addDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Printer, 
  Scale, 
  Gavel, 
  BookOpen, 
  AlertCircle,
  BrainCircuit,
  MessageCircle,
  Plus,
  X,
  Zap,
  Play,
  Pause,
  Square
} from "lucide-react";
import Link from "next/link";
export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.id as string;

  const [activeTab, setActiveTab] = useState("facts");
  const [isSaved, setIsSaved] = useState(true);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { uid } = useUserContext();

  // Highlighting State
  const [highlightedText, setHighlightedText] = useState("");
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    async function load() {
      if (!caseId) return;
      const data = await fetchCaseById(caseId);
      setCaseData(data);
      setLoading(false);
    }
    load();
  }, [caseId]);

  const fetchAIExplanation = async (promptMsg: string) => {
    setIsAIThinking(true);
    setAiResponse(null); // Clear previous cache when asking a new question
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptMsg }],
          type: "assistant"
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setAiResponse(`Error: ${data.error || data.details || "API Error"}`);
      } else {
        setAiResponse(data.content || "Empty response from AI.");
        // Award XP for learning
        if (uid) addPoints(uid, 5);
      }
    } catch (error: any) {
      setAiResponse(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleAIExplain = async () => {
    if (!caseData) return;
    setAiModalOpen(true);
    if (aiResponse && !aiResponse.startsWith("Error:") && !aiResponse.includes("highlighted legal text")) return;
    
    await fetchAIExplanation(`Explain the key legal principle in ${caseData.title} to a law student using a simple, relatable real-life analogy. Keep your response extremely brief, maximum 3 sentences.`);
  };

  const explainHighlight = async (text: string) => {
    setAiModalOpen(true);
    await fetchAIExplanation(`I highlighted the following legal text from the case ${caseData.title}: "${text}". Explain what this specifically means in plain, simple English to a law student. Keep it extremely concise.`);
  };

  const handleGenerateFlashcards = async () => {
    if (!caseData || !uid) {
       alert("Please ensure you are logged in.");
       return;
    }
    setIsGeneratingCards(true);
    try {
      const text = `Facts: ${caseData.facts}\n\nIssues: ${caseData.issues}\n\nReasoning: ${caseData.reasoning}\n\nDecision: ${caseData.decision}`;
      
      const res = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: caseData.title, text })
      });
      const data = await res.json();
      
      if (data.flashcards && Array.isArray(data.flashcards)) {
        const deckName = caseData.title;
        const promises = data.flashcards.map((card: any) => 
          addDoc(collection(db, "users", uid, "flashcards"), {
            deck: deckName,
            subject: "Case Law",
            question: card.question,
            answer: card.answer,
            createdAt: new Date()
          })
        );
        await Promise.all(promises);
        addPoints(uid, 20); // Award XP for generating a deck!
        alert("Successfully generated and saved 5 flashcards to your library! (+20 XP)");
      } else {
        alert("Failed to generate flashcards.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating flashcards.");
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setHighlightRect(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setHighlightedText(text);
      setHighlightRect({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    } else {
      setHighlightRect(null);
    }
  };

  const clearSelection = () => {
    if (highlightRect) {
      setHighlightRect(null);
    }
  };

  const listenToCase = () => {
    if (!window.speechSynthesis) {
       alert("Your browser does not support text-to-speech.");
       return;
    }
    
    if (isPaused) {
       window.speechSynthesis.resume();
       setIsPaused(false);
       setIsPlaying(true);
       return;
    }
    
    if (isPlaying) {
       window.speechSynthesis.pause();
       setIsPaused(true);
       setIsPlaying(false);
       return;
    }

    // Clean text by stripping markdown or weird chars if needed
    const cleanText = (text: string) => text.replace(/[*#]/g, '');

    const textToRead = `Case Title: ${cleanText(caseData.title)}. Citation: ${cleanText(caseData.citation)}. Facts of the case: ${cleanText(caseData.facts)}. Legal issues: ${cleanText(caseData.issues)}. Court's reasoning: ${cleanText(caseData.reasoning)}. The decision: ${cleanText(caseData.decision)}.`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Samantha")) || voices[0];
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.onend = () => {
       setIsPlaying(false);
       setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };
  
  const stopListening = () => {
    if (window.speechSynthesis) {
       window.speechSynthesis.cancel();
       setIsPlaying(false);
       setIsPaused(false);
    }
  };

  const tabs = [
    { id: "facts", label: "Facts of the Case", icon: BookOpen },
    { id: "issues", label: "Legal Issues", icon: AlertCircle },
    { id: "reasoning", label: "Court's Reasoning", icon: Gavel },
    { id: "decision", label: "Final Decision", icon: Scale }
  ];

  if (loading) {
    return <div className="max-w-5xl mx-auto py-32 text-center text-muted italic flex flex-col items-center justify-center gap-4"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> Loading Case Data...</div>;
  }

  if (!caseData) {
    return <div className="max-w-5xl mx-auto py-32 text-center text-rose-500 font-bold italic">Case not found. Please return to the library.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/cases" className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center transition-all ${isSaved ? 'text-primary' : 'text-muted'}`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-muted hover:text-foreground transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-muted hover:text-foreground transition-all">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Case Header */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
           {caseData.landmark && <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest italic">LANDMARK CASE</span>}
           {caseData.subject && <span className="px-4 py-1.5 glass text-muted border-white/10 rounded-full text-xs font-black uppercase tracking-widest">{caseData.subject}</span>}
           {caseData.topic && <span className="px-4 py-1.5 glass text-muted border-white/10 rounded-full text-xs font-black uppercase tracking-widest">{caseData.topic}</span>}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic leading-tight">{caseData.title || "Untitled Case"}</h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <p className="text-xl font-mono text-muted">{caseData.citation || "No citation provided"}</p>
           
           {/* Audio Player Controls */}
           <div className="flex items-center gap-2 p-2 glass rounded-2xl border-emerald-500/20 max-w-sm w-full md:w-auto">
              <button 
                onClick={listenToCase}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex-1 justify-center whitespace-nowrap"
              >
                 {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                 {isPlaying ? "Pause" : isPaused ? "Resume Audio" : "Listen to Case"}
              </button>
              {(isPlaying || isPaused) && (
                <button 
                  onClick={stopListening}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors"
                >
                   <Square className="w-4 h-4 fill-current" />
                </button>
              )}
           </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border text-left ${
                 activeTab === tab.id 
                   ? "bg-primary/20 text-primary border-primary/30" 
                   : "glass border-white/5 hover:border-white/20 text-muted"
               }`}
             >
               <tab.icon className="w-5 h-5" />
               <span className="text-sm font-bold tracking-tight">{tab.label}</span>
             </button>
           ))}

           <div className="mt-10 p-6 glass rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <h4 className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest mb-3 italic">
                 <BrainCircuit className="w-4 h-4" /> Ask VERDI AI
              </h4>
              <p className="text-[10px] text-muted italic mb-4 leading-relaxed">Need a simpler breakdown or a real-life analogy for this case?</p>
              
              <button 
                onClick={handleAIExplain}
                className="w-full py-3 mb-3 bg-emerald-500 text-background text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                 <BrainCircuit className="w-3.5 h-3.5" /> Explain Principle
              </button>

              <button 
                onClick={handleGenerateFlashcards}
                disabled={isGeneratingCards}
                className="w-full py-3 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                 {isGeneratingCards ? (
                   <div className="flex gap-1.5 items-center">
                     <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                     <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.15s]" />
                     <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" />
                   </div>
                 ) : (
                   <><Zap className="w-3.5 h-3.5" /> Generate Deck</>
                 )}
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3" onMouseUp={handleSelection} onTouchEnd={handleSelection}>
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass p-8 md:p-12 rounded-[48px] border-white/5 min-h-[500px]"
           >
               {activeTab === "facts" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold flex items-center gap-3 italic">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      The Facts
                   </h3>
                   <div className="prose prose-invert max-w-none text-muted leading-relaxed space-y-4 text-lg whitespace-pre-wrap">
                      {caseData.facts || (caseData.processed ? "No facts recorded." : "Facts have not been processed yet. Please ask Verdi AI or an admin to process this case.")}
                   </div>
                </div>
              )}

              {activeTab === "issues" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold flex items-center gap-3 italic">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      Legal Issues
                   </h3>
                   <div className="space-y-6 whitespace-pre-wrap text-muted text-lg leading-relaxed">
                      {caseData.issues || "No legal issues identified yet."}
                   </div>
                </div>
              )}

              {activeTab === "reasoning" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold flex items-center gap-3 italic">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Gavel className="w-5 h-5 text-purple-500" />
                      </div>
                      Court's Reasoning
                   </h3>
                   <div className="prose prose-invert max-w-none text-muted leading-relaxed space-y-6 text-lg whitespace-pre-wrap">
                      {caseData.reasoning || "Reasoning is still being processed."}
                   </div>
                </div>
              )}

              {activeTab === "decision" && (
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold flex items-center gap-3 italic">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-emerald-500" />
                      </div>
                      The Decision
                   </h3>
                   <div className="space-y-8">
                      <div className="p-10 bg-emerald-500/10 rounded-[40px] border border-emerald-500/20">
                         <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">Final Verdict</h4>
                         <p className="text-xl italic mb-6 whitespace-pre-wrap leading-relaxed">{caseData.decision || "Pending verdict processing."}</p>
                      </div>
                   </div>
                </div>
              )}
           </motion.div>

           {/* In-page Notes Widget */}
           <div className="mt-8 p-8 glass rounded-[40px] border-white/5">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="font-bold flex items-center gap-3 italic">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    My Learning Notes
                 </h4>
                 <button className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                    <Plus className="w-4 h-4" /> Add Note
                 </button>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-sm italic text-muted">
                 Click "Add Note" to save your personal reflections or class discussions for this case. Linked to your dashboard.
              </div>
           </div>
        </div>
      </div>

      {/* Floating Highlight Tooltip */}
      <AnimatePresence>
        {highlightRect && highlightedText && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-40 transform -translate-x-1/2 -translate-y-full pb-3 pointer-events-auto"
            style={{ top: highlightRect.top, left: highlightRect.left }}
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl">
               <button 
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   explainHighlight(highlightedText);
                   window.getSelection()?.removeAllRanges();
                   setHighlightRect(null);
                 }}
                 className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
               >
                 <BrainCircuit className="w-3.5 h-3.5" /> Explain Selection
               </button>
               <div className="w-px h-4 bg-white/10" />
               <button
                 onClick={(e) => {
                   e.preventDefault();
                   window.getSelection()?.removeAllRanges();
                   setHighlightRect(null);
                   alert("Notes feature coming in Phase 2!"); 
                 }}
                 className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
               >
                 <Plus className="w-3.5 h-3.5" /> Add to Notes
               </button>
            </div>
            <div className="absolute left-1/2 bottom-1 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-r border-b border-white/10 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Explanation Modal */}
      <AnimatePresence>
        {aiModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setAiModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-500/10"
            >
              <div className="p-6 md:p-8 bg-gradient-to-br from-emerald-500/10 to-transparent">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold italic flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-emerald-500" />
                    </div>
                    Verdi AI Explanation
                  </h3>
                  <button 
                    onClick={() => setAiModalOpen(false)}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted hover:text-white" />
                  </button>
                </div>
                
                <div className="min-h-[140px] flex items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5">
                  {isAIThinking ? (
                    <div className="flex flex-col items-center gap-4 text-muted italic">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      Crafting a legal analogy...
                    </div>
                  ) : (
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground italic">
                      {aiResponse || "Something went wrong."}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
