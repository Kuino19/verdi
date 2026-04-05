"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, X, Sparkles, Zap, Flame, Trophy, Info } from "lucide-react";
import { useNotifications } from "./NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "premium": return <Zap className="w-4 h-4 text-primary" />;
      case "streak": return <Flame className="w-4 h-4 text-orange-500" />;
      case "points": return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "welcome": return <Sparkles className="w-4 h-4 text-primary" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-muted hover:text-foreground transition-all relative group"
      >
        <Bell className={`w-4 h-4 ${isOpen ? 'text-primary' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)] group-hover:scale-110 transition-transform" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-4 w-[320px] sm:w-[380px] glass border-white/5 rounded-[32px] overflow-hidden shadow-2xl shadow-black/40 z-[100]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black italic">Notifications</p>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-primary text-[8px] font-black rounded-full text-background uppercase tracking-tighter">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-muted transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-2">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted mb-2">
                      <Bell className="w-6 h-6 opacity-20" />
                   </div>
                   <p className="text-xs font-bold text-muted">No alerts yet</p>
                   <p className="text-[10px] text-muted/50 italic leading-relaxed">Check back later for academic updates.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => !n.read && markAsRead(n.id)}
                      className={`p-5 flex gap-4 transition-all cursor-pointer ${n.read ? 'opacity-50 grayscale-[0.5]' : 'hover:bg-white/5 bg-primary/[0.02]'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-white/5 text-muted' : 'bg-primary/10'}`}>
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold mb-1 leading-tight ${n.read ? 'text-muted' : 'text-foreground'}`}>
                          {n.title}
                        </p>
                        <p className="text-[10px] leading-relaxed text-muted line-clamp-2 mb-2 italic">
                          {n.message}
                        </p>
                        <p className="text-[9px] font-medium text-muted/40 uppercase tracking-widest">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shadow-[0_0_8px_rgba(201,162,39,0.3)] shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted/60 italic">
                Verdi Intelligence Center
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
