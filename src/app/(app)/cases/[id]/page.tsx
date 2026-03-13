"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Plus
} from "lucide-react";
import Link from "next/link";
export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("facts");
  const [isSaved, setIsSaved] = useState(true);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const handleAIExplain = async () => {
    setIsAIThinking(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Explain the key legal principle in Donoghue v Stevenson to a law student using a simple analogy.` }],
          type: "summarize"
        })
      });
      const data = await response.json();
      setAiResponse(data.content);
    } catch (error) {
      setAiResponse("I'm sorry, I couldn't generate an explanation right now.");
    } finally {
      setIsAIThinking(false);
    }
  };

  const tabs = [
    { id: "facts", label: "Facts of the Case", icon: BookOpen },
    { id: "issues", label: "Legal Issues", icon: AlertCircle },
    { id: "reasoning", label: "Court's Reasoning", icon: Gavel },
    { id: "decision", label: "Final Decision", icon: Scale }
  ];

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
           <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest italic">LANDMARK CASE</span>
           <span className="px-4 py-1.5 glass text-muted border-white/10 rounded-full text-xs font-black uppercase tracking-widest">TORT LAW</span>
           <span className="px-4 py-1.5 glass text-muted border-white/10 rounded-full text-xs font-black uppercase tracking-widest">NEGLIGENCE</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic leading-tight">Donoghue v Stevenson</h1>
        <p className="text-xl font-mono text-muted">[1932] AC 562, (1932) UKHL 100</p>
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
              
              {aiResponse ? (
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-muted italic mb-4 leading-relaxed">
                   {aiResponse}
                </div>
              ) : null}

              <button 
                onClick={handleAIExplain}
                disabled={isAIThinking}
                className="w-full py-3 bg-emerald-500 text-background text-[10px] font-black rounded-xl uppercase tracking-widest disabled:opacity-50"
              >
                 {isAIThinking ? 'Analyzing...' : 'Explain Principle'}
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
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
                   <div className="prose prose-invert max-w-none text-muted leading-relaxed space-y-4 text-lg">
                      <p>
                        The appellant, Mrs Donoghue, went to a café in Paisley with a friend who bought her a bottle of ginger beer. 
                        The bottle was made of dark, opaque glass. Mrs Donoghue drank some of the ginger beer and then poured the remainder 
                        into a tumbler.
                      </p>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5 font-medium italic">
                        "As she did so, the decomposed remains of a snail floated out of the bottle and into the tumbler."
                      </div>
                      <p>
                        Mrs Donoghue subsequently suffered from shock and severe gastroenteritis. She sued the manufacturer, 
                        Mr Stevenson, in the Court of Session, claiming that he had a duty of care to ensure that the ginger beer was 
                        free from such contaminants.
                      </p>
                      <p>
                        She had no contract with Mr Stevenson (the retailer did), so the case was brought in negligence.
                      </p>
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
                   <div className="space-y-6">
                      <div className="p-8 glass rounded-3xl border-l-8 border-orange-500">
                         <h4 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Primary Issue</h4>
                         <p className="text-xl font-bold leading-relaxed">
                            Does a manufacturer of products owe a duty of care to the ultimate consumer, in the absence of a contractual relationship?
                         </p>
                      </div>
                      <p className="text-muted text-lg italic pl-8">
                         Prior to this case, the general rule was that there could be no liability without a contract between the parties.
                      </p>
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
                   <div className="prose prose-invert max-w-none text-muted leading-relaxed space-y-6 text-lg">
                      <p>
                        Lord Atkin formulated the famous <span className="text-foreground font-bold">"Neighbor Principle"</span>, 
                        drawing inspiration from the biblical command to love thy neighbor.
                      </p>
                      <div className="p-10 glass rounded-[40px] border-white/10 text-foreground italic font-serif text-2xl leading-relaxed relative">
                         <div className="absolute top-4 left-6 text-6xl text-primary/20">"</div>
                         "You must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbor."
                      </div>
                      <p>
                        He defined a "neighbor" as someone who is so closely and directly affected by my act that I ought reasonably 
                        to have them in contemplation when I am directing my mind to the acts or omissions in question.
                      </p>
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
                         <p className="text-3xl font-black italic mb-6">Judgment for the Appellant (Mrs Donoghue).</p>
                         <p className="text-muted text-lg leading-relaxed">
                            The House of Lords ruled that manufacturers owe a duty of care to consumers. Stevenson was held liable 
                            for the snail in the ginger beer.
                         </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="p-6 glass rounded-3xl">
                            <h5 className="text-[10px] font-black uppercase text-muted mb-2 tracking-widest italic">Ratio Decidendi</h5>
                            <p className="text-sm font-bold">Manufacturers owe a duty of care to consumers who use their products, even without a contract.</p>
                         </div>
                         <div className="p-6 glass rounded-3xl">
                            <h5 className="text-[10px] font-black uppercase text-muted mb-2 tracking-widest italic">Legacy</h5>
                            <p className="text-sm font-bold">Birth of modern negligence law and the neighbor principle globally.</p>
                         </div>
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
    </div>
  );
}
