"use client";

import { motion } from "framer-motion";
import { 
  Library, 
  Search, 
  Download, 
  FileText, 
  ChevronRight, 
  Filter, 
  Star,
  Clock,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { useRouter } from "next/navigation";
import OCRUploadModal from "@/components/app/OCRUploadModal";
import { fetchAllCases } from "@/lib/firebase/db";

const mockPapers = [
  { id: 1, title: "Law of Tort I", year: "2023", school: "University of Lagos", session: "First Semester", level: "300L" },
  { id: 2, title: "Criminal Law II", year: "2022", school: "University of Ibadan", session: "Second Semester", level: "200L" },
  { id: 3, title: "Constitutional Law", year: "2023", school: "Ahmadu Bello University", session: "First Semester", level: "100L" },
  { id: 4, title: "Equity & Trusts", year: "2021", school: "University of Benin", session: "First Semester", level: "400L" },
  { id: 5, title: "Commercial Law", year: "2022", school: "Obafemi Awolowo University", session: "Second Semester", level: "300L" },
  { id: 6, title: "Legal Method", year: "2023", school: "Lagos State University", session: "First Semester", level: "100L" },
];

export default function PastPapersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isPremium } = useUserContext();
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllCases();
        setCases(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPapers = [...mockPapers, ...cases.filter(c => c.type === 'past-paper')].filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.school && p.school.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold mb-2">Past <span className="text-gradient">Papers</span></h1>
        <p className="text-muted italic">Browse past examination questions from top Nigerian Law Faculties.</p>
      </header>

      {/* Search & Stats */}
      <section className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
           <input 
             type="text" 
             placeholder="Search by subject, university, or year..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 text-sm italic focus:outline-none focus:border-primary/50 transition-all font-medium"
           />
        </div>
        <button className="flex items-center justify-center gap-3 px-8 py-6 glass rounded-[24px] border-white/5 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest whitespace-nowrap">
           <Filter className="w-4 h-4" /> Advanced Filter
        </button>
      </section>

      {/* Categories Horizontal */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
         {["All Universities", "UNILAG", "UI", "ABU", "OAU", "UNIBEN", "LASU"].map((u, i) => (
           <button key={i} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${i === 0 ? 'bg-primary text-background border-primary' : 'glass border-white/5 text-muted hover:border-white/20'}`}>
              {u}
           </button>
         ))}
      </div>

      {/* Results Grid */}
      <section className="grid md:grid-cols-2 gap-6">
         {filteredPapers.map((paper, i) => {
           const isLocked = !isPremium && i >= 2;
           return (
             <motion.div
               key={paper.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               className="glass p-8 rounded-[36px] border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all relative overflow-hidden"
             >
                <div className={`flex items-center gap-6 ${isLocked ? "opacity-30 blur-[2px]" : ""}`}>
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <FileText className="w-8 h-8 text-primary/50 group-hover:text-primary transition-colors" />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">{paper.level}</span>
                         <span className="text-[10px] font-bold text-muted uppercase tracking-widest">•</span>
                         <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{paper.year}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1 italic">{paper.title}</h3>
                      <p className="text-xs text-muted font-bold opacity-60">{paper.school}</p>
                   </div>
                </div>
                
                {isLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 rounded-[36px]">
                    <Lock className="w-8 h-8 text-primary mb-2" />
                    <button onClick={() => router.push("/subscription")} className="px-4 py-2 bg-primary text-background font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(201,162,39,0.3)]">
                      Upgrade to Unlock
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 relative z-20">
                     <button className="p-3 glass rounded-xl text-muted hover:text-primary transition-all">
                        <Download className="w-4 h-4" />
                     </button>
                     <button className="p-3 glass rounded-xl text-muted hover:text-foreground transition-all">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                )}
             </motion.div>
           );
         })}
      </section>

      {/* Quick Access Sidebar Component (Planned Integration) */}
      <div className="p-10 glass rounded-[48px] border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-4 italic leading-tight">Can't find a specific paper?</h3>
            <p className="text-sm text-muted mb-8 leading-relaxed italic">Contribute past papers from your university and earn <span className="text-primary font-bold">VERDI Points</span> to unlock Premium features.</p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black uppercase text-muted tracking-widest">500 Points Per Paper</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-muted tracking-widest">Fast Review (24h)</span>
               </div>
            </div>
         </div>
         <button 
           onClick={() => setIsUploadModalOpen(true)}
           className="px-10 py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all"
         >
            <Library className="w-5 h-5" /> Upload Now
         </button>
      </div>

      <OCRUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        type="exam" 
      />
    </div>
  );
}
