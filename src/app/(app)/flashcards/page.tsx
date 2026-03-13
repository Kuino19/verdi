"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Plus,
  Zap
} from "lucide-react";
import { useState } from "react";

const mockFlashcards = [
  {
    id: 1,
    question: "What is the 'Rule in Rylands v Fletcher'?",
    answer: "A person who for his own purposes brings on his lands and collects and keeps there anything likely to do mischief if it escapes, must keep it in at his peril.",
    subject: "Tort Law",
    deck: "Landmark Rules"
  },
  {
    id: 2,
    question: "What are the three certainties for a valid trust?",
    answer: "1. Certainty of Intention\n2. Certainty of Subject Matter\n3. Certainty of Objects",
    subject: "Equity & Trusts",
    deck: "Exam Essentials"
  },
  {
    id: 3,
    question: "Define 'Animus Furandi'.",
    answer: "An intention to steal; the intent to deprive the owner of property permanently.",
    subject: "Criminal Law",
    deck: "Latin Terms"
  }
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const currentCard = mockFlashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockFlashcards.length);
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Legal <span className="text-gradient">Flashcards</span></h1>
          <p className="text-muted italic">Master legal definitions and case ratios using spaced repetition.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 glass rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:border-primary/20 transition-all">
          <Plus className="w-4 h-4" /> Create Deck
        </button>
      </header>

      {!sessionStarted ? (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { name: "Landmark Rules", count: 42, color: "text-primary", bg: "bg-primary/10" },
             { name: "Exam Essentials", count: 128, color: "text-emerald-500", bg: "bg-emerald-500/10" },
             { name: "Latin Terms", count: 56, color: "text-blue-500", bg: "bg-blue-500/10" }
           ].map((deck, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="p-8 glass rounded-[32px] border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
               onClick={() => setSessionStarted(true)}
             >
                <div className={`w-12 h-12 rounded-xl ${deck.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <Layers className={`w-6 h-6 ${deck.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{deck.name}</h3>
                <p className="text-xs text-muted font-black uppercase tracking-widest mb-6">{deck.count} Cards</p>
                <div className="flex items-center justify-between">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0B1120]"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-[#0B1120]"></div>
                   </div>
                   <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Session <ArrowRight className="w-3 h-3" />
                   </span>
                </div>
             </motion.div>
           ))}
           
           <div className="p-8 glass rounded-[32px] border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-all cursor-pointer">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">AI Generated Decks<br/><span className="text-[10px] text-primary">Pro Feature</span></p>
           </div>
        </section>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
           {/* Card Container */}
           <div 
             className="w-full max-w-xl aspect-[4/3] relative perspective-1000 cursor-pointer"
             onClick={() => setIsFlipped(!isFlipped)}
           >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
              >
                 {/* Front */}
                 <div className="absolute inset-0 backface-hidden glass rounded-[48px] border-white/10 flex flex-col items-center justify-center p-12 text-center shadow-3xl bg-slate-900">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8 italic">{currentCard.subject} • {currentCard.deck}</span>
                    <h2 className="text-3xl font-bold mb-10 italic">"{currentCard.question}"</h2>
                    <div className="flex items-center gap-2 text-muted text-xs font-bold animate-pulse">
                       <RotateCw className="w-4 h-4" /> Tap to reveal answer
                    </div>
                 </div>

                 {/* Back */}
                 <div 
                   className="absolute inset-0 backface-hidden glass rounded-[48px] border-primary/20 flex flex-col items-center justify-center p-12 text-center shadow-3xl bg-slate-900/90"
                   style={{ transform: "rotateY(180) translateZ(1px)" }}
                 >
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-8 italic">THE ANSWER</span>
                    <p className="text-xl font-medium text-foreground/90 leading-relaxed mb-10 italic">
                       {currentCard.answer}
                    </p>
                    <HelpCircle className="w-8 h-8 text-white/10" />
                 </div>
              </motion.div>
           </div>

           {/* Controls */}
           <AnimatePresence>
              {isFlipped && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex flex-wrap justify-center gap-4 w-full"
                >
                   <button onClick={handleNext} className="flex flex-col items-center gap-2 group">
                      <div className="w-16 h-16 rounded-2xl glass border-rose-500/20 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-background transition-all">
                         <XCircle className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Again</span>
                   </button>
                   <button onClick={handleNext} className="flex flex-col items-center gap-2 group">
                      <div className="w-16 h-16 rounded-2xl glass border-orange-500/20 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-background transition-all">
                         <AlertCircle className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Hard</span>
                   </button>
                   <button onClick={handleNext} className="flex flex-col items-center gap-2 group">
                      <div className="w-16 h-16 rounded-2xl glass border-emerald-500/20 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-background transition-all">
                         <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Good</span>
                   </button>
                   <button onClick={handleNext} className="flex flex-col items-center gap-2 group">
                      <div className="w-16 h-16 rounded-2xl glass border-blue-500/20 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-background transition-all">
                         <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">Easy</span>
                   </button>
                </motion.div>
              )}
           </AnimatePresence>

           <button 
             onClick={() => setSessionStarted(false)}
             className="mt-16 text-xs font-black text-muted uppercase tracking-[0.2em] hover:text-foreground transition-all"
           >
              End Session
           </button>
        </motion.div>
      )}

      {/* Global Perspectve styles */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
