"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead, sendSystemNotification } from "@/lib/firebase/db";
import { useUserContext } from "./UserContext";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  addSystemAlert: (title: string, message: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { uid } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!uid) return;

    // Real-time listener for notifications
    const notificationsRef = collection(db, "users", uid, "notifications");
    const q = query(notificationsRef, orderBy("createdAt", "desc"), limit(20));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Notification[];
      
      setNotifications(docs);
      setUnreadCount(docs.filter(n => !n.read).length);

      // Auto-send welcome if none
      if (docs.length === 0) {
        sendSystemNotification(uid, "Welcome to Verdi Academy! 📚", "We're excited to have you here. Start by creating your first study plan or exploring the dictionary.", "welcome");
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const markAsRead = async (id: string) => {
    if (!uid) return;
    await markNotificationAsRead(uid, id);
  };

  const addSystemAlert = async (title: string, message: string) => {
    if (!uid) return;
    await sendSystemNotification(uid, title, message);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, addSystemAlert }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
