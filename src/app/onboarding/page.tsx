"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  GraduationCap, 
  BookMarked, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Award,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const levels = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];
const subjects = [
  "Constitutional Law", 
  "Contract Law", 
  "Criminal Law", 
  "Company Law", 
  "Legal System", 
  "Jurisprudence", 
  "Tort Law", 
  "Family Law", 
  "Property Law", 
  "Public International Law"
];
const goals = [
  { label: "Casual", time: "30 mins / day", icon: "☕" },
  { label: "Steady", time: "1 hour / day", icon: "📚" },
  { label: "Intensive", time: "3 hours / day", icon: "🔥" },
  { label: "Exam Mode", time: "5+ hours / day", icon: "⚖️" }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  return (
    <main className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step >= i ? "w-12 bg-primary" : "w-6 bg-white/10"
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs font-black text-muted uppercase tracking-widest italic">Step {step} of 4</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-[40px] border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 italic">Which level are you?</h2>
              <p className="text-muted mb-10">We'll tailor your case summaries and exam questions to your specific level of study.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => { setSelectedLevel(level); nextStep(); }}
                    className={`p-6 rounded-2xl border transition-all text-left group ${
                      selectedLevel === level 
                        ? "bg-primary text-background border-primary" 
                        : "glass border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="font-black text-lg">{level}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-[40px] border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8">
                <BookMarked className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4 italic">Core Interests?</h2>
              <p className="text-muted mb-10">Select at least 3 subjects you're currently focusing on this semester.</p>
              
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`p-4 rounded-xl border transition-all text-xs font-bold text-center ${
                      selectedSubjects.includes(subject) 
                        ? "bg-emerald-500 text-background border-emerald-500" 
                        : "glass border-white/5 hover:border-white/20"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-between items-center">
                <button onClick={prevStep} className="text-muted font-bold flex items-center gap-2 hover:text-foreground">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button 
                  onClick={nextStep} 
                  disabled={selectedSubjects.length < 3}
                  className="px-8 py-4 bg-emerald-500 text-background font-black rounded-2xl flex items-center gap-2 disabled:opacity-50"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-[40px] border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4 italic">Set Study Goal</h2>
              <p className="text-muted mb-10">How many hours per day do you plan to dedicate to your studies?</p>
              
              <div className="space-y-4">
                {goals.map((goal) => (
                  <button
                    key={goal.label}
                    onClick={() => { setSelectedGoal(goal.label); nextStep(); }}
                    className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                      selectedGoal === goal.label 
                        ? "bg-blue-500 text-background border-blue-500" 
                        : "glass border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h4 className="font-bold text-lg">{goal.label}</h4>
                        <p className={`text-sm ${selectedGoal === goal.label ? 'text-white/80' : 'text-muted'}`}>{goal.time}</p>
                      </div>
                    </div>
                    {selectedGoal === goal.label && <CheckCircle2 className="w-6 h-6" />}
                  </button>
                ))}
              </div>

              <button onClick={prevStep} className="mt-8 text-muted font-bold flex items-center gap-2 hover:text-foreground">
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-10 rounded-[40px] border-white/5 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 mx-auto relative">
                <Award className="w-12 h-12 text-primary" />
                <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 rounded-full border-2 border-primary" 
                />
              </div>
              <h2 className="text-4xl font-bold mb-4 italic text-gradient">You're All Set!</h2>
              <p className="text-muted mb-10">Your personal legal learning dashboard is ready. Let's start simplifying the law together.</p>
              
              <div className="p-6 glass rounded-2xl border-primary/20 mb-10 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-widest italic">Daily Goal Target</span>
                <span className="text-xl font-bold">{selectedGoal} — {goals.find(g => g.label === selectedGoal)?.time}</span>
              </div>

              <Link 
                href="/dashboard" 
                className="w-full py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
