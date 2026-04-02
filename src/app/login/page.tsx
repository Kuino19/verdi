"use client";

import { motion } from "framer-motion";
import { Gavel, Mail, Lock, ArrowRight, AlertCircle, Scale, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const features = [
  { icon: Scale, text: "Nigerian Case Law Database" },
  { icon: BookOpen, text: "AI-Powered Legal Tutor" },
  { icon: Trophy, text: "Leaderboard & Gamified Study" },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const setSession = async (idToken: string) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(`Session Error: ${data.message || "Failed to initialize session."}`);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await setSession(idToken);
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Invalid email or password.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await setSession(idToken);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#0B1120] overflow-hidden" suppressHydrationWarning>
      
      {/* ── Left Panel (decorative) — hidden on mobile ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[42%] bg-gradient-to-br from-primary/20 via-slate-900 to-[#0B1120] border-r border-white/5 p-12 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]" />
        
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 z-10">
          <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/30">
            <Gavel className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gradient">VERDI</span>
        </Link>

        {/* Feature list */}
        <div className="z-10 space-y-3">
          <h2 className="text-3xl xl:text-4xl font-bold italic leading-tight mb-6">
            Nigeria's #1 Legal<br/>
            <span className="text-gradient">Study Platform</span>
          </h2>
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              className="flex items-center gap-3 p-4 glass rounded-2xl border-white/5"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">{text}</span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted z-10 italic">
          Join 10,000+ law students studying smarter with VERDI.
        </p>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-10 relative">
        {/* Mobile background blobs */}
        <div className="lg:hidden absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 glass rounded-lg">
                <Gavel className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gradient">VERDI</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-1.5">Welcome Back</h1>
            <p className="text-muted text-sm">Sign in to continue your legal journey</p>
          </div>

          <div className="glass p-6 md:p-8 rounded-3xl border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2 text-muted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu.ng"
                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Password</label>
                  <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <button 
                disabled={isLoading}
                type="submit"
                className="w-full py-4 bg-primary text-background font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-grow bg-white/5" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">or</span>
              <div className="h-px flex-grow bg-white/5" />
            </div>

            <button 
              onClick={handleGoogleLogin} 
              type="button" 
              className="flex items-center justify-center gap-3 w-full py-3.5 glass rounded-2xl hover:bg-white/5 transition-all font-semibold text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-muted">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
