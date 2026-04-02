"use client";

import { useUserContext } from "@/components/app/UserContext";
import { PaystackButton } from "react-paystack";
import { Check, Crown, Shield } from "lucide-react";
import { useState } from "react";
import { updateUserProfile } from "@/lib/firebase/db";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const { uid, userEmail, userName, isPremium } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<"3days" | "weekly" | "monthly">("monthly");

  const plans = {
    "3days": { label: "3 Days Access", amount: 500 * 100, price: "₦500", desc: "Short term intensive prep" },
    "weekly": { label: "Weekly Access", amount: 1000 * 100, price: "₦1,000", desc: "One week of power study" },
    "monthly": { label: "Monthly Access", amount: 3500 * 100, price: "₦3,500", desc: "The ultimate law degree companion" }
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userEmail,
    amount: plans[plan].amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
    metadata: {
      custom_fields: [
        {
          display_name: "UID",
          variable_name: "uid",
          value: uid,
        },
        {
          display_name: "Plan",
          variable_name: "plan",
          value: plan
        }
      ]
    }
  };

  const handlePaystackSuccessAction = async (reference: any) => {
    setLoading(true);
    try {
      // Direct update to Firestore client-side for immediate access (Mock backend action)
      // Ideally, a webhook verifies this.
      await updateUserProfile(uid, { isPremium: true });
      router.refresh(); // refresh AppLayout to refetch latest status
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackCloseAction = () => {
    console.log("Payment closed");
  };

  const componentProps = {
    ...config,
    text: loading ? "Upgrading..." : `Pay ${plans[plan].price} / ${plan === "3days" ? "3 days" : plan === "weekly" ? "week" : "month"}`,
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      
      <div className="text-center space-y-4">
        <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-foreground">Upgrade Your Legal Arsenal</h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Unlock the ultimate suite of tools to excel in your Nigerian bar examinations and law degree.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto">
        
        {/* Free Tier */}
        <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold">Free</h2>
          <p className="text-3xl font-extrabold pb-4 border-b border-white/[0.06]">₦0 <span className="text-base text-muted font-medium">/forever</span></p>
          <ul className="space-y-4 text-sm text-muted">
            <li className="flex gap-3"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic AI legal tutor prompts (limited daily)</li>
            <li className="flex gap-3"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Standard dashboard access</li>
            <li className="flex gap-3"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 10 Past Papers accessible</li>
          </ul>
          <div className="pt-6">
            <button disabled className="w-full py-3 rounded-xl bg-white/5 text-muted font-bold cursor-not-allowed">
              Current Plan
            </button>
          </div>
        </div>

        {/* Premium Tier */}
        <div className="flex-1 bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-primary">Verdi Premium</h2>
          
          <div className="space-y-4">
            {(Object.keys(plans) as Array<keyof typeof plans>).map((p) => (
              <button 
                key={p} 
                onClick={() => setPlan(p)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${plan === p ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
              >
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="font-bold text-sm">{plans[p].label}</p>
                       <p className="text-[10px] text-muted">{plans[p].desc}</p>
                    </div>
                    <p className="font-black text-primary">{plans[p].price}</p>
                 </div>
              </button>
            ))}
          </div>

          <ul className="space-y-4 text-sm text-foreground pt-4 border-t border-white/5">
            <li className="flex gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Unlimited AI Legal Tutor Interactions</li>
            <li className="flex gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Automated case summaries & briefs</li>
            <li className="flex gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Over 5,000+ Past Questions spanning all universities</li>
            <li className="flex gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Smart Exam Generator (Personalized testing)</li>
          </ul>
          
          <div className="pt-6">
            {isPremium ? (
              <button disabled className="w-full py-3 rounded-xl bg-primary text-background font-bold tracking-wide flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> You are Premium
              </button>
            ) : (
              <PaystackButton 
                {...componentProps} 
                className="w-full py-3 rounded-xl bg-primary text-background font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
