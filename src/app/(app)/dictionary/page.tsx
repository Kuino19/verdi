"use client";

import { motion } from "framer-motion";
import { 
  BookMarked, 
  Search, 
  Info, 
  BookOpen, 
  Scale, 
  Gavel, 
  Star,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { useState } from "react";

const terms = [
  { term: "Ab Initio", meaning: "From the beginning.", latin: true, category: "Civil Procedure" },
  { term: "Ad Ignorantiam", meaning: "Appealing to ignorance.", latin: true, category: "Logic" },
  { term: "Bona Fide", meaning: "In good faith; without deceit.", latin: true, category: "General" },
  { term: "Certiorari", meaning: "To be informed of. An order issued by a higher court to a lower court.", latin: true, category: "Public Law" },
  { term: "Damnum Sine Injuria", meaning: "Damage without legal injury.", latin: true, category: "Tort Law" },
  { term: "Ex Gratia", meaning: "By favor; not as a matter of legal right.", latin: true, category: "Contract Law" },
  { term: "Habeas Corpus", meaning: "You have the body. A writ requiring a person under arrest to be brought before a judge.", latin: true, category: "Constitutional Law" },
  { term: "Res Ipsa Loquitur", meaning: "The thing speaks for itself.", latin: true, category: "Tort Law" },
  { term: "Stare Decisis", meaning: "To stand by things decided. The doctrine of precedent.", latin: true, category: "Jurisprudence" },
  { term: "Ultra Vires", meaning: "Beyond the powers.", latin: true, category: "Constitutional Law" },
];

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Legal <span className="text-gradient">Dictionary</span></h1>
          <p className="text-muted italic">A comprehensive glossary of legal terms and Latin maxims used in Nigerian courts.</p>
        </div>
        <div className="flex gap-2 p-1 glass rounded-2xl border-white/5">
           <button className="px-6 py-2.5 bg-primary text-background font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">Common Terms</button>
           <button className="px-6 py-2.5 text-muted font-black rounded-xl text-[10px] uppercase tracking-widest hover:text-foreground transition-all">Latin Maxims</button>
        </div>
      </header>

      {/* Search Section */}
      <section className="relative">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted" />
         <input 
           type="text" 
           placeholder="Search for a term (e.g., Stare Decisis)..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="w-full bg-white/5 border border-white/10 rounded-[32px] py-8 pl-18 pr-8 text-xl italic font-serif focus:outline-none focus:border-primary/50 transition-all font-medium text-foreground pl-16"
         />
      </section>

      {/* Letters Filter */}
      <div className="flex flex-wrap gap-2 justify-center py-4 px-6 glass rounded-[32px] border-white/5">
         {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
           <button key={l} className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-all">{l}</button>
         ))}
      </div>

      {/* Dictionary Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredTerms.map((t, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.05 }}
             className="glass p-8 rounded-[40px] border-white/5 hover:border-primary/30 transition-all group flex flex-col"
           >
              <div className="flex items-center justify-between mb-6">
                 <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-primary uppercase tracking-widest italic">{t.category}</div>
                 <button className="text-muted hover:text-primary transition-colors"><Bookmark className="w-4 h-4" /></button>
              </div>

              <h2 className={`text-2xl font-black mb-4 italic ${t.latin ? 'text-gradient' : 'text-foreground'}`}>{t.term}</h2>
              <p className="text-sm text-muted italic leading-relaxed mb-8 flex-grow">"{t.meaning}"</p>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> Usage Example
                 </span>
                 <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
           </motion.div>
         ))}

         {/* Pro Widget */}
         <div className="p-8 glass rounded-[40px] border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex flex-col items-center justify-center text-center">
            <Scale className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-xl font-bold mb-4">Case Citations</h3>
            <p className="text-xs text-muted leading-relaxed mb-8">Upgrade to Pro to see critical cases where these maxims were applied in Nigerian Law.</p>
            <button className="w-full py-4 bg-primary text-background font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
               Unlock Citations
            </button>
         </div>
      </section>
    </div>
  );
}
