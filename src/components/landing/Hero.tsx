"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Gavel, Scale, BookOpen, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10"></div>

      <div className="container grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Empowering Nigerian Law Students</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Simplifying <span className="text-gradient">Legal Learning</span> for the Next Gen.
          </h1>
          
          <p className="text-lg md:text-xl text-muted mb-10 max-w-xl">
            VERDI transforms complex judicial decisions into structured summaries, combines AI-powered study assistance, and generates exam questions designed for your university.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-extrabold rounded-2xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center justify-center gap-2 px-8 py-4 glass text-foreground font-bold rounded-2xl hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current" />
              </div>
              See How it Works
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                  {i === 4 ? "+5k" : ""}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">
              Joined by <span className="text-foreground font-bold">5,000+ students</span> across 60+ Nigerian Universities
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 glass-dark p-8 rounded-[32px] border-white/10 shadow-3xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Case Summary</h3>
                  <p className="text-xs text-muted">*Donoghue v Stevenson [1932]*</p>
                </div>
              </div>
              <div className="px-3 py-1 glass rounded-lg text-xs font-bold text-secondary">LANDMARK</div>
            </div>

            <div className="space-y-4">
              <div className="p-4 glass rounded-xl border-l-4 border-primary">
                <p className="text-xs font-bold text-primary uppercase mb-1">Fact</p>
                <p className="text-sm text-muted">A manufacturer of ginger beer sold a bottle containing a decomposed snail to a retailer...</p>
              </div>
              <div className="p-4 glass rounded-xl border-l-4 border-emerald-500">
                <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Legal Issue</p>
                <p className="text-sm text-muted">Does a manufacturer owe a duty of care to the ultimate consumer in the absence of a contract?</p>
              </div>
              <div className="p-4 glass rounded-xl border-l-4 border-blue-500">
                <p className="text-xs font-bold text-blue-500 uppercase mb-1">Holding</p>
                <p className="text-sm font-bold">Yes. The "Neighbor Principle" was established.</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-background font-bold gap-3 animate-pulse">
              <BrainCircuit className="w-6 h-6" />
              Ask AI: Explain this in simple terms
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 glass rounded-2xl flex items-center justify-center animate-bounce duration-[3s]">
            <Scale className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 glass rounded-2xl flex items-center justify-center animate-bounce duration-[4s] delay-700">
            <Gavel className="w-12 h-12 text-secondary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
