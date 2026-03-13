"use client";

import { motion } from "framer-motion";
import { 
  Users2, 
  Copy, 
  Share2, 
  Zap, 
  Award, 
  MessageSquare, 
  Gift,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "verdi.app/ref/adeyemi123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border-primary/20 mb-4">
           <Gift className="w-4 h-4 text-primary" />
           <span className="text-[10px] font-black text-primary uppercase tracking-widest">Share the Knowledge</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold italic tracking-tight">Give Pro, <span className="text-gradient">Get Pro</span></h1>
        <p className="text-muted text-lg max-w-xl mx-auto italic leading-relaxed">Refer your classmates to VERDI. For every friend who joins Pro, you both get 1 week of Premium for free.</p>
      </header>

      {/* Main Referral Card */}
      <section className="glass p-12 rounded-[56px] border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent text-center">
         <div className="w-20 h-20 rounded-[32px] bg-primary/20 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20">
            <Users2 className="w-10 h-10 text-primary" />
         </div>

         <div className="max-w-md mx-auto space-y-6">
            <h3 className="text-xl font-bold italic">Your Unique Referral Link</h3>
            <div className="relative group">
               <div className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-6 px-6 text-sm font-black text-primary tracking-wider italic text-center">
                  {referralLink}
               </div>
               <button 
                 onClick={handleCopy}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
               >
                  {copied ? <Zap className="w-5 h-5 text-primary fill-current" /> : <Copy className="w-5 h-5 text-muted" />}
               </button>
            </div>
            
            <div className="flex gap-3">
               <button className="flex-grow py-5 bg-primary text-background font-black rounded-[24px] text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                  <MessageSquare className="w-4 h-4" /> Share on WhatsApp
               </button>
               <button className="p-5 glass border-white/10 rounded-[24px] hover:bg-white/10 transition-all">
                  <Share2 className="w-5 h-5 text-muted" />
               </button>
            </div>
         </div>
      </section>

      {/* How it works grid */}
      <section className="grid md:grid-cols-3 gap-8">
         {[
           { step: "1", title: "Invite Friends", desc: "Send your link via WhatsApp or Telegram.", icon: Users2 },
           { step: "2", title: "Friend Joins", desc: "They register and explore the platform.", icon: Zap },
           { step: "3", title: "Earn Rewards", desc: "Get Pro extensions instantly.", icon: Award }
         ].map((s, i) => (
           <div key={i} className="p-8 glass rounded-[40px] border-white/5 text-center relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-[40px] font-black text-white/5 italic select-none group-hover:text-primary/10 transition-colors">{s.step}</div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                 <s.icon className="w-6 h-6 text-muted" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">{s.title}</h4>
              <p className="text-[10px] text-muted italic leading-relaxed">{s.desc}</p>
           </div>
         ))}
      </section>

      {/* Activity Stats */}
      <div className="p-10 glass rounded-[48px] border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-8">
            <div className="text-center">
               <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 italic">INVITES</p>
               <p className="text-3xl font-black italic">12</p>
            </div>
            <div className="w-[1px] h-10 bg-white/5"></div>
            <div className="text-center">
               <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 italic">PRO WEEKS</p>
               <p className="text-3xl font-black italic text-primary">8</p>
            </div>
         </div>
         <button className="flex items-center gap-3 text-xs font-black text-muted uppercase tracking-widest hover:text-foreground transition-all">
            View Reward History <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
