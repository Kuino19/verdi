"use client";

import Sidebar from "@/components/app/Sidebar";
import { motion } from "framer-motion";
import { Bell, Search, User, Zap, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  university?: string;
}

export default function AppShell({ children, userName, university }: AppShellProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-foreground">
      <Sidebar />
      <div className="md:ml-[260px] ml-0 transition-all duration-300">
        {/* Top bar */}
        <header className="h-[72px] glass-dark border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex-grow max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search cases, principles, or papers..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass rounded-full border-primary/20">
              <Zap className="w-3.5 h-3.5 text-primary fill-current" />
              <span className="text-[10px] font-black text-primary uppercase">VERDI PRO</span>
            </div>

            <button className="p-2.5 glass rounded-xl relative hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5 text-muted" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B1120]" />
            </button>

            <div className="h-8 w-[1px] bg-white/5 mx-1" />

            {/* User profile + sign out */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-3 p-1.5 glass rounded-2xl hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left hidden lg:block pr-2">
                  <p className="text-xs font-bold leading-none">{userName || "Student"}</p>
                  <p className="text-[10px] text-muted leading-tight">{university || "Nigerian University"}</p>
                </div>
              </button>

              <button
                onClick={handleSignOut}
                title="Sign out"
                className="p-2.5 glass rounded-xl hover:bg-rose-500/10 hover:border-rose-500/20 transition-all group"
              >
                <LogOut className="w-4 h-4 text-muted group-hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
