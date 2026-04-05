"use client";

import { motion } from "framer-motion";
import { Gavel, Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "@/lib/firebase/client";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendEmailVerification 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const setSession = async (idToken: string) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (res.ok) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setError("Failed to initialize session.");
      setIsLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.name });
      
      try {
        const dbSavePromise = setDoc(doc(db, "users", userCredential.user.uid), {
          full_name: form.name,
          university: form.university,
          email: form.email
        });
        await Promise.race([dbSavePromise, new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))]);
      } catch (dbErr) {
        console.error("Firestore Error:", dbErr);
      }

      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: true,
      });

      setSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        full_name: result.user.displayName,
        email: result.user.email
      }, { merge: true });
      const idToken = await result.user.getIdToken();
      await setSession(idToken);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputClass = "w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm";
  const labelClass = "block text-xs font-bold mb-2 text-muted uppercase tracking-wider";

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      alert("Verification email resent!");
    } catch (err: any) {
      setError(err.message || "Failed to resend email.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0B1120] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Check Your Email!</h2>
            <p className="text-muted mb-8 leading-relaxed text-sm">
              We sent a confirmation link to{" "}
              <strong className="text-foreground">{form.email}</strong>.{" "}
              Click it to activate your account and start learning.
            </p>
            
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all justify-center"
              >
                Back to Sign In <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button 
                onClick={handleResendEmail}
                disabled={isLoading}
                className="text-xs font-bold text-muted hover:text-primary transition-colors py-2"
              >
                {isLoading ? "Resending..." : "Didn't get the email? Resend Link"}
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex bg-[#0B1120] overflow-hidden">

      {/* ── Left decorative panel — desktop only ── */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] xl:w-[38%] bg-gradient-to-br from-primary/15 via-slate-900 to-[#0B1120] border-r border-white/5 p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[80px]" />

        <Link href="/" className="inline-flex items-center gap-3 z-10">
          <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/30">
            <Gavel className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gradient">VERDI</span>
        </Link>

        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-wider">Join 10,000+ Students</span>
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold italic leading-tight mb-4">
            Start Your Legal<br/>
            <span className="text-gradient">Journey Today</span>
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Access Nigeria's most complete legal study platform. AI-powered tutoring, 
            case law database, and exam generators — all in one place.
          </p>
        </div>

        <div className="z-10 p-5 glass rounded-2xl border-primary/20 bg-primary/5">
          <p className="text-sm italic text-muted leading-relaxed">
            "VERDI helped me pass my Constitutional Law finals. The AI tutor explains things better than my textbooks!"
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold">Adaeze O.</p>
              <p className="text-[10px] text-muted">University of Lagos, 400L</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-10 relative overflow-y-auto">
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[80px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[500px] py-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="p-2 glass rounded-lg">
                <Gavel className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gradient">VERDI</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold italic mb-1">Create Your Account</h1>
            <p className="text-muted text-sm">Join thousands of Nigerian law students</p>
          </div>

          <div className="glass p-6 md:p-8 rounded-3xl border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input type="text" required value={form.name} onChange={set("name")}
                    placeholder="John Doe" className={inputClass} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input type="email" required value={form.email} onChange={set("email")}
                    placeholder="j.doe@unilag.edu.ng" className={inputClass} />
                </div>
              </div>

              {/* University */}
              <div className="sm:col-span-2">
                <label className={labelClass}>University</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <select required value={form.university} onChange={set("university")}
                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none cursor-pointer">
                    <option value="" disabled>Select your university</option>
                    <optgroup label="Federal Universities">
                      <option value="ui">University of Ibadan (UI)</option>
                      <option value="unilag">University of Lagos (UNILAG)</option>
                      <option value="unn">University of Nigeria, Nsukka (UNN)</option>
                      <option value="oau">Obafemi Awolowo University (OAU)</option>
                      <option value="abu">Ahmadu Bello University (ABU)</option>
                      <option value="unilorin">University of Ilorin (UNILORIN)</option>
                      <option value="uniben">University of Benin (UNIBEN)</option>
                      <option value="unijos">University of Jos (UNIJOS)</option>
                      <option value="unical">University of Calabar (UNICAL)</option>
                      <option value="unizik">Nnamdi Azikiwe University (UNIZIK)</option>
                      <option value="unimaid">University of Maiduguri (UNIMAID)</option>
                      <option value="buk">Bayero University, Kano (BUK)</option>
                    </optgroup>
                    <optgroup label="State Universities">
                      <option value="lasu">Lagos State University (LASU)</option>
                      <option value="delsu">Delta State University (DELSU)</option>
                      <option value="oou">Olabisi Onabanjo University (OOU)</option>
                      <option value="aau">Ambrose Alli University (AAU)</option>
                      <option value="rsu">Rivers State University (RSU)</option>
                    </optgroup>
                    <optgroup label="Private Universities">
                      <option value="abuad">Afe Babalola University (ABUAD)</option>
                      <option value="babcock">Babcock University</option>
                      <option value="baze">Baze University</option>
                      <option value="covenant">Covenant University</option>
                      <option value="igbinedion">Igbinedion University</option>
                      <option value="pau">Pan-Atlantic University</option>
                    </optgroup>
                    <option value="other">Other University</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input type="password" required value={form.password} onChange={set("password")}
                    placeholder="Min. 8 characters" className={inputClass} />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input type="password" required value={form.confirmPassword} onChange={set("confirmPassword")}
                    placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="sm:col-span-2 flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Submit */}
              <div className="sm:col-span-2">
                <button disabled={isLoading}
                  className="w-full py-4 bg-primary text-background font-black rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-grow bg-white/5" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">or</span>
              <div className="h-px flex-grow bg-white/5" />
            </div>

            <button onClick={handleGoogleLogin} type="button"
              className="flex items-center justify-center gap-3 w-full py-3.5 glass rounded-2xl hover:bg-white/5 transition-all font-semibold text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center mt-5 text-xs text-muted leading-relaxed">
              By signing up you agree to our{" "}
              <Link href="#" className="underline hover:text-foreground transition-colors">Terms of Service</Link> and{" "}
              <Link href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
            </p>
          </div>

          <p className="text-center mt-6 text-sm text-muted">
            Already a member?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
