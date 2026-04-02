"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  X,
  FileText,
  Save,
  Trash2
} from "lucide-react";
import { addPoints } from "@/lib/firebase/db";
import { useUserContext } from "./UserContext";

interface OCRUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "exam" | "note";
  onSuccess?: (content: string) => void;
}

export default function OCRUploadModal({ isOpen, onClose, type, onSuccess }: OCRUploadModalProps) {
  const { uid } = useUserContext();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const processOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: base64,
            mimeType: file.type || "image/jpeg",
            type: type
          })
        });

        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setResult(data.content);
        }
        setIsProcessing(false);
      };
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      if (type === "exam") {
        await addPoints(uid, 500);
        setPointsAwarded(true);
      }
      
      if (onSuccess) onSuccess(result);
      
      // Delay closing to show points
      setTimeout(() => {
         onClose();
         // Reset state
         setFile(null);
         setResult(null);
         setPointsAwarded(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl glass p-10 rounded-[56px] border-white/10 overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-muted hover:text-foreground transition-all">
           <X className="w-6 h-6" />
        </button>

        {!result ? (
          <div className="space-y-10 py-6">
            <div className="text-center">
               <h2 className="text-3xl font-bold mb-2 italic">Digitize your {type === 'exam' ? 'Past Papers' : 'Law Notes'}</h2>
               <p className="text-sm text-muted italic">Upload a photo or {type === 'exam' ? 'PDF' : 'Image'} for instant AI transcription.</p>
            </div>

            <div className={`p-16 border-2 border-dashed rounded-[48px] flex flex-col items-center justify-center transition-all ${file ? 'border-primary/40 bg-primary/5' : 'border-white/5 hover:border-white/20'}`}>
               <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center mb-8">
                 {isProcessing ? (
                   <Loader2 className="w-10 h-10 text-primary animate-spin" />
                 ) : (
                   <FileUp className="w-10 h-10 text-muted" />
                 )}
               </div>
               
               {file ? (
                 <div className="text-center">
                    <p className="text-lg font-bold mb-8 italic">{file.name}</p>
                    <button 
                      onClick={processOCR}
                      disabled={isProcessing}
                      className="px-10 py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" /> {isProcessing ? 'AI Processing...' : 'Start Scanning'}
                    </button>
                 </div>
               ) : (
                 <label className="text-center cursor-pointer">
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                    <p className="text-lg font-bold mb-2 italic">Select File</p>
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest">Supports JPG, PNG, PDF</p>
                 </label>
               )}
            </div>

            {error && (
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500 italic">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 py-6">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
               </div>
               <div>
                  <h3 className="text-xl font-bold italic">Extraction Complete</h3>
                  <p className="text-xs text-muted italic">Review the transcribed text below.</p>
               </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-8 bg-white/5 rounded-[36px] border border-white/5 scrollbar-hide text-sm text-muted leading-relaxed italic whitespace-pre-wrap">
               {result}
            </div>

            {pointsAwarded && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center gap-4 text-amber-500"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-background" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.1em] italic">+500 VERDI POINTS EARNED</p>
              </motion.div>
            )}

            <div className="flex gap-4">
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex-grow py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                 Save & Finish
               </button>
               <button 
                 onClick={() => setResult(null)}
                 className="py-5 px-8 glass text-rose-500 font-bold rounded-2xl border-white/5 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-3"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
