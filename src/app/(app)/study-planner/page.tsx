"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  BrainCircuit,
  Zap,
  Loader2,
  CheckCircle2,
  Star,
  ListTodo
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { addPoints } from "@/lib/firebase/db";
import Confetti from "@/components/app/Confetti";

interface DailyPlan {
  dayOffset: number;
  title: string;
  focusAreas: string[];
  estimatedHours: number;
}

export default function StudyPlannerPage() {
  const { uid, isPremium } = useUserContext();
  const [topic, setTopic] = useState("");
  const [daysAvailable, setDaysAvailable] = useState<number>(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/planner", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ topic, daysAvailable })
      });
      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.details || data.error || "Generation failed.");
      }

      setPlans(data.plan);
      setCompletedDays([]);

      // Give 20 points for structuring their studying!
      if (uid) {
         await addPoints(uid, 20);
      }
    } catch (error: any) {
      console.error("Planner Gen Error:", error);
      setErrorMsg(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDayComplete = async (offset: number) => {
    if (completedDays.includes(offset)) return; // Already completed
    const newCompleted = [...completedDays, offset];
    setCompletedDays(newCompleted);

    // Give 50 points per completed study day
    if (uid) {
      await addPoints(uid, 50);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
        <Confetti active={showConfetti} />
        <div>
          <h1 className="text-4xl font-bold mb-2">Study <span className="text-gradient">Planner</span></h1>
          <p className="text-muted italic">Let AI break down massive syllabuses into optimized daily timetables.</p>
        </div>
      </header>

      {plans.length === 0 ? (
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[48px] p-12 lg:p-20 border-white/5 flex flex-col items-center justify-center text-center"
         >
            <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
               <BrainCircuit className="w-12 h-12 text-primary opacity-90" />
            </div>
            
            <h2 className="text-3xl font-bold italic mb-4">What's your next big exam?</h2>
            <p className="text-muted max-w-sm mx-auto mb-10 leading-relaxed">
               Give Verdi the course module and the number of days you have left to study. It will instantly output a rigorous, fully-planned curriculum. 
            </p>

            <form onSubmit={handleGeneratePlan} className="w-full max-w-md space-y-4 px-4 sm:px-0">
               <input 
                 type="text" 
                 placeholder="e.g. Criminal Law (Homicide)..." 
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 disabled={isGenerating}
                 required
                 className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-center focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted/50 text-sm" 
               />
               
               <div className="flex flex-col sm:flex-row gap-4">
                  <select 
                    value={daysAvailable} 
                    onChange={e => setDaysAvailable(Number(e.target.value))}
                    disabled={isGenerating}
                    className="w-full sm:w-[160px] bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none disabled:opacity-50"
                  >
                     <option value={3}>3 Days</option>
                     <option value={7}>1 Week</option>
                     <option value={14} disabled={!isPremium}>2 Weeks (Pro)</option>
                     <option value={30} disabled={!isPremium}>1 Month (Pro)</option>
                  </select>
                  <button 
                    type="submit" 
                    disabled={isGenerating || !topic.trim()}
                    className="w-full sm:flex-1 bg-primary text-background font-black rounded-2xl py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Optimize Plan <Zap className="w-4 h-4 fill-current" /></>}
                  </button>
               </div>
               {errorMsg && (
                 <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold mt-4">
                   {errorMsg}
                 </div>
               )}
            </form>
         </motion.div>
      ) : (
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
         >
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold flex items-center gap-3 italic text-primary">
                  <Calendar className="w-5 h-5 text-primary" />
                  Your Optimized {topic} Plan
               </h3>
               <button onClick={() => setPlans([])} className="px-6 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest text-muted hover:text-white transition-all border border-white/5">
                  Discard & Restart
               </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
               <div className="glass p-8 rounded-[40px] border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-3 italic">
                  <Zap className="w-5 h-5 text-primary fill-current transition-all group-hover:scale-125" />
                  Productivity Pulse
               </h3>
               <div className="flex flex-col items-center py-4 group">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                           initial={{ strokeDashoffset: 364.4 }}
                           animate={{ strokeDashoffset: 72.8 }}
                           transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                           cx="64" cy="64" r="58" stroke="#C9A227" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeLinecap="round" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5 }}
                          className="text-2xl font-black"
                        >
                          80%
                        </motion.span>
                        <span className="text-[8px] font-black text-muted uppercase tracking-widest italic">Weekly Goal</span>
                     </div>
                  </div>
                  <p className="text-xs text-muted text-center italic">
                     You're <span className="text-foreground font-bold">2 hours ahead</span> of your weekly study goal. Keep it up!
                  </p>
               </div>
            </div>

            <div className="lg:col-span-2 grid gap-6">
               {plans.map((plan, idx) => {
                  const isCompleted = completedDays.includes(plan.dayOffset);
                  return (
                     <div key={idx} className={`glass p-8 rounded-3xl transition-all border relative ${
                        isCompleted ? "border-emerald-500/30 opacity-60" : "border-primary/20 hover:border-primary/40"
                     }`}>
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted italic flex items-center gap-1.5 mb-2">
                                 <ListTodo className="w-3 h-3 text-primary" /> Day {plan.dayOffset + 1}
                              </span>
                              <h4 className={`text-lg font-bold leading-relaxed ${isCompleted ? 'text-emerald-500 line-through' : ''}`}>
                                 {plan.title}
                              </h4>
                           </div>
                           <div className="px-3 py-1 bg-white/5 text-[10px] font-bold text-muted uppercase tracking-widest rounded-lg">
                              ~{plan.estimatedHours} hrs
                           </div>
                        </div>

                        <ul className="space-y-2 mb-8 pl-4 border-l-2 border-white/5">
                           {plan.focusAreas.map((focus, fIdx) => (
                              <li key={fIdx} className={`text-sm tracking-wide ${isCompleted ? 'text-emerald-500/50 line-through' : 'text-muted'}`}>
                                 • {focus}
                              </li>
                           ))}
                        </ul>

                        <button 
                           onClick={() => toggleDayComplete(plan.dayOffset)}
                           disabled={isCompleted}
                           className={`w-full py-3 rounded-2xl text-xs flex items-center justify-center font-black uppercase tracking-widest transition-all ${
                              isCompleted 
                                 ? "bg-emerald-500/10 text-emerald-500 cursor-not-allowed border border-emerald-500/20" 
                                 : "glass text-foreground hover:bg-emerald-500 hover:text-background border border-white/10"
                           }`}
                        >
                           {isCompleted ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Completed (+50 XP)</> : "Mark as Completed"}
                        </button>
                     </div>
                  );
               })}
            </div>
          </div>
         </motion.div>
      )}
    </div>
  );
}
