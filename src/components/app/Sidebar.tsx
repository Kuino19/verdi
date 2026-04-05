"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { BookMarked as BookMarkedIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  FileQuestion, 
  Network, 
  Library, 
  Calendar,
  Layers,
  Users2,
  Trophy,
  Settings,
  LogOut,
  Gavel,
  X,
  Crown,
  Gift
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useFeatureFlags } from "@/components/app/FeatureContext";
import { useUserContext } from "@/components/app/UserContext";
import { ChevronDown, ChevronRight, Lock } from "lucide-react";

const menuItems = [
  { name: "Dashboard",   icon: LayoutDashboard,  href: "/dashboard", featureId: "dashboard" },
  { 
    name: "Cases",       
    icon: BookOpen,         
    href: "/cases",
    featureId: "cases",
    subItems: [
      { name: "CaseFlow", icon: Network, href: "/caseflow", featureId: "caseflow", isPremium: true },
    ]
  },
  { name: "AI Assistant", icon: BrainCircuit,   href: "/assistant", featureId: "assistant" },
  { name: "Exam Generator", icon: FileQuestion, href: "/exam-generator", featureId: "exam-generator", isPremium: true },
  { 
    name: "Study Planner", 
    icon: Calendar,      
    href: "/study-planner",
    featureId: "study-planner",
    subItems: [
      { name: "Flashcards", icon: Layers, href: "/flashcards", featureId: "flashcards", isPremium: true },
    ]
  },
  { name: "Past Papers", icon: Library,       href: "/past-papers", featureId: "past-papers", isPremium: true },
  { name: "Dictionary",  icon: BookMarkedIcon, href: "/dictionary", featureId: "dictionary" },
  { name: "Community",   icon: Users2,         href: "/community", featureId: "community" },
  { name: "Leaderboard", icon: Trophy,         href: "/leaderboard", featureId: "leaderboard", isPremium: true },
  { name: "Rewards",     icon: Gift,           href: "/rewards", featureId: "rewards", isPremium: true },
  { name: "Mock Trial",  icon: Gavel,          href: "/moot-court", featureId: "moot-court", isPremium: true },
  { name: "Subscription",icon: Crown,          href: "/subscription", featureId: "subscription" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { flags } = useFeatureFlags() || { flags: {} };
  const { isPremium } = useUserContext();

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

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <Gavel className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-gradient">VERDI</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 rounded-lg text-muted hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-grow px-3 overflow-y-auto no-scrollbar">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isEnabled = flags[item.featureId as string] !== false;
            if (!isEnabled) return null;

            const isActive = pathname === item.href || (item.subItems?.some(sub => pathname === sub.href));
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.name} className="space-y-1">
                <Link href={item.href} onClick={onClose}>
                  <div className={`
                    flex items-center justify-between px-3 py-2.5 rounded-lg transition-all relative group
                    ${isActive
                      ? "bg-white/8 text-foreground"
                      : "text-muted hover:bg-white/5 hover:text-foreground"
                    }
                  `}>
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       {item.isPremium && !isPremium && <Lock className="w-3 h-3 text-primary/50" />}
                       {hasSubItems && (
                          isActive ? <ChevronDown className="w-3.5 h-3.5 text-muted/50" /> : <ChevronRight className="w-3.5 h-3.5 text-muted/20 group-hover:text-muted/50 transition-all" />
                       )}
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full"
                      />
                    )}
                  </div>
                </Link>

                {/* Sub-items rendering */}
                {hasSubItems && isActive && (
                  <div className="ml-9 space-y-1 py-1 border-l border-white/5">
                    {item.subItems?.map((sub) => {
                      const isSubEnabled = flags[sub.featureId as string] !== false;
                      if (!isSubEnabled) return null;
                      
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link key={sub.name} href={sub.href} onClick={onClose}>
                          <div className={`
                            flex items-center justify-between px-3 py-1.5 rounded-md transition-all
                            ${isSubActive ? "text-primary font-bold" : "text-muted/60 hover:text-foreground"}
                          `}>
                            <span className="text-xs">{sub.name}</span>
                            {sub.isPremium && !isPremium && <Lock className="w-2.5 h-2.5" />}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.06] flex-shrink-0 space-y-0.5">
        <Link href="/settings" onClick={onClose}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-white/5 hover:text-foreground transition-all">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </div>
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:bg-white/5 hover:text-rose-400 transition-all">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign out</span>
        </button>
        <div className="text-[10px] text-center pt-4 text-muted/30 font-bold uppercase tracking-widest pointer-events-none">
          Made by <span className="text-primary/50">Kuino</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[240px] flex-col border-r border-white/[0.06] bg-[#080E1C]">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[260px] flex flex-col border-r border-white/[0.06] bg-[#080E1C] md:hidden"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
