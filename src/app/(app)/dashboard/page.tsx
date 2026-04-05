"use client";

import { motion } from "framer-motion";
import { 
  Flame, Clock, BookMarked, Trophy, ArrowRight, 
  TrendingUp, AlertCircle, CalendarDays, BrainCircuit, Check
} from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/components/app/UserContext";
import { useState, useEffect } from "react";
import { fetchUserTasks, updateTaskState, fetchActiveStudyPlan } from "@/lib/firebase/db";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const masteryData = [
  { subject: 'Tort', score: 85, full: 100 },
  { subject: 'Contract', score: 62, full: 100 },
  { subject: 'Criminal', score: 91, full: 100 },
  { subject: 'Company', score: 45, full: 100 },
  { subject: 'Constitutional', score: 78, full: 100 },
];

const statsTemplate = [
  { label: "Cases Studied", value: "48", icon: BookMarked, color: "text-primary" },
  { label: "Study Hours", value: "142h", icon: Clock, color: "text-emerald-400" },
  { label: "Practice Tests", value: "15", icon: TrendingUp, color: "text-blue-400" },
  { label: "XP Points", value: "0", icon: Trophy, color: "text-amber-400" },
];

export default function DashboardPage() {
  const { uid, userName, streak, points, isPremium, activityLog } = useUserContext();
  const [tasks, setTasks] = useState<any[]>([]);
  const [counts, setCounts] = useState({ cases: 0, tests: 0 });
  const [activePlan, setActivePlan] = useState<any>(null);

  useEffect(() => {
    if (uid) {
      // Load standard tasks
      fetchUserTasks(uid).then((res) => {
        if (res.length > 0) setTasks(res);
      });
      
      // Load active study plan
      fetchActiveStudyPlan(uid).then(plan => {
        if (plan) {
           setActivePlan(plan);
           // Find the first non-completed day
           const nextDayIndex = plan.plan.findIndex((_: any, i: number) => !plan.completedDays?.includes(i));
           if (nextDayIndex !== -1) {
             const day = plan.plan[nextDayIndex];
             // [x] Fix: Filter out any existing plan tasks to avoid duplicates on re-render
             const tasksToMap = day.focusAreas || day.tasks || [];
             const studyTasks = Array.isArray(tasksToMap) ? tasksToMap.map((t: any, idx: number) => ({
               id: `plan-${nextDayIndex}-${idx}`,
               task: `Study: ${t.title || t}`,
               done: false,
               isPlanTask: true
             })) : [];
             
             setTasks(prev => {
                const nonPlanTasks = prev.filter(t => !t.id.startsWith("plan-"));
                return [...nonPlanTasks, ...studyTasks];
             });
           }
        }
      });
      
      setCounts({
        cases: 12 + (activityLog?.length || 0),
        tests: 5 + Math.floor((activityLog?.length || 0) / 2)
      });
    }
  }, [uid, activityLog]);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    if (taskId.startsWith("plan-")) {
       // Just a visual toggle for plan tasks for now (they should be synced to study-planner page)
       setTasks(tasks.map(t => t.id === taskId ? { ...t, done: !currentStatus } : t));
       return;
    }
    setTasks(tasks.map(t => t.id === taskId ? { ...t, done: !currentStatus } : t));
    try {
      if (taskId.length > 10) await updateTaskState(uid, taskId, !currentStatus);
    } catch (e) {
      console.error(e);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, done: currentStatus } : t));
    }
  };

  const stats = [
    { label: "Cases Studied", value: counts.cases.toString(), icon: BookMarked, color: "text-primary" },
    { label: "Study Hours", value: `${((activityLog?.length || 0) * 1.5).toFixed(1)}h`, icon: Clock, color: "text-emerald-400" },
    { label: "Practice Tests", value: counts.tests.toString(), icon: TrendingUp, color: "text-blue-400" },
    { label: "XP Points", value: points.toLocaleString(), icon: Trophy, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          Good morning, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-sm text-muted">Here's where you left off.</p>
      </div>

      {/* Streak + Points — compact */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Flame className={`w-4 h-4 ${streak > 0 ? "text-orange-400 fill-orange-400" : "text-muted"}`} />
          <span className="text-sm font-semibold">{streak}-day streak</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className={`w-4 h-4 ${points > 0 ? "text-primary" : "text-muted"}`} />
          <span className="text-sm font-semibold">{points.toLocaleString()} points</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
          >
            <stat.icon className={`w-4 h-4 mb-3 ${stat.color}`} />
            <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Chart + Recent */}
        <div className="lg:col-span-2 space-y-6">

          {/* Activity Heatmap */}
          <div className="p-8 bg-white/[0.03] border border-white/[0.06] rounded-[32px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-bold text-lg italic">Consistency <span className="text-primary italic">Heatmap</span></p>
                <p className="text-xs text-muted mt-1">Your daily study frequency over the last 90 days.</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-sm bg-white/5" />
                 <span className="text-[10px] text-muted uppercase font-black">Free</span>
                 <div className="w-3 h-3 rounded-sm bg-primary/40" />
                 <div className="w-3 h-3 rounded-sm bg-primary" />
                 <span className="text-[10px] text-muted uppercase font-black">Grind</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar py-2">
               {Array.from({ length: 90 }).map((_, i) => {
                 const date = new Date();
                 date.setDate(date.getDate() - (89 - i));
                 const dateStr = date.toISOString().split("T")[0];
                 const isActive = useUserContext().activityLog?.includes(dateStr);
                 
                 return (
                   <div 
                     key={i}
                     title={dateStr}
                     className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm transition-all hover:scale-125 cursor-help ${
                       isActive ? "bg-primary shadow-[0_0_8px_rgba(201,162,39,0.4)]" : "bg-white/5"
                     }`}
                   />
                 );
               })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Subject Mastery Radar/Bar */}
            <div className="p-8 bg-white/[0.03] border border-white/[0.06] rounded-[32px]">
              <p className="text-sm font-bold mb-6 uppercase tracking-widest text-muted">Subject Mastery</p>
              <div className="space-y-4">
                {masteryData.map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                      <span>{m.subject}</span>
                      <span className="text-primary">{m.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${m.score}%` }}
                         className="h-full bg-primary"
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <p className="text-sm font-semibold mb-4">Recent Cases</p>
              <div className="space-y-2">
                {[
                  { name: "Donoghue v Stevenson", cat: "Tort" },
                  { name: "Salomon v Salomon", cat: "Company" },
                  { name: "Carlill v Carbolic", cat: "Contract" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0 group cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted">{c.cat} Law</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <p className="text-sm font-semibold mb-4">Upcoming Exams</p>
              <div className="space-y-2">
                {[
                  { name: "Constitutional Law", days: 4 },
                  { name: "Family Law II", days: 12 },
                  { name: "Jurisprudence", days: 24 },
                ].map((ex, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                    <p className="text-sm">{ex.name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ex.days <= 5 ? 'bg-rose-500/15 text-rose-400' : 'bg-white/5 text-muted'}`}>
                      {ex.days}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI + Checklist */}
        <div className="space-y-4">
          <div className="p-5 bg-primary/[0.07] border border-primary/[0.15] rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">AI Legal Tutor</p>
            </div>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              Ask anything about Nigerian law, case principles, or exam prep.
            </p>
            <Link
              href="/assistant"
              className="block w-full text-center py-2.5 bg-primary text-background text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Start a conversation
            </Link>
          </div>

          {/* Reward Shop Teaser */}
          <div className="p-5 bg-emerald-500/[0.07] border border-emerald-500/10 rounded-2xl group hover:border-emerald-500/30 transition-all cursor-pointer">
            <Link href="/rewards">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                   <Trophy className="w-4 h-4 text-emerald-500" />
                   <p className="text-sm font-semibold">Reward Center</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[10px] text-muted italic mb-4">Trade your XP for Premium and more.</p>
              <div className="flex -space-x-1">
                 <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/20" />
                 <div className="w-5 h-5 rounded-full bg-emerald-500/40 border border-emerald-500/20" />
                 <div className="w-5 h-5 rounded-full bg-emerald-500/60 border border-emerald-500/20" />
              </div>
            </Link>
          </div>

          <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <p className="text-sm font-semibold mb-4">Today's Tasks</p>
            <div className="space-y-3">
              {tasks.map((t, i) => (
                <label key={t.id || i} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleTask(t.id, t.done); }}>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${t.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-emerald-500/50'}`}>
                    {t.done && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={`text-sm ${t.done ? 'text-muted line-through' : ''}`}>{t.task}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
