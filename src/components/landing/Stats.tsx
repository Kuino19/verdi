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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`p-8 bg-white/[0.02] border border-white/[0.06] rounded-[32px] ${stat.border} text-center flex flex-col items-center group transition-all duration-300 relative overflow-hidden`}
    >
      {/* Background glow on hover */}
      <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-30 transition-opacity rounded-3xl`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-5 transition-transform duration-300`}>
          <stat.icon className={`w-6 h-6 ${stat.color}`} />
        </div>
        <h4 className={`text-3xl font-bold mb-1 tracking-tight ${stat.color}`}>
          {stat.display}
        </h4>
        <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
        <p className="text-xs text-muted italic opacity-80">{stat.sub}</p>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
        </div>

        {/* Market insight quote */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="p-8 md:p-10 bg-white/[0.02] border border-white/[0.06] rounded-[40px] text-center max-w-3xl mx-auto relative"
        >
          <Quote className="w-6 h-6 text-primary/20 mx-auto mb-5" />
          <p className="text-muted leading-relaxed">
            Nigeria has more than{" "}
            <span className="text-foreground font-semibold">60 universities</span>{" "}
            offering law degrees. Each faculty admits between{" "}
            <span className="text-foreground font-semibold">100–300 students</span>{" "}
            per level. Even modest adoption rates represent a{" "}
            <span className="text-primary font-semibold">massive opportunity.</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
            <span className="block w-8 h-[1px] bg-primary/20" />
            Market Analysis Report 2025
            <span className="block w-8 h-[1px] bg-primary/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
