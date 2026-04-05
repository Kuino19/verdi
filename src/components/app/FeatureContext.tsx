"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface FeatureFlags {
  [key: string]: boolean;
}

interface FeatureContextType {
  flags: FeatureFlags;
  loading: boolean;
  toggleFeature: (featureId: string, enabled: boolean) => Promise<void>;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

const DEFAULT_FLAGS: FeatureFlags = {
  cases: true,
  assistant: true,
  dictionary: true,
  community: true,
  "exam-generator": false,
  caseflow: false,
  flashcards: false,
  "past-papers": false,
  leaderboard: false,
  rewards: false,
  "moot-court": false,
  subscription: true,
  referrals: false,
  bookmarks: true,
  settings: true,
};

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "feature_flags"), (docSnap) => {
      if (docSnap.exists()) {
        setFlags(docSnap.data() as FeatureFlags);
      } else {
        // Initialize if not exists
        setDoc(doc(db, "config", "feature_flags"), DEFAULT_FLAGS);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleFeature = async (featureId: string, enabled: boolean) => {
    const newFlags = { ...flags, [featureId]: enabled };
    await setDoc(doc(db, "config", "feature_flags"), newFlags);
  };

  return (
    <FeatureContext.Provider value={{ flags, loading, toggleFeature }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureProvider");
  }
  return context;
}
