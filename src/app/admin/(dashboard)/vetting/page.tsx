"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  Database,
  Filter
} from "lucide-react";
import Link from "next/link";
import { fetchAllCases } from "@/lib/firebase/db";

export default function VettingPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { cases: data } = await fetchAllCases(true);
        // Filter for NON-vetted cases
        setCases(data.filter(c => !c.vetted));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold mb-2 italic">Judicial <span className="text-primary italic">Vetting</span></h1>
        <p className="text-muted italic">Review and verify AI-generated summaries before they are promoted to 'Verified' status.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
        </div>
      ) : cases.length === 0 ? (
        <div className="glass p-20 text-center rounded-[48px] border-white/5 bg-emerald-500/5">
           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6 opacity-80" />
           <h3 className="text-2xl font-bold mb-2 italic text-emerald-500">Queue Clear!</h3>
           <p className="text-muted text-sm">All entries in the legal repository have been vetted by administrators.</p>
           <Link href="/admin/cases" className="mt-8 inline-block text-primary font-black uppercase text-[10px] tracking-widest hover:underline">View Entire Repository</Link>
        </div>
      ) : (
        <div className="grid gap-6">
           <div className="flex items-center justify-between px-4">
              <span className="text-[10px] font-black uppercase text-muted tracking-widest">
                {cases.length} Cases Awaiting Review
              </span>
           </div>

           {cases.map((c, i) => (
             <motion.div 
               key={c.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="glass p-8 rounded-[40px] border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between group"
             >
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors italic">{c.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{c.citation || 'Awaiting Citation'}</span>
                         <span className="w-1 h-1 bg-white/10 rounded-full" />
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">{c.subject || 'Uncategorized'}</span>
                      </div>
                   </div>
                </div>

                <Link 
                  href={`/admin/cases/${c.id}`}
                  className="px-6 py-3 glass rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                   Curate Summary <ArrowRight className="w-3.5 h-3.5" />
                </Link>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}
