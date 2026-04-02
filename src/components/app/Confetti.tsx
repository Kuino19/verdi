"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#C9A227", "#EAB308", "#22C55E", "#3B82F6", "#F43F5E"];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
}

export default function Confetti({ active = false }: { active?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ 
            x: p.x * 10, 
            y: p.y * 10 - 200, 
            opacity: 0, 
            rotate: p.rotation + 720 
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "2px" : "50%",
          }}
        />
      ))}
    </div>
  );
}
