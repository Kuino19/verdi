"use client";

import { motion } from "framer-motion";
import { 
  Flame, 
  Clock, 
  BookMarked, 
  Trophy, 
  ArrowRight, 
  TrendingUp,
  AlertCircle,
  CalendarDays,
  BrainCircuit,
  Check
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 4.1 },
  { name: 'Wed', hours: 3.8 },
  { name: 'Thu', hours: 5.2 },
  { name: 'Fri', hours: 3.0 },
  { name: 'Sat', hours: 1.5 },
  { name: 'Sun', hours: 2.0 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <section className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Welcome Back, <span className="text-gradient italic">Adeyemi</span></h1>
          <p className="text-muted italic">"Knowledge is power. Information is liberating." — Kofi Annan</p>
        </motion.div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
           <div className="flex flex-col items-center px-6 border-r border-white/10">
              <span className="text-xs font-bold text-muted uppercase tracking-widest mb-1">STREAK</span>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span className="text-2xl font-black italic">12 Days</span>
              </div>
           </div>
           <div className="flex flex-col items-center px-6">
              <span className="text-xs font-bold text-muted uppercase tracking-widest mb-1">POINTS</span>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary fill-primary" />
                <span className="text-2xl font-black italic">4,250</span>
              </div>
           </div>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Cases Studied", value: "48", icon: BookMarked, color: "text-primary" },
          { label: "Study Hours", value: "142h", icon: Clock, color: "text-emerald-500" },
          { label: "Practice Tests", value: "15", icon: TrendingUp, color: "text-blue-500" },
          { label: "Global Rank", value: "#124", icon: Trophy, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass rounded-[28px] border-white/5 group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-emerald-500">+12% this week</span>
            </div>
            <h4 className="text-3xl font-black mb-1">{stat.value}</h4>
            <p className="text-xs font-bold text-muted uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Activities */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 glass rounded-[36px] border-white/5"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold mb-1 italic">Learning Pulse</h3>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">Study activity across the week</p>
              </div>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-muted focus:outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? '#C9A227' : 'rgba(201, 162, 39, 0.2)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="p-8 glass rounded-[36px] border-white/5">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                   <BookMarked className="w-5 h-5 text-primary" />
                   Recent Cases
                </h3>
                <div className="space-y-4">
                   {[
                     { name: "Donoghue v Stevenson", level: "300L", cat: "Tort" },
                     { name: "Salomon v Salomon & Co", level: "200L", cat: "Company" },
                     { name: "Carlill v Carbolic Smoke Ball", level: "100L", cat: "Contract" }
                   ].map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl hover:bg-white/5 transition-all text-sm group cursor-pointer">
                        <div className="flex flex-col">
                           <span className="font-bold">{c.name}</span>
                           <span className="text-[10px] text-muted font-black uppercase tracking-widest">{c.cat} Law • {c.level}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-muted hover:text-foreground transition-all">
                   View All Cases
                </button>
             </div>

             <div className="p-8 glass rounded-[36px] border-white/5">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                   <AlertCircle className="w-5 h-5 text-rose-500" />
                   Exam Countdown
                </h3>
                <div className="space-y-4">
                   {[
                     { name: "Constitutional Law", days: 4, type: "Major" },
                     { name: "Family Law II", days: 12, type: "Minor" },
                     { name: "Jurisprudence", days: 24, type: "Major" }
                   ].map((ex, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${ex.days <= 5 ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5'}`}>
                           <span className="text-lg leading-none">{ex.days}</span>
                           <span className="text-[8px] uppercase tracking-tighter">Days</span>
                        </div>
                        <div>
                           <p className="text-sm font-bold">{ex.name}</p>
                           <p className="text-[10px] text-muted font-black tracking-widest uppercase">{ex.type} Assessment</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                   Open Study Planner
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: AI & Community */}
        <div className="space-y-8">
           <div className="p-8 pb-10 glass rounded-[36px] border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
                 <BrainCircuit className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 italic leading-tight">Your Personal <br/><span className="text-primary italic">AI Legal Tutor</span></h3>
              <p className="text-sm text-muted mb-8 leading-relaxed">Ask anything about legal principles, Nigerian cases, or exam prep strategies.</p>
              
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 mb-6 text-xs text-muted italic">
                 "Try asking: Explain the Doctrine of Separation of Powers in Nigeria."
              </div>

              <Link 
                href="/assistant" 
                className="w-full py-4 bg-primary text-background font-black rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                 Start Chatting <BrainCircuit className="w-4 h-4" />
              </Link>
           </div>

           <div className="p-8 glass rounded-[36px] border-white/5">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                 <CalendarDays className="w-5 h-5 text-emerald-500" />
                 Daily Checklist
              </h3>
              <div className="space-y-4">
                 {[
                   { task: "Summarize 3 Tort cases", done: true },
                   { task: "Complete 100L Quiz", done: false },
                   { task: "Update Study Planner", done: false },
                   { task: "Review CaseFlow for Carlill", done: false }
                 ].map((t, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${t.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 group-hover:border-emerald-500/50'}`}>
                         {t.done && <Check className="w-4 h-4 text-background" />}
                      </div>
                      <span className={`text-sm font-bold ${t.done ? 'text-muted line-through' : 'text-foreground'}`}>{t.task}</span>
                   </div>
                 ))}
                 
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
