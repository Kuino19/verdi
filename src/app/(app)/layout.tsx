// This is a SERVER component — no "use client" directive.
// It checks auth server-side and redirects unauthenticated users to /login.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import AppShell from "@/components/app/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value || "";

  if (!session) {
    redirect("/login");
  }

  let decodedClaims;
  try {
    decodedClaims = await adminAuth.verifySessionCookie(session, true);
  } catch (error) {
    redirect("/login");
  }

  // Fetch user profile from Firestore
  let userName = decodedClaims.name || decodedClaims.email?.split("@")[0] || "Student";
  let university = "Nigerian University";

  try {
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      if (data?.full_name) userName = data.full_name;
      if (data?.university) university = data.university;
    }
  } catch (e: any) {
    if (e.code === 7) {
      console.error("🔥 CRITICAL: Firestore Permission Denied. Please add 'Cloud Datastore User' role to your service account.");
    } else {
      console.error("Error fetching user profile", e);
    }
  }

  return (
    <AppShell userName={userName} university={university} userEmail={decodedClaims.email || ""}>
      {children}
    </AppShell>
  );
}
