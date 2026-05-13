"use client";

import { useState } from "react";
import { products } from "@/lib/mockData";

type Severity = "critical" | "warning" | "info";
type Status   = "great" | "good" | "warn" | "bad";

const SEV: Record<Severity, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "#f0683a", bg: "rgba(240,104,58,0.10)" },
  warning:  { label: "Warning",  color: "#f5b429", bg: "rgba(245,180,41,0.10)" },
  info:     { label: "Info",     color: "#4d7aff", bg: "rgba(77,122,255,0.10)" },
};

const STATUS: Record<Status, { label: string; color: string; bg: string }> = {
  great: { label: "Great",      color: "#16b98c", bg: "rgba(22,185,140,0.10)" },
  good:  { label: "Good",       color: "#4d7aff", bg: "rgba(77,122,255,0.10)" },
  warn:  { label: "Needs Work", color: "#f5b429", bg: "rgba(245,180,41,0.10)" },
  bad:   { label: "Poor",       color: "#f0683a", bg: "rgba(240,104,58,0.10)" },
};

const DIM_LABELS: Record<string, string> = {
  description: "Description",
  schema: "Structured Data",
  images: "Image Alt Text",
  brandVoice: "Brand Voice",
  comparability: "Comparability",
  trustSignals: "Trust Signals",
};

const DIM_COLORS: Record<string, string> = {
  description:   "#16b98c",
  schema:        "#4d7aff",
  images:        "#8b6ef5",
  brandVoice:    "#f5b429",
  comparability: "#f0683a",
  trustSignals:  "#5ed8b4",
};

function RadialScore({ value, color }: { value: number; color: string }) {
  const r = 28, cx = 36, cy = 36, stroke = 5;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle"
        fill={color} fontSize="13" fontWeight="700"
        fontFamily="'Syne', sans-serif">
        {value}
      </text>
    </svg>
  );
}

