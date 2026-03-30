"use client";

import { motion, useInView } from "framer-motion";
import { 
  Award, Briefcase, Gift, ShieldCheck, Users, Star, 
  ArrowRight, CheckCircle2, Trophy, Zap, Globe,
  GraduationCap, Building2
} from "lucide-react";
import { useRef } from "react";
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
  "₦500 commission per referred student",
  "Early access to all new platform features",
  "Quarterly top ambassador rewards",
  "Official VERDI merchandise kit",
  "Priority 1-on-1 support",
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

  return (
    <section id="ambassador" className="py-24 relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[-20%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10" ref={ref}>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-full mb-6 text-[10px] font-bold tracking-widest uppercase"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            LEADERSHIP OPPORTUNITY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
          >
            Become a <span className="text-gradient">VERDI Ambassador</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-muted leading-relaxed max-w-2xl mx-auto"
          >
            Lead the digital transformation of legal education at your university. 
            Build your CV, earn rewards, and help your peers succeed.
          </motion.p>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-[40px] overflow-hidden mb-20 shadow-2xl"
        >
          <div className="grid lg:grid-cols-5">
            {/* Left: Benefits */}
            <div className="lg:col-span-3 p-10 md:p-14 flex flex-col justify-center">
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all group`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${benefit.bg} flex items-center justify-center mb-4 transition-transform`}>
                      <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                    </div>
                    <h4 className="font-bold text-sm mb-2">{benefit.title}</h4>
                    <p className="text-xs text-muted leading-relaxed opacity-80">{benefit.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-500 text-background font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 text-sm"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-[10px] text-muted opacity-60 text-center sm:text-left">
                  Limited to one student per faculty. <br /> Application takes 2 minutes.
                </p>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="lg:col-span-2 relative bg-emerald-500/[0.03] p-10 flex flex-col justify-center border-l border-white/[0.06]">
              <div className="relative z-10">
                <div className="mb-10 text-center lg:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 mx-auto lg:mx-0">
                    <GraduationCap className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Join the Network</h3>
                  <p className="text-[10px] text-muted uppercase tracking-widest opacity-60">Nigerian Student Leadership</p>
                </div>

                <div className="space-y-3 mb-10">
                  {[
                    { label: "Ambassadors", value: "127+", icon: Users },
                    { label: "Universities", value: "43", icon: Building2 },
                    { label: "Avg. Rewards", value: "₦35k/mo", icon: Trophy },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                      <div className="flex items-center gap-3">
                        <s.icon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] uppercase font-bold text-muted tracking-tight">{s.label}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {universities.slice(0, 6).map((uni, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/[0.04] border border-emerald-500/10 rounded-full text-[9px] font-bold text-emerald-400/80 uppercase"
                    >
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits List */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Rewards</span>
              <h3 className="text-2xl font-bold mt-1">What you get</h3>
            </div>
            <div className="space-y-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/60 flex-shrink-0" />
                  <span className="text-sm font-medium text-muted/90">{perk}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-6">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Stories</span>
              <h3 className="text-2xl font-bold mt-1">Ambassador Success</h3>
            </div>
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-[32px]">
                  <p className="text-sm text-muted italic leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t.name}</p>
                      <p className="text-[9px] text-muted opacity-60">{t.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-10 md:p-14 rounded-[40px] text-center border border-emerald-500/10 bg-emerald-500/[0.02]"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold tracking-tight mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Limited Slots
            </div>
            <h3 className="text-2xl md:text-5xl font-bold mb-4 tracking-tight">
              Ready to <span className="text-emerald-400">Lead</span> at Your Campus?
            </h3>
            <p className="text-muted text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Join student leaders already shaping how Nigerian law students study. 
              Your faculty slot is waiting.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-500 text-background font-bold rounded-2xl hover:scale-105 transition-all shadow-lg"
            >
              Apply Now
              <Award className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
