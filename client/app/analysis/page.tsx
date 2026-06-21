"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAnalyses } from "@/services/analysisService";

// ── Types ────────────────────────────────────────────────────────────────────
interface Analysis {
  _id: string;
  productId: { title?: string; image?: string } | null;
  scores: {
    overallScore: number;
    semanticScore?: number;
    discoverabilityScore?: number;
    trustScore?: number;
    [key: string]: number | undefined;
  };
  issues: string[];
  recommendations: string[];
  aiInsights?: {
    summary?: string;
    optimizedTitle?: string;
    optimizedDescription?: string;
    improvementPriority?: string;
    semanticGaps?: string[];
    visibilityPrediction?: Record<string, string | number>;
  };
}

// ── Config ───────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  HIGH:   { color: "#e05555", bg: "rgba(224,85,85,0.1)"  },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.1)" },
  LOW:    { color: "#3ecf8e", bg: "rgba(62,207,142,0.1)" },
};

const SCORE_DIMS: { key: string; label: string; color: string }[] = [
  { key: "semanticScore",        label: "Semantic",        color: "#3ecf8e" },
  { key: "discoverabilityScore", label: "Discoverability", color: "#8aa8e8" },
  { key: "trustScore",           label: "Trust",           color: "#e8a838" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function scoreColor(v: number) {
  return v >= 80 ? "#3ecf8e" : v >= 65 ? "#8aa8e8" : v >= 50 ? "#e8a838" : "#e05555";
}
function scoreLabel(v: number) {
  return v >= 80 ? "Great" : v >= 65 ? "Good" : v >= 50 ? "Needs work" : "Poor";
}
function scoreLabelBg(v: number) {
  return v >= 80 ? "rgba(62,207,142,0.1)"
    : v >= 65 ? "rgba(138,168,232,0.1)"
    : v >= 50 ? "rgba(232,168,56,0.1)"
    : "rgba(224,85,85,0.1)";
}

// ── Sub-components ───────────────────────────────────────────────────────────
function RadialScore({ value, color }: { value: number; color: string }) {
  const r = 29, cx = 37, cy = 37, sw = 5;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(value, 100) / 100) * circ;
  return (
    <svg className="radial-score" viewBox="0 0 74 74">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.16,1,.3,1)" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize="15" fontFamily="'DM Serif Display', serif">
        {value}
      </text>
    </svg>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<"all" | "great" | "good" | "warn" | "poor">("all");
  const [sortBy, setSortBy]     = useState<"score" | "issues">("score");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: analyses, isLoading } = useQuery<Analysis[]>({
    queryKey: ["analyses"],
    queryFn: getAllAnalyses,
  });

  const total = analyses?.length ?? 0;
  const avgScore = total
    ? Math.round(analyses!.reduce((s, a) => s + (a.scores.overallScore ?? 0), 0) / total)
    : 0;
  const critCount = analyses?.filter((a) => (a.scores.overallScore ?? 0) < 60).length ?? 0;
  const highPri = analyses?.filter((a) => a.aiInsights?.improvementPriority === "HIGH").length ?? 0;

  const filtered = (analyses ?? [])
    .filter((a) => {
      const title = a.productId?.title?.toLowerCase() ?? "";
      const matchSearch = title.includes(search.toLowerCase());
      const score = a.scores.overallScore ?? 0;
      const matchFilter =
        filter === "all"   ? true :
        filter === "great" ? score >= 80 :
        filter === "good"  ? score >= 65 && score < 80 :
        filter === "warn"  ? score >= 50 && score < 65 :
        score < 50;
      return matchSearch && matchFilter;
    })
    .sort((a, b) =>
      sortBy === "score"
        ? (b.scores.overallScore ?? 0) - (a.scores.overallScore ?? 0)
        : (b.issues?.length ?? 0) - (a.issues?.length ?? 0)
    );

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#8c8a83", fontFamily: "'DM Sans', sans-serif" }}>
        Loading AI visibility…
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap');

        :root {
          --bg:         #111110;
          --surface:    #1c1b1a;
          --surface2:   #242321;
          --surface3:   #2e2c2a;
          --border:     rgba(255,255,255,0.07);
          --border-mid: rgba(255,255,255,0.13);
          --ink:        #f0ede8;
          --ink2:       #8c8a83;
          --ink3:       #504e49;
          --green:      #3ecf8e;
          --amber:      #e8a838;
          --red:        #e05555;
          --blue:       #8aa8e8;
          --font-serif: 'DM Serif Display', serif;
          --font:       'DM Sans', sans-serif;
          --font-mono:  'DM Mono', monospace;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: var(--bg); color: var(--ink); font-family: var(--font); -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .av-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 28px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── page header ── */
        .av-hd { padding-bottom: 28px; border-bottom: 1px solid var(--border); }
        .av-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .av-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .av-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }

        /* ── summary stat cards ── */
        .av-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .av-stat {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 22px 24px;
          transition: border-color 0.2s;
        }
        .av-stat:hover { border-color: var(--border-mid); }
        .av-stat-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 12px;
        }
        .av-stat-val { font-family: var(--font-serif); font-size: 36px; letter-spacing: -0.04em; line-height: 1; }
        .av-stat-sub { font-size: 12px; color: var(--ink3); margin-top: 6px; font-weight: 300; }

        /* ── toolbar section ── */
        .av-section {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 22px 24px;
        }
        .av-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .av-search {
          flex: 1; min-width: 200px; max-width: 300px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 9px; padding: 10px 16px;
          color: var(--ink); font-family: var(--font); font-size: 13.5px;
          outline: none; transition: border-color 0.2s;
        }
        .av-search::placeholder { color: var(--ink3); }
        .av-search:focus { border-color: var(--border-mid); }
        .av-select {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 9px; padding: 10px 14px;
          color: var(--ink2); font-family: var(--font); font-size: 13px;
          outline: none; cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238c8a83' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 32px;
        }
        .av-select option { background: var(--surface); color: var(--ink); }
        .av-filter-btn {
          padding: 8px 15px; border-radius: 8px;
          font-family: var(--font); font-size: 12.5px; font-weight: 500;
          cursor: pointer; border: 1px solid var(--border);
          background: transparent; color: var(--ink2);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .av-filter-btn:hover { border-color: var(--border-mid); color: var(--ink); }
        .av-filter-btn.active { background: var(--ink); border-color: var(--ink); color: var(--bg); }

        /* ── section header ── */
        .sec-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .sec-title { font-family: var(--font-serif); font-size: 18px; letter-spacing: -0.02em; color: var(--ink); }
        .sec-count { font-size: 12.5px; color: var(--ink3); font-family: var(--font-mono); }

        /* ── analysis card ── */
        .av-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden; transition: border-color 0.2s;
        }
        .av-card:hover { border-color: var(--border-mid); }
        .av-card.open  { border-color: var(--border-mid); }

        .av-card-hd {
          display: flex; align-items: center; gap: 18px;
          padding: 20px 24px; cursor: pointer; flex-wrap: wrap;
        }
        .radial-score { width: 74px; height: 74px; flex-shrink: 0; }
        .av-card-top {
          display: flex; align-items: center; gap: 18px;
          flex: 1; min-width: 0;
        }
        .av-card-info { flex: 1; min-width: 0; }
        .av-card-title {
          font-family: var(--font-serif); font-size: 17px;
          letter-spacing: -0.015em; color: var(--ink); margin-bottom: 4px;
          overflow: hidden; text-overflow: ellipsis;
          display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
        }
        .av-card-sub {
          font-size: 12.5px; color: var(--ink3); font-weight: 300;
          overflow: hidden; text-overflow: ellipsis;
          display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
        }
        .av-card-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
        .av-pill {
          font-size: 10.5px; font-weight: 500; padding: 3px 10px;
          border-radius: 100px; white-space: nowrap; flex-shrink: 0;
        }
        .av-issue-badge {
          font-size: 11.5px; color: var(--ink3); flex-shrink: 0;
          background: var(--surface2); border: 1px solid var(--border);
          padding: 3px 10px; border-radius: 100px; white-space: nowrap;
        }
        .av-chevron { flex-shrink: 0; color: var(--ink3); transition: transform 0.25s; }
        .av-chevron.open { transform: rotate(180deg); }

        /* ── expanded body ── */
        .av-body {
          border-top: 1px solid var(--border);
          padding: 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
        }
        .av-sec-title {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 14px;
        }

        /* score breakdown bars */
        .dim-list { display: flex; flex-direction: column; gap: 12px; }
        .dim-row { display: flex; flex-direction: column; gap: 6px; }
        .dim-top { display: flex; justify-content: space-between; }
        .dim-name { font-size: 12.5px; color: var(--ink2); font-weight: 300; }
        .dim-val { font-family: var(--font-serif); font-size: 14px; }
        .dim-track {
          height: 4px; background: var(--surface2); border: 1px solid var(--border);
          border-radius: 99px; overflow: hidden;
        }
        .dim-fill { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(0.16,1,0.3,1); }

        /* visibility prediction cells */
        .vis-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .vis-cell {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 10px; padding: 13px 15px;
        }
        .vis-platform { font-size: 11px; color: var(--ink3); margin-bottom: 7px; text-transform: capitalize; }
        .vis-val { font-family: var(--font-serif); font-size: 21px; letter-spacing: -0.02em; color: var(--ink); }

        /* AI insight box */
        .ai-box {
          background: rgba(62,207,142,0.06); border: 1px solid rgba(62,207,142,0.18);
          border-radius: 10px; padding: 16px; font-size: 13px;
          color: var(--green); line-height: 1.65; font-weight: 300;
        }

        /* optimized content */
        .opt-box {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 10px; padding: 16px; margin-bottom: 10px;
        }
        .opt-box:last-child { margin-bottom: 0; }
        .opt-label { font-size: 10.5px; color: var(--ink3); margin-bottom: 8px; letter-spacing: 0.04em; text-transform: uppercase; }
        .opt-text { font-size: 13px; color: var(--ink2); line-height: 1.6; font-weight: 300; }

        /* semantic gap tags */
        .gap-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .gap-tag {
          font-size: 12px; font-weight: 400;
          padding: 5px 13px; border-radius: 100px;
          background: rgba(232,168,56,0.08); color: var(--amber);
          border: 1px solid rgba(232,168,56,0.2);
        }

        /* issue / recommendation rows */
        .ir-list { display: flex; flex-direction: column; gap: 8px; }
        .ir-item {
          display: flex; align-items: flex-start; gap: 11px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 10px; padding: 11px 14px;
        }
        .ir-badge {
          font-size: 10px; font-weight: 500; padding: 2px 8px;
          border-radius: 100px; flex-shrink: 0; margin-top: 2px; letter-spacing: 0.03em;
        }
        .ir-text { font-size: 12.5px; color: var(--ink2); flex: 1; line-height: 1.55; font-weight: 300; }
        .ir-action {
          font-size: 11px; font-weight: 500;
          background: var(--surface3); border: 1px solid var(--border);
          border-radius: 6px; padding: 4px 10px; cursor: pointer;
          color: var(--ink2); white-space: nowrap; flex-shrink: 0;
          transition: border-color 0.2s, color 0.2s; font-family: var(--font);
        }
        .ir-action:hover { border-color: var(--border-mid); color: var(--ink); }

        .av-empty { text-align: center; padding: 64px 24px; color: var(--ink3); font-size: 13.5px; }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .av-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 820px) {
          .av-body { grid-template-columns: 1fr; }
        }
        @media (max-width: 680px) {
          .av-root { padding: 24px 16px 60px; gap: 24px; }
          .av-stats { grid-template-columns: 1fr; }
          .av-select { margin-left: 0 !important; width: 100%; }

          /* card header: ring+title on top row, pills wrap as their own row below */
          .av-card-hd { padding: 16px; gap: 12px; }
          .av-card-top { gap: 12px; }
          .radial-score { width: 56px; height: 56px; }
          .av-card-meta { width: 100%; padding-left: 0; }
          .av-body { padding: 18px 16px; gap: 22px; }
        }
        @media (max-width: 460px) {
          .av-card-hd { padding: 14px; }
        }
      `}</style>

      <div className="av-root">

        {/* ── Page header ── */}
        <div className="av-hd">
          <p className="av-eyebrow">Intelligence</p>
          <h1 className="av-title">AI visibility analysis</h1>
          <p className="av-sub">Deep dive into how every product scores across semantic, trust, and discoverability signals</p>
        </div>

        {/* ── Summary stat cards ── */}
        <div className="av-stats">
          {([
            { key: "all",   label: "Total analyses",  val: total,     color: "var(--ink)",                          sub: "all products" },
            { key: "score", label: "Avg AI score",     val: avgScore,  color: scoreColor(avgScore),                  sub: scoreLabel(avgScore) },
            { key: "crit",  label: "Poor visibility",  val: critCount, color: critCount > 0 ? "var(--red)" : "var(--green)",   sub: "score < 60" },
            { key: "high",  label: "High priority",    val: highPri,   color: highPri > 0 ? "var(--amber)" : "var(--green)",  sub: "need action" },
          ] as const).map(({ key, label, val, color, sub }) => (
            <div key={key} className="av-stat">
              <div className="av-stat-label">{label}</div>
              <div className="av-stat-val" style={{ color }}>{val}</div>
              <div className="av-stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="av-section">
          <div className="av-toolbar">
            <input
              className="av-search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {(["all", "great", "good", "warn", "poor"] as const).map((f) => (
              <button
                key={f}
                className={`av-filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "great" ? "Great" : f === "good" ? "Good" : f === "warn" ? "Needs work" : "Poor"}
              </button>
            ))}
            <select
              className="av-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "issues")}
              style={{ marginLeft: "auto" }}
            >
              <option value="score">Sort: AI score</option>
              <option value="issues">Sort: Issue count</option>
            </select>
          </div>
        </div>

        {/* ── Card list ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">AI visibility analyses</h2>
            <span className="sec-count">{filtered.length} results</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.length === 0 && (
              <div className="av-card"><div className="av-empty">No analyses match your filter.</div></div>
            )}

            {filtered.map((analysis) => {
              const score   = analysis.scores.overallScore ?? 0;
              const color   = scoreColor(score);
              const label   = scoreLabel(score);
              const labelBg = scoreLabelBg(score);
              const isOpen  = expanded === analysis._id;
              const priority = analysis.aiInsights?.improvementPriority ?? "MEDIUM";
              const priCfg   = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
              const issueLen = analysis.issues?.length ?? 0;

              return (
                <div key={analysis._id} className={`av-card${isOpen ? " open" : ""}`}>

                  {/* Card header — always visible */}
                  <div className="av-card-hd" onClick={() => setExpanded(isOpen ? null : analysis._id)}>
                    <div className="av-card-top">
                      <RadialScore value={score} color={color} />

                      <div className="av-card-info">
                        <div className="av-card-title">{analysis.productId?.title ?? "Untitled product"}</div>
                        <div className="av-card-sub">
                          {analysis.aiInsights?.summary
                            ? analysis.aiInsights.summary.slice(0, 90) + (analysis.aiInsights.summary.length > 90 ? "…" : "")
                            : "No summary available"}
                        </div>
                      </div>

                      <svg className={`av-chevron${isOpen ? " open" : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div className="av-card-meta">
                      <span className="av-pill" style={{ background: labelBg, color }}>{label}</span>
                      <span className="av-pill" style={{ background: priCfg.bg, color: priCfg.color }}>{priority}</span>
                      <span className="av-issue-badge">
                        {issueLen > 0 ? (
                          <span style={{ color: "var(--red)" }}>{issueLen} issues</span>
                        ) : "No issues"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="av-body">

                      {/* ── Left column ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                        {/* Score breakdown */}
                        <div>
                          <div className="av-sec-title">Score breakdown</div>
                          <div className="dim-list">
                            {SCORE_DIMS.map(({ key, label, color: dc }) => {
                              const val = analysis.scores[key] ?? 0;
                              return (
                                <div className="dim-row" key={key}>
                                  <div className="dim-top">
                                    <span className="dim-name">{label}</span>
                                    <span className="dim-val" style={{ color: dc }}>{val}</span>
                                  </div>
                                  <div className="dim-track">
                                    <div className="dim-fill" style={{ width: `${val}%`, background: dc }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Visibility prediction */}
                        {analysis.aiInsights?.visibilityPrediction &&
                          Object.keys(analysis.aiInsights.visibilityPrediction).length > 0 && (
                            <div>
                              <div className="av-sec-title">Platform visibility</div>
                              <div className="vis-grid">
                                {Object.entries(analysis.aiInsights.visibilityPrediction).map(([platform, val]) => (
                                  <div className="vis-cell" key={platform}>
                                    <div className="vis-platform">{platform}</div>
                                    <div className="vis-val">{String(val)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Semantic gaps */}
                        {(analysis.aiInsights?.semanticGaps ?? []).length > 0 && (
                          <div>
                            <div className="av-sec-title">Semantic gaps</div>
                            <div className="gap-wrap">
                              {analysis.aiInsights!.semanticGaps!.map((gap) => (
                                <span className="gap-tag" key={gap}>{gap}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Right column ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                        {/* AI summary */}
                        {analysis.aiInsights?.summary && (
                          <div>
                            <div className="av-sec-title">AI agent assessment</div>
                            <div className="ai-box">{analysis.aiInsights.summary}</div>
                          </div>
                        )}

                        {/* Optimized title + description */}
                        {(analysis.aiInsights?.optimizedTitle || analysis.aiInsights?.optimizedDescription) && (
                          <div>
                            <div className="av-sec-title">Optimized content</div>
                            {analysis.aiInsights.optimizedTitle && (
                              <div className="opt-box">
                                <div className="opt-label">AI optimized title</div>
                                <div className="opt-text" style={{ fontWeight: 500, color: "var(--ink)" }}>
                                  {analysis.aiInsights.optimizedTitle}
                                </div>
                              </div>
                            )}
                            {analysis.aiInsights.optimizedDescription && (
                              <div className="opt-box">
                                <div className="opt-label">AI optimized description</div>
                                <div className="opt-text">{analysis.aiInsights.optimizedDescription}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Issues */}
                        {issueLen > 0 && (
                          <div>
                            <div className="av-sec-title">Issues</div>
                            <div className="ir-list">
                              {analysis.issues.map((issue, idx) => (
                                <div className="ir-item" key={idx}>
                                  <span className="ir-badge" style={{ background: "rgba(224,85,85,0.12)", color: "var(--red)" }}>
                                    Issue
                                  </span>
                                  <span className="ir-text">{issue}</span>
                                  <button className="ir-action">Fix</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {(analysis.recommendations?.length ?? 0) > 0 && (
                          <div>
                            <div className="av-sec-title">Recommendations</div>
                            <div className="ir-list">
                              {analysis.recommendations.map((rec, idx) => (
                                <div className="ir-item" key={idx}>
                                  <span className="ir-badge" style={{ background: "rgba(138,168,232,0.12)", color: "var(--blue)" }}>
                                    Rec
                                  </span>
                                  <span className="ir-text">{rec}</span>
                                  <button className="ir-action">Apply</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}