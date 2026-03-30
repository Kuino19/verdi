import Link from "next/link";
import { Gavel, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-20 bg-background border-t border-white/5">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Gavel className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold tracking-tighter text-gradient">VERDI</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-8 italic">
              Empowering the next generation of Nigerian lawyers with intelligent, simplified legal education tools.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-[10px] uppercase tracking-wider text-muted/60">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">Case Summaries</Link></li>
              <li><Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">Exam Generator</Link></li>
              <li><Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">CaseFlow Map</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-[10px] uppercase tracking-wider text-muted/60">Community</h4>
            <ul className="space-y-4">
              <li><Link href="#ambassador" className="text-sm text-muted hover:text-primary transition-colors">Ambassador Program</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Discussions</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Refer a Friend</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-[10px] uppercase tracking-wider text-muted/60">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted opacity-60 italic">
            © {new Date().getFullYear()} VERDI Legal Technologies. All rights reserved. 
            <span className="mx-2 text-primary/40">•</span> 
            Made with ❤️ by <span className="text-primary font-bold shadow-sm">Kuino</span>
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted/40 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              Pulse Active
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
