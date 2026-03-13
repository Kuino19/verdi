"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gavel } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4 glass-dark shadow-2xl" : "py-6 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 glass rounded-lg group-hover:bg-primary/20 transition-all">
            <Gavel className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-gradient">VERDI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          <Link href="#ambassador" className="text-sm font-medium hover:text-primary transition-colors">Ambassadors</Link>
          <div className="h-4 w-[1px] bg-border mx-2"></div>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
          <Link 
            href="/register" 
            className="px-6 py-2.5 bg-primary text-background font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 glass" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-r-0 border-l-0 border-b border-t mt-4 overflow-hidden"
          >
            <div className="container py-8 flex flex-col gap-6 items-center text-center">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Features</Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Pricing</Link>
              <Link href="#ambassador" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Ambassadors</Link>
              <div className="w-full h-[1px] bg-border"></div>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Login</Link>
              <Link 
                href="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-primary text-background font-bold rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
