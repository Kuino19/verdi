"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Settings as SettingsIcon, 
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
import { useState } from "react";

interface SettingItem {
  label: string;
  icon: any;
  value: string;
  color?: string;
  action?: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");

  const sections: SettingSection[] = [
    {
      title: "Account",
      items: [
        { label: "Profile Information", icon: User, value: "Adeyemi Lawal" },
        { label: "Connected University", icon: Gavel, value: "University of Lagos" },
        { label: "Security & Password", icon: Shield, value: "Changed 2 months ago" }
      ]
    },
    {
      title: "Subscription",
      items: [
        { label: "Current Plan", icon: Zap, value: "VERDI Pro (Monthly)", color: "text-primary" },
        { label: "Payment Method", icon: CreditCard, value: "Visa •••• 4242" },
        { label: "Billing History", icon: Globe, value: "View all invoices" }
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Notifications", icon: Bell, value: "Push & Email" },
        { label: "Appearance", icon: theme === 'dark' ? Moon : Sun, value: "Dark Mode", action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
        { label: "Language", icon: Globe, value: "English (Nigeria)" }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10">
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
           <button className="w-full flex items-center gap-4 p-6 glass rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all font-bold">
              <LogOut className="w-5 h-5" />
              Sign Out of VERDI
           </button>
        </div>
      </div>

      <div className="p-10 glass rounded-[48px] border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex flex-wrap items-center justify-between gap-6">
         <div>
            <h4 className="text-lg font-bold mb-2">VERDI Desktop App</h4>
            <p className="text-xs text-muted mb-4 italic">Get a more seamless experience on your computer.</p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 w-fit">
               <Smartphone className="w-3.5 h-3.5 text-muted" />
               <span className="text-[9px] font-black text-muted uppercase tracking-widest">Available for Windows, macOS</span>
            </div>
         </div>
         <button className="px-6 py-3 bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
            Download App
         </button>
      </div>
    </div>
  );
}
