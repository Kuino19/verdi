"use client";

import { motion, useInView } from "framer-motion";
import { 
  Award, Briefcase, Gift, ShieldCheck, Users, Star, 
  ArrowRight, CheckCircle2, Trophy, Zap, Globe,
  GraduationCap, Building2, ChevronRight
} from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";

const benefits = [
  {
    title: "Official Recognition",
    description: "Be the official face of VERDI at your faculty. Get a custom digital badge, certificate, and LinkedIn endorsement.",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Free Pro Access",
    description: "Full VERDI Pro features — AI assistant, exam generator, and all premium tools — completely free during your tenure.",
    icon: Gift,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  },
  {
    title: "Career Growth",
    description: "Priority placement for internships at our partner law firms across Lagos, Abuja, and Port Harcourt.",
    icon: Briefcase,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    title: "Elite Network",
    description: "Connect with top law students and faculty representatives across 60+ Nigerian universities.",
    icon: Globe,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
];

const perks = [
  "₦500 commission per referred student who upgrades",
  "Early access to all new platform features",
  "Quarterly top ambassador rewards & cash prizes",
  "Official VERDI merchandise kit",
  "Priority 1-on-1 support from the VERDI team",
  "Invitation to annual Legal-Tech Summit",
];

const universities = [
  "University of Lagos", "University of Ibadan", "ABU Zaria",
  "University of Nigeria", "LASU", "Obafemi Awolowo University",
  "Covenant University", "BUK", "University of Benin",
];

const testimonials = [
  {
    name: "Amaka O.",
    school: "University of Lagos — 400L",
    quote: "Being a VERDI Ambassador transformed my academic profile. I've already referred 24 students on my campus.",
    rating: 5
  },
  {
    name: "Chukwuemeka A.",
    school: "ABU Zaria — 300L",
    quote: "The career connections from the program are real. I secured a chambers attachment through the ambassador network.",
    rating: 5
  },
];

export default function Ambassador() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredPerk, setHoveredPerk] = useState<number | null>(null);

  return (
    <section id="ambassador" className="py-32 relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[-20%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10" ref={ref}>

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-6 text-xs font-black uppercase tracking-widest"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Leadership Opportunity
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Become a{" "}
            <span className="relative">
              <span className="text-emerald-400">VERDI</span>
              <span className="text-gradient"> Ambassador</span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted leading-relaxed italic max-w-2xl mx-auto"
          >
            Lead the digital transformation of legal education at your university. 
            <strong className="text-foreground"> Build your CV, earn rewards,</strong> and help your peers succeed on a national stage.
          </motion.p>
        </div>

        {/* ── Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="glass rounded-[48px] border-white/10 overflow-hidden mb-20 shadow-3xl"
        >
          <div className="grid lg:grid-cols-5">

            {/* Left: Benefits */}
            <div className="lg:col-span-3 p-10 md:p-16 flex flex-col justify-center">
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`p-6 rounded-3xl border ${benefit.border} ${benefit.bg} hover:scale-[1.02] transition-all group`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                    </div>
                    <h4 className="font-black text-sm mb-2">{benefit.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-background font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 text-sm"
                >
                  Apply Now — It&apos;s Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-xs text-muted mt-4 italic">
                  Applications reviewed within 48 hours. Limited to one ambassador per faculty.
                </p>
              </motion.div>
            </div>

            {/* Right: Stats + Visual */}
            <div className="lg:col-span-2 relative bg-gradient-to-br from-emerald-950/40 via-slate-900/50 to-slate-900/80 p-10 flex flex-col justify-between">
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle, #10B981 1px, transparent 1px)`,
                  backgroundSize: "28px 28px"
                }}
              />
              
              <div className="relative z-10">
                <div className="mb-10">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                    <GraduationCap className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 italic">Join the Elite</h3>
                  <p className="text-xs text-muted uppercase tracking-[0.2em]">Network of Nigerian Student Leaders</p>
                </div>

                {/* Live stats */}
                <div className="space-y-4 mb-10">
                  {[
                    { label: "Active Ambassadors", value: "127+", icon: Users },
                    { label: "Universities Covered", value: "43", icon: Building2 },
                    { label: "Avg. Monthly Earnings", value: "₦35,000", icon: Trophy },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                      <div className="flex items-center gap-3">
                        <s.icon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-muted">{s.label}</span>
                      </div>
                      <span className="text-sm font-black text-emerald-400">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Floatinguniversity tags */}
                <div className="flex flex-wrap gap-2">
                  {universities.slice(0, 6).map((uni, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.07 }}
                      className="px-3 py-1 glass border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider"
                    >
                      {uni.length > 15 ? uni.split(" ").slice(-1)[0] : uni}
                    </motion.span>
                  ))}
                  <span className="px-3 py-1 glass border-white/10 rounded-full text-[10px] font-black text-muted">+17 more</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Perks List ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <span className="text-xs font-black text-primary uppercase tracking-widest">What you get</span>
              <h3 className="text-3xl font-bold mt-2 italic">Every Ambassador Earns</h3>
            </div>
            <div className="space-y-3">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  onHoverStart={() => setHoveredPerk(i)}
                  onHoverEnd={() => setHoveredPerk(null)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-default ${
                    hoveredPerk === i 
                      ? "bg-emerald-500/10 border-emerald-500/30 scale-[1.01]" 
                      : "glass border-white/5"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 transition-colors ${hoveredPerk === i ? "text-emerald-400" : "text-emerald-500/50"}`} />
                  <span className="text-sm font-bold">{perk}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-6">
              <span className="text-xs font-black text-primary uppercase tracking-widest">From the community</span>
              <h3 className="text-3xl font-bold mt-2 italic">Ambassador Stories</h3>
            </div>
            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 glass rounded-3xl border-white/5 relative group hover:border-emerald-500/20 transition-all">
                  <div className="absolute top-6 right-8 text-5xl text-primary/10 font-serif leading-none select-none">&ldquo;</div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted italic leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-sm font-black text-emerald-400">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-[10px] text-muted">{t.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Final CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="relative p-12 md:p-16 rounded-[48px] overflow-hidden text-center"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0.9) 50%, rgba(201,162,39,0.1) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, #10B981 1px, transparent 1px)`,
              backgroundSize: "24px 24px"
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Limited Slots Available
            </div>
            <h3 className="text-3xl md:text-5xl font-bold mb-4 italic">
              Ready to Lead at <span className="text-emerald-400">Your Campus?</span>
            </h3>
            <p className="text-muted mb-10 max-w-xl mx-auto leading-relaxed">
              Join 127+ student leaders already shaping how Nigerian law students study. 
              Your faculty slot is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-background font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
              >
                Apply as Ambassador
                <Award className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-5 glass rounded-2xl hover:bg-white/10 transition-all font-bold text-muted hover:text-foreground">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
