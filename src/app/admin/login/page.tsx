"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Gavel } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  useEffect(() => {
    if (authError === "unauthorized") {
      setError("Access Denied: Administrator permissions required.");
    }
  }, [authError]);

  const setSession = async (idToken: string) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Failed to initialize secure session.");
      setIsLoading(false);
    }
  };

  const checkAdminStatus = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists() || userDoc.data()?.isAdmin !== true) {
      setError("Access Denied: This account does not have administrator privileges.");
      setIsLoading(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await checkAdminStatus(userCredential.user.uid);
      if (!isAdmin) return;

      const idToken = await userCredential.user.getIdToken();
      await setSession(idToken);
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Invalid administrative credentials.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const isAdmin = await checkAdminStatus(result.user.uid);
      if (!isAdmin) return;

      const idToken = await result.user.getIdToken();
      await setSession(idToken);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary to-amber-600 rounded-2xl shadow-2xl shadow-primary/20 mb-6 group">
            <ShieldCheck className="w-8 h-8 text-background group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter mb-2">
            VERDI <span className="text-primary italic">ADMIN</span>
          </h1>
          <p className="text-muted text-sm italic font-medium tracking-wide font-inter">Secure Legal Repository Access</p>
        </div>

        <div className="glass p-10 rounded-[40px] border-white/5 shadow-2xl bg-[#0B1120]/40 backdrop-blur-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3 italic">Auth Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@verdi.legal"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-primary/50 transition-all text-sm italic font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3 italic">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-primary/50 transition-all text-sm italic font-medium"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-bold text-rose-400 italic"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full py-5 bg-primary text-background font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 text-xs uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Authorize Access <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-grow bg-white/5" />
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">or</span>
            <div className="h-px flex-grow bg-white/5" />
          </div>

          <button 
            onClick={handleGoogleLogin} 
            type="button" 
            className="flex items-center justify-center gap-3 w-full py-4 glass rounded-2xl hover:bg-white/5 transition-all font-bold text-xs uppercase tracking-widest"
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

        <div className="mt-12 text-center">
          <Link href="/dashboard" className="text-[10px] font-black text-muted uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2 italic">
            <Gavel className="w-3 h-3" /> Return to Student Portal
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
