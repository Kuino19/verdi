"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { addPoints } from "@/lib/firebase/db";
import Confetti from "@/components/app/Confetti";

interface ExamQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function ExamGeneratorPage() {
  const { uid, isPremium } = useUserContext();
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Quiz State
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    if (isCompleted && score > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      
      // Basic count-up
      const targetPoints = score * 50;
      let count = 0;
      const interval = setInterval(() => {
         count += Math.ceil(targetPoints / 20);
         if (count >= targetPoints) {
            setDisplayPoints(targetPoints);
            clearInterval(interval);
         } else {
            setDisplayPoints(count);
         }
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isCompleted, score]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, numQuestions })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || "Generation failed.");
      }

      setQuestions(data.quiz);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsCompleted(false);
    } catch (error: any) {
      console.error("Exam Gen Error:", error);
      setErrorMsg(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isCompleted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: index }));
  };

  const handleSubmitExam = async () => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) finalScore++;
    });
    setScore(finalScore);
    setIsCompleted(true);

    // Award Points
    if (uid && finalScore > 0) {
      const earnedPoints = finalScore * 50; // 50 points per correct answer
      await addPoints(uid, earnedPoints);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold mb-2">Exam <span className="text-gradient">Generator</span></h1>
        <p className="text-muted italic">Spawn realistic multiple choice quizzes instantly using Verdi AI.</p>
      </header>

      {/* TOPIC INPUT VIEW */}
      {questions.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-16 rounded-[48px] border-white/5 flex flex-col items-center justify-center text-center relative"
        >
          <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center mb-8">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-4 italic">What do you want to study?</h3>
          <p className="text-muted max-w-sm mx-auto leading-relaxed mb-8">
            Enter a Nigerian law topic (e.g. "Law of Torts", "Constitution", "Land Law") and Verdi will generate a custom quiz.
          </p>

          <form onSubmit={handleGenerate} className="w-full max-w-md space-y-4">
             <input 
               type="text" 
               placeholder="e.g. Principles of Equity..." 
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               disabled={isGenerating}
               required
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center focus:outline-none focus:border-primary/50 transition-colors" 
             />
             
             <div className="flex gap-4">
                <select 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  disabled={isGenerating || !isPremium}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none disabled:opacity-50"
                  title={!isPremium ? "Premium feature" : ""}
                >
                   <option value={5}>5 Questions</option>
                   <option value={10}>10 Questions</option>
                   <option value={20}>20 Questions</option>
                </select>
                <button 
                  type="submit" 
                  disabled={isGenerating || !topic.trim()}
                  className="flex-1 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Exam</>}
                </button>
             </div>
             {errorMsg && (
               <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold mt-4">
                 {errorMsg}
               </div>
             )}
          </form>
        </motion.div>
      )}

      {/* ACTIVE QUIZ VIEW */}
      {questions.length > 0 && !isCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold italic text-primary">Topic: {topic}</h2>
              <div className="px-4 py-2 glass rounded-xl text-xs font-black uppercase tracking-widest text-muted">
                 Question {currentIndex + 1} of {questions.length}
              </div>
           </div>

           <div className="glass p-6 md:p-12 rounded-[32px] md:rounded-[48px] border-white/5">
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed mb-8">{questions[currentIndex].question}</h3>

              <div className="space-y-3 md:space-y-4">
                 {questions[currentIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 md:p-6 rounded-2xl border transition-all ${
                         selectedAnswers[currentIndex] === idx 
                         ? "bg-primary/10 border-primary text-white" 
                         : "bg-white/5 border-white/5 text-muted hover:bg-white/10"
                      }`}
                    >
                       <span className="font-bold mr-4 text-primary opacity-50 uppercase tracking-widest text-xs">{String.fromCharCode(65 + idx)}</span>
                       <span className="text-sm md:text-base">{opt}</span>
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex justify-between items-center">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-6 py-4 glass rounded-2xl text-muted hover:text-white transition-colors disabled:opacity-30 flex items-center gap-2"
              >
                 <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              
              {currentIndex < questions.length - 1 ? (
                 <button 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  className="px-8 py-4 bg-primary text-background font-black rounded-2xl disabled:opacity-30 transition-all flex items-center gap-2"
                 >
                   Next <ArrowRight className="w-4 h-4" />
                 </button>
              ) : (
                <button 
                  onClick={handleSubmitExam}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  className="px-8 py-4 bg-emerald-500 text-background font-black rounded-2xl disabled:opacity-30 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"
                 >
                   Submit Exam <CheckCircle2 className="w-5 h-5" />
                 </button>
              )}
           </div>
        </motion.div>
      )}

      {/* RESULTS VIEW */}
      {isCompleted && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 pb-10"
        >
           <Confetti active={showConfetti} />
           
           <div className="flex flex-col items-center justify-center p-12 glass rounded-[48px] border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent text-center relative overflow-hidden">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Trophy className="w-20 h-20 text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              </motion.div>
              
              <h2 className="text-4xl font-black mb-2 italic">You Scored {score} / {questions.length}</h2>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-8"
              >
                 <p className="text-xl text-muted font-bold">You earned </p>
                 <motion.span 
                   animate={{ scale: [1, 1.2, 1] }}
                   className="text-4xl font-black text-primary italic drop-shadow-[0_0_10px_rgba(201,162,39,0.3)]"
                 >
                    +{displayPoints} XP
                 </motion.span>
              </motion.div>
              
              <button 
                 onClick={() => { setQuestions([]); setDisplayPoints(0); }}
                 className="px-10 py-5 bg-white/5 text-foreground font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10"
               >
                 <RotateCcw className="w-4 h-4" /> Take Another Mock
               </button>

               {/* Achievement badge concept */}
               {score === questions.length && (
                 <motion.div
                   initial={{ x: 100, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="absolute top-8 right-8 rotate-12"
                 >
                    <div className="bg-primary text-background px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                      Perfect Score!
                    </div>
                 </motion.div>
               )}
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-widest text-muted italic">Review Answers</h3>
              {questions.map((q, idx) => {
                 const isCorrect = selectedAnswers[idx] === q.answer;
                 return (
                   <div key={idx} className={`glass p-8 rounded-[32px] border ${isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                      <div className="flex items-start gap-4 mb-4">
                         {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />}
                         <p className="text-lg font-bold leading-relaxed">{q.question}</p>
                      </div>
                      <div className="pl-10 space-y-3">
                         <p className="text-sm">
                           <span className="text-muted">Your Answer: </span>
                           <span className={`font-bold ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>{q.options[selectedAnswers[idx]] || 'None'}</span>
                         </p>
                         {!isCorrect && (
                           <p className="text-sm">
                             <span className="text-muted">Correct Answer: </span>
                             <span className="font-bold text-emerald-500">{q.options[q.answer]}</span>
                           </p>
                         )}
                         <div className="mt-4 p-4 glass rounded-2xl text-xs text-muted leading-relaxed italic">
                            <span className="font-bold text-primary uppercase mr-2 tracking-widest">Explanation:</span>
                            {q.explanation}
                         </div>
                      </div>
                   </div>
                 );
              })}
           </div>
        </motion.div>
      )}

    </div>
  );
}
