"use client";

import { useFeatureFlags } from "@/components/app/FeatureContext";
import { motion } from "framer-motion";
import { Check, X, Zap, Shield, Star, LayoutGrid } from "lucide-react";

export default function FeatureManager() {
  const { flags, toggleFeature, loading } = useFeatureFlags();

  if (loading) {
    return <div className="p-8 text-center text-muted italic">Loading feature flags...</div>;
  }

  const features = Object.keys(flags).sort();

  return (
    <section className="glass p-10 rounded-[56px] border-white/5 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-3 italic">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Feature Launch Control
        </h3>
        <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
          Live Sync
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
        {features.map((featureId) => (
          <div 
            key={featureId}
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${flags[featureId] ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {flags[featureId] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-bold capitalize">{featureId.replace("-", " ")}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                  {flags[featureId] ? "Active & Visible" : "Hidden from Users"}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleFeature(featureId, !flags[featureId])}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                flags[featureId] 
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20" 
                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
              }`}
            >
              {flags[featureId] ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
         <p className="text-xs text-muted leading-relaxed italic">
            <Star className="w-3 h-3 inline mr-1 text-primary" />
            Changes made here are applied instantly to all active student sessions. Use this to gradually roll out features.
         </p>
      </div>
    </section>
  );
}
