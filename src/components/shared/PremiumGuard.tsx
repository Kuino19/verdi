"use client";

import { useUserContext } from "@/components/app/UserContext";
import { motion } from "framer-motion";
import { Lock, Crown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { logEvent, EVENTS } from "@/lib/firebase/analytics-utils";

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isFeatureLocked?: boolean;
}

export default function PremiumGuard({ children, fallback, isFeatureLocked }: PremiumGuardProps) {
  const { isPremium } = useUserContext();
  
  // A feature is "locked" if:
  // 1. isFeatureLocked is explicitly true
  // 2. OR isFeatureLocked is undefined AND the user is not premium
  const locked = isFeatureLocked !== undefined ? isFeatureLocked : !isPremium;

  if (!locked) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative group">
      {/* Blurred background content to show what they're missing */}
      <div className="filter blur-md pointer-events-none select-none opacity-40">
        {children}
      </div>

      {/* Premium Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-[48px] border-primary/20 bg-gradient-to-br from-primary/10 to-transparent max-w-md w-full text-center shadow-2xl shadow-primary/10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8" />
          </div>
          
          <h3 className="text-2xl font-bold mb-3 italic">Premium Feature</h3>
          <p className="text-muted text-sm mb-8 italic">
            This advanced tool is part of our <span className="text-primary font-bold">Verdi Gold</span> workspace. Upgrade to unlock case analytics, AI-generated exams, and more.
          </p>

          <div className="space-y-3">
            <Link 
              href="/subscription"
              onClick={() => logEvent(EVENTS.PREMIUM_UPGRADE_CLICK)}
              className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all text-xs uppercase tracking-widest"
            >
              Get Verdi Gold <ChevronRight className="w-4 h-4" />
            </Link>
            <button className="w-full py-4 glass border-white/5 text-muted font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Compare All Plans
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[#0B1120]/40 rounded-[48px] pointer-events-none" />
    </div>
  );
}
