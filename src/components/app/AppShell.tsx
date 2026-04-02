"use client";

import Sidebar from "@/components/app/Sidebar";
import { UserProvider, useUserContext } from "@/components/app/UserContext";
import { Bell, LogOut, Menu, Flame, Trophy } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AppShellProps {
  children: React.ReactNode;
  uid: string;
  userEmail?: string;
  userName?: string;
  university?: string;
  isPremium?: boolean;
  streak?: number;
  points?: number;
}

import { AnimatePresence, motion } from "framer-motion";

export default function AppShell({ children, uid, userName, university, userEmail, isPremium = false, streak = 0, points = 0 }: AppShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <UserProvider 
      uid={uid} 
      userName={userName || "Student"} 
      university={university || "Nigerian University"} 
      userEmail={userEmail || ""} 
      isPremium={isPremium} 
      streak={streak} 
      points={points}
    >
      <div className="min-h-screen bg-[#0B1120] text-foreground flex flex-col md:flex-row">

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-grow flex flex-col min-h-screen md:ml-[240px]">

          {/* Top Bar — minimal */}
          <header className="h-16 border-b border-white/[0.06] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 bg-[#0B1120]/80 backdrop-blur-xl">

            {/* Left: hamburger (mobile) or page area (desktop) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-white/5 text-muted hover:text-foreground transition-all"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:block">
                 <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-0.5 italic">Workspace</p>
                 <p className="text-sm font-bold text-foreground">Verdi <span className="text-primary italic">Academy</span></p>
              </div>
              <span className="md:hidden text-lg font-black tracking-tighter text-gradient">VERDI</span>
            </div>

            {/* Stats Display (Desktop & Mobile) */}
            <div className="flex items-center gap-2 md:gap-6">
              <StatsDisplay />

              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-muted hover:text-foreground transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
                </button>

                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-2 rounded-lg text-muted hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-grow p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

function StatsDisplay() {
  const { points, streak } = useUserContext();
  const [prevPoints, setPrevPoints] = useState(points);
  const [pointDelta, setPointDelta] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    if (points > prevPoints) {
      setPointDelta(points - prevPoints);
      setShowXP(true);
      const timer = setTimeout(() => setShowXP(false), 2000);
      setPrevPoints(points);
      return () => clearTimeout(timer);
    } else if (points < prevPoints) {
       setPrevPoints(points);
    }
  }, [points, prevPoints]);

  return (
    <div className="flex items-center gap-3 sm:gap-6 relative">
      {/* Floating XP Animation */}
      <AnimatePresence>
        {showXP && pointDelta && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -25, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            className="absolute -top-6 left-0 right-0 flex justify-center pointer-events-none"
          >
            <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full text-[10px] font-black italic shadow-lg shadow-primary/20 backdrop-blur-md">
              +{pointDelta} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={showXP ? { scale: [1, 1.1, 1], transition: { duration: 0.4 } } : {}}
        className="flex flex-col items-end sm:items-center sm:flex-row gap-0.5 sm:gap-2"
      >
        <div className="flex items-center gap-1.5">
          <Trophy className={`w-3.5 h-3.5 ${showXP ? 'text-primary fill-primary/20 animate-pulse' : 'text-primary'}`} />
          <motion.span 
            key={points}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-xs font-black italic tracking-tight"
          >
            {points.toLocaleString()}
          </motion.span>
        </div>
        <span className="text-[8px] sm:text-[10px] font-bold text-muted uppercase tracking-widest hidden sm:inline-block">Points</span>
      </motion.div>

      <div className="h-3 w-[1px] bg-white/5 hidden sm:block" />

      <div className="flex flex-col items-end sm:items-center sm:flex-row gap-0.5 sm:gap-2">
        <div className="flex items-center gap-1.5">
          <Flame className={`w-3.5 h-3.5 ${streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted"}`} />
          <span className="text-xs font-black italic tracking-tight">{streak}</span>
        </div>
        <span className="text-[8px] sm:text-[10px] font-bold text-muted uppercase tracking-widest hidden sm:inline-block">Days</span>
      </div>
    </div>
  );
}
