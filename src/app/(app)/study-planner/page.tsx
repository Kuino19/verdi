"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  Zap,
  Star
} from "lucide-react";
import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = Array.from({ length: 31 }, (_, i) => i + 1);

const scheduledTasks = [
  { day: 14, title: "Tort: Negligence Summaries", status: "Done", priority: "High" },
  { day: 15, title: "Contract Law Mock Exam", status: "Pending", priority: "Critical" },
  { day: 17, title: "Criminal Law CaseFlow", status: "Pending", priority: "Medium" },
  { day: 20, title: "Constitutional Law Quiz", status: "Pending", priority: "High" }
];

export default function StudyPlannerPage() {
  const [currentDate] = useState(new Date());

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Study <span className="text-gradient">Planner</span></h1>
          <p className="text-muted italic">Organize your semester and optimize your exam preparation path.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-3 glass rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/5 transition-all">
              Manage Exams
           </button>
           <button className="px-6 py-3 bg-primary text-background font-black rounded-xl text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
              <Plus className="w-4 h-4" /> Add Task
           </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass p-8 rounded-[40px] border-white/5">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-bold flex items-center gap-3 italic">
                    <Calendar className="w-6 h-6 text-primary" />
                    March 2026
                 </h2>
                 <div className="flex gap-2">
                    <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-2 glass rounded-lg hover:bg-white/10 transition-all"><ChevronRight className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-6">
                 {days.map(d => (
                   <div key={d} className="text-center text-[10px] font-black text-muted uppercase tracking-[0.2em]">{d}</div>
                 ))}
              </div>

              <div className="grid grid-cols-7 gap-3">
                 {dates.map((d, i) => {
                   const task = scheduledTasks.find(t => t.day === d);
                   return (
                     <motion.div 
                       key={i}
                       whileHover={{ scale: 1.05 }}
                       className={`aspect-square rounded-2xl border p-3 flex flex-col justify-between transition-all group cursor-pointer relative ${
                         d === 13 
                           ? "bg-primary text-background border-primary" 
                           : task 
                           ? "glass border-primary/30" 
                           : "glass border-white/5 hover:border-white/20"
                       }`}
                     >
                        <span className={`text-xs font-bold ${d === 13 ? 'text-background' : 'text-foreground'}`}>{d}</span>
                        {task && (
                           <div className={`w-2 h-2 rounded-full mx-auto ${task.status === 'Done' ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`}></div>
                        )}
                        {d === 13 && (
                           <div className="absolute top-1 right-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-background"></div>
                           </div>
                        )}
                     </motion.div>
                   );
                 })}
              </div>
           </div>

           <div className="p-8 glass rounded-[40px] border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                 <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-2 italic">
                    <BrainCircuit className="w-4 h-4" /> AI Auto-Schedule
                 </div>
                 <h3 className="text-xl font-bold mb-2">Let AI optimize your plan</h3>
                 <p className="text-sm text-muted">We can analyze your weak points and upcoming exams to automatically shift your study slots for maximum efficiency.</p>
              </div>
              <button className="px-10 py-4 bg-emerald-500 text-background font-black rounded-2xl shadow-xl shadow-emerald-500/20">
                 Run AI Scheduler
              </button>
           </div>
        </div>

        {/* Task List & Focus */}
        <div className="space-y-8">
           <div className="glass p-8 rounded-[40px] border-white/5">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3 italic">
                 <Clock className="w-5 h-5 text-primary" />
                 Today's Focus
              </h3>
              <div className="space-y-6">
                 {scheduledTasks.filter(t => t.day === 14 || t.day === 15).map((t, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between">
                         <span className={`text-[10px] font-black uppercase tracking-widest italic ${
                           t.priority === 'Critical' ? 'text-rose-500' : 'text-primary'
                         }`}>{t.priority} Priority</span>
                         <span className="text-[10px] font-bold text-muted uppercase">14:00 — 16:30</span>
                      </div>
                      <div className="p-5 glass rounded-2xl border-white/10 hover:border-primary/30 transition-all cursor-pointer">
                         <h4 className="font-bold text-sm mb-1">{t.title}</h4>
                         <div className="flex items-center gap-2 mt-3">
                            <div className="h-1 flex-grow bg-white/10 rounded-full overflow-hidden">
                               <div className={`h-full bg-primary ${t.status === 'Done' ? 'w-full' : 'w-1/3'}`}></div>
                            </div>
                            <span className="text-[10px] font-bold text-muted">{t.status === 'Done' ? '100%' : '30%'}</span>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
                    <Star className="w-8 h-8 text-white/5 mb-4" />
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">No more tasks for today</p>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[40px] border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3 italic">
                 <Zap className="w-5 h-5 text-primary fill-current" />
                 Productivity Pulse
              </h3>
              <div className="flex flex-col items-center py-4">
                 <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                       <circle cx="64" cy="64" r="58" stroke="#C9A227" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="72.8" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-2xl font-black">80%</span>
                       <span className="text-[8px] font-black text-muted uppercase tracking-widest italic">Weekly Goal</span>
                    </div>
                 </div>
                 <p className="text-xs text-muted text-center italic">
                    You're <span className="text-foreground font-bold">2 hours ahead</span> of your weekly study goal. Keep it up!
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
