// This is a SERVER component — no "use client" directive.
// It checks auth server-side and redirects unauthenticated users to /login.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/app/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → send to login
  if (!user) {
    redirect("/login");
  }

  // Extract user metadata (set during sign-up)
  const userName: string =
    (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Student";
  const university: string =
    (user.user_metadata?.university as string) || "Nigerian University";

  return (
    <AppShell userName={userName} university={university} userEmail={user.email}>
      {children}
    </AppShell>
  );
}
