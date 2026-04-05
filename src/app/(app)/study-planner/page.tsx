"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  BrainCircuit,
  Zap,
  Loader2,
  CheckCircle2,
  Star,
  ListTodo,
  Sparkles,
  Clock,
  Timer,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  Download
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { fetchActiveStudyPlan, updatePlanDayProgress, addPoints, incrementUsage, saveStudyPlan } from "@/lib/firebase/db";
import PremiumGuard from "@/components/shared/PremiumGuard";
import Confetti from "@/components/app/Confetti";
import FocusTimer from "@/components/app/FocusTimer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DailyPlan {
  dayOffset: number;
  title: string;
  focusAreas: string[];
  estimatedHours: number;
}

export default function StudyPlannerPage() {
  const { uid, isPremium, studyPlanCount } = useUserContext();
  const [topic, setTopic] = useState("");
  const [daysAvailable, setDaysAvailable] = useState<number>(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [briefs, setBriefs] = useState<Record<number, string>>({});
  const [loadingBrief, setLoadingBrief] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeBrief, setActiveBrief] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (uid) {
      refreshPlans();
    }
  }, [uid]);

  const refreshPlans = async () => {
    if (!uid) return;
    try {
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/client");
      const plansRef = collection(db, "users", uid, "studyPlans");
      const q = query(plansRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const plansList = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setAllPlans(plansList);
      
      if (plansList.length > 0 && plans.length === 0) {
        const latest: any = plansList[0];
        setPlans(latest.plan);
        setTopic(latest.topic);
        setActivePlanId(latest.id);
        setCompletedDays(latest.completedDays || []);
      }
    } catch (e) {
      console.error("Refresh plans error", e);
    }
  };

  const selectPlan = (p: any) => {
    setPlans(p.plan);
    setTopic(p.topic);
    setActivePlanId(p.id);
    setCompletedDays(p.completedDays || []);
    setCurrentPage(1); // Reset pagination
  };

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
      if (!response.ok) throw new Error(data.details || data.error || "Generation failed.");
      if (uid) {
         const planId = await saveStudyPlan(uid, topic, data.plan);
         setActivePlanId(planId);
         setPlans(data.plan);
         setCompletedDays([]);
         await addPoints(uid, 20);
         await incrementUsage(uid, "studyPlanCount");
         await refreshPlans();
         setCurrentPage(1);
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDayComplete = async (offset: number) => {
    if (completedDays.includes(offset)) return;
    const newCompleted = [...completedDays, offset];
    setCompletedDays(newCompleted);
    if (uid && activePlanId) {
      await updatePlanDayProgress(uid, activePlanId, newCompleted);
      await addPoints(uid, 50);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleGetBrief = async (dayOffset: number, title: string, focusAreas: string[]) => {
    // If brief already exists, just open the modal
    if (briefs[dayOffset]) {
      setActiveBrief(briefs[dayOffset]);
      setShowModal(true);
      return;
    }

    if (loadingBrief !== null) return;
    setLoadingBrief(dayOffset);
    try {
      const res = await fetch("/api/planner/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, title, focusAreas }),
      });
      const data = await res.json();
      if (data.brief) {
        setBriefs(prev => ({ ...prev, [dayOffset]: data.brief }));
        setActiveBrief(data.brief);
        setShowModal(true);
      } else {
        const err = `Failed: ${data.error || "AI took too long to respond."}`;
        setBriefs(prev => ({ ...prev, [dayOffset]: err }));
        setActiveBrief(err);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Failed to get brief:", err);
    } finally {
      setLoadingBrief(null);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(plans.length / pageSize);
  const paginatedPlans = plans.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
        <Confetti active={showConfetti} />
        <div>
          <h1 className="text-4xl font-bold mb-2">Study <span className="text-gradient">Planner</span></h1>
          <p className="text-muted italic">Let AI break down massive syllabuses into optimized daily timetables.</p>
        </div>
      </header>

      {isMounted && (
        plans.length === 0 ? (
          <PremiumGuard isFeatureLocked={!isPremium && studyPlanCount >= 1}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[48px] p-12 lg:p-20 border-white/5 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                <BookOpen className="w-12 h-12 text-primary opacity-90" />
              </div>
              
              <h2 className="text-3xl font-bold italic mb-4">What's your next big exam?</h2>
              <p className="text-muted max-w-sm mx-auto mb-10 leading-relaxed text-sm">
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
              </form>

              {allPlans.length > 0 && (
                <div className="mt-12 w-full pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-4 italic">Load Existing Plan</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {allPlans.map(p => (
                      <button key={p.id} onClick={() => selectPlan(p)} className="px-4 py-2 glass rounded-xl text-xs font-bold hover:border-primary/40 transition-all">
                        {p.topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </PremiumGuard>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3 italic text-primary">
                <Calendar className="w-5 h-5 text-primary" />
                {topic} Hub
              </h3>
              <button onClick={() => { setPlans([]); setActivePlanId(null); }} className="px-6 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest text-muted hover:text-white transition-all border border-white/5">
                New Exam Plan
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Sidebar Hub */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glass p-8 rounded-[40px] border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
                  <h3 className="text-sm font-bold mb-6 flex items-center gap-3 italic">
                    <Timer className="w-4 h-4 text-primary" />
                    Deep Focus
                  </h3>
                  <div className="flex justify-center">
                    <FocusTimer />
                  </div>
                </div>

                <div className="glass p-8 rounded-[40px] border-white/5 space-y-4">
                  <p className="text-[10px] font-black uppercase text-muted tracking-widest italic">All Active Exams</p>
                  <div className="space-y-2">
                    {allPlans.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => selectPlan(p)}
                        className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all border ${activePlanId === p.id ? 'border-primary/40 bg-primary/5 text-primary' : 'border-transparent text-muted hover:bg-white/5'}`}
                      >
                        {p.topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                <div className="grid gap-6">
                  {paginatedPlans.map((plan, idx) => {
                    const isCompleted = completedDays.includes(plan.dayOffset);
                    return (
                      <div key={idx} className={`glass p-8 rounded-3xl transition-all border relative ${
                        isCompleted ? "border-emerald-500/30 opacity-60" : "border-primary/20 hover:border-primary/40"
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted italic flex items-center gap-1.5 mb-2">
                              <ListTodo className="w-3 h-3 text-primary" /> Day {plan.dayOffset + 1}
                            </span>
                            <h4 className={`text-lg font-bold leading-relaxed ${isCompleted ? 'text-emerald-500 line-through' : ''}`}>
                              {plan.title}
                            </h4>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                            <div className="px-3 py-1 bg-white/5 text-[10px] font-bold text-muted uppercase tracking-widest rounded-lg">
                              ~{plan.estimatedHours} hrs
                            </div>
                            {!isCompleted && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleGetBrief(plan.dayOffset, plan.title, plan.focusAreas); }}
                                disabled={loadingBrief === plan.dayOffset}
                                className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
                              >
                                {loadingBrief === plan.dayOffset ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 fill-current" />}
                                Detailed Guide
                              </button>
                            )}
                          </div>
                        </div>

                        <ul className="space-y-2 mb-6 pl-4 border-l-2 border-white/5">
                          {plan.focusAreas.map((focus, fIdx) => (
                            <li key={fIdx} className={`text-sm tracking-wide ${isCompleted ? 'text-emerald-500/50 line-through' : 'text-muted'}`}>
                              • {focus}
                            </li>
                          ))}
                        </ul>

                        <button 
                          onClick={() => toggleDayComplete(plan.dayOffset)}
                          className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                            isCompleted 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default" 
                            : "bg-white/5 text-muted hover:bg-white/10 hover:text-white border border-white/5"
                          }`}
                        >
                          {isCompleted ? "Goal Completed" : "Mark as Finished"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest italic">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         disabled={currentPage === 1}
                         className="p-2 glass rounded-xl text-muted disabled:opacity-20 hover:text-white transition-all"
                       >
                          <ChevronLeft className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                         disabled={currentPage === totalPages}
                         className="p-2 glass rounded-xl text-muted disabled:opacity-20 hover:text-white transition-all"
                       >
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      )}

      {/* Immersive Study Guide Modal */}
      <AnimatePresence>
        {showModal && activeBrief && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] glass border-white/10 rounded-[48px] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold italic">Academic Study Guide</h2>
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest">Enhanced AI Reading Aid</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-3 glass rounded-2xl text-muted hover:text-primary transition-all">
                      <Printer className="w-5 h-5" />
                   </button>
                   <button onClick={() => setShowModal(false)} className="p-3 glass rounded-2xl text-muted hover:text-rose-500 transition-all">
                      <X className="w-5 h-5" />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar focus-guide">
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-primary prose-code:text-emerald-400 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeBrief}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/5 flex flex-col items-center gap-3 shrink-0">
                 <p className="text-[10px] font-black uppercase text-muted tracking-widest italic">Verdi Immersive Learning System</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
