"use client";

import { motion } from "framer-motion";
import { Check, Zap, Info } from "lucide-react";

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
      "Community discussion access"
    ],
    cta: "Start for Free",
    pro: false
  },
  {
    name: "Weekly Pro",
    price: "₦1,000",
    period: "per Week",
    description: "The most popular plan for exam prep.",
    features: [
      "Unlimited AI Legal Assistant",
      "Advanced Case Breakdown",
      "Exam Simulation Mode",
      "Upload notes & generate questions",
      "Full CaseFlow visual mapping",
      "AI Study Planner (Exam-based)"
    ],
    cta: "Go Pro Weekly",
    pro: true,
    badge: "Popular"
  },
  {
    name: "Monthly Pro",
    price: "₦3,500",
    period: "per Month",
    description: "Save big for the entire semester.",
    features: [
      "Everything in Weekly Pro",
      "Priority AI Response time",
      "Advanced Analytics & Streaks",
      "Download Case PDFs",
      "Early Access to new features",
      "Personalized Legal Mentoring (AI)"
    ],
    cta: "Get Full Semester",
    pro: true,
    badge: "Best Value"
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 italic"
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
          
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-bold text-amber-500 border-amber-500/20">
            <Info className="w-4 h-4" />
            Try our 3-day short access plan for just ₦500
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 glass rounded-[32px] border-white/5 flex flex-col h-full hover:border-white/20 transition-all ${plan.pro ? 'bg-gradient-to-b from-white/5 to-transparent' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-background text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm text-muted">/{plan.period}</span>
                </div>
                <p className="mt-4 text-sm text-muted italic">"{plan.description}"</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex gap-3 text-sm">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.pro ? 'text-primary' : 'text-emerald-500'}`} />
                    <span className="text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.pro ? 'bg-primary text-background shadow-xl hover:scale-[1.02] active:scale-[0.98]' : 'glass hover:bg-white/5'}`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Payment dummy icons */}
            <div className="text-xs font-bold">PAYSTACK SECURE</div>
            <div className="text-xs font-bold">FLUTTERWAVE</div>
            <div className="text-xs font-bold">BANK TRANSFER</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
