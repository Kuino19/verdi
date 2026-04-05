"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Moon, 
  Sun,
  Globe,
  LogOut,
  ChevronRight,
  Gavel,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { auth } from "@/lib/firebase/client";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { updateUserProfile } from "@/lib/firebase/db";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/components/app/NotificationContext";

interface SettingItem {
  label: string;
  icon: LucideIcon;
  value: string;
  color?: string;
  action?: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsPage() {
  const { userName, university, uid, userEmail } = useUserContext();
  const { addSystemAlert } = useNotifications();
  const [theme, setTheme] = useState("dark");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newUni, setNewUni] = useState(university);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    setIsSaving(true);
    try {
      await updateUserProfile(uid, { full_name: newName, university: newUni });
      setIsEditingProfile(false);
      addSystemAlert("Profile Updated! ✨", "Your changes have been saved to the Verdi Cloud.");
      router.refresh();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userEmail) return;
    try {
      await sendPasswordResetEmail(auth, userEmail);
      addSystemAlert("Reset Email Sent! 🔐", `A secure link has been sent to ${userEmail}. Check your inbox.`);
    } catch (err) {
      console.error("Reset failed", err);
    }
  };

  const sections: SettingSection[] = [
    {
      title: "Account",
      items: [
        { label: "Profile Information", icon: User, value: userName, action: () => {
          setNewName(userName);
          setNewUni(university);
          setIsEditingProfile(true);
        }},
        { label: "Connected University", icon: Gavel, value: university, action: () => setIsEditingProfile(true) },
        { label: "Security & Password", icon: Shield, value: "Secure with Gmail Auth", action: handlePasswordReset }
      ]
    },
    {
      title: "Subscription",
      items: [
        { label: "Current Plan", icon: Zap, value: "VERDI Student (Free)", color: "text-muted" },
        { label: "Payment Method", icon: CreditCard, value: "No active card" },
        { label: "Billing History", icon: Globe, value: "View all invoices" }
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Notifications", icon: Bell, value: "Push & Email Enabled" },
        { label: "Appearance", icon: theme === 'dark' ? Moon : Sun, value: "Dark Mode", action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
        { label: "Language", icon: Globe, value: "English (Nigeria)" }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-bold mb-2">Account <span className="text-gradient">Settings</span></h1>
        <p className="text-muted italic">Manage your profile, preferences, and subscription status.</p>
      </header>

      <div className="space-y-8">
        {sections.map((section, si) => (
          <motion.div 
            key={si}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="space-y-4"
          >
             <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-4 italic">{section.title}</h3>
             <div className="glass rounded-[32px] border-white/5 overflow-hidden">
                {section.items.map((item, ii) => (
                  <button 
                    key={ii}
                    onClick={() => item.action?.()}
                    className={`w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left ${ii !== section.items.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted">
                           <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm font-bold">{item.label}</p>
                           <p className={`text-xs font-medium opacity-60 ${item.color || ''}`}>{item.value}</p>
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-muted" />
                  </button>
                ))}
             </div>
          </motion.div>
        ))}

        <div className="pt-6">
           <button onClick={handleSignOut} className="w-full flex items-center gap-4 p-6 glass rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all font-bold group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sign Out of VERDI
           </button>
        </div>

        {/* Desktop App Promo */}
        <div className="p-10 glass rounded-[48px] border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex flex-wrap items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">VERDI Desktop App</h4>
              <p className="text-xs text-muted mb-4 italic">Get a more seamless experience on your computer.</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 w-fit">
                <Smartphone className="w-3.5 h-3.5 text-muted" />
                <span className="text-[9px] font-black text-muted uppercase tracking-widest">Available for Windows, macOS</span>
              </div>
          </div>
          <button className="relative z-10 px-6 py-3 bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Download App
          </button>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass border-white/10 rounded-[48px] p-10 overflow-hidden"
            >
               <h2 className="text-2xl font-bold italic mb-6">Edit <span className="text-primary">Profile</span></h2>
               <form onSubmit={handleUpdateProfile} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted tracking-widest px-2 italic">Full Name</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full glass bg-white/5 border-white/10 rounded-2xl p-4 text-sm focus:border-primary/40 outline-none transition-all font-medium" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted tracking-widest px-2 italic">University</label>
                    <input 
                      type="text" 
                      value={newUni}
                      onChange={e => setNewUni(e.target.value)}
                      className="w-full glass bg-white/5 border-white/10 rounded-2xl p-4 text-sm focus:border-primary/40 outline-none transition-all font-medium" 
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 px-6 py-4 glass border-white/5 rounded-2xl text-xs font-bold hover:bg-white/5 transition-all text-muted uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 px-6 py-4 bg-primary text-background rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : "Save Changes"}
                    </button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
