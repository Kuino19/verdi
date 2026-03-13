"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Clock, 
  BrainCircuit, 
  Scale, 
  Users2,
  Crown
} from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "For the occasional student",
    features: ["5 Case Summaries / Day", "Basic AI Assistant", "Public Community", "Standard Leaderboard"],
    button: "Current Plan",
    active: false,
    color: "bg-white/5"
  },
  {
    name: "Weekly Pro",
    price: "₦1,000",
    period: "per week",
    desc: "Perfect for exam week",
    features: ["Unlimited Cases", "Advanced AI Legal Tutor", "Exam Generator (5/day)", "CaseFlow Explorer", "Dark/Light Theme"],
    button: "Get Weekly Pro",
    active: false,
    color: "bg-white/5"
  },
  {
    name: "Monthly Pro",
    price: "₦3,500",
    period: "per month",
    desc: "The full scholar experience",
    features: ["Everything in Weekly", "Unlimited Exam Prep", "Early Access to Features", "Verified Badge", "Priority Support"],
    button: "Get Monthly Pro",
    active: true,
    color: "bg-primary/20 border-primary/50"
  }
];

export default function UpgradePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border-primary/20 mb-4">
           <Zap className="w-4 h-4 text-primary fill-current" />
           <span className="text-[10px] font-black text-primary uppercase tracking-widest">Elevate Your Legal Learning</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold italic tracking-tight">Choice of the <span className="text-gradient">Elite</span></h1>
        <p className="text-muted text-lg max-w-2xl mx-auto italic">Join thousands of Nigerian law students who are outperforming their peers with VERDI Pro tools.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
         {plans.map((plan, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={`p-10 glass rounded-[48px] border-white/5 flex flex-col relative overflow-hidden group ${plan.color}`}
           >
              {plan.active && (
                <div className="absolute top-8 right-8">
                   <Crown className="w-8 h-8 text-primary animate-bounce shadow-2xl" />
                </div>
              )}

              <div className="mb-10">
                 <h3 className="text-sm font-black text-muted uppercase tracking-[0.2em] mb-2">{plan.name}</h3>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic">{plan.price}</span>
                    <span className="text-xs text-muted font-bold uppercase">{plan.period}</span>
                 </div>
                 <p className="mt-4 text-xs text-muted italic opacity-60 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="space-y-4 mb-12 flex-grow">
                 {plan.features.map((f, j) => (
                   <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${plan.active ? 'text-primary' : 'text-emerald-500'}`} />
                      <span className="text-xs font-bold text-muted group-hover:text-foreground transition-colors">{f}</span>
                   </div>
                 ))}
              </div>

              <button className={`w-full py-5 rounded-[24px] font-black text-[12px] uppercase tracking-widest transition-all ${
                plan.active 
                  ? 'bg-primary text-background shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95' 
                  : 'glass border-white/10 hover:bg-white/10'
              }`}>
                 {plan.button}
              </button>
           </motion.div>
         ))}
      </div>

      {/* Trust Badges */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-t border-white/5">
         {[
           { icon: ShieldCheck, title: "Secure Payment", desc: "Paystack & Flutterwave" },
           { icon: BrainCircuit, title: "Precision AI", desc: "Fine-tuned on Law" },
           { icon: Users2, title: "Student Trusted", desc: "Active in 60+ Unis" },
           { icon: Clock, title: "Instant Access", desc: "Zero setup delay" }
         ].map((t, i) => (
           <div key={i} className="flex flex-col items-center text-center">
              <t.icon className="w-8 h-8 text-muted mb-4 opacity-50" />
              <h4 className="text-sm font-black uppercase tracking-widest mb-1">{t.title}</h4>
              <p className="text-[10px] text-muted italic font-bold">{t.desc}</p>
           </div>
         ))}
      </section>

      {/* Testimonial Quote */}
      <div className="p-16 glass rounded-[64px] border-white/5 text-center relative overflow-hidden">
         <Star className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 text-white/5" />
         <p className="text-2xl md:text-3xl font-serif italic mb-10 relative z-10 leading-relaxed max-w-4xl mx-auto">
           "The shift from 100L to 300L was brutal. VERDI's CaseFlow and AI Tutor didn't just help me pass; they helped me understand the <span className="text-primary font-bold">logic behind the law</span>."
         </p>
         <div className="relative z-10">
            <h5 className="text-sm font-black uppercase tracking-widest mb-1 italic">Ifeoluwa Adeyemi</h5>
            <p className="text-[10px] text-muted font-bold tracking-widest uppercase">300L Student, UNILAG</p>
         </div>
      </div>
    </div>
  );
}
