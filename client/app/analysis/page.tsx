"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAnalyses } from "@/services/analysisService";

// ── Types ────────────────────────────────────────────────────────────────────

interface Analysis {
  _id:        string;
  productId:  { title?: string; image?: string } | null;
  scores: {
    overallScore:        number;
    semanticScore?:      number;
    discoverabilityScore?: number;
    trustScore?:         number;
    [key: string]:       number | undefined;
  };
  issues:          string[];
  recommendations: string[];
  aiInsights?: {
    summary?:               string;
    optimizedTitle?:        string;
    optimizedDescription?:  string;
    improvementPriority?:   string;
    semanticGaps?:          string[];
    visibilityPrediction?:  Record<string, string | number>;
  };
}

// ── Config ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  HIGH:   { color: "#f0683a", bg: "rgba(240,104,58,0.10)" },
  MEDIUM: { color: "#f5b429", bg: "rgba(245,180,41,0.10)" },
  LOW:    { color: "#16b98c", bg: "rgba(22,185,140,0.10)" },
};

const SCORE_DIMS: { key: string; label: string; color: string }[] = [
  { key: "semanticScore",        label: "Semantic",        color: "#16b98c" },
  { key: "discoverabilityScore", label: "Discoverability", color: "#4d7aff" },
  { key: "trustScore",           label: "Trust",           color: "#f5b429" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(v: number) {
  return v >= 80 ? "#16b98c" : v >= 65 ? "#4d7aff" : v >= 50 ? "#f5b429" : "#f0683a";
}

function scoreLabel(v: number) {
  return v >= 80 ? "Great" : v >= 65 ? "Good" : v >= 50 ? "Needs Work" : "Poor";
}

function scoreLabelBg(v: number) {
  return v >= 80 ? "rgba(22,185,140,0.10)"
       : v >= 65 ? "rgba(77,122,255,0.10)"
       : v >= 50 ? "rgba(245,180,41,0.10)"
       : "rgba(240,104,58,0.10)";
}

// ── Sub-components ───────────────────────────────────────────────────────────

function RadialScore({ value, color }: { value: number; color: string }) {
  const r = 28, cx = 36, cy = 36, sw = 5;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(value, 100) / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + 5} textAnchor="middle"
        fill={color} fontSize="13" fontWeight="700"
        fontFamily="'Syne', sans-serif">
        {value}
      </text>
    </svg>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AnalysisPage() {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<"all" | "great" | "good" | "warn" | "poor">("all");
  const [sortBy,   setSortBy]   = useState<"score" | "issues">("score");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: analyses, isLoading } = useQuery<Analysis[]>({
    queryKey: ["analyses"],
    queryFn:  getAllAnalyses,
  });

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total     = analyses?.length ?? 0;
  const avgScore  = total
    ? Math.round(analyses!.reduce((s, a) => s + (a.scores.overallScore ?? 0), 0) / total)
    : 0;
  const critCount = analyses?.filter((a) => (a.scores.overallScore ?? 0) < 60).length ?? 0;
  const highPri   = analyses?.filter(
    (a) => a.aiInsights?.improvementPriority === "HIGH"
  ).length ?? 0;

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const filtered = (analyses ?? [])
    .filter((a) => {
      const title = a.productId?.title?.toLowerCase() ?? "";
      const matchSearch = title.includes(search.toLowerCase());
      const score = a.scores.overallScore ?? 0;
      const matchFilter =
        filter === "all"   ? true
        : filter === "great" ? score >= 80
        : filter === "good"  ? score >= 65 && score < 80
        : filter === "warn"  ? score >= 50 && score < 65
        : score < 50;
      return matchSearch && matchFilter;
    })
    .sort((a, b) =>
      sortBy === "score"
        ? (b.scores.overallScore ?? 0) - (a.scores.overallScore ?? 0)
        : (b.issues?.length ?? 0) - (a.issues?.length ?? 0)
    );

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
        Loading AI visibility…
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .av-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 24px; color: #e8edf5; -webkit-font-smoothing: antialiased; }

        /* Summary cards */
        .av-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        @media(max-width:900px){ .av-stats { grid-template-columns: repeat(2,1fr); } }
        .av-stat {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px 20px;
          cursor: pointer; transition: border-color 0.15s;
        }
        .av-stat:hover { border-color: rgba(255,255,255,0.11); }
        .av-stat.active { border-color: rgba(77,122,255,0.30); background: rgba(77,122,255,0.06); }
        .av-stat-label { font-size: 11.5px; color: #64748b; margin-bottom: 8px; }
        .av-stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.04em; }
        .av-stat-sub { font-size: 11px; color: #2d3748; margin-top: 4px; }

        /* Toolbar */
        .av-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .av-search {
          flex: 1; min-width: 180px; max-width: 300px;
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 9px 14px;
          color: #e8edf5; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.15s;
        }
        .av-search::placeholder { color: #2d3748; }
        .av-search:focus { border-color: rgba(77,122,255,0.35); }
        .av-select {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 9px 12px;
          color: #64748b; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; cursor: pointer;
        }
        .av-filter-btn {
          padding: 8px 13px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.07);
          background: transparent; color: #64748b; transition: all 0.15s;
        }
        .av-filter-btn:hover { border-color: rgba(255,255,255,0.12); color: #94a3b8; }
        .av-filter-btn.active { background: rgba(77,122,255,0.12); border-color: rgba(77,122,255,0.25); color: #8aabff; }

        /* Analysis card */
        .av-card {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden; transition: border-color 0.2s;
        }
        .av-card:hover  { border-color: rgba(255,255,255,0.11); }
        .av-card.open   { border-color: rgba(77,122,255,0.25); }

        .av-card-hd {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 22px; cursor: pointer;
        }
        .av-card-info  { flex: 1; min-width: 0; }
        .av-card-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: -0.02em; color: #e8edf5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .av-card-sub   { font-size: 12px; color: #2d3748; margin-top: 3px; }
        .av-pill {
          font-size: 10.5px; font-weight: 600; padding: 3px 9px;
          border-radius: 100px; white-space: nowrap; flex-shrink: 0;
        }
        .av-issue-badge {
          font-size: 11.5px; color: #64748b; flex-shrink: 0;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
          padding: 3px 9px; border-radius: 100px;
        }
        .av-chevron { flex-shrink: 0; color: #2d3748; transition: transform 0.2s; font-size: 13px; }
        .av-chevron.open { transform: rotate(180deg); }

        /* Expanded body */
        .av-body {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 22px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
        }
        @media(max-width:820px){ .av-body { grid-template-columns: 1fr; } }

        .av-sec-title {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em;
          text-transform: uppercase; color: #2d3748; margin-bottom: 12px;
        }

        /* Score breakdown bars */
        .dim-list { display: flex; flex-direction: column; gap: 10px; }
        .dim-row  { display: flex; flex-direction: column; gap: 5px; }
        .dim-top  { display: flex; justify-content: space-between; }
        .dim-name { font-size: 12px; color: #64748b; }
        .dim-val  { font-size: 12px; font-weight: 700; }
        .dim-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden; }
        .dim-fill  { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

        /* Visibility prediction cells */
        .vis-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        .vis-cell {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px; padding: 12px 14px;
        }
        .vis-platform { font-size: 11px; color: #2d3748; margin-bottom: 6px; text-transform: capitalize; }
        .vis-val { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #e8edf5; }

        /* AI insight box */
        .ai-box {
          background: rgba(77,122,255,0.05); border: 1px solid rgba(77,122,255,0.14);
          border-radius: 10px; padding: 14px;
          font-size: 13px; color: #8aabff; line-height: 1.65;
          margin-bottom: 14px;
        }

        /* Optimized content */
        .opt-box {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px; padding: 14px; margin-bottom: 10px;
        }
        .opt-label { font-size: 11px; color: #2d3748; margin-bottom: 6px; }
        .opt-text  { font-size: 13px; color: #c8d0de; line-height: 1.6; }

        /* Semantic gap tags */
        .gap-wrap  { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
        .gap-tag   {
          font-size: 11.5px; font-weight: 500;
          padding: 4px 10px; border-radius: 100px;
          background: rgba(240,104,58,0.10); color: #f0683a;
          border: 1px solid rgba(240,104,58,0.20);
        }

        /* Issue / recommendation rows */
        .ir-list { display: flex; flex-direction: column; gap: 7px; }
        .ir-item {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
          border-radius: 9px; padding: 10px 13px;
        }
        .ir-badge {
          font-size: 10px; font-weight: 600; padding: 2px 7px;
          border-radius: 100px; flex-shrink: 0; margin-top: 1px; letter-spacing: 0.04em;
        }
        .ir-text  { font-size: 12.5px; color: #94a3b8; flex: 1; line-height: 1.5; }
        .ir-action {
          font-size: 11px; color: #4d7aff; font-weight: 500;
          background: rgba(77,122,255,0.08); border: 1px solid rgba(77,122,255,0.15);
          border-radius: 6px; padding: 3px 9px; cursor: pointer;
          white-space: nowrap; flex-shrink: 0; transition: background 0.15s;
        }
        .ir-action:hover { background: rgba(77,122,255,0.15); }

        .av-empty { text-align: center; padding: 60px 24px; color: #2d3748; font-size: 14px; }

        /* Section header */
        .section-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
      `}</style>

      <div className="av-root">

        {/* ── Summary stat cards ── */}
        <div className="av-stats">
          {([
            { key: "all",   label: "Total Analyses",  val: total,     color: "#e8edf5", sub: "all products" },
            { key: "score", label: "Avg AI Score",     val: avgScore,  color: scoreColor(avgScore), sub: scoreLabel(avgScore) },
            { key: "crit",  label: "Poor Visibility",  val: critCount, color: critCount > 0 ? "#f0683a" : "#16b98c", sub: "score < 60" },
            { key: "high",  label: "High Priority",    val: highPri,   color: highPri > 0 ? "#f5b429" : "#16b98c", sub: "need action" },
          ] as const).map(({ key, label, val, color, sub }) => (
            <div key={key} className="av-stat">
              <div className="av-stat-label">{label}</div>
              <div className="av-stat-val" style={{ color }}>{val}</div>
              <div className="av-stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="av-toolbar">
          <input
            className="av-search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {(["all","great","good","warn","poor"] as const).map((f) => (
            <button
              key={f}
              className={`av-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "great" ? "Great" : f === "good" ? "Good" : f === "warn" ? "Needs Work" : "Poor"}
            </button>
          ))}
          <select
            className="av-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "issues")}
            style={{ marginLeft: "auto" }}
          >
            <option value="score">Sort: AI Score</option>
            <option value="issues">Sort: Issue Count</option>
          </select>
        </div>

        {/* ── Card list ── */}
        <div>
          <div className="section-hd">
            <div className="section-title">AI Visibility Analyses</div>
            <span style={{ fontSize: 12, color: "#64748b" }}>{filtered.length} results</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 && (
              <div className="av-empty">No analyses match your filter.</div>
            )}

            {filtered.map((analysis) => {
              const score    = analysis.scores.overallScore ?? 0;
              const color    = scoreColor(score);
              const label    = scoreLabel(score);
              const labelBg  = scoreLabelBg(score);
              const isOpen   = expanded === analysis._id;
              const priority = analysis.aiInsights?.improvementPriority ?? "MEDIUM";
              const priCfg   = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
              const issueLen = analysis.issues?.length ?? 0;

              return (
                <div key={analysis._id} className={`av-card${isOpen ? " open" : ""}`}>

                  {/* Card header — always visible */}
                  <div className="av-card-hd" onClick={() => setExpanded(isOpen ? null : analysis._id)}>
                    <RadialScore value={score} color={color} />

                    <div className="av-card-info">
                      <div className="av-card-title">{analysis.productId?.title ?? "Untitled Product"}</div>
                      <div className="av-card-sub">
                        {analysis.aiInsights?.summary
                          ? analysis.aiInsights.summary.slice(0, 90) + (analysis.aiInsights.summary.length > 90 ? "…" : "")
                          : "No summary available"}
                      </div>
                    </div>

                    <span className="av-pill" style={{ background: labelBg, color }}>{label}</span>
                    <span className="av-pill" style={{ background: priCfg.bg, color: priCfg.color }}>{priority}</span>
                    <span className="av-issue-badge">
                      {issueLen > 0
                        ? <span style={{ color: "#f0683a" }}>{issueLen} issues</span>
                        : "No issues"}
                    </span>
                    <span className={`av-chevron${isOpen ? " open" : ""}`}>▾</span>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="av-body">

                      {/* ── Left column ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Score breakdown */}
                        <div>
                          <div className="av-sec-title">Score Breakdown</div>
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
                            <div className="av-sec-title">Platform Visibility</div>
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
                            <div className="av-sec-title">Semantic Gaps</div>
                            <div className="gap-wrap">
                              {analysis.aiInsights!.semanticGaps!.map((gap) => (
                                <span className="gap-tag" key={gap}>{gap}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Right column ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* AI summary */}
                        {analysis.aiInsights?.summary && (
                          <div>
                            <div className="av-sec-title">AI Agent Assessment</div>
                            <div className="ai-box">{analysis.aiInsights.summary}</div>
                          </div>
                        )}

                        {/* Optimized title + description */}
                        {(analysis.aiInsights?.optimizedTitle || analysis.aiInsights?.optimizedDescription) && (
                          <div>
                            <div className="av-sec-title">Optimized Content</div>
                            {analysis.aiInsights.optimizedTitle && (
                              <div className="opt-box">
                                <div className="opt-label">AI Optimized Title</div>
                                <div className="opt-text" style={{ fontWeight: 500 }}>
                                  {analysis.aiInsights.optimizedTitle}
                                </div>
                              </div>
                            )}
                            {analysis.aiInsights.optimizedDescription && (
                              <div className="opt-box">
                                <div className="opt-label">AI Optimized Description</div>
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
                                  <span className="ir-badge" style={{ background: "rgba(240,104,58,0.10)", color: "#f0683a" }}>
                                    Issue
                                  </span>
                                  <span className="ir-text">{issue}</span>
                                  <span className="ir-action">Fix</span>
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
                                  <span className="ir-badge" style={{ background: "rgba(77,122,255,0.10)", color: "#8aabff" }}>
                                    Rec
                                  </span>
                                  <span className="ir-text">{rec}</span>
                                  <span className="ir-action">Apply</span>
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