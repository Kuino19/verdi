"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  Sparkles, 
  FileText, 
  Download, 
  CheckCircle2, 
  ChevronDown, 
  AlertTriangle,
  FileQuestion,
  HelpCircle,
  Clock,
  RotateCcw
} from "lucide-react";
import { useState } from "react";

const mockQuestions = [
  {
    id: 1,
    question: "Discuss the 'Neighbor Principle' as established in Donoghue v Stevenson. In what circumstances can this duty be excluded?",
    type: "Essay",
    difficulty: "Medium",
    modelAnswer: "The Neighbor Principle states that you must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbor. A neighbor is defined as someone closely and directly affected by the act..."
  },
  {
    id: 2,
    question: "Under the Rule in Rylands v Fletcher, what are the four essential elements for establishing liability for the escape of non-natural substances?",
    type: "Short Answer",
    difficulty: "Hard",
    modelAnswer: "1. Accumulation on the defendant's land. 2. A non-natural use of the land. 3. The substance likely to do mischief if it escapes. 4. Escape must occur causing damage."
  },
  {
    id: 3,
    question: "Explain the difference between a 'Special Relationship' and 'Assumption of Responsibility' in the context of pure economic loss.",
    type: "Problem Question",
    difficulty: "Hard",
    modelAnswer: "A special relationship exists when there is proximity and reliance (Hedley Byrne v Heller). Assumption of responsibility refers to a voluntary undertaking of a task which the claimant relies upon..."
  }
];

export default function ExamGeneratorPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Generate 3 law exam questions based on common Nigerian law exam topics like Tort, Contract, or Constitutional law. Provide a question, type, difficulty, and a model answer for each in a JSON format: { questions: [{ id, question, type, difficulty, modelAnswer }] }" }],
          type: "exam"
        })
      });
      const data = await response.json();
      
      // Attempt to parse JSON from AI response if it's wrapped in text
      const content = data.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setGeneratedQuestions(parsed.questions || []);
      } else {
        // Fallback or manual parsing if needed
        setGeneratedQuestions([]);
      }
      
      setIsGenerated(true);
    } catch (error) {
      console.error("Exam Gen Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold mb-2">Exam <span className="text-gradient">Generator</span></h1>
        <p className="text-muted italic">Transform your lecture notes into high-quality mock examination questions.</p>
      </header>

      {!isGenerated ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-16 rounded-[48px] border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-all cursor-pointer"
          onClick={handleUpload}
        >
          {isUploading ? (
             <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <div>
                   <h3 className="text-xl font-bold mb-2 animate-pulse">Analyzing Lecture Handout...</h3>
                   <p className="text-sm text-muted">AIEngine is extracting key principles and questioning styles</p>
                </div>
             </div>
          ) : (
            <>
              <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <FileUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 italic">Upload Your Notes (PDF)</h3>
              <p className="text-muted max-w-sm mx-auto leading-relaxed mb-8">
                Drop your PDF lecture notes here. We'll generate realistic exam questions based on the content's syllabus.
              </p>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl text-xs font-bold text-muted uppercase tracking-widest border border-white/5">
                 MAX FILE SIZE: 25MB
              </div>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 glass rounded-[32px] border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Generation Complete</h3>
                    <p className="text-sm text-muted italic">Found 12 focal points, generated 3 premium questions.</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2">
                 Download PDF <Download className="w-5 h-5" />
              </button>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-xs font-black text-muted uppercase tracking-[0.2em] italic">Mock Examination Paper</h4>
                 <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted"><Clock className="w-3 h-3" /> 2 Hours</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted"><HelpCircle className="w-3 h-3" /> 100 Marks</span>
                 </div>
              </div>

              {(generatedQuestions.length > 0 ? generatedQuestions : mockQuestions).map((q, i) => (
                <div key={q.id || i} className="glass rounded-[32px] border-white/5 overflow-hidden">
                   <div 
                     className="p-8 cursor-pointer flex items-start justify-between group"
                     onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                   >
                      <div className="flex gap-6 items-start">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-primary flex-shrink-0">
                            Q{i+1}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-3">
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                 q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                               }`}>{q.difficulty}</span>
                               <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{q.type}</span>
                            </div>
                            <p className="text-lg font-bold leading-relaxed">{q.question}</p>
                         </div>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-muted group-hover:text-primary transition-all ${expandedId === q.id ? 'rotate-180' : ''}`} />
                   </div>
                   
                   <AnimatePresence>
                      {expandedId === q.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-white/5"
                        >
                           <div className="p-8 bg-slate-900/50">
                              <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 italic">VERDI AI Model Answer</h5>
                              <div className="p-6 glass rounded-2xl border-primary/10 text-sm leading-relaxed text-muted italic">
                                 {q.modelAnswer}
                              </div>
                              <div className="mt-6 flex justify-end gap-3">
                                 <button className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-foreground">Report Issue</button>
                                 <button className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">Mark as Learned</button>
                              </div>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              ))}
           </div>

           <div className="p-8 glass rounded-[32px] border-primary/20 flex items-center gap-4 bg-gradient-to-r from-primary/5 to-transparent">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <p className="text-xs text-muted leading-relaxed">
                 <span className="text-foreground font-bold">Pro-Tip:</span> For better results, ensure your PDF is clear and text-searchable. Scanned images may result in lower accuracy.
              </p>
           </div>

           <button 
             onClick={() => { setIsGenerated(false); setIsUploading(false); }}
             className="w-full py-6 glass rounded-2xl border-white/5 text-sm font-black text-muted uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-4"
           >
              <RotateCcw className="w-5 h-5" /> Generate Another Paper
           </button>
        </motion.div>
      )}
    </div>
  );
}

