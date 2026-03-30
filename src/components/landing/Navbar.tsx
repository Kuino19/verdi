"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gavel, ChevronRight } from "lucide-react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#ambassador", label: "Ambassadors" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent"
      }`}
      style={isScrolled ? { background: "rgba(11,17,32,0.85)" } : undefined}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="p-2 glass rounded-xl group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all">
            <Gavel className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tight text-gradient">VERDI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 rounded-xl transition-all"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-background text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(201,162,39,0.25)]"
          >
            Get Started
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2.5 glass rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/5"
            style={{ background: "rgba(11,17,32,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="container py-6 flex flex-col gap-2">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-white/5 transition-all flex items-center justify-between"
                >
                  {label}
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>
              ))}
              <div className="w-full h-[1px] bg-white/5 my-2" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-white/5 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-primary text-background font-black rounded-2xl text-center mt-2 shadow-[0_0_24px_rgba(201,162,39,0.3)] hover:scale-[1.02] transition-all"
              >
                Get Started — It&apos;s Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
