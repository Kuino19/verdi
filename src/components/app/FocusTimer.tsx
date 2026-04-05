"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Zap, 
  Timer,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "@/components/app/UserContext";
import { addPoints } from "@/lib/firebase/db";

type TimerMode = "grind" | "short" | "long";

const MODES: Record<TimerMode, { label: string; time: number; color: string; icon: any }> = {
  grind: { label: "Grind", time: 25 * 60, color: "text-primary", icon: Zap },
  short: { label: "Short Break", time: 5 * 60, color: "text-emerald-400", icon: Coffee },
  long: { label: "Long Break", time: 15 * 60, color: "text-blue-400", icon: Coffee },
};

export default function FocusTimer() {
  const { uid } = useUserContext();
  const [mode, setMode] = useState<TimerMode>("grind");
  const [timeLeft, setTimeLeft] = useState(MODES.grind.time);
  const [isRunning, setIsRunning] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, timeLeft]);

  const handleComplete = async () => {
    setIsRunning(false);
    setShowComplete(true);
    if (mode === "grind" && uid) {
      await addPoints(uid, 20);
    }
    setTimeout(() => setShowComplete(false), 5000);
  };

  const toggle = () => setIsRunning(!isRunning);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].time);
  };

  const switchMode = (m: TimerMode) => {
    setMode(m);
    setTimeLeft(MODES[m].time);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / MODES[mode].time) * 100;
  const ModeIcon = MODES[mode].icon;

  return (
    <div className="flex items-center gap-3">
      
      {/* Time Display Badge */}
      <div className="relative group">
         <div className={`p-1 flex items-center gap-3 pl-3 rounded-xl glass border-white/5 transition-all hover:border-white/10 cursor-pointer ${isRunning ? 'animate-pulse bg-white/5' : ''}`}>
            <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="transparent" />
                    <motion.circle 
                        cx="12" cy="12" r="10" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="transparent" 
                        strokeDasharray="62.8"
                        animate={{ strokeDashoffset: 62.8 - (62.8 * (100 - progress)) / 100 }}
                        className={MODES[mode].color}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <ModeIcon className={`w-2.5 h-2.5 ${MODES[mode].color} fill-current opacity-70`} />
                </div>
            </div>
            
            <span className="text-sm font-black italic tracking-tighter w-10">
              {formatTime(timeLeft)}
            </span>

            <div className="flex items-center gap-1 pr-1">
              <button 
                onClick={toggle}
                className={`p-1.5 rounded-lg transition-all ${isRunning ? 'text-amber-500 hover:bg-amber-500/10' : 'text-primary hover:bg-primary/20 bg-primary/10'}`}
              >
                {isRunning ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              </button>
            </div>
         </div>

         {/* Extended Dropdown Control - Refined for Sidebar */}
         <AnimatePresence>
            <motion.div 
               initial={{ opacity: 0, height: 0, marginTop: 0 }}
               animate={{ opacity: 1, height: "auto", marginTop: 12 }}
               exit={{ opacity: 0, height: 0, marginTop: 0 }}
               className="overflow-hidden w-full h-auto z-10"
            >
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-muted tracking-widest italic">Focus Mode</span>
                  <button onClick={reset} className="p-1.5 hover:bg-white/5 rounded-lg text-muted transition-all">
                     <RotateCcw className="w-3 h-3" />
                  </button>
               </div>

               <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(MODES) as TimerMode[]).map((m) => (
                    <button 
                      key={m}
                      onClick={() => switchMode(m)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${mode === m ? `bg-primary/5 border-primary/20 ${MODES[m].color}` : 'border-transparent text-muted hover:bg-white/5'}`}
                    >
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${mode === m ? 'bg-primary/10' : ''}`}>
                             {m === 'grind' ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Coffee className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs font-bold">{MODES[m].label}</span>
                       </div>
                       <span className="text-[10px] font-mono opacity-50">{MODES[m].time / 60}m</span>
                    </button>
                  ))}
               </div>

               {mode === 'grind' && (
                 <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary italic">Grind Session = +20 XP</p>
                 </div>
               )}
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Completion Notification */}
      <AnimatePresence>
        {showComplete && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-8 right-8 p-6 glass border-emerald-500/20 rounded-[32px] shadow-2xl z-[1000] flex items-center gap-6"
          >
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Sparkles className="w-6 h-6 text-emerald-500 fill-emerald-500" />
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Session Clear!</p>
                <p className="text-sm font-bold">Incredible focus. {mode === "grind" ? "+20 XP added to stack." : "Break over."}</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
