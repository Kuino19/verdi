"use client";

import { createContext, useContext, ReactNode } from "react";

interface UserContextType {
  userName: string;
  userEmail: string;
  university: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  userName,
  userEmail,
  university,
}: UserContextType & { children: ReactNode }) {
  return (
    <UserContext.Provider value={{ userName, userEmail, university }}>
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
