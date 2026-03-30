"use client";

import { motion } from "framer-motion";
import { 
  Flame, Clock, BookMarked, Trophy, ArrowRight, 
  TrendingUp, AlertCircle, CalendarDays, BrainCircuit, Check
} from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/components/app/UserContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 4.1 },
  { name: 'Wed', hours: 3.8 },
  { name: 'Thu', hours: 5.2 },
  { name: 'Fri', hours: 3.0 },
  { name: 'Sat', hours: 1.5 },
  { name: 'Sun', hours: 2.0 },
];

const stats = [
  { label: "Cases Studied", value: "48", icon: BookMarked, color: "text-primary" },
  { label: "Study Hours", value: "142h", icon: Clock, color: "text-emerald-400" },
  { label: "Practice Tests", value: "15", icon: TrendingUp, color: "text-blue-400" },
  { label: "Global Rank", value: "#124", icon: Trophy, color: "text-amber-400" },
];

export default function DashboardPage() {
  const { userName } = useUserContext();

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
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-sm font-semibold">12-day streak</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">4,250 points</span>
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

          {/* Activity Chart */}
          <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-semibold text-sm">Study Activity</p>
                <p className="text-xs text-muted mt-0.5">This week</p>
              </div>
              <select className="bg-white/5 border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-muted focus:outline-none">
                <option>7 days</option>
                <option>30 days</option>
              </select>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={24}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {data.map((_, index) => (
                      <Cell key={index} fill={index === 3 ? '#C9A227' : 'rgba(201,162,39,0.18)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Cases + Exams */}
          <div className="grid sm:grid-cols-2 gap-4">
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

          <div className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <p className="text-sm font-semibold mb-4">Today's Tasks</p>
            <div className="space-y-3">
              {[
                { task: "Summarize 3 Tort cases", done: true },
                { task: "Complete 100L Quiz", done: false },
                { task: "Update Study Planner", done: false },
                { task: "Review Carlill in CaseFlow", done: false },
              ].map((t, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
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
