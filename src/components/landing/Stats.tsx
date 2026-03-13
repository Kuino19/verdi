"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, Globe, TrendingUp, Quote } from "lucide-react";

const stats = [
  {
    label: "Universities",
    value: 60,
    display: "60+",
    sub: "Across Nigeria",
    icon: GraduationCap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-400/30"
  },
  {
    label: "Law Students",
    value: 10000,
    display: "10,000+",
    sub: "Monthly target",
    icon: Users,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-400/30"
  },
  {
    label: "Revenue Target",
    value: 4.8,
    display: "₦4.8M",
    sub: "Projected Year-1",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/30"
  },
  {
    label: "Presence",
    value: 37,
    display: "Nationwide",
    sub: "36 States + FCT",
    icon: Globe,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-400/30"
  }
];

function useCountUp(target: number, isInView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);
  return count;
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className={`p-8 glass rounded-3xl border-white/5 ${stat.border} text-center flex flex-col items-center group hover:scale-[1.03] transition-all duration-300 relative overflow-hidden`}
    >
      {/* Background glow on hover */}
      <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-50 transition-opacity rounded-3xl`} />

      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon className={`w-7 h-7 ${stat.color}`} />
        </div>
        <h4 className={`text-4xl font-black mb-2 tracking-tighter ${stat.color}`}>
          {stat.display}
        </h4>
        <p className="text-sm font-bold text-foreground mb-1 uppercase tracking-widest">{stat.label}</p>
        <p className="text-xs text-muted italic">{stat.sub}</p>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900/40">
      {/* Top/Bottom edge gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
        </div>

        {/* Market insight quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="p-10 md:p-12 glass rounded-[40px] border-white/5 text-center max-w-4xl mx-auto relative"
        >
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6" />
          <p className="text-muted text-lg leading-relaxed italic">
            Nigeria currently has more than{" "}
            <span className="text-foreground font-bold not-italic">60 universities</span>{" "}
            offering law degrees. Each faculty admits between{" "}
            <span className="text-foreground font-bold not-italic">100–300 students</span>{" "}
            per level. Even modest adoption rates represent a{" "}
            <span className="text-primary font-bold not-italic">massive opportunity.</span>
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-xs font-black text-primary tracking-[0.25em] uppercase">
            <span className="block w-12 h-[1px] bg-gradient-to-r from-transparent to-primary" />
            Market Analysis Report — 2025
            <span className="block w-12 h-[1px] bg-gradient-to-l from-transparent to-primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
