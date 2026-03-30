"use client";

import Sidebar from "@/components/app/Sidebar";
import { UserProvider } from "@/components/app/UserContext";
import { Bell, LogOut, Menu } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  university?: string;
}

export default function AppShell({ children, userName, university, userEmail }: AppShellProps) {
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
    <UserProvider userName={userName || "Student"} university={university || "Nigerian University"} userEmail={userEmail || ""}>
      <div className="min-h-screen bg-[#0B1120] text-foreground">

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="md:ml-[240px] flex flex-col min-h-screen">

          {/* Top Bar — minimal */}
          <header className="h-14 border-b border-white/[0.06] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 bg-[#0B1120]/90 backdrop-blur-xl">

            {/* Left: hamburger (mobile) or page area (desktop) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              {/* Mobile logo */}
              <span className="md:hidden text-base font-bold tracking-tight text-gradient">VERDI</span>
            </div>

            {/* Right: minimal actions */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-muted hover:text-foreground transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>

              {/* User avatar */}
              <button className="ml-1 flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">
                    {(userName || "S")[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-muted hidden lg:block truncate max-w-[120px]">
                  {userName || "Student"}
                </span>
              </button>

              <button
                onClick={handleSignOut}
                title="Sign out"
                className="p-2 rounded-lg text-muted hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
