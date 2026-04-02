"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { addPoints } from "@/lib/firebase/db";
import { 
  Gift, 
  Crown, 
  BookOpen, 
  Video, 
  ShieldCheck, 
  Star,
  Award,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Zap
} from "lucide-react";
import Link from "next/link";
import Confetti from "@/components/app/Confetti";

const rewardsList = [
  {
    id: "premium-1m",
    name: "1-Month Premium",
    desc: "Unlock all verdicts, infinite AI generation, and unlimited case summaries for 30 days.",
    price: 150,
    icon: Crown,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    id: "badge-vip",
    name: "VIP Scholar Badge",
    desc: "Stand out on the leaderboard with an exclusive golden VIP badge next to your name.",
    price: 50,
    icon: Star,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: "mentorship",
    name: "1-on-1 Mentorship (30m)",
    desc: "A personalized 30-minute Google Meet call with a practicing Senior Advocate or Top Graduate.",
    price: 1500,
    icon: Video,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  },
  {
    id: "book-delivery",
    name: "Physical Law Book",
    desc: "Choose a textbook from our partner library. Delivered straight to your university campus.",
    price: 5000,
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    id: "ai-persona",
    name: "Custom AI Persona",
    desc: "Train Verdi AI to specifically simulate your exact university professor's exam style.",
    price: 300,
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  },
  {
    id: "immunity",
    name: "Streak Freeze",
    desc: "Save your daily learning streak even if you miss a day of studying.",
    price: 25,
    icon: ShieldCheck,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20"
  }
];

export default function RewardsPage() {
  const { uid, points } = useUserContext();
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleRedeem = async (reward: typeof rewardsList[0]) => {
    if (!uid) return alert("Please log in to redeem rewards.");
    if (points < reward.price) {
      return alert("Not enough XP to redeem this reward. Keep studying!");
    }

    setRedeemingId(reward.id);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    try {
      // Deduct points
      await addPoints(uid, -reward.price);
      setSuccessId(reward.id);
      
      // Reset success state after a few seconds
      setTimeout(() => {
        setSuccessId(null);
      }, 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to process redemption. Please try again.");
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <Confetti active={!!successId} />
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link href="/leaderboard" className="text-xs font-black uppercase tracking-widest text-muted hover:text-primary transition-colors flex items-center gap-2 justify-center md:justify-start mb-4">
             <ArrowRight className="w-3 h-3 rotate-180" /> Back to Leaderboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Reward <span className="text-gradient">Center</span></h1>
          <p className="text-sm md:text-base text-muted italic leading-relaxed max-w-xl">
             Trade your hard-earned XP for exclusive app extensions, real-world prizes, and VIP access.
          </p>
        </div>
        
        <div className="glass p-6 rounded-[32px] border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center gap-6 min-w-[280px]">
           <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/30">
              <Award className="w-7 h-7 text-emerald-500" />
           </div>
           <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Available XP</p>
              <div className="flex items-baseline gap-2">
                 <p className="text-3xl font-black italic text-foreground">{points?.toLocaleString() || 0}</p>
                 <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">PTS</span>
              </div>
           </div>
        </div>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
         {rewardsList.map((reward, i) => {
            const isAffordable = points >= reward.price;
            const isRedeeming = redeemingId === reward.id;
            const isSuccess = successId === reward.id;
            
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col p-8 glass rounded-[32px] border transition-all relative overflow-hidden group ${isAffordable ? 'hover:border-emerald-500/30' : 'opacity-70 grayscale hover:grayscale-0 border-white/5'}`}
              >
                 {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center"
                    >
                       <div className="w-16 h-16 bg-emerald-500 text-background rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-8 h-8" />
                       </div>
                       <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest italic">Redeemed!</h3>
                       <p className="text-xs font-bold text-emerald-500 mt-2">Check your email for details.</p>
                    </motion.div>
                 )}

                 <div className="flex items-start justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl ${reward.bg} border ${reward.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       <reward.icon className={`w-7 h-7 ${reward.color}`} />
                    </div>
                    <div className="flex items-baseline gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                       <span className="text-sm font-black italic">{reward.price.toLocaleString()}</span>
                       <span className="text-[9px] font-black uppercase text-muted tracking-widest">XP</span>
                    </div>
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{reward.name}</h3>
                    <p className="text-sm text-muted leading-relaxed">{reward.desc}</p>
                 </div>

                 <button 
                    onClick={() => handleRedeem(reward)}
                    disabled={!isAffordable || isRedeeming}
                    className={`mt-8 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2
                      ${isAffordable 
                        ? 'bg-emerald-500 text-background hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20' 
                        : 'bg-white/5 text-muted cursor-not-allowed border border-white/10'
                      }
                    `}
                 >
                    {isRedeeming ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isAffordable ? (
                      <>Redeem Reward <ArrowRight className="w-3 h-3" /></>
                    ) : (
                      <span className="opacity-50">Locked ({reward.price.toLocaleString()} XP req.)</span>
                    )}
                 </button>
              </motion.div>
            );
         })}
      </section>
    </div>
  );
}
