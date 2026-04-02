"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  BookOpen, 
  Bookmark, 
  Share2, 
  Calendar,
  Layers,
  Star
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchAllCases } from "@/lib/firebase/db";

const mockCases = [
  {
    id: 1,
    title: "Donoghue v Stevenson",
    citation: "[1932] AC 562",
    subject: "Tort Law",
    topic: "Negligence",
    year: "1932",
    summary: "Established the 'Neighbor Principle' and the modern law of negligence.",
    landmark: true,
    saved: true
  },
  {
    id: 2,
    title: "Salomon v Salomon & Co Ltd",
    citation: "[1897] AC 22",
    subject: "Company Law",
    topic: "Corporate Personality",
    year: "1897",
    summary: "Established the principle of separate legal personality of a company.",
    landmark: true,
    saved: false
  },
  {
    id: 3,
    title: "Carlill v Carbolic Smoke Ball Co",
    citation: "[1893] 1 QB 256",
    subject: "Contract Law",
    topic: "Offer & Acceptance",
    year: "1893",
    summary: "Determined that an advertisement can constitute a unilateral contract.",
    landmark: true,
    saved: false
  },
  {
    id: 4,
    title: "R v Dudley and Stephens",
    citation: "(1884) 14 QBD 273",
    subject: "Criminal Law",
    topic: "Necessity",
    year: "1884",
    summary: "Established that necessity is not a defense to a charge of murder.",
    landmark: false,
    saved: true
  },
  {
    id: 5,
    title: "Entick v Carrington",
    citation: "[1765] EWHC CP J98",
    subject: "Constitutional Law",
    topic: "State Power",
    year: "1765",
    summary: "Established the principle that the state must have legal authority for its actions.",
    landmark: true,
    saved: false
  },
  {
    id: 6,
    title: "Hadley v Baxendale",
    citation: "(1854) 9 Exch 341",
    subject: "Contract Law",
    topic: "Remoteness of Damage",
    year: "1854",
    summary: "Set the rules for determining the amount of damages for breach of contract.",
    landmark: false,
    saved: false
  }
];

const subjects = ["All Subjects", "Tort", "Contract", "Criminal", "Company", "Constitutional", "Family", "Property"];

export default function CasesPage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState<any[]>(mockCases);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllCases();
        if (data.length > 0) {
          setCases(data);
        }
      } catch (e) {
        console.error("Error loading cases:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCases = cases.filter(c => 
    (selectedSubject === "All Subjects" || (c.subject && c.subject.includes(selectedSubject))) &&
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.summary && c.summary.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-2">Case <span className="text-gradient">Library</span></h1>
        <p className="text-muted italic">Explore thousands of structured case summaries from Nigerian and International courts.</p>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-[72px] z-20 py-4 -mx-6 px-6 glass-dark border-b border-white/5">
        <div className="container flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input 
              type="text" 
              placeholder="Search by case name, citation, or legal principle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <button className="flex items-center gap-2 px-6 py-4 glass rounded-2xl border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 px-6 py-4 glass rounded-2xl border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <ArrowUpDown className="w-4 h-4" /> Sort By
            </button>
          </div>
        </div>

        <div className="container mt-6 flex gap-3 overflow-x-auto no-scrollbar">
           {subjects.map((sub) => (
             <button
               key={sub}
               onClick={() => setSelectedSubject(sub)}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                 selectedSubject === sub 
                   ? "bg-primary text-background border-primary" 
                   : "glass border-white/5 hover:border-white/20 text-muted"
               }`}
             >
               {sub}
             </button>
           ))}
        </div>
      </section>

      {/* Results Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredCases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-[32px] border-white/5 overflow-hidden flex flex-col hover:border-primary/20 transition-all group"
          >
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                   <span className="text-[10px] font-black text-primary uppercase">{c.subject}</span>
                 </div>
                 {c.landmark && (
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                     <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                     <span className="text-[10px] font-black text-amber-500 uppercase">Landmark</span>
                   </div>
                 )}
              </div>
              
              <Link href={`/cases/${c.id}`}>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{c.title}</h3>
              </Link>
              <p className="text-xs font-bold text-muted mb-4 font-mono">{c.citation}</p>
              <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-6 italic">"{c.summary}"</p>
            </div>

            <div className="mt-auto p-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button className={`flex items-center gap-1.5 text-xs font-bold transition-all ${c.saved ? 'text-primary' : 'text-muted hover:text-foreground'}`}>
                   <Bookmark className={`w-4 h-4 ${c.saved ? 'fill-current' : ''}`} />
                 </button>
                 <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-all">
                   <Share2 className="w-4 h-4" />
                 </button>
              </div>
              <Link 
                href={`/cases/${c.id}`}
                className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Full Case Summary
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Pagination Placeholder */}
      <section className="py-12 flex justify-center">
         <div className="flex gap-2">
            {[1, 2, 3, "...", 12].map((p, i) => (
              <button 
                key={i} 
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${p === 1 ? 'bg-primary text-background' : 'glass border-white/5 hover:border-white/10 text-muted'}`}
              >
                {p}
              </button>
            ))}
         </div>
      </section>
    </div>
  );
}
