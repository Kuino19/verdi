"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Zap, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getCountFromServer, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<string>("...");
  const [caseCount, setCaseCount] = useState<string>("...");
  const [pendingCount, setPendingCount] = useState<string>("...");
  const [recentCases, setRecentCases] = useState<any[]>([]);

  useEffect(() => {
    async function getCounts() {
      try {
        const userSnap = await getCountFromServer(collection(db, "users"));
        const caseSnap = await getCountFromServer(collection(db, "cases"));
        const pendingSnap = await getCountFromServer(query(collection(db, "cases"), where("processed", "==", false)));
        
        setUserCount(userSnap.data().count.toLocaleString());
        setCaseCount(caseSnap.data().count.toLocaleString());
        setPendingCount(pendingSnap.data().count.toLocaleString());

        // Fetch latest 5 cases for activity
        const latestSnap = await getDocs(query(collection(db, "cases"), orderBy("scrapedAt", "desc"), limit(5)));
        setRecentCases(latestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      }
    }
    getCounts();
  }, []);

  const stats = [
    { label: "Cases in Library", value: caseCount, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending AI Extraction", value: pendingCount, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Premium Users", value: "Locked", icon: Star, color: "text-primary", bg: "bg-primary/10" },
    { label: "AI Queries Today", value: "2,410", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-bold mb-2 italic">Admin <span className="text-primary italic">Command Center</span></h1>
           <p className="text-muted italic">Overview of Verdi's ecosystem and performance metrics.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 glass rounded-2xl border-white/5">
           <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-white/10" />
              ))}
           </div>
           <span className="text-[10px] font-black uppercase text-muted tracking-widest">3 Admins Online</span>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <motion.div
             key={stat.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
           >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-black text-muted uppercase tracking-widest mb-1">{stat.label}</h4>
              <p className="text-3xl font-black italic">{stat.value}</p>
              
              <div className="absolute top-8 right-8">
                 <TrendingUp className="w-4 h-4 text-emerald-500 opacity-50" />
              </div>
           </motion.div>
         ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Recent Activity */}
         <section className="lg:col-span-2 glass p-10 rounded-[56px] border-white/5">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 italic">
               <Clock className="w-5 h-5 text-primary" />
               Recent Ingestions
            </h3>
            <div className="space-y-6">
               {recentCases.length === 0 ? (
                 <p className="text-sm text-muted italic p-8 text-center bg-white/5 rounded-3xl">No recent activity found.</p>
               ) : recentCases.map((item, i) => (
                 <Link href="/admin/cases" key={item.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs">
                          {item.processed ? <ShieldCheck className="w-5 h-5 text-emerald-500" /> : <Zap className="w-5 h-5 text-amber-500" />}
                       </div>
                       <div>
                          <p className="text-sm font-bold truncate max-w-[300px]">{item.title}</p>
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.processed ? 'Processed' : 'Pending AI'}</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-muted uppercase">
                        {new Date(item.scrapedAt || item.createdAt).toLocaleDateString()}
                    </span>
                 </Link>
               ))}
            </div>
         </section>

         {/* Quick Actions */}
         <section className="space-y-6">
            <div className="p-10 glass rounded-[56px] border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
               <ShieldCheck className="w-10 h-10 text-primary mb-6" />
               <h3 className="text-xl font-bold mb-2 italic">Quick Actions</h3>
               <p className="text-xs text-muted mb-8 italic">Common administrative tasks for managing Verdi.</p>
               
               <div className="space-y-3">
                  <Link href="/admin/cases/new" className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all text-xs uppercase tracking-widest">
                     <FileText className="w-4 h-4" /> Upload New Case
                  </Link>
                  <button className="w-full py-4 glass border-white/5 text-muted font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-xs uppercase tracking-widest">
                     Manage Users <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full py-4 glass border-white/5 text-muted font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-xs uppercase tracking-widest">
                     System Logs <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
