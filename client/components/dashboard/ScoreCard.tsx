"use client";
import { useEffect, useRef } from "react";

interface ScoreCardProps {
  title: string;
  value: number;
  delta?: number;       // e.g. +6 or -2
  suffix?: string;      // e.g. "%"
  color?: "brand" | "teal" | "amber" | "coral";
}

const COLOR_MAP = {
  brand: { stroke: "#4d7aff", glow: "rgba(77,122,255,0.35)", bg: "rgba(77,122,255,0.08)", text: "#8aabff" },
  teal:  { stroke: "#16b98c", glow: "rgba(22,185,140,0.30)", bg: "rgba(22,185,140,0.08)", text: "#5ed8b4" },
  amber: { stroke: "#f5b429", glow: "rgba(245,180,41,0.30)", bg: "rgba(245,180,41,0.08)", text: "#f5b429" },
  coral: { stroke: "#f0683a", glow: "rgba(240,104,58,0.30)", bg: "rgba(240,104,58,0.08)", text: "#f0683a" },
};

export default function ScoreCard({ title, value, delta, suffix = "", color = "brand" }: ScoreCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const c = COLOR_MAP[color];
  const pct = Math.min(Math.max(value, 0), 100) / 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const size = 88;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.scale(dpr, dpr);

    let current = 0;
    const target = pct;
    const cx = size / 2, cy = size / 2, r = 34;
    const start = -Math.PI / 2;

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, size, size);
      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 5;
      ctx.stroke();
      // Fill
      if (progress > 0) {
        ctx.save();
        ctx.shadowColor = c.glow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, r, start, start + Math.PI * 2 * progress);
        ctx.strokeStyle = c.stroke;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      }
    };

    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    let startTime: number | null = null;
    const duration = 900;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      current = ease(t) * target;
      draw(current);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [pct, c]);

  return (
    <>
      <style>{`
        .sc-card {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px 22px 20px;
          display: flex; flex-direction: column; gap: 16px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .sc-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--sc-accent, rgba(77,122,255,0.3)), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .sc-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .sc-card:hover::before { opacity: 1; }
        .sc-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .sc-title { font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b; }
        .sc-delta { font-size: 11.5px; font-weight: 500; padding: 3px 8px; border-radius: 100px; }
        .sc-delta.pos { background: rgba(22,185,140,0.12); color: #5ed8b4; }
        .sc-delta.neg { background: rgba(240,104,58,0.12); color: #f0683a; }
        .sc-body { display: flex; align-items: center; gap: 18px; }
        .sc-val { font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
        .sc-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
      `}</style>
      <div
        className="sc-card"
        style={{ "--sc-accent": c.stroke } as React.CSSProperties}
      >
        <div className="sc-top">
          <div className="sc-title">{title}</div>
          {delta !== undefined && (
            <div className={`sc-delta ${delta >= 0 ? "pos" : "neg"}`}>
              {delta >= 0 ? "+" : ""}{delta}
            </div>
          )}
        </div>
        <div className="sc-body">
          <canvas ref={canvasRef} style={{ flexShrink: 0 }} />
          <div>
            <div className="sc-val" style={{ color: c.text }}>
              {value}{suffix}
            </div>
            <div className="sc-sub">out of 100</div>
          </div>
        </div>
      </div>
    </>
  );
}