"use client";

import { motion } from "framer-motion";
import { Check, Zap, Info, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "Forever",
    description: "Perfect for casual study needs.",
    features: [
      "Limited case summaries",
      "Basic AI explanations (Daily limit)",
      "General case search",
      "Limited practice questions",
      "Community discussion access",
    ],
    cta: "Start for Free",
    href: "/register",
    pro: false,
    color: "emerald",
  },
  {
    name: "Weekly Pro",
    price: "₦1,000",
    period: "/ Week",
    description: "The most popular plan for exam prep.",
    features: [
      "Unlimited AI Legal Assistant",
      "Advanced Case Breakdown",
      "Exam Simulation Mode",
      "Upload notes & generate questions",
      "Full CaseFlow visual mapping",
      "AI Study Planner (Exam-based)",
    ],
    cta: "Go Pro Weekly",
    href: "/register",
    pro: true,
    badge: "🔥 Most Popular",
    color: "primary",
  },
  {
    name: "Monthly Pro",
    price: "₦3,500",
    period: "/ Month",
    description: "Save big for the entire semester.",
    features: [
      "Everything in Weekly Pro",
      "Priority AI Response time",
      "Advanced Analytics & Streaks",
      "Download Case PDFs",
      "Early Access to new features",
      "Personalized Legal Mentoring (AI)",
    ],
    cta: "Get Full Semester",
    href: "/register",
    pro: true,
    badge: "💎 Best Value",
    color: "primary",
  },
];

const colorMap: Record<string, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
};

const glowMap: Record<string, string> = {
  primary: "shadow-[0_0_40px_rgba(201,162,39,0.25)] border-primary/20",
  emerald: "shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/20",
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      {/* Section orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] -z-10 opacity-30"
        style={{ background: "radial-gradient(ellipse, rgba(201,162,39,0.15), transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6 border border-primary/20 text-xs font-black tracking-widest text-primary uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" /> Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold mb-5 italic"
          >
            Accessible <span className="text-gradient">Pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted"
          >
            Simple, student-friendly plans. No long-term commitments, no hidden fees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-bold text-amber-400 border border-amber-500/20"
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            Try our 3-day access plan for just{" "}
            <span className="text-amber-300 font-black">₦500</span>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative p-7 xl:p-8 glass rounded-[28px] border flex flex-col h-full transition-all duration-300 ${plan.pro ? glowMap[plan.color] : "border-white/5 hover:border-white/10"}`}
            >
              {/* Popular/Best Value badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-5 py-1.5 bg-primary text-background text-[11px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(201,162,39,0.4)]">
                  {plan.badge}
                </div>
              )}

              {/* Price block */}
              <div className="mb-8 pt-2">
                <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-3">{plan.name}</h3>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-sm text-muted pb-2">{plan.period}</span>
                </div>
                <p className="text-sm text-muted/80 italic">&ldquo;{plan.description}&rdquo;</p>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-10 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${plan.pro ? "bg-primary/15" : "bg-emerald-500/15"}`}>
                      <Check className={`w-3 h-3 ${colorMap[plan.color]}`} />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full py-4 rounded-2xl font-black text-sm text-center transition-all flex items-center justify-center gap-2 ${
                  plan.pro
                    ? "bg-primary text-background shadow-[0_0_30px_rgba(201,162,39,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                    : "glass hover:bg-white/5 border border-white/10"
                }`}
              >
                {plan.pro && <Zap className="w-4 h-4" />}
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {["PAYSTACK SECURE", "FLUTTERWAVE", "BANK TRANSFER"].map((label) => (
            <div key={label} className="flex items-center gap-2 text-xs font-black text-muted/50 hover:text-muted transition-colors tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
