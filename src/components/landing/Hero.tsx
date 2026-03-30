"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Gavel, Scale, BookOpen, BrainCircuit, Sparkles } from "lucide-react";
import Link from "next/link";

function FloatingBadge({
  className,
  delay = 0,
  zIndex = 10,
  style,
  children,
}: {
  className?: string;
  delay?: number;
  zIndex?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
      style={{ zIndex, ...style }}
    >
      {children}
    </motion.div>
  );
}

const badgeBase: React.CSSProperties = {
  background: "rgba(11,17,32,0.95)",
  backdropFilter: "blur(16px)",
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 overflow-x-hidden">

      {/* ─── Background orbs ─── */}
      <div className="absolute top-[-5%] right-[-8%] w-[550px] h-[550px] rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,162,39,0.28) 0%, rgba(201,162,39,0.05) 60%, transparent 80%)", filter: "blur(60px)" }}
      />
      <div className="absolute bottom-[5%] left-[-8%] w-[450px] h-[450px] rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.04) 60%, transparent 80%)", filter: "blur(60px)" }}
      />
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)", backgroundSize: "56px 56px" }}
      />

      <div className="container">
        {/* 1-col on mobile/tablet, 2-col only on xl+ */}
        <div className="grid xl:grid-cols-2 gap-12 2xl:gap-24 items-center">

          {/* ─── Left: Copy ─── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary/30"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                Empowering Nigerian Law Students
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-5xl 2xl:text-7xl font-bold mb-6 leading-[1.1]">
              Simplifying{" "}
              <span className="text-gradient relative inline-block">
                Legal Learning
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full origin-left"
                  style={{ background: "linear-gradient(90deg, #C9A227, #FFD700)" }}
                />
              </span>{" "}
              for the Next Gen.
            </h1>

            <p className="text-base sm:text-lg text-muted mb-10 max-w-xl leading-relaxed">
              VERDI transforms complex judicial decisions into structured summaries, combines
              AI-powered study assistance, and generates exam questions designed for your university.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_8px_30px_rgba(201,162,39,0.25)]"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center justify-center gap-3 px-8 py-4 glass text-foreground font-bold rounded-2xl hover:bg-white/5 transition-all">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/10">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                See How it Works
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "bg-amber-700",
                  "bg-emerald-700",
                  "bg-blue-700",
                  "bg-violet-700",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-[#0B1120] ${color} flex items-center justify-center text-[10px] font-black ring-1 ring-white/10`}
                  >
                    {i === 3 ? "+5k" : ""}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-muted">
                  Joined by <span className="text-foreground font-bold">5,000+ students</span>{" "}
                  across <span className="text-foreground font-bold">60+ Nigerian Universities</span>
                </p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-muted ml-1.5">4.9 / 5</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Right: Case Card + Floating Badges ─── */}
          {/*
            FIX NOTES:
            - isolation:isolate on wrapper creates its own stacking context
            - Floating badges use inline zIndex instead of Tailwind z-* class
            - Badges positioned RIGHT-side only (-right-*) so they never overlap the left column
            - VERDICTS badge moved to bottom-right to keep it inside the right column bounds
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden xl:block"
            style={{ isolation: "isolate" }}
          >
            {/* Glow halo behind card */}
            <div
              className="absolute inset-[-10%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
                zIndex: 0,
              }}
            />

            {/* ── Case card ── */}
            <div
              className="glass-dark p-6 xl:p-8 rounded-[32px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{ position: "relative", zIndex: 1 }}
            >
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Case Summary</h3>
                    <p className="text-xs text-muted">Donoghue v Stevenson [1932]</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  LANDMARK
                </div>
              </div>

              <div className="space-y-3">
                {/* FACT — gold left border */}
                <div className="p-4 glass rounded-xl" style={{ borderLeft: "3px solid #C9A227" }}>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Fact</p>
                  <p className="text-sm text-muted leading-relaxed">
                    A manufacturer of ginger beer sold a bottle containing a decomposed snail to a retailer…
                  </p>
                </div>
                {/* LEGAL ISSUE — emerald left border */}
                <div className="p-4 glass rounded-xl" style={{ borderLeft: "3px solid #10B981" }}>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Legal Issue</p>
                  <p className="text-sm text-muted leading-relaxed">
                    Does a manufacturer owe a duty of care to the ultimate consumer in the absence of a contract?
                  </p>
                </div>
                {/* HOLDING — blue left border */}
                <div className="p-4 glass rounded-xl" style={{ borderLeft: "3px solid #3B82F6" }}>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Holding</p>
                  <p className="text-sm font-bold">Yes. The &ldquo;Neighbor Principle&rdquo; was established.</p>
                </div>
              </div>

              {/* AI CTA */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mt-6 flex items-center justify-center gap-3 p-4 rounded-2xl cursor-pointer font-bold text-sm text-background"
                style={{ background: "linear-gradient(135deg, #C9A227, #FFD700)" }}
              >
                <BrainCircuit className="w-5 h-5" />
                Ask AI: Explain this in simple terms
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>

            {/* ── Scale / CASES badge — top right corner ── */}
            <FloatingBadge
              delay={0}
              zIndex={20}
              className="absolute -top-8 -right-8 w-[78px] h-[78px] flex flex-col items-center justify-center rounded-2xl ring-1 ring-primary/40"
              style={{
                ...badgeBase,
                boxShadow: "0 0 30px rgba(201,162,39,0.55)",
              } as React.CSSProperties}
            >
              <Scale className="w-9 h-9 text-primary" style={{ filter: "drop-shadow(0 0 8px rgba(201,162,39,0.9))" }} />
              <span className="text-[8px] font-black text-primary mt-0.5 tracking-wider">CASES</span>
            </FloatingBadge>

            {/* ── Gavel / VERDICTS badge — bottom right ── */}
            <FloatingBadge
              delay={0.9}
              zIndex={20}
              className="absolute -bottom-10 -right-8 w-[90px] h-[90px] flex flex-col items-center justify-center rounded-2xl ring-1 ring-emerald-500/30"
              style={{
                ...badgeBase,
                boxShadow: "0 0 20px rgba(16,185,129,0.3)",
              } as React.CSSProperties}
            >
              <Gavel className="w-10 h-10 text-emerald-400" />
              <span className="text-[8px] font-bold text-emerald-400 mt-0.5 tracking-wider">VERDICTS</span>
            </FloatingBadge>

            {/* ── AI Online pill — mid left, safely inside the column ── */}
            <FloatingBadge
              delay={1.5}
              zIndex={20}
              className="absolute top-1/3 left-0"
              style={{ transform: "translateX(-50%)" } as React.CSSProperties}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full ring-1 ring-blue-500/30 text-xs font-bold text-blue-300 whitespace-nowrap"
                style={{ ...badgeBase, boxShadow: "0 0 18px rgba(59,130,246,0.35)" }}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
                AI Online
              </div>
            </FloatingBadge>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
