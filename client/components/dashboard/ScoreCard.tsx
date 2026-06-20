"use client";

import { useEffect, useRef } from "react";

interface ScoreCardProps {
  title: string;
  value: number;
  delta?: number;
  suffix?: string;
  color?: "brand" | "teal" | "amber" | "coral";
}

const COLOR_MAP = {
  brand: {
    stroke: "#3ecf8e",
    text: "#3ecf8e",
    bg: "rgba(62,207,142,0.08)",
  },
  teal: {
    stroke: "#3ecf8e",
    text: "#3ecf8e",
    bg: "rgba(62,207,142,0.08)",
  },
  amber: {
    stroke: "#e8a838",
    text: "#e8a838",
    bg: "rgba(232,168,56,0.08)",
  },
  coral: {
    stroke: "#e05555",
    text: "#e05555",
    bg: "rgba(224,85,85,0.08)",
  },
};

export default function ScoreCard({
  title,
  value,
  delta,
  suffix = "",
  color = "brand",
}: ScoreCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pct = Math.min(Math.max(value, 0), 100) / 100;
  const c = COLOR_MAP[color];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 76;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = 30;
    const start = -Math.PI / 2;

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, size, size);

      // background ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // progress ring
      ctx.beginPath();
      ctx.arc(
        cx,
        cy,
        r,
        start,
        start + Math.PI * 2 * progress
      );
      ctx.strokeStyle = c.stroke;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const duration = 900;
    let startTime: number | null = null;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;

      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);

      draw(easeOut(t) * pct);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [pct, c.stroke]);

  return (
    <>
      <style>{`
        .score-card {
          background: #1c1b1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px 24px;
          transition: border-color 0.2s ease;
        }

        .score-card:hover {
          border-color: rgba(255,255,255,0.13);
        }

        .score-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .score-title {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #504e49;
        }

        .score-delta {
          font-size: 11px;
          font-weight: 500;
          border-radius: 999px;
          padding: 3px 8px;
        }

        .score-delta.pos {
          background: rgba(62,207,142,0.1);
          color: #3ecf8e;
        }

        .score-delta.neg {
          background: rgba(224,85,85,0.1);
          color: #e05555;
        }

        .score-body {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .score-value {
          font-family: 'DM Serif Display', serif;
          font-size: 42px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .score-sub {
          margin-top: 6px;
          font-size: 12px;
          color: #504e49;
          font-weight: 300;
        }

        .score-ring-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .score-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #8c8a83;
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      <div className="score-card">
        <div className="score-head">
          <div className="score-title">{title}</div>

          {delta !== undefined && (
            <div
              className={`score-delta ${
                delta >= 0 ? "pos" : "neg"
              }`}
            >
              {delta >= 0 ? "↑ +" : "↓ "}
              {Math.abs(delta)}
            </div>
          )}
        </div>

        <div className="score-body">
          <div className="score-ring-wrap">
            <canvas ref={canvasRef} />
            <div className="score-ring-center">
              {value}
            </div>
          </div>

          <div>
            <div
              className="score-value"
              style={{ color: c.text }}
            >
              {value}
              {suffix}
            </div>

            <div className="score-sub">
              Visibility score
            </div>
          </div>
        </div>
      </div>
    </>
  );
}