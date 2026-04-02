"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ChevronRight,
  Save,
  Trash2,
  FileText
} from "lucide-react";
import { createCase } from "@/lib/firebase/db";
import { useRouter } from "next/navigation";

export default function NewCasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const processPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: base64,
            mimeType: "application/pdf",
            type: "case"
          })
        });

        const result = await response.json();
        if (result.error) {
          setError(result.error);
        } else {
          setExtractedData(result.data);
        }
        setIsProcessing(false);
      };
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData) return;
    setIsSaving(true);
    try {
      await createCase(extractedData);
      router.push("/admin/cases");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold mb-2 italic">Upload <span className="text-primary italic">Law Case</span></h1>
        <p className="text-muted italic">Upload a PDF judgment and let VERDI AI structure it for the study library.</p>
      </header>

      {!extractedData ? (
        <section className="max-w-2xl">
          <div className={`p-16 border-2 border-dashed rounded-[48px] flex flex-col items-center justify-center transition-all ${file ? 'border-primary/40 bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
             <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center mb-8">
               {isProcessing ? (
                 <Loader2 className="w-10 h-10 text-primary animate-spin" />
               ) : (
                 <FileUp className="w-10 h-10 text-muted" />
               )}
             </div>
             
             {file ? (
               <div className="text-center">
                  <p className="text-lg font-bold mb-2">{file.name}</p>
                  <p className="text-xs text-muted mb-8 italic">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Parsing</p>
                  <button 
                    onClick={processPDF}
                    disabled={isProcessing}
                    className="px-10 py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" /> {isProcessing ? 'Analyzing Case...' : 'Start AI Parsing'}
                  </button>
               </div>
             ) : (
               <label className="text-center cursor-pointer">
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                  <p className="text-lg font-bold mb-2">Drop judgment PDF here</p>
                  <p className="text-xs text-muted italic">Click to browse your files (Max 10MB)</p>
               </label>
             )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500 italic"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      ) : (
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid lg:grid-cols-12 gap-10"
        >
          {/* Editor Area */}
          <div className="lg:col-span-8 space-y-8">
             <div className="glass p-10 rounded-[56px] border-white/10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">Case Title</label>
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-lg font-bold italic focus:outline-none focus:border-primary/50 transition-all font-serif"
                        value={extractedData.title}
                        onChange={(e) => setExtractedData({...extractedData, title: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">Citation</label>
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-lg font-mono focus:outline-none focus:border-primary/50 transition-all"
                        value={extractedData.citation}
                        onChange={(e) => setExtractedData({...extractedData, citation: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">Subject</label>
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all"
                        value={extractedData.subject}
                        onChange={(e) => setExtractedData({...extractedData, subject: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">Year</label>
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all text-center"
                        value={extractedData.year}
                        onChange={(e) => setExtractedData({...extractedData, year: e.target.value})}
                      />
                   </div>
                   <div className="flex items-center gap-4 pt-10 pl-4">
                      <input 
                        type="checkbox"
                        id="landmark"
                        className="w-5 h-5 accent-primary bg-white/5 border-white/10 rounded-lg"
                        checked={extractedData.landmark}
                        onChange={(e) => setExtractedData({...extractedData, landmark: e.target.checked})}
                      />
                      <label htmlFor="landmark" className="text-xs font-black uppercase tracking-widest cursor-pointer">Landmark Case</label>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">Facts of the Case</label>
                   <textarea 
                     rows={6}
                     className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 px-8 text-sm leading-relaxed text-muted focus:outline-none focus:border-primary/50 transition-all italic"
                     value={extractedData.facts}
                     onChange={(e) => setExtractedData({...extractedData, facts: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">Legal Issues</label>
                   <textarea 
                     rows={4}
                     className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 px-8 text-sm leading-relaxed text-muted focus:outline-none focus:border-primary/50 transition-all font-bold"
                     value={extractedData.issues}
                     onChange={(e) => setExtractedData({...extractedData, issues: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-4">The Decision</label>
                   <textarea 
                     rows={4}
                     className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 px-8 text-sm leading-relaxed text-muted focus:outline-none focus:border-primary/50 transition-all italic"
                     value={extractedData.decision}
                     onChange={(e) => setExtractedData({...extractedData, decision: e.target.value})}
                   />
                </div>
             </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <div className="p-10 glass rounded-[48px] border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent sticky top-12">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold mb-2 italic">Audit Complete</h3>
                <p className="text-xs text-muted mb-8 leading-relaxed italic">VERDI AI has successfully structured the PDF judgment. Please review the details before committing to the repository.</p>
                
                <div className="space-y-4 mb-10">
                   <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase text-muted tracking-widest">Judgment Parsed</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase text-muted tracking-widest">Principles Extracted</span>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="w-full py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                   >
                     {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                     Publish to Library
                   </button>
                   <button 
                     onClick={() => setExtractedData(null)}
                     className="w-full py-5 glass text-rose-500 font-bold rounded-2xl border-white/5 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-3"
                   >
                     <Trash2 className="w-4 h-4" /> Discard
                   </button>
                </div>
             </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
