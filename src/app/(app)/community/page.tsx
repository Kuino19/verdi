"use client";

import { motion } from "framer-motion";
import { 
  Users2, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Share2, 
  Heart, 
  MessageCircle,
  MoreVertical,
  Award,
  Search,
  Zap,
  Tag
} from "lucide-react";
import { useState } from "react";

const posts = [
  {
    id: 1,
    author: "Bolaji Williams",
    school: "University of Lagos",
    title: "How to handle Company Law exams? The syllabus is huge!",
    content: "Seriously struggling with the corporate personality section. Anyone has a summarized note or mindmap for Salomon v Salomon?",
    tags: ["Study Tips", "Company Law", "UNILAG"],
    likes: 42,
    replies: 12,
    time: "2h ago",
    badge: "Student Ambassador"
  },
  {
    id: 2,
    author: "Zainab Mohammed",
    school: "Ahmadu Bello University",
    title: "Difference between Ratio Decidendi and Obiter Dictum",
    content: "Could someone explain this in the simplest terms possible? My Jurisprudence lecturer is making it sound so complex.",
    tags: ["Jurisprudence", "Legal Method"],
    likes: 28,
    replies: 15,
    time: "5h ago",
    badge: "Verified Tutor"
  },
  {
    id: 3,
    author: "Chidi Okafor",
    school: "University of Nigeria, Nsukka",
    title: "Legal Internship opportunities in Lagos for 400L students?",
    content: "Looking for reputable law firms that offer student internships during the break. Any leads?",
    tags: ["Career", "Internships", "Lagos"],
    likes: 56,
    replies: 8,
    time: "8h ago"
  }
];

export default function CommunityPage() {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar: Navigation & Spaces */}
      <div className="hidden lg:flex flex-col gap-6">
        <button className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
           <Plus className="w-5 h-5" /> Start Discussion
        </button>

        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
           <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-6 italic">
                 <Users2 className="w-4 h-4" /> Spaces
              </h4>
              <div className="space-y-4">
                 {["General Discussion", "Legal Concepts", "Exam Preparation", "Career Advice", "University Specific"].map((s, i) => (
                   <button key={i} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${i === 0 ? 'bg-primary/10 text-primary font-bold' : 'text-muted hover:bg-white/5 hover:text-foreground text-sm font-medium'}`}>
                      <Tag className="w-3.5 h-3.5" /> {s}
                   </button>
                 ))}
              </div>
           </div>

           <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-6 italic">
                 <Award className="w-4 h-4" /> Top Contributors
              </h4>
              <div className="space-y-4">
                 {[
                   { name: "Bolaji Williams", pts: "14.2k" },
                   { name: "Zainab Mohammed", pts: "12.8k" },
                   { name: "Chidi Okafor", pts: "9.5k" }
                 ].map((u, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black">{u.name[0]}</div>
                         <p className="text-xs font-bold text-foreground">{u.name}</p>
                      </div>
                      <span className="text-[10px] font-black text-primary">{u.pts}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
         {/* Search Bar */}
         <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input 
              type="text" 
              placeholder="Search discussions, topics, or people..."
              className="w-full bg-white/5 border border-white/10 rounded-[28px] py-5 px-16 text-sm italic focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
         </div>

         {/* Feed Tabs */}
         <div className="flex gap-4 border-b border-white/5 px-2">
            {["Trending", "Latest", "Following"].map((t, i) => (
              <button key={i} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${i === 0 ? 'text-primary' : 'text-muted hover:text-foreground'}`}>
                 {t}
                 {i === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>}
              </button>
            ))}
         </div>

         {/* Posts */}
         <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[40px] border-white/5 hover:border-white/10 transition-all group"
              >
                 <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-primary relative">
                          {post.author[0]}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0B1120] rounded-lg flex items-center justify-center">
                             <TrendingUp className="w-3 h-3 text-emerald-500" />
                          </div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-0.5">
                             <h4 className="font-bold text-sm">{post.author}</h4>
                             {post.badge && (
                               <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[8px] font-black uppercase tracking-tighter">{post.badge}</span>
                             )}
                          </div>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest italic">{post.school} • {post.time}</p>
                       </div>
                    </div>
                    <button className="text-muted hover:text-foreground transition-all"><MoreVertical className="w-4 h-4" /></button>
                 </div>

                 <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors italic leading-snug">{post.title}</h3>
                 <p className="text-sm text-muted leading-relaxed mb-6 italic opacity-80">"{post.content}"</p>

                 <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, j) => (
                      <span key={j} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-muted uppercase tracking-widest">#{tag}</span>
                    ))}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-6">
                       <button className="flex items-center gap-2 text-muted hover:text-rose-500 transition-all font-black text-[10px] uppercase">
                          <Heart className="w-4 h-4" /> {post.likes}
                       </button>
                       <button className="flex items-center gap-2 text-muted hover:text-primary transition-all font-black text-[10px] uppercase">
                          <MessageCircle className="w-4 h-4" /> {post.replies}
                       </button>
                    </div>
                    <button className="p-2 text-muted hover:text-foreground transition-all"><Share2 className="w-4 h-4" /></button>
                 </div>
              </motion.div>
            ))}
         </div>

         {/* Pro Interaction Card */}
         <div className="p-10 glass rounded-[48px] border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[24px] bg-primary/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary fill-current" />
               </div>
               <div>
                  <h4 className="text-xl font-bold mb-1 italic">Join Expert Q&A Sessions</h4>
                  <p className="text-xs text-muted italic">Exclusive weekly live sessions with senior lawyers and academy lecturers.</p>
               </div>
            </div>
            <button className="px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs uppercase tracking-widest">
               Upgrade for Access
            </button>
         </div>
      </div>
    </div>
  );
}
