import { db } from "./client";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, query, where, getDocs, orderBy, limit, increment, addDoc, QueryConstraint } from "firebase/firestore";
import { User, Task, Case, Bookmark, StudySession, Flashcard, Leaderboard, AIUsageData } from "@/types/firestore";
import { AppError } from "@/lib/errors/AppError";
import { logger } from "@/lib/logger";

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Update user profile with type-safe data
 */
export async function updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data as Record<string, any>);
    logger.debug("User profile updated", { uid });
  } catch (error) {
    logger.error("Failed to update user profile", { uid, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to update user profile");
  }
}

/**
 * Create user document if it doesn't exist
 */
export async function createUserDocumentIfNotExists(uid: string, data: Partial<User> & { email: string }): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      const newUser: User = {
        uid,
        email: data.email,
        full_name: data.full_name || "Student",
        university: data.university || "Nigerian University",
        isPremium: false,
        streak: 0,
        points: 0,
        createdAt: new Date().toISOString(),
        aiUsage: { date: new Date().toISOString().split("T")[0], count: 0 },
      };
      
      await setDoc(userRef, newUser);
      logger.info("New user document created", { uid });
    }
  } catch (error) {
    logger.error("Failed to create user document", { uid, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to create user document");
  }
}

/**
 * Get user by ID with type safety
 */
export async function getUserById(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      return null;
    }
    
    return snap.data() as User;
  } catch (error) {
    logger.error("Failed to fetch user", { uid, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to fetch user data");
  }
}

// ============================================
// TASK OPERATIONS
// ============================================

/**
 * Fetch user's tasks with type safety
 */
export async function fetchUserTasks(uid: string): Promise<(Task & { id: string })[]> {
  try {
    const tasksRef = collection(db, "users", uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data() as Task,
      id: doc.id,
    }));
  } catch (error) {
    logger.error("Failed to fetch tasks", { uid, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to fetch tasks");
  }
}

/**
 * Update task state
 */
export async function updateTaskState(uid: string, taskId: string, done: boolean): Promise<void> {
  try {
    const taskRef = doc(db, "users", uid, "tasks", taskId);
    await updateDoc(taskRef, { done, updatedAt: new Date().toISOString() } as Partial<Task>);
    logger.debug("Task updated", { uid, taskId, done });
  } catch (error) {
    logger.error("Failed to update task", { uid, taskId, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to update task");
  }
}

// ============================================
// ACTIVITY & STREAK OPERATIONS
// ============================================

/**
 * Log daily activity and update streaks
 */
export async function logActivity(uid: string): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return;
    }
    
    const userData = userSnap.data() as User;
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const lastActive = userData.lastActive || "";
    
    let newStreak = userData.streak || 0;
    const activityLog = userData.activityLog || [];

    if (lastActive !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      if (!activityLog.includes(todayStr)) {
        activityLog.push(todayStr);
      }

      await updateDoc(userRef, {
        lastActive: todayStr,
        streak: newStreak,
        activityLog: activityLog.slice(-365),
      } as Partial<User>);
      
      logger.debug("Activity logged", { uid, streak: newStreak });
    }
  } catch (error) {
    logger.error("Failed to log activity", { uid, error: error instanceof Error ? error.message : String(error) });
    // Don't throw - this is non-critical
  }
}

/**
 * Add points to user
 */
