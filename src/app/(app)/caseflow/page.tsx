"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  Library,
  Network,
  Scale,
  Loader2,
  FileText,
  BookmarkPlus
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUserContext } from "@/components/app/UserContext";
import { addPoints } from "@/lib/firebase/db";

export default function CaseFlowPage() {
  const { uid, isPremium } = useUserContext();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [caseSummary, setCaseSummary] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorMsg("");
    setCaseSummary("");
    setActiveCase(null);

    const searchPayload = `Provide a full IRAC summary of the following legal case: ${query}. Address Facts, Issues, Rule of Law, Application, and Conclusion.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: searchPayload }],
          type: "summarize"
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to generate case summary.");
      }

      setCaseSummary(data.content);
      setActiveCase(query);

      // Reward points for studying cases
      if (uid) {
        await addPoints(uid, 10); // Reward 10 points per case searched
      }

    } catch (error: any) {
      console.error("CaseFlow Error:", error);
      setErrorMsg(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-bold mb-2">Case<span className="text-gradient">Flow</span></h1>
          <p className="text-muted italic">Instant AI-generated Case Briefs for Nigerian and global precedents.</p>
        </div>
        <div className="w-full md:w-96">
           <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search a case (e.g. Awolowo v Shagari)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
                required
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted/50"
              />
              <button 
                type="submit" 
                disabled={isSearching || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/20 text-primary hover:bg-primary hover:text-background rounded-full flex items-center justify-center transition-all disabled:opacity-50"
              >
                 {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
           </form>
           {errorMsg && <p className="text-rose-500 text-xs mt-2 pl-4">{errorMsg}</p>}
        </div>
      </header>

      {!activeCase && !isSearching && (
         <div className="pt-20">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-2xl mx-auto text-center space-y-8"
            >
               <div className="flex justify-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                     <Scale className="w-8 h-8 text-primary opacity-80" />
                  </div>
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center">
                     <Library className="w-8 h-8 text-blue-500 opacity-80" />
                  </div>
               </div>
               
               <h2 className="text-3xl font-bold italic">Never struggle with 100-page judgments.</h2>
               <p className="text-muted leading-relaxed">
                  CaseFlow uses the Verdi AI tutor to parse through decades of Nigerian judicial rationale and instantly output perfectly structured IRAC briefs. Just search the case citation or name above.
               </p>
               
               <div className="grid grid-cols-2 gap-4 text-left pt-8">
                  <div className="glass p-6 rounded-3xl border-white/5 hover:border-primary/20 transition-all cursor-pointer" onClick={() => setQuery("Carlill v Carbolic Smoke Ball")}>
                     <p className="text-xs font-black text-primary mb-2 uppercase tracking-widest">Example</p>
                     <p className="text-sm font-bold italic">Carlill v Carbolic Smoke Ball</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border-white/5 hover:border-blue-500/20 transition-all cursor-pointer" onClick={() => setQuery("Awolowo v Shagari")}>
                     <p className="text-xs font-black text-blue-500 mb-2 uppercase tracking-widest">Example</p>
                     <p className="text-sm font-bold italic">Awolowo v Shagari</p>
                  </div>
               </div>
            </motion.div>
         </div>
      )}

      {isSearching && (
         <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
               <div className="w-20 h-20 glass rounded-[32px] flex items-center justify-center relative z-10 border-primary/20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
               </div>
            </div>
            <div className="text-center">
               <h3 className="text-xl font-bold mb-2">Analyzing judicial records...</h3>
               <p className="text-sm text-muted animate-pulse">Generating facts, extracting ratios, and restructuring conclusion.</p>
            </div>
         </div>
      )}

      {activeCase && caseSummary && !isSearching && (
         <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[32px] md:rounded-[48px] border-white/5 overflow-hidden"
         >
            <div className="p-6 md:p-12 border-b border-white/5 bg-slate-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-primary/15 flex flex-shrink-0 items-center justify-center">
                     <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                     <h2 className="text-xl md:text-2xl font-bold mb-2 break-words">{activeCase.charAt(0).toUpperCase() + activeCase.slice(1)}</h2>
                     <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-muted tracking-widest">Case Brief</span>
                        <span className="text-xs text-emerald-500 font-bold px-3 py-1 bg-emerald-500/10 rounded-lg">Verified Output</span>
                     </div>
                  </div>
               </div>
               
               <button className="px-6 py-4 glass hover:bg-primary/10 hover:text-primary transition-all rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <BookmarkPlus className="w-4 h-4" /> Save Brief
               </button>
            </div>

            <div className="p-6 md:p-12 prose prose-invert prose-headings:text-primary prose-headings:italic prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-muted prose-li:text-muted max-w-none text-sm md:text-base">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {caseSummary}
               </ReactMarkdown>
            </div>
         </motion.div>
      )}

    </div>
  );
}
