"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface UserContextType {
  uid: string;
  userName: string;
  userEmail: string;
  university: string;
  isPremium: boolean;
  streak: number;
  points: number;
  activityLog?: string[];
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
  const [livePremium, setLivePremium] = useState(isPremium);
  const [liveActivityLog, setLiveActivityLog] = useState<string[]>([]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLivePoints(data.points || 0);
        setLivePremium(!!data.isPremium);
        setLiveActivityLog(data.activityLog || []);
      }
    });
    return () => unsub();
  }, [uid]);

  return (
    <UserContext.Provider value={{ uid, userName, userEmail, university, isPremium: livePremium, streak, points: livePoints, activityLog: liveActivityLog }}>
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
