"use client";

import { motion } from "framer-motion";
import { 
  Users2, 
  Plus, 
  MessageCircle,
  TrendingUp,
  Tag,
  Loader2,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/app/UserContext";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where, QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc, increment as firestoreIncrement } from "firebase/firestore";
import { addForumReply, likeForumPost, addPoints, incrementUsage } from "@/lib/firebase/db";
import { logEvent, EVENTS } from "@/lib/firebase/analytics-utils";
import { ArrowLeft, Heart, Send, Crown, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ForumPost {
  id: string;
  author: string;
  authorId: string;
  university: string;
  title: string;
  content: string;
  topicTag: string;
  likes: number;
  replies: number;
  createdAt: any;
  isPremiumAuthor?: boolean;
}

export default function CommunityPage() {
  const { uid, userName, university, isPremium } = useUserContext();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("General Discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thread View State
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Space Filtering
  const [activeSpace, setActiveSpace] = useState("General Discussion");

  useEffect(() => {
    setIsLoading(true);
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (activeSpace !== "General Discussion") {
      constraints.unshift(where("topicTag", "==", activeSpace));
    }

    const q = query(collection(db, "forums"), ...constraints);
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedPosts: ForumPost[] = [];
      snapshot.forEach(doc => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as ForumPost);
      });
      setPosts(fetchedPosts);
      setIsLoading(false);
    });
    return () => unsub();
  }, [activeSpace]);

  useEffect(() => {
    if (!selectedPost) {
      setReplies([]);
      return;
    }
    const q = query(collection(db, "forums", selectedPost.id, "replies"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedReplies: any[] = [];
      snapshot.forEach(doc => {
        fetchedReplies.push({ id: doc.id, ...doc.data() });
      });
      setReplies(fetchedReplies);
    });
    return () => unsub();
  }, [selectedPost]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !newTitle.trim() || !newContent.trim()) return;

    // Daily Limit Check for FREE users
    if (!isPremium) {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const today = new Date().toISOString().split("T")[0];
      const communityUsage = userData?.communityUsage || { date: today, count: 0 };
      
      if (communityUsage.date !== today) {
        communityUsage.date = today;
        communityUsage.count = 0;
      }

      if (communityUsage.count >= 3) {
        alert("Daily community limit reached (3 posts). Upgrade to VERDI Pro for unlimited academic discussions!");
        setIsCreating(false);
        return;
      }

      // Update local usage immediately for guard
      await updateDoc(userRef, {
        communityUsage: { date: today, count: communityUsage.count + 1 }
      });
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "forums"), {
        author: userName || "Anonymous Law Student",
        authorId: uid,
        university: university || "Nigerian University",
        title: newTitle,
        content: newContent,
        topicTag: newTag,
        likes: 0,
        replies: 0,
        isPremiumAuthor: isPremium,
        createdAt: serverTimestamp()
      });

      // Reward points!
      await addPoints(uid, 5);
      await incrementUsage(uid, "communityCount");

      // Analytics Logging
      logEvent("community_post_create", {
        topic: newTag,
        title_length: newTitle.length,
        is_premium: isPremium
      });

      // Reset
      setIsCreating(false);
      setNewTitle("");
      setNewContent("");
      setNewTag("General Discussion");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    await likeForumPost(postId);
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
    }
    logEvent("community_like", {
      post_id: postId,
      is_premium: isPremium
    });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !selectedPost || !newReply.trim()) return;

    setIsReplying(true);
    try {
      await addForumReply(selectedPost.id, {
        author: userName || "Anonymous Student",
        authorId: uid,
        university: university || "Nigerian University",
        content: newReply,
      });
      // Analytics Logging
      logEvent("community_reply_complete", {
        post_id: selectedPost.id,
        is_premium: isPremium
      });

      setNewReply("");
      await addPoints(uid, 2); // 2 XP per reply
    } catch (error) {
      console.error("Error replying:", error);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8 relative pb-20">
      
      {/* CREATE POST MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-2xl glass p-8 md:p-12 rounded-[48px] border-white/10 shadow-2xl space-y-8 relative"
           >
              <button 
                onClick={() => setIsCreating(false)}
                className="absolute top-8 right-8 p-3 glass rounded-full hover:bg-white/10 transition-colors"
              >
                 <X className="w-5 h-5 text-muted" />
              </button>

              <div>
                 <h2 className="text-3xl font-bold flex items-center gap-3 italic">
                    <MessageCircle className="w-6 h-6 text-primary" /> Start Discussion
                 </h2>
                 <p className="text-muted mt-2">Share thoughts, ask highly-academic questions, or request case notes.</p>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                 <div>
                    <input 
                      type="text" 
                      placeholder="Title of your discussion..." 
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 font-bold text-lg focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted/50"
                    />
                 </div>
                 
                 <div>
                    <select 
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                       <option value="General Discussion">General Discussion</option>
                       <option value="Legal Concepts">Legal Concepts</option>
                       <option value="Exam Preparation">Exam Preparation</option>
                       <option value="Career Advice">Career Advice</option>
                    </select>
                 </div>

                 <div>
                    <textarea 
                      placeholder="Explain your question or thoughts in detail..." 
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      required
                      disabled={isSubmitting}
                      rows={5}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-6 text-sm leading-relaxed focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted/50 resize-none"
                    ></textarea>
                 </div>

                 <button 
                    type="submit" 
                    disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                    className="w-full py-5 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post Discussion (+5 XP)"}
                 </button>
              </form>
           </motion.div>
        </div>
      )}

      {/* Sidebar: Navigation & Spaces */}
      <div className="hidden lg:flex flex-col gap-6">
        <button 
          onClick={() => setIsCreating(true)}
          className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
        >
           <Plus className="w-5 h-5" /> Start Discussion
        </button>

        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
           <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest mb-6 italic">
                 <Users2 className="w-4 h-4" /> Spaces
              </h4>
               <div className="space-y-4">
                  {["General Discussion", "Legal Concepts", "Exam Preparation", "Career Advice"].map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveSpace(s)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${activeSpace === s ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'text-muted hover:bg-white/5 hover:text-foreground text-sm font-medium border border-transparent'}`}
                    >
                       <Tag className="w-3.5 h-3.5" /> {s}
                    </button>
                  ))}
               </div>
           </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
         
         {!selectedPost ? (
           <>
              {/* Mobile Create Button */}
              <div className="lg:hidden">
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Start Discussion
                </button>
              </div>

              <div className="flex gap-4 border-b border-white/5 px-2">
                <button className="pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative text-primary">
                    Latest Discussions
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
                </button>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="glass p-12 text-center rounded-[48px] border-white/5 border-dashed">
                      <MessageCircle className="w-12 h-12 text-primary opacity-50 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No Discussions Yet</h3>
                      <p className="text-sm text-muted">Be the first to ask a legal question or share a study tip!</p>
                    </div>
                ) : (
                    posts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedPost(post)}
                        className="glass p-8 md:p-10 rounded-[40px] border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-primary text-lg shrink-0">
                                  {post.author[0]}
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm mb-0.5 flex items-center gap-1">
                                    {post.author}
                                    {post.isPremiumAuthor && <Crown className="w-3 h-3 text-primary fill-current" />}
                                  </h4>
                                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest">{post.university}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-muted uppercase tracking-widest">
                              {post.topicTag}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                        <div className="text-sm text-muted leading-relaxed mb-6 prose prose-invert line-clamp-3 prose-p:italic prose-p:opacity-80">
                           <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {post.content}
                           </ReactMarkdown>
                        </div>

                        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                            <button onClick={(e) => handleLike(e, post.id)} className="flex items-center gap-2 text-xs font-bold text-muted hover:text-rose-500 transition-colors">
                              <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} /> {post.likes}
                            </button>
                            <div className="flex items-center gap-2 text-xs font-bold text-muted">
                              <MessageCircle className="w-4 h-4" /> {post.replies}
                            </div>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
           </>
         ) : (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors"
              >
                 <ArrowLeft className="w-4 h-4" /> Back to Feed
              </button>

              <div className="glass p-10 rounded-[48px] border-primary/20">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-primary text-2xl">
                      {selectedPost.author[0]}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                           {selectedPost.author}
                           {selectedPost.isPremiumAuthor && <Crown className="w-4 h-4 text-primary fill-current" />}
                        </h4>
                        <p className="text-xs text-muted font-bold uppercase tracking-widest">{selectedPost.university}</p>
                    </div>
                 </div>
                  <h2 className="text-3xl font-bold mb-6 italic">{selectedPost.title}</h2>
                  <div className="text-base text-muted leading-relaxed prose prose-invert max-w-none mb-10 prose-p:italic prose-p:leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>
                 
                 <div className="flex items-center gap-6 py-6 border-t border-white/5">
                    <button onClick={(e) => handleLike(e, selectedPost.id)} className="flex items-center gap-2 text-sm font-bold text-muted hover:text-rose-500 transition-colors">
                      <Heart className={`w-5 h-5 ${selectedPost.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} /> {selectedPost.likes} Likes
                    </button>
                    <div className="flex items-center gap-2 text-sm font-bold text-muted">
                      <MessageCircle className="w-5 h-5" /> {selectedPost.replies} Replies
                    </div>
                 </div>
              </div>

              {/* Replies */}
              <div className="space-y-6 pl-10 border-l border-white/5">
                 <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Thread Replies</h4>
                 {replies.map((reply, i) => (
                   <motion.div key={reply.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-3xl border-white/5">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-primary">
                            {reply.author[0]}
                         </div>
                          <div>
                             <p className="text-xs font-bold">{reply.author}</p>
                             <div className="flex items-center gap-1 mt-0.5">
                                <GraduationCap className="w-2.5 h-2.5 text-emerald-500" />
                                <p className="text-[8px] text-muted uppercase font-bold">{reply.university}</p>
                             </div>
                          </div>
                       </div>
                       <div className="text-sm text-muted leading-relaxed prose prose-invert prose-p:italic prose-p:opacity-90">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {reply.content}
                          </ReactMarkdown>
                       </div>
                   </motion.div>
                 ))}

                 {/* Reply Input */}
                 <form onSubmit={handleReplySubmit} className="relative mt-10">
                    <textarea 
                      placeholder="Add your legal perspective..."
                      value={newReply}
                      onChange={e => setNewReply(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-6 pr-20 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none italic"
                    />
                    <button 
                      type="submit"
                      disabled={isReplying || !newReply.trim()}
                      className="absolute right-4 bottom-4 w-12 h-12 bg-primary text-background rounded-2xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                       {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                 </form>
              </div>
           </motion.div>
         )}
      </div>
    </div>
  );
}
