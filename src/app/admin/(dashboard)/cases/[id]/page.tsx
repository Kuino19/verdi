"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  FileText, 
  Tag as TagIcon,
  Loader2,
  AlertTriangle,
  Star
} from "lucide-react";
import Link from "next/link";
import { fetchCaseById, updateCase } from "@/lib/firebase/db";
import { db } from "@/lib/firebase/client"; // For potential direct interaction
import { doc, getDoc } from "firebase/firestore";

export default function CaseEditorPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCaseById(id);
        if (data) {
          setCaseData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdate = (field: string, value: any) => {
    setCaseData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    try {
      await updateCase(id, caseData);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center glass rounded-3xl border-white/5">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Case Not Found</h2>
        <Link href="/admin/cases" className="text-primary hover:underline mt-4 inline-block">Back to Repository</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 glass rounded-xl text-muted hover:text-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold italic">Curate <span className="text-primary italic">Case</span></h1>
            <p className="text-xs text-muted font-bold tracking-widest uppercase">ID: {id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {status === "success" && (
             <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-500 text-xs font-black uppercase italic">
               Updated successfully
             </motion.span>
           )}
           <button 
              form="case-form"
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-primary text-background font-black rounded-2xl flex items-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
           >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Save Changes
           </button>
        </div>
      </header>

      <form id="case-form" onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass p-10 rounded-[48px] border-white/5 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic">Case Title</label>
                <input 
                  type="text" 
                  value={caseData.title || ""} 
                  onChange={(e) => handleUpdate("title", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-bold text-lg focus:outline-none focus:border-primary/50 transition-all italic"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic">Law Citation</label>
                <input 
                  type="text" 
                  value={caseData.citation || ""} 
                  onChange={(e) => handleUpdate("citation", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-mono tracking-widest focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic">Subject (Primary)</label>
                    <input 
                      type="text" 
                      value={caseData.subject || ""} 
                      onChange={(e) => handleUpdate("subject", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic">Year of Judgment</label>
                    <input 
                      type="number" 
                      value={caseData.year || ""} 
                      onChange={(e) => handleUpdate("year", parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
              </div>
           </div>

           <div className="glass p-10 rounded-[48px] border-white/5 space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic underline">1. Material Facts</label>
                <textarea 
                  value={caseData.facts || ""} 
                  onChange={(e) => handleUpdate("facts", e.target.value)}
                  rows={8}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-6 text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-all resize-none italic"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic underline">2. Core Issues</label>
                <textarea 
                  value={caseData.issues || ""} 
                  onChange={(e) => handleUpdate("issues", e.target.value)}
                  rows={6}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-6 text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-all resize-none italic"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-muted tracking-widest mb-3 block italic underline">3. Final Decision / Holding</label>
                <textarea 
                  value={caseData.decision || ""} 
                  onChange={(e) => handleUpdate("decision", e.target.value)}
                  rows={6}
                  className="w-full bg-primary/5 border border-primary/20 rounded-3xl p-6 text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-all resize-none italic text-primary"
                />
              </div>
           </div>
        </div>

        {/* Curation Controls Area */}
        <div className="space-y-6">
           <div className="glass p-8 rounded-[40px] border-white/5 border-primary/20 bg-primary/5">
              <h3 className="text-[10px] font-black uppercase text-primary tracking-widest mb-6 italic flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> Vetting Status
              </h3>
              
              <div className="space-y-4">
                 <button 
                  type="button"
                  onClick={() => handleUpdate("vetted", !caseData.vetted)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${caseData.vetted ? 'bg-emerald-500 border-emerald-400 text-background' : 'bg-white/5 border-white/10 text-muted hover:border-emerald-500/50'}`}
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Verify as Vetted</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${caseData.vetted ? 'bg-background border-transparent' : 'border-white/20'}`}>
                       {caseData.vetted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />}
                    </div>
                 </button>

                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[9px] font-black uppercase text-muted tracking-widest italic">AI Processed</p>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold">{caseData.processed ? "Completed" : "Awaiting Summary"}</span>
                       <div className={`w-2 h-2 rounded-full ${caseData.processed ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[40px] border-white/5">
              <h3 className="text-[10px] font-black uppercase text-muted tracking-widest mb-6 italic flex items-center gap-2">
                 <Star className="w-4 h-4 text-amber-500" /> Significance
              </h3>
               <button 
                  type="button"
                  onClick={() => handleUpdate("landmark", !caseData.landmark)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${caseData.landmark ? 'bg-amber-500 border-amber-400 text-background' : 'bg-white/5 border-white/10 text-muted hover:border-amber-500/50'}`}
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Landmark Status</span>
                    <Star className={`w-4 h-4 ${caseData.landmark ? 'fill-background text-background' : 'text-muted'}`} />
                 </button>
           </div>
        </div>

      </form>
    </div>
  );
}
