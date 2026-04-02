import { db } from "./client";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, collection, query, where, getDocs, orderBy, limit, increment, addDoc } from "firebase/firestore";

// User Actions
export async function updateUserProfile(uid: string, data: any) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

// Ensure user document exists upon first login/registration
export async function createUserDocumentIfNotExists(uid: string, data: any) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      ...data,
      isPremium: false,
      streak: 0,
      points: 0,
      createdAt: new Date().toISOString()
    });
  }
}

// Fetch user's tasks
export async function fetchUserTasks(uid: string) {
  const tasksRef = collection(db, "users", uid, "tasks");
  const q = query(tasksRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update a specific task state
export async function updateTaskState(uid: string, taskId: string, done: boolean) {
  const taskRef = doc(db, "users", uid, "tasks", taskId);
  await updateDoc(taskRef, { done });
}

// Global Leaderboard
export async function getGlobalLeaderboard(limitCount: number = 50) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("points", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Log daily activity and update streaks
export async function logActivity(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return;
  
  const data = userSnap.data();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const lastActive = data.lastActive || "";
  
  let newStreak = data.streak || 0;
  const activityLog = data.activityLog || [];

  if (lastActive !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    // Add to activity log if not already there
    if (!activityLog.includes(todayStr)) {
      activityLog.push(todayStr);
    }

    await updateDoc(userRef, {
      lastActive: todayStr,
      streak: newStreak,
      activityLog: activityLog.slice(-365) // Keep last year
    });
  }
}

// Add Points (now also triggers activity logging)
export async function addPoints(uid: string, pointsToAdd: number) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(pointsToAdd)
  });
  await logActivity(uid);
}

// Admin Helpers
export async function createCase(caseData: any) {
  const casesRef = collection(db, "cases");
  const docRef = doc(casesRef);
  await setDoc(docRef, {
    ...caseData,
    id: docRef.id,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function fetchAllCases() {
  const casesRef = collection(db, "cases");
  // Fetch all cases without strict ordering to avoid "missing field" filtering in Firestore
  const snap = await getDocs(casesRef);
  const cases = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Sort in-memory by date (descending)
  return cases.sort((a: any, b: any) => {
    const dateA = new Date(a.scrapedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.scrapedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

export async function fetchCaseById(caseId: string) {
  const caseRef = doc(db, "cases", caseId);
  const snap = await getDoc(caseRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

export async function updateCase(caseId: string, data: any) {
  const caseRef = doc(db, "cases", caseId);
  await updateDoc(caseRef, data);
}

export async function deleteCase(caseId: string) {
  const caseRef = doc(db, "cases", caseId);
  await deleteDoc(caseRef);
}

export async function checkIfAdmin(uid: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() && snap.data()?.isAdmin === true;
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
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
