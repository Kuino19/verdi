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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full mb-6 text-[10px] font-bold tracking-widest text-primary uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" /> PRICING
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
          >
            Simple, <span className="text-gradient">Flexible</span> Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted leading-relaxed"
          >
            Choose the plan that fits your study pace. No hidden fees.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 rounded-full text-xs font-semibold text-amber-200/80 border border-amber-500/10"
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Limited time: 3-day access for just{" "}
            <span className="text-amber-400 font-bold">₦500</span>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 bg-white/[0.02] border rounded-[32px] flex flex-col h-full transition-all duration-300 ${plan.pro ? "border-primary/20 bg-primary/[0.02]" : "border-white/[0.06]"}`}
            >
              {/* Popular/Best Value badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-background text-[10px] font-bold uppercase tracking-wider rounded-full shadow-[0_4px_16px_rgba(201,162,39,0.2)]">
                  {plan.badge}
                </div>
              )}

              {/* Price block */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">{plan.name}</h3>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-xs text-muted pb-1.5">{plan.period}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed opacity-80">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3.5 mb-10 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${plan.pro ? "bg-primary/20" : "bg-emerald-500/15"}`}>
                      <Check className={`w-3 h-3 ${colorMap[plan.color]}`} />
                    </div>
                    <span className="text-muted text-xs md:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                  plan.pro
                    ? "bg-primary text-background shadow-[0_8px_30px_rgba(201,162,39,0.25)]"
                    : "bg-white/[0.05] hover:bg-white/[0.08] text-foreground border border-white/[0.08]"
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