export async function addPoints(uid: string, pointsToAdd: number): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      points: increment(pointsToAdd)
    });
    await logActivity(uid);
    logger.debug("Points added", { uid, points: pointsToAdd });
  } catch (error) {
    logger.error("Failed to add points", { uid, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to add points");
  }
}

// ============================================
// LEADERBOARD OPERATIONS
// ============================================

/**
 * Get global leaderboard
 */
export async function getGlobalLeaderboard(limitCount: number = 50): Promise<Leaderboard[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("points", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    
    return snap.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        full_name: data.full_name || "Anonymous",
        points: data.points || 0,
        streak: data.streak || 0,
        university: data.university || "Unknown",
        rank: index + 1,
      };
    });
  } catch (error) {
    logger.error("Failed to fetch leaderboard", { error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to fetch leaderboard");
  }
}

// ============================================
// CASE OPERATIONS
// ============================================

/**
 * Create a new case (Admin only)
 */
export async function createCase(caseData: Partial<Case>): Promise<string> {
  try {
    const casesRef = collection(db, "cases");
    const docRef = await addDoc(casesRef, {
      ...caseData,
      createdAt: new Date().toISOString(),
    });
    
    logger.info("Case created", { caseId: docRef.id, title: caseData.title });
    return docRef.id;
  } catch (error) {
    logger.error("Failed to create case", { error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to create case");
  }
}

/**
 * Fetch cases with pagination support
 */
export async function fetchAllCases(isPremium: boolean = false, pagination?: { page: number, perPage: number }): Promise<{ cases: (Case & { id: string })[], total: number }> {
  try {
    const casesRef = collection(db, "cases");
    const constraints: QueryConstraint[] = [];
    
    // Non-premium users only see landmark cases
    if (!isPremium) {
      constraints.push(where("landmark", "==", true));
    }
    
    // Build query for cases
    const q = query(casesRef, ...constraints, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    
    const allCases = snap.docs.map(doc => ({
      ...doc.data() as Case,
      id: doc.id,
    }));

    if (pagination) {
      const start = (pagination.page - 1) * pagination.perPage;
      const paginated = allCases.slice(start, start + pagination.perPage);
      return { cases: paginated, total: allCases.length };
    }
    
    return { cases: allCases, total: allCases.length };
  } catch (error) {
    logger.error("Failed to fetch cases", { error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to fetch cases");
  }
}

/**
 * Get case by ID
 */
export async function fetchCaseById(caseId: string): Promise<(Case & { id: string }) | null> {
  try {
    const caseRef = doc(db, "cases", caseId);
    const snap = await getDoc(caseRef);
    
    if (!snap.exists()) {
      return null;
    }
    
    return { ...snap.data() as Case, id: snap.id };
  } catch (error) {
    logger.error("Failed to fetch case", { caseId, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to fetch case");
  }
}

/**
 * Update a case
 */
export async function updateCase(caseId: string, data: Partial<Case>): Promise<void> {
  try {
    const caseRef = doc(db, "cases", caseId);
    await updateDoc(caseRef, data as Record<string, any>);
    logger.debug("Case updated", { caseId });
  } catch (error) {
    logger.error("Failed to update case", { caseId, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to update case");
  }
}

/**
 * Delete a case
 */
export async function deleteCase(caseId: string): Promise<void> {
  try {
    const caseRef = doc(db, "cases", caseId);
    await deleteDoc(caseRef);
    logger.info("Case deleted", { caseId });
  } catch (error) {
    logger.error("Failed to delete case", { caseId, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to delete case");
  }
}

// ============================================
// ADMIN OPERATIONS
// ============================================

/**
 * Check if user is admin
 */
export async function checkIfAdmin(uid: string): Promise<boolean> {
  try {
    const user = await getUserById(uid);
    return user?.isAdmin === true || false;
  } catch {
    return false;
  }
}

// Forum Actions
export async function addForumReply(postId: string, replyData: any) {
  const repliesRef = collection(db, "forums", postId, "replies");
  await addDoc(repliesRef, {
    ...replyData,
    createdAt: new Date().toISOString()
  });
  
  // Increment reply count on parent
  const postRef = doc(db, "forums", postId);
  await updateDoc(postRef, {
    replies: increment(1)
  });
}

export async function likeForumPost(postId: string) {
  const postRef = doc(db, "forums", postId);
  await updateDoc(postRef, {
    likes: increment(1)
  });
}

export async function fetchForumReplies(postId: string) {
  const repliesRef = collection(db, "forums", postId, "replies");
  const q = query(repliesRef, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function fetchSimilarCases(subject: string, excludeId: string, limitCount: number = 3) {
  if (!subject) return [];
  try {
    const casesRef = collection(db, "cases");
    const q = query(casesRef, where("subject", "==", subject), limit(limitCount + 1));
    const snap = await getDocs(q);
    return snap.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .filter((c: any) => c.id !== excludeId)
      .slice(0, limitCount);
  } catch (e) {
    console.error("Error fetching similar cases:", e);
    return [];
  }
}

// Subscription & Usage Helpers
export async function incrementUsage(uid: string, field: "aiUsageCount" | "examCount" | "flashcardCount" | "studyPlanCount" | "communityCount") {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    [field]: increment(1)
  });
}

// Study Planner Operations
export async function saveStudyPlan(uid: string, topic: string, days: any[]) {
  try {
    const plansRef = collection(db, "users", uid, "studyPlans");
    const docRef = await addDoc(plansRef, {
      topic,
      plan: days,
      createdAt: new Date().toISOString(),
      active: true
    });
    
    // Set others to inactive
    const q = query(plansRef, where("active", "==", true));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      if (d.id !== docRef.id) {
        await updateDoc(d.ref, { active: false });
      }
    }
    
    return docRef.id;
  } catch (error) {
    logger.error("Failed to save study plan", { uid, error: error instanceof Error ? error.message : String(error) });
    throw AppError.internal("Failed to save study plan");
  }
}

export async function fetchActiveStudyPlan(uid: string) {
  try {
    const plansRef = collection(db, "users", uid, "studyPlans");
    // [x] Simplified to avoid composite index error
    const snap = await getDocs(plansRef);
    if (snap.empty) return null;
    
    const plans = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
    const activePlan = plans
      .filter(p => p.active === true)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
      
    return activePlan || null;
  } catch (error) {
    logger.error("Failed to fetch study plan", { uid, error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export async function updatePlanDayProgress(uid: string, planId: string, completedDays: number[]) {
  try {
    const planRef = doc(db, "users", uid, "studyPlans", planId);
    await updateDoc(planRef, { completedDays, updatedAt: new Date().toISOString() });
  } catch (error) {
    logger.error("Failed to update plan progress", { planId, error: error instanceof Error ? error.message : String(error) });
  }
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

/**
 * Fetch recent notifications for a user
 */
export async function fetchNotifications(uid: string, limitCount: number = 10) {
  try {
    const notificationsRef = collection(db, "users", uid, "notifications");
    const q = query(notificationsRef, orderBy("createdAt", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    logger.error("Failed to fetch notifications", { uid, error: error instanceof Error ? error.message : String(error) });
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(uid: string, notificationId: string) {
  try {
    const notifyRef = doc(db, "users", uid, "notifications", notificationId);
    await updateDoc(notifyRef, { read: true, updatedAt: new Date().toISOString() });
  } catch (error) {
    logger.error("Failed to mark notification as read", { uid, notificationId, error: error instanceof Error ? error.message : String(error) });
  }
}

/**
 * Send a system notification to a user
 */
export async function sendSystemNotification(uid: string, title: string, message: string, type: string = "system") {
  try {
    const notificationsRef = collection(db, "users", uid, "notifications");
    await addDoc(notificationsRef, {
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Failed to send notification", { uid, error: error instanceof Error ? error.message : String(error) });
  }
}

