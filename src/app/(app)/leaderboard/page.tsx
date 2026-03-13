"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Zap, 
  Award, 
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  Crown
} from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Adeyemi Lawal", school: "UNILAG", points: "14,850", trend: "up", level: "500L", isUser: true },
  { rank: 2, name: "Chisom Okoro", school: "UNN", points: "14,200", trend: "down", level: "400L" },
  { rank: 3, name: "Fatima Yusuf", school: "ABU", points: "13,950", trend: "up", level: "300L" },
  { rank: 4, name: "Olaide Bakare", school: "UI", points: "12,100", trend: "stable", level: "200L" },
  { rank: 5, name: "Emeka Obi", school: "UNIBEN", points: "11,800", trend: "up", level: "500L" },
  { rank: 6, name: "Tunde Ednut", school: "LASU", points: "10,500", trend: "down", level: "100L" },
];

const badges = [
  { name: "Top Researcher", icon: Star, color: "text-amber-500", desc: "Summarized 50+ cases" },
  { name: "Daily Warrior", icon: Flame, color: "text-orange-500", desc: "15-day study streak" },
  { name: "Exam Master", icon: Target, color: "text-rose-500", desc: "Scored 90%+ in 10 mocks" },
  { name: "Helper", icon: Zap, color: "text-primary", desc: "20+ helpful forum replies" }
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Global <span className="text-gradient">Leaderboard</span></h1>
          <p className="text-muted italic">Compete with law students across Nigeria and rise as a VERDI Scholar.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
           <div className="px-6 py-2 border-r border-white/10 text-center">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">YOUR RANK</p>
              <p className="text-2xl font-black italic text-primary">#1</p>
           </div>
           <div className="px-6 py-2 text-center">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">PERCENTILE</p>
              <p className="text-2xl font-black italic text-foreground">Top 1%</p>
           </div>
        </div>
      </header>

      {/* Podium (Top 3 Visual) */}
      <section className="grid grid-cols-3 gap-4 md:gap-8 items-end max-w-4xl mx-auto pt-10">
         {/* Rank 2 */}
         <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border-2 border-white/10 flex items-center justify-center mb-4 relative">
               <Medal className="w-8 h-8 text-slate-400" />
               <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-400 text-background rounded-full flex items-center justify-center font-black text-xs">2</div>
            </div>
            <div className="w-full h-32 glass rounded-t-[32px] border-white/5 flex flex-col items-center justify-end pb-6 px-4 text-center">
               <h4 className="text-xs font-bold truncate w-full">Chisom Okoro</h4>
               <p className="text-[8px] font-black text-muted uppercase">14.2k pts</p>
            </div>
         </div>

         {/* Rank 1 */}
         <div className="flex flex-col items-center scale-110 -translate-y-4">
            <Crown className="w-8 h-8 text-primary mb-2 animate-bounce" />
            <div className="w-20 h-20 rounded-[32px] bg-primary/20 border-4 border-primary flex items-center justify-center mb-4 relative">
               <Trophy className="w-10 h-10 text-primary" />
               <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-background rounded-full border-4 border-[#0B1120] flex items-center justify-center font-black text-sm">1</div>
            </div>
            <div className="w-full h-44 glass border-primary/20 bg-gradient-to-t from-primary/10 to-transparent rounded-t-[40px] flex flex-col items-center justify-end pb-8 px-4 text-center">
               <h4 className="text-sm font-black truncate w-full italic">Adeyemi Lawal</h4>
               <p className="text-[10px] font-black text-primary uppercase">14.8k pts</p>
            </div>
         </div>

         {/* Rank 3 */}
         <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border-2 border-white/10 flex items-center justify-center mb-4 relative">
               <Medal className="w-8 h-8 text-amber-700" />
               <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-700 text-background rounded-full flex items-center justify-center font-black text-xs">3</div>
            </div>
            <div className="w-full h-24 glass rounded-t-[32px] border-white/5 flex flex-col items-center justify-end pb-6 px-4 text-center">
               <h4 className="text-xs font-bold truncate w-full">Fatima Yusuf</h4>
               <p className="text-[8px] font-black text-muted uppercase">13.9k pts</p>
            </div>
         </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8 pt-10">
         {/* Main Leaderboard Table */}
         <div className="lg:col-span-2 glass rounded-[48px] border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-xl font-bold flex items-center gap-3 italic">
                  <Award className="w-6 h-6 text-primary" /> Global Rankings
               </h3>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest">Weekly</button>
                  <button className="px-4 py-2 text-muted text-[10px] font-black uppercase tracking-widest">All Time</button>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-white/5 text-[10px] font-black text-muted uppercase tracking-widest">
                     <tr>
                        <th className="px-8 py-4 text-left">Rank</th>
                        <th className="px-8 py-4 text-left">Student</th>
                        <th className="px-8 py-4 text-left">Level</th>
                        <th className="px-8 py-4 text-right">Points</th>
                        <th className="px-8 py-4 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {leaderboardData.map((student, i) => (
                        <tr key={i} className={`group hover:bg-white/5 transition-colors ${student.isUser ? 'bg-primary/5' : ''}`}>
                           <td className="px-8 py-6">
                              <span className={`text-sm font-black ${i < 3 ? 'text-primary' : 'text-muted'}`}>{student.rank}</span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs">{student.name[0]}</div>
                                 <div>
                                    <p className={`text-sm font-bold ${student.isUser ? 'text-primary' : ''}`}>{student.name}</p>
                                    <p className="text-[10px] text-muted font-bold italic">{student.school}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-xs font-bold text-muted">{student.level}</td>
                           <td className="px-8 py-6 text-right font-black text-sm italic">{student.points}</td>
                           <td className="px-8 py-6">
                              <div className="flex justify-center">
                                 {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                 {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                                 {student.trend === 'stable' && <Minus className="w-4 h-4 text-slate-500" />}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Badges and Rewards */}
         <div className="space-y-8">
            <div className="glass p-8 rounded-[48px] border-white/5">
               <h3 className="text-lg font-bold mb-8 flex items-center gap-3 italic">
                  <Award className="w-5 h-5 text-primary" /> Your Badges
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge, i) => (
                     <div key={i} className="p-4 glass rounded-3xl border-white/5 flex flex-col items-center text-center group hover:border-primary/30 transition-all cursor-pointer">
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                           <badge.icon className={`w-6 h-6 ${badge.color}`} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-tight mb-1">{badge.name}</h4>
                        <p className="text-[8px] text-muted italic leading-tight">{badge.desc}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-8 glass rounded-[48px] border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
               <h3 className="text-lg font-bold mb-4 italic">Reward Center</h3>
               <p className="text-xs text-muted mb-8 italic italic leading-relaxed">Redeem your VERDI Points for exclusive mentorship, physical law books, or Premium subscription extensions.</p>
               <button className="w-full py-4 bg-emerald-500 text-background font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                  Visit Reward Shop
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