export default function AnalysisPage() {
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<"all" | Status>("all");
  const [expanded, setExpanded]   = useState<number | null>(null);
  const [sortBy, setSortBy]       = useState<"score" | "issues">("score");

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || p.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) =>
      sortBy === "score"
        ? b.score - a.score
        : b.issues.length - a.issues.length
    );

  const counts = {
    all:   products.length,
    great: products.filter((p) => p.status === "great").length,
    good:  products.filter((p) => p.status === "good").length,
    warn:  products.filter((p) => p.status === "warn").length,
    bad:   products.filter((p) => p.status === "bad").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .ap-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 24px; }

        /* Summary bar */
        .ap-summary { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .ap-summary-card {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; transition: border-color 0.15s;
        }
        .ap-summary-card:hover { border-color: rgba(255,255,255,0.12); }
        .ap-summary-card.active { border-color: rgba(77,122,255,0.35); background: rgba(77,122,255,0.07); }
        .sum-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .sum-val  { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.03em; }
        .sum-label { font-size: 11.5px; color: #64748b; margin-top: 1px; }

        /* Toolbar */
        .ap-toolbar { display: flex; gap: 10px; align-items: center; }
        .ap-search {
          flex: 1; background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 9px 14px;
          color: #e8edf5; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.15s;
        }
        .ap-search::placeholder { color: #2d3748; }
        .ap-search:focus { border-color: rgba(77,122,255,0.35); }
        .ap-select {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 9px 12px;
          color: #64748b; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; cursor: pointer;
        }
        .ap-select:focus { border-color: rgba(77,122,255,0.35); }

        /* Product cards */
        .ap-card {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.2s;
        }
        .ap-card:hover { border-color: rgba(255,255,255,0.11); }
        .ap-card.open  { border-color: rgba(77,122,255,0.25); }

        .ap-card-header {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 22px; cursor: pointer;
        }
        .ap-card-info { flex: 1; min-width: 0; }
        .ap-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: -0.02em; color: #e8edf5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ap-card-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .ap-card-cat  { font-size: 11.5px; color: #2d3748; }
        .ap-card-price { font-size: 11.5px; color: #4a5568; }

        .ap-status {
          font-size: 11px; font-weight: 600; padding: 3px 9px;
          border-radius: 100px; white-space: nowrap; flex-shrink: 0;
        }
        .ap-issue-count {
          font-size: 11.5px; color: #64748b; flex-shrink: 0;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
          padding: 3px 9px; border-radius: 100px;
        }
        .ap-chevron {
          flex-shrink: 0; color: #2d3748; transition: transform 0.2s;
          font-size: 14px;
        }
        .ap-chevron.open { transform: rotate(180deg); }

        /* Expanded body */
        .ap-card-body {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 20px 22px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        @media(max-width:800px){ .ap-card-body { grid-template-columns: 1fr; } }

        .ap-section-title {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #2d3748; margin-bottom: 12px;
        }

        /* Radar-style dimension bars */
        .dim-list { display: flex; flex-direction: column; gap: 10px; }
        .dim-row  { display: flex; flex-direction: column; gap: 4px; }
        .dim-top  { display: flex; justify-content: space-between; align-items: center; }
        .dim-name { font-size: 12px; color: #64748b; }
        .dim-val  { font-size: 12px; font-weight: 600; }
        .dim-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden; }
        .dim-fill  { height: 100%; border-radius: 99px; }

        /* AI summary box */
        .ai-summary {
          background: rgba(77,122,255,0.05);
          border: 1px solid rgba(77,122,255,0.15);
          border-radius: 10px; padding: 14px;
          font-size: 13px; color: #8aabff; line-height: 1.6;
          margin-bottom: 16px;
        }

        /* Issue list */
        .issue-list { display: flex; flex-direction: column; gap: 8px; }
        .issue-item {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 9px; padding: 11px 13px;
        }
        .issue-sev {
          font-size: 10px; font-weight: 600; padding: 2px 7px;
          border-radius: 100px; flex-shrink: 0; margin-top: 1px;
          letter-spacing: 0.04em;
        }
        .issue-text { font-size: 12.5px; color: #94a3b8; flex: 1; line-height: 1.5; }
        .issue-action {
          font-size: 11px; color: #4d7aff; font-weight: 500;
          background: rgba(77,122,255,0.08); border: 1px solid rgba(77,122,255,0.15);
          border-radius: 6px; padding: 3px 9px; cursor: pointer;
          white-space: nowrap; flex-shrink: 0; transition: background 0.15s;
        }
        .issue-action:hover { background: rgba(77,122,255,0.15); }

        .empty-state {
          text-align: center; padding: 60px 24px;
          color: #2d3748; font-size: 14px;
        }
      `}</style>

      <div className="ap-root">

        {/* Summary chips */}
        <div className="ap-summary">
          {([
            ["all",   "#64748b", `All Products`,  counts.all],
            ["great", "#16b98c", "Great (80–100)", counts.great],
            ["good",  "#4d7aff", "Good (65–79)",   counts.good],
            ["warn",  "#f5b429", "Needs Work",      counts.warn],
            ["bad",   "#f0683a", "Poor (<60)",      counts.bad],
          ] as const).filter(([k]) => k !== "all" || true).map(([key, color, label, count]) => (
            <div
              key={key}
              className={`ap-summary-card${filter === key ? " active" : ""}`}
              onClick={() => setFilter(key as typeof filter)}
            >
              <span className="sum-dot" style={{ background: color }} />
              <div>
                <div className="sum-val" style={{ color }}>{count}</div>
                <div className="sum-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="ap-toolbar">
          <input
            className="ap-search"
            placeholder="Search products or categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="ap-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "issues")}
          >
            <option value="score">Sort: AI Score</option>
            <option value="issues">Sort: Issue Count</option>
          </select>
        </div>

        {/* Product cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div className="empty-state">No products match your filter.</div>
          )}
          {filtered.map((product) => {
            const st  = STATUS[product.status as Status];
            const isOpen = expanded === product.id;
            const critCount = product.issues.filter((i) => i.severity === "critical").length;

            return (
              <div key={product.id} className={`ap-card${isOpen ? " open" : ""}`}>
                <div
                  className="ap-card-header"
                  onClick={() => setExpanded(isOpen ? null : product.id)}
                >
                  <RadialScore value={product.score} color={st.color} />

                  <div className="ap-card-info">
                    <div className="ap-card-name">{product.name}</div>
                    <div className="ap-card-meta">
                      <span className="ap-card-cat">{product.category}</span>
                      <span style={{ color: "#1e293b" }}>·</span>
                      <span className="ap-card-price">{product.price}</span>
                    </div>
                  </div>

                  <div
                    className="ap-status"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.label}
                  </div>

                  <div className="ap-issue-count">
                    {critCount > 0
                      ? <span style={{ color: "#f0683a" }}>{critCount} critical</span>
                      : `${product.issues.length} issues`
                    }
                  </div>

                  <span className={`ap-chevron${isOpen ? " open" : ""}`}>▾</span>
                </div>

                {isOpen && (
                  <div className="ap-card-body">
                    {/* Left: dimensions + AI summary */}
                    <div>
                      <div className="ap-section-title">Score Breakdown</div>
                      <div className="dim-list">
                        {Object.entries(product.dimensions).map(([key, val]) => (
                          <div className="dim-row" key={key}>
                            <div className="dim-top">
                              <span className="dim-name">{DIM_LABELS[key] ?? key}</span>
                              <span className="dim-val" style={{ color: DIM_COLORS[key] }}>{val}</span>
                            </div>
                            <div className="dim-track">
                              <div
                                className="dim-fill"
                                style={{ width: `${val}%`, background: DIM_COLORS[key] }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: AI summary + issues */}
                    <div>
                      <div className="ap-section-title">AI Agent Assessment</div>
                      <div className="ai-summary">{product.aiSummary}</div>

                      <div className="ap-section-title" style={{ marginTop: 4 }}>Issues</div>
                      <div className="issue-list">
                        {product.issues.map((issue, i) => {
                          const sev = SEV[issue.severity as Severity];
                          return (
                            <div className="issue-item" key={i}>
                              <span className="issue-sev" style={{ background: sev.bg, color: sev.color }}>
                                {sev.label}
                              </span>
                              <span className="issue-text">{issue.text}</span>
                              <span className="issue-action">{issue.action}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}