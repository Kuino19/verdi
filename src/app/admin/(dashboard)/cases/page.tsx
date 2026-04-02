"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Plus, 
  FileText, 
  Edit3,
  Trash2,
  Filter,
  Star,
  Zap,
  Clock,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { fetchAllCases } from "@/lib/firebase/db";

export default function AdminCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await fetchAllCases();
        setCases(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  const handleSummarize = async (caseId: string) => {
    if (processingId) return;
    setProcessingId(caseId);
    try {
      const res = await fetch("/api/admin/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Summarization failed");
      }
      
      // Refresh library
      const updatedCases = await fetchAllCases();
      setCases(updatedCases);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm("Are you sure you want to delete this case permanently?")) return;
    try {
      const { deleteCase } = await import("@/lib/firebase/db");
      await deleteCase(caseId);
      setCases(prev => prev.filter(c => c.id !== caseId));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredCases = cases.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.citation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 italic">Legal <span className="text-primary italic">Repository</span></h1>
          <p className="text-muted italic">Manage and audit the case law database for Verdi users.</p>
        </div>
        <Link 
          href="/admin/cases/new" 
          className="px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> New Case (PDF)
        </Link>
      </header>

      {/* Control Bar */}
      <section className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
           <input 
             type="text" 
             placeholder="Search by case name or citation..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-[28px] py-5 pl-16 pr-6 text-sm italic focus:outline-none focus:border-primary/50 transition-all font-medium font-inter"
           />
        </div>
        <button className="flex items-center justify-center gap-3 px-8 py-5 glass rounded-[28px] border-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
           <Filter className="w-4 h-4" /> Filter Library
        </button>
      </section>

      {/* Data Table */}
      <section className="glass rounded-[48px] border-white/5 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="px-8 py-6 text-[10px] font-black uppercase text-muted tracking-widest italic">Case Name & Citation</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase text-muted tracking-widest italic">Subject</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase text-muted tracking-widest italic text-center">Landmark</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase text-muted tracking-widest italic">Status</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase text-muted tracking-widest italic">Added Date</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase text-muted tracking-widest italic text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                    <tr>
                       <td colSpan={6} className="px-8 py-12 text-center text-muted italic">Loading repository...</td>
                    </tr>
                  ) : filteredCases.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-8 py-12 text-center text-muted italic">No cases found matching your criteria.</td>
                    </tr>
                  ) : filteredCases.map((c, i) => (
                    <motion.tr 
                      key={c.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-all group"
                    >
                       <td className="px-8 py-6">
                          <p className="font-bold text-sm italic mb-1 group-hover:text-primary transition-colors">{c.title}</p>
                          <p className="text-[10px] font-mono text-muted uppercase tracking-widest">{c.citation || 'No Citation'}</p>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black text-muted uppercase tracking-[0.1em]">{c.subject || "N/A"}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex justify-center">
                             {c.landmark ? (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                   <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                   <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Yes</span>
                               </div>
                             ) : (
                               <span className="text-[10px] font-black text-muted/30 uppercase tracking-widest italic">No</span>
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             {c.processed ? (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Processed</span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                                   <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">Pending AI</span>
                               </div>
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-[10px] font-bold text-muted uppercase tracking-widest italic">
                          {(c.scrapedAt || c.createdAt) ? new Date(c.scrapedAt || c.createdAt).toLocaleDateString() : 'N/A'}
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                             <button title="Edit Case" className="p-3 glass rounded-xl text-muted hover:text-foreground transition-all">
                                <Edit3 className="w-4 h-4" />
                             </button>
                             {!c.processed && (
                               <button 
                                 onClick={() => handleSummarize(c.id)}
                                 disabled={processingId === c.id}
                                 title="Run AI Processor" 
                                 className="p-3 glass rounded-xl text-amber-500 hover:text-amber-400 transition-all border-amber-500/10 hover:border-amber-500/30 disabled:opacity-50"
                               >
                                  {processingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                               </button>
                             )}
                             <button 
                               onClick={() => handleDelete(c.id)}
                               title="Delete Case" 
                               className="p-3 glass rounded-xl text-muted hover:text-rose-500 transition-all border-rose-500/10"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}
