"use client";

import { motion } from "framer-motion";
import { Gavel, Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

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

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, university: form.university },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const inputClass =
    "w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm";
  const labelClass = "block text-xs font-bold mb-2 ml-1 text-muted uppercase tracking-widest";

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0B1120]">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        {/* Logo + header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="p-2 glass rounded-lg group-hover:bg-primary/20 transition-all">
              <Gavel className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-gradient">VERDI</span>
          </Link>
          <h1 className="text-3xl font-bold italic">Start Your Career</h1>
          <p className="text-muted mt-2">Join thousands of law students nationwide</p>
        </div>

        {success ? (
          /* ── Email sent screen ── */
          <div className="glass p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
            <p className="text-muted mb-8 leading-relaxed">
              We sent a confirmation link to{" "}
              <strong className="text-foreground">{form.email}</strong>.{" "}
              Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all"
            >
              Back to Sign In <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* ── Registration form ── */
          <div className="glass p-8 md:p-12 rounded-[40px] border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="col-span-2 md:col-span-1">
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input type="text" required value={form.name} onChange={set("name")}
                    placeholder="John Doe" className={inputClass} />
                </div>
              </div>

              {/* Email */}
              <div className="col-span-2 md:col-span-1">
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input type="email" required value={form.email} onChange={set("email")}
                    placeholder="j.doe@unilag.edu.ng" className={inputClass} />
                </div>
              </div>

              {/* University */}
              <div className="col-span-2">
                <label className={labelClass}>University</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <select required value={form.university} onChange={set("university")}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none cursor-pointer">
                    <option value="" disabled>Select your university</option>
                    <option value="unilag">University of Lagos (UNILAG)</option>
                    <option value="ui">University of Ibadan (UI)</option>
                    <option value="abu">Ahmadu Bello University (ABU)</option>
                    <option value="unn">University of Nigeria, Nsukka (UNN)</option>
                    <option value="lasu">Lagos State University (LASU)</option>
                    <option value="oau">Obafemi Awolowo University (OAU)</option>
                    <option value="covenant">Covenant University</option>
                    <option value="buk">Bayero University, Kano (BUK)</option>
                    <option value="uniben">University of Benin (UNIBEN)</option>
                    <option value="other">Other University</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="col-span-2 md:col-span-1">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input type="password" required value={form.password} onChange={set("password")}
                    placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="col-span-2 md:col-span-1">
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input type="password" required value={form.confirmPassword} onChange={set("confirmPassword")}
                    placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="col-span-2 flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="col-span-2 mt-2">
                <button disabled={isLoading}
                  className="w-full py-5 bg-primary text-background font-black rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center mt-10 text-xs text-muted leading-relaxed">
              By signing up you agree to our{" "}
              <Link href="#" className="underline">Terms of Service</Link> and{" "}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        )}

        <p className="text-center mt-8 text-sm text-muted">
          Already a member?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
