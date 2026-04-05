import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
import { LayoutDashboard, BookText, Settings, LogOut, ShieldCheck, PlusCircle } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value || "";

  if (!session) {
    redirect("/admin/login");
  }

  let decodedClaims;
  try {
    decodedClaims = await adminAuth.verifySessionCookie(session, true);
  } catch (error) {
    redirect("/admin/login");
  }

  const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
  const isAdmin = userDoc.data()?.isAdmin === true;

  if (!isAdmin) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-foreground font-inter">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0B1120] p-8 flex flex-col fixed h-full z-50">
        <div className="mb-12">
          <Link href="/admin" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-lg shadow-primary/20">
               <ShieldCheck className="w-6 h-6 text-background" />
             </div>
             <span className="text-xl font-black tracking-tighter italic">VERDI <span className="text-primary">ADMIN</span></span>
          </Link>
        </div>

        <nav className="space-y-2 flex-grow">
          <Link href="/admin" className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold text-muted hover:text-primary group">
            <LayoutDashboard className="w-5 h-5 transition-colors group-hover:text-primary" />
            Dashboard
          </Link>
          <Link href="/admin/cases" className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold text-muted hover:text-primary group">
            <BookText className="w-5 h-5 transition-colors group-hover:text-primary" />
            Case Library
          </Link>
          <Link href="/admin/vetting" className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold text-muted hover:text-primary group">
            <ShieldCheck className="w-5 h-5 transition-colors group-hover:text-primary" />
            Judicial Vetting
          </Link>
          <Link href="/admin/cases/new" className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold text-muted hover:text-primary group">
            <PlusCircle className="w-5 h-5 transition-colors group-hover:text-primary" />
            Upload Case (PDF)
          </Link>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
           <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-rose-500/10 transition-all text-sm font-bold text-muted hover:text-rose-500 group">
             <LogOut className="w-5 h-5 transition-colors group-hover:text-rose-500" />
             Exit Admin
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow pl-72">
        <div className="p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
