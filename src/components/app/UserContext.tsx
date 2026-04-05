"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { logActivity } from "@/lib/firebase/db";
import { setAnalyticsUserId, setAnalyticsUserProperties } from "@/lib/firebase/analytics-utils";

interface UserContextType {
  uid: string;
  userName: string;
  userEmail: string;
  university: string;
  isPremium: boolean;
  streak: number;
  points: number;
  activityLog?: string[];
  aiUsageCount: number;
  examCount: number;
  flashcardCount: number;
  studyPlanCount: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  uid,
  userName,
  userEmail,
  university,
  isPremium,
  streak,
  points,
}: UserContextType & { children: ReactNode }) {

  const [livePoints, setLivePoints] = useState(points);
  const [liveStreak, setLiveStreak] = useState(streak);
  const [livePremium, setLivePremium] = useState(isPremium);
  const [liveActivityLog, setLiveActivityLog] = useState<string[]>([]);
  const [liveUsage, setLiveUsage] = useState({ ai: 0, exams: 0, flashcards: 0, plans: 0 });

  // Passive Activity Check-in
  useEffect(() => {
    if (uid) {
      logActivity(uid).catch(err => console.error("Streak check failed", err));
    }
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLivePoints(data.points || 0);
        setLiveStreak(data.streak || 0);
        setLivePremium(!!data.isPremium);
        setLiveActivityLog(data.activityLog || []);
        setLiveUsage({
          ai: data.aiUsageCount || 0,
          exams: data.examCount || 0,
          flashcards: data.flashcardCount || 0,
          plans: data.studyPlanCount || 0
        });
      }
    });
    return () => unsub();
  }, [uid]);

  // Sync Analytics
  useEffect(() => {
    if (uid) {
      setAnalyticsUserId(uid);
      setAnalyticsUserProperties({
        isPremium: livePremium,
        university: university,
        points: livePoints,
        streak: liveStreak
      });
    }
  }, [uid, livePremium, livePoints, liveStreak]);

  return (
    <UserContext.Provider value={{ 
      uid, 
      userName, 
      userEmail, 
      university, 
      isPremium: livePremium, 
      streak: liveStreak, 
      points: livePoints, 
      activityLog: liveActivityLog,
      aiUsageCount: liveUsage.ai,
      examCount: liveUsage.exams,
      flashcardCount: liveUsage.flashcards,
      studyPlanCount: liveUsage.plans
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
