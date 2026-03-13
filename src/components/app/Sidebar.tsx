"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  ChevronLeft,
  Gavel,
  Zap
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Cases", icon: BookOpen, href: "/cases" },
  { name: "AI Assistant", icon: BrainCircuit, href: "/assistant" },
  { name: "Exam Gen", icon: FileQuestion, href: "/exam-generator" },
  { name: "CaseFlow", icon: Network, href: "/caseflow" },
  { name: "Flashcards", icon: Layers, href: "/flashcards" },
  { name: "Study Planner", icon: Calendar, href: "/study-planner" },
  { name: "Past Papers", icon: Library, href: "/past-papers" },
  { name: "Dictionary", icon: BookMarkedIcon, href: "/dictionary" },
  { name: "Community", icon: Users2, href: "/community" },
  { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
];

import { BookMarked as BookMarkedIcon } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="fixed left-0 top-0 bottom-0 z-40 glass-dark border-r border-white/5 flex flex-col transition-all duration-300"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" />
            <span className="text-xl font-black tracking-tighter text-gradient">VERDI</span>
          </Link>
        )}
        {isCollapsed && <Gavel className="w-6 h-6 text-primary mx-auto" />}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/5 rounded-lg transition-colors md:flex hidden"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`
                flex items-center gap-3 p-3 rounded-xl transition-all relative group
                ${isActive ? "bg-primary/20 text-primary" : "text-muted hover:bg-white/5 hover:text-foreground"}
                ${isCollapsed ? "justify-center" : ""}
              `}>
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted group-hover:text-foreground"}`} />
                {!isCollapsed && <span className="text-sm font-bold tracking-tight">{item.name}</span>}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill" 
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 glass text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto space-y-2">
        {!isCollapsed && (
           <div className="p-4 glass rounded-2xl border-primary/20 bg-gradient-to-br from-primary/10 to-transparent mb-4">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase mb-2">
                <Zap className="w-3 h-3 fill-current" />
                Upgrade to Pro
              </div>
              <p className="text-[10px] text-muted italic mb-3">Get unlimited AI Assistant & Exam Generator.</p>
              <Link href="/upgrade" className="block text-center py-2 bg-primary text-background text-[10px] font-black rounded-lg">
                View Plans
              </Link>
           </div>
        )}
        
        <Link href="/settings">
          <div className={`flex items-center gap-3 p-3 rounded-xl text-muted hover:bg-white/5 transition-all ${isCollapsed ? "justify-center" : ""}`}>
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-bold tracking-tight">Settings</span>}
          </div>
        </Link>
        <Link href="/">
          <div className={`flex items-center gap-3 p-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all ${isCollapsed ? "justify-center" : ""}`}>
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-bold tracking-tight">Logout</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
