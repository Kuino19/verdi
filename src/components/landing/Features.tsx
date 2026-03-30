"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpenCheck, 
  BrainCircuit, 
  FileQuestion, 
  Network, 
  Library, 
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight
} from "lucide-react";

const features = [
  {
    title: "Structured Case Summaries",
    description: "Extract facts, issues, reasoning, and decisions in seconds. No more digging through 50-page judgments.",
    icon: BookOpenCheck,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "hover:border-primary/30",
    glow: "hover:shadow-lg hover:shadow-primary/10"
  },
  {
    title: "AI Legal Assistant",
    description: "Ask questions about complex legal principles and get simplified explanations tailored for Nigerian law students.",
    icon: BrainCircuit,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/30",
    glow: "hover:shadow-lg hover:shadow-emerald-500/10"
  },
  {
    title: "Exam Question Generator",
    description: "Upload your notes and generate exam-style questions mirroring the format of Nigerian law faculties.",
    icon: FileQuestion,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/30",
    glow: "hover:shadow-lg hover:shadow-blue-500/10"
  },
  {
    title: "CaseFlow Mapping",
    description: "Visually map how cases relate. See which precedents follow, distinguish, or overrule each other.",
    icon: Network,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-400/30",
    glow: "hover:shadow-lg hover:shadow-amber-400/10"
  },
  {
    title: "Legal Dictionary",
    description: "Browse an A-Z glossary of legal terms with simple definitions and relevant case examples.",
    icon: Library,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-400/30",
    glow: "hover:shadow-lg hover:shadow-purple-400/10"
  },
  {
    title: "AI Study Planner",
    description: "Input your exam dates and let our AI build a day-by-day roadmap designed for maximum retention.",
    icon: Sparkles,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-400/30",
    glow: "hover:shadow-lg hover:shadow-rose-400/10"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full mb-6 text-xs font-bold tracking-tight"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Powerful Tools
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
          >
            Everything a Modern Law Student Needs
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted leading-relaxed"
          >
            VERDI combines academic accuracy with cutting-edge AI to give you a 
            significant competitive edge in your legal education.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className={`group p-8 glass rounded-[32px] border-white/5 ${feature.border} transition-all duration-300 relative overflow-hidden`}
            >
              {/* Hover background glow */}
              <div className={`absolute inset-0 ${feature.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} border border-white/5 flex items-center justify-center mb-6 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-foreground transition-colors">{feature.title}</h3>
                <p className="text-muted text-sm leading-[1.6] mb-6">{feature.description}</p>
                <div className={`flex items-center gap-2 ${feature.color} font-bold text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0`}>
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-20 relative overflow-hidden rounded-[40px] border border-primary/20 bg-primary/[0.03] backdrop-blur-sm"
        >
          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5 text-primary mb-4 font-bold text-xs tracking-tight">
                <Zap className="w-4 h-4 fill-current" />
                <span>Pro Exclusive</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
                Transform your <span className="text-gradient">lecture notes</span> into personalized exams.
              </h3>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                Upload your lecture handouts and let VERDI Pro build mock exams 
                matching your faculty&apos;s style.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-primary text-background font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap shadow-[0_8px_30px_rgba(201,162,39,0.25)]"
              >
                Get Pro Generator
              </Link>
              <button className="flex items-center justify-center gap-1 text-xs text-muted hover:text-foreground transition-colors font-bold">
                See how it works <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
