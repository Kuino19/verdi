"use client";

import { motion } from "framer-motion";
import { 
  Bookmark, 
  Search, 
  FileText, 
  BookOpen, 
  Scale, 
  Trash2, 
  ExternalLink,
  Filter,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const savedItems = [
  { id: 1, type: "Case", title: "Donoghue v Stevenson", category: "Tort Law", info: "[1932] AC 562" },
  { id: 2, type: "Definition", title: "Stare Decisis", category: "Jurisprudence", info: "Doctrine of Precedent" },
  { id: 3, type: "Note", title: "Negligence Essentials", category: "Tort Law", info: "Modified 2 days ago" },
  { id: 4, type: "Past Paper", title: "Law of Tort I (2023)", category: "UNILAG", info: "Exam Prep" },
];

export default function BookmarksPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My <span className="text-gradient">Bookmarks</span></h1>
          <p className="text-muted italic">All your saved cases, notes, and definitions in one organized space.</p>
        </div>
        <div className="flex items-center gap-2">
           {["All", "Case", "Definition", "Note"].map(f => (
             <button 
               key={f} 
               onClick={() => setFilter(f)}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-primary text-background border-primary' : 'glass border-white/5 text-muted hover:border-white/20'}`}
             >
               {f}s
             </button>
           ))}
        </div>
      </header>

      {/* Search */}
      <div className="relative">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
         <input 
           type="text" 
           placeholder="Search through your saved items..."
           className="w-full bg-white/5 border border-white/10 rounded-[28px] py-5 pl-16 pr-6 text-sm italic focus:outline-none focus:border-primary/50 transition-all font-medium"
         />
      </div>

      {/* Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {savedItems.filter(i => filter === "All" || i.type === filter).map((item, i) => (
           <motion.div
             key={item.id}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.05 }}
             className="glass p-8 rounded-[40px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
           >
              <div className="flex items-start justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary/50 group-hover:text-primary transition-colors">
                       {item.type === 'Case' && <Scale className="w-5 h-5" />}
                       {item.type === 'Definition' && <BookOpen className="w-5 h-5" />}
                       {item.type === 'Note' && <FileText className="w-5 h-5" />}
                       {item.type === 'Past Paper' && <Layers className="w-5 h-5" />}
                    </div>
                    <div>
                       <span className="text-[10px] font-black uppercase text-muted tracking-widest">{item.type}</span>
                       <h4 className="text-sm font-bold truncate max-w-[150px]">{item.title}</h4>
                    </div>
                 </div>
                 <button className="text-muted hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-black text-muted uppercase tracking-widest">{item.category}</div>
                 </div>
                 <p className="text-[10px] text-muted font-bold italic opacity-60">{item.info}</p>
              </div>

              <div className="mt-8 flex justify-end">
                 <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    Open Item <ExternalLink className="w-3.5 h-3.5" />
                 </button>
              </div>
           </motion.div>
         ))}

         {/* Empty State / Add UI */}
         <div className="p-8 glass rounded-[40px] border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
               <Bookmark className="w-6 h-6 text-muted" />
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Find and bookmark more content</p>
         </div>
      </section>

      {/* Pro Hint */}
      <div className="p-10 glass rounded-[48px] border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center gap-8">
         <Sparkles className="w-10 h-10 text-primary animate-pulse" />
         <div>
            <h4 className="text-xl font-bold mb-1 italic">Smart Organization</h4>
            <p className="text-xs text-muted italic">Upgrade to Pro to automatically categorize your notes using AI and export them as structured study guides.</p>
         </div>
         <Link href="/upgrade" className="ml-auto px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-xs uppercase tracking-widest">
            Go Pro
         </Link>
      </div>
    </div>
  );
}
