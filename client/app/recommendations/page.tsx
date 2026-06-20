"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAnalyses } from "@/services/analysisService";

// ── Configs ──────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  HIGH:   { color: "#e05555", bg: "rgba(224,85,85,0.1)",  label: "High priority"   },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.1)", label: "Medium priority" },
  LOW:    { color: "#3ecf8e", bg: "rgba(62,207,142,0.1)", label: "Low priority"    },
};

// ── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 29, circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score ?? 0, 0), 100);
  const color =
    pct >= 80 ? "#3ecf8e" :
    pct >= 60 ? "#8aa8e8" :
    pct >= 40 ? "#e8a838" :
    "#e05555";
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" style={{ flexShrink: 0 }}>
      <circle cx="37" cy="37" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
      <circle
        cx="37" cy="37" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 37 37)"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.16,1,.3,1)" }}
      />
      <text x="37" y="42" textAnchor="middle" fontSize="15" fontFamily="'DM Serif Display', serif" fill={color}>
        {pct}
      </text>
    </svg>
  );
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="skel-card">
      <div className="skel" style={{ height: 20, width: "40%" }} />
      <div style={{ display: "flex", gap: 12 }}>
        {[1, 2, 3].map((i) => <div className="skel" key={i} style={{ height: 80, flex: 1 }} />)}
      </div>
      <div className="skel" style={{ height: 140, width: "100%" }} />
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function RecommendationsPage() {
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [filterPri, setFilterPri] = useState<string>("ALL");
  const [search, setSearch]       = useState("");

  const { data: analyses, isLoading, isError } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getAllAnalyses,
  });

  const totalIssues       = analyses?.reduce((acc: number, a: any) => acc + (a.issues?.length ?? 0), 0) ?? 0;
  const highPriorityCount = analyses?.filter((a: any) => a.aiInsights?.improvementPriority === "HIGH").length ?? 0;
  const avgScore = analyses?.length
    ? Math.round(analyses.reduce((s: number, a: any) => s + (a.scores?.overallScore ?? 0), 0) / analyses.length)
    : 0;

  const filtered = (analyses ?? []).filter((a: any) => {
    const matchPri    = filterPri === "ALL" || a.aiInsights?.improvementPriority === filterPri;
    const matchSearch = !search || a.productId?.title?.toLowerCase().includes(search.toLowerCase());
    return matchPri && matchSearch;
  });

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

        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink   { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .rp-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 32px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .skel-card {
          display: flex; flex-direction: column; gap: 16px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px;
        }
        .skel {
          border-radius: 10px;
          background: linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* ── page header ── */
        .rp-hd {
          display: flex; align-items: flex-end; justify-content: space-between;
          padding-bottom: 28px; border-bottom: 1px solid var(--border);
        }
        .rp-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .rp-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .rp-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }

        /* ── stats ── */
        .rp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .rp-stat {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 22px 24px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.2s;
        }
        .rp-stat:hover { border-color: var(--border-mid); }
        .rp-stat-icon {
          width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; background: var(--surface2); border: 1px solid var(--border); color: var(--ink2);
        }
        .rp-stat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink3); margin-bottom: 6px; }
        .rp-stat-val { font-family: var(--font-serif); font-size: 30px; letter-spacing: -0.04em; line-height: 1; }

        /* ── toolbar ── */
        .rp-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .rp-search {
          flex: 1; min-width: 200px; max-width: 320px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 9px; padding: 10px 16px;
          font-family: var(--font); font-size: 13.5px; color: var(--ink);
          outline: none; transition: border-color 0.2s;
        }
        .rp-search::placeholder { color: var(--ink3); }
        .rp-search:focus { border-color: var(--border-mid); }
        .rp-filter {
          padding: 8px 16px; border-radius: 8px;
          font-family: var(--font); font-size: 12.5px; font-weight: 500;
          cursor: pointer; border: 1px solid var(--border);
          background: transparent; color: var(--ink2);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .rp-filter:hover { border-color: var(--border-mid); color: var(--ink); }
        .rp-filter.active { background: var(--ink); border-color: var(--ink); color: var(--bg); }
        .rp-count { font-size: 12.5px; color: var(--ink3); margin-left: auto; font-family: var(--font-mono); }

        /* ── section header ── */
        .sec-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .sec-title { font-family: var(--font-serif); font-size: 18px; letter-spacing: -0.02em; color: var(--ink); }

        /* ── analysis card ── */
        .rp-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          transition: border-color 0.2s;
        }
        .rp-card:hover { border-color: var(--border-mid); }
        .rp-card.expanded { border-color: var(--border-mid); }

        .rp-card-hd {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 24px; cursor: pointer;
          border-bottom: 1px solid transparent; transition: border-color 0.2s;
        }
        .rp-card.expanded .rp-card-hd { border-color: var(--border); }
        .rp-card-info { flex: 1; min-width: 0; }
        .rp-card-title {
          font-size: 15px; font-weight: 500; color: var(--ink);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .rp-card-meta { display: flex; align-items: center; gap: 8px; margin-top: 7px; flex-wrap: wrap; }

        .rp-chip {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 100px;
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .rp-issue-badge {
          font-size: 11px; color: var(--red); font-weight: 500;
          background: rgba(224,85,85,0.08); border: 1px solid rgba(224,85,85,0.18);
          padding: 3px 10px; border-radius: 100px; white-space: nowrap;
        }
        .rp-rec-badge {
          font-size: 11px; color: var(--blue); font-weight: 500;
          background: rgba(138,168,232,0.08); border: 1px solid rgba(138,168,232,0.18);
          padding: 3px 10px; border-radius: 100px; white-space: nowrap;
        }
        .rp-chevron { color: var(--ink3); transition: transform 0.25s; flex-shrink: 0; }
        .rp-chevron.open { transform: rotate(180deg); }

        /* ── expand body ── */
        .rp-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        .rp-ai-summary {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(138,168,232,0.06); border: 1px solid rgba(138,168,232,0.18);
          border-radius: 12px; padding: 18px;
        }
        .rp-ai-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: rgba(138,168,232,0.12); border: 1px solid rgba(138,168,232,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--blue);
        }
        .rp-ai-text { font-size: 13px; color: var(--blue); line-height: 1.65; font-weight: 300; }

        /* two-col issues + recs */
        .rp-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .rp-col-title {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 12px;
        }

        .rp-issue-item {
          display: flex; align-items: flex-start; gap: 9px;
          background: rgba(224,85,85,0.05); border: 1px solid rgba(224,85,85,0.15);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 8px;
          font-size: 13px; color: var(--ink); line-height: 1.55; font-weight: 300;
        }
        .rp-issue-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); flex-shrink: 0; margin-top: 6px; }

        .rp-rec-item {
          display: flex; align-items: flex-start; gap: 9px;
          background: rgba(138,168,232,0.05); border: 1px solid rgba(138,168,232,0.15);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 8px;
          font-size: 13px; color: var(--ink); line-height: 1.55; font-weight: 300;
        }
        .rp-rec-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; margin-top: 6px; }

        .rp-empty-note { font-size: 13px; color: var(--ink3); font-weight: 300; }

        /* semantic gaps */
        .rp-gaps { display: flex; flex-wrap: wrap; gap: 8px; }
        .rp-gap-chip {
          font-size: 12px; color: var(--amber);
          background: rgba(232,168,56,0.08); border: 1px solid rgba(232,168,56,0.2);
          border-radius: 100px; padding: 5px 13px; font-weight: 400;
        }

        /* optimised content */
        .rp-opt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .rp-opt-card {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 12px; padding: 18px;
        }
        .rp-opt-label {
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 10px;
        }
        .rp-opt-val { font-size: 13px; color: var(--ink2); line-height: 1.6; font-weight: 300; }
        .rp-opt-title { font-family: var(--font-serif); font-size: 16px; letter-spacing: -0.01em; color: var(--ink); }

        /* impact bar */
        .rp-impact {
          display: flex; align-items: center; gap: 16px;
          background: rgba(62,207,142,0.06); border: 1px solid rgba(62,207,142,0.18);
          border-radius: 14px; padding: 18px 20px;
        }
        .rp-impact-icon {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          background: rgba(62,207,142,0.1); border: 1px solid rgba(62,207,142,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--green);
        }
        .rp-impact-title { font-size: 13.5px; font-weight: 500; color: var(--green); margin-bottom: 4px; }
        .rp-impact-desc { font-size: 12.5px; color: var(--ink2); line-height: 1.55; font-weight: 300; }

        /* ── empty / error ── */
        .rp-empty { text-align: center; padding: 64px 24px; color: var(--ink3); font-size: 13.5px; }
        .rp-error {
          display: flex; align-items: center; gap: 10px;
          background: rgba(232,168,56,0.06); border: 1px solid rgba(232,168,56,0.2);
          border-radius: 12px; padding: 13px 18px; font-size: 13px; color: var(--amber);
        }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .rp-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 760px) {
          .rp-two, .rp-opt-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 680px) {
          .rp-root { padding: 24px 20px 60px; gap: 24px; }
          .rp-hd { flex-direction: column; align-items: flex-start; gap: 16px; }
          .rp-stats { grid-template-columns: 1fr; }
          .rp-count { margin-left: 0; width: 100%; }
        }
      `}</style>

      <div className="rp-root">

        {/* ── Page header ── */}
        <div className="rp-hd">
          <div>
            <p className="rp-eyebrow">Optimization</p>
            <h1 className="rp-title">Recommendations</h1>
            <p className="rp-sub">AI-generated fixes ranked by visibility impact</p>
          </div>
        </div>

        {isError && (
          <div className="rp-error">⚠ Failed to load recommendations — check your server connection.</div>
        )}

        {/* ── Summary stats ── */}
        <div className="rp-stats">
          <div className="rp-stat">
            <div className="rp-stat-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8.5 5.5v3.5l2.2 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="rp-stat-label">Total issues</div>
              <div className="rp-stat-val" style={{ color: totalIssues > 0 ? "var(--red)" : "var(--green)" }}>
                {isLoading ? "—" : totalIssues}
              </div>
            </div>
          </div>
          <div className="rp-stat">
            <div className="rp-stat-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M9.5 2L4 9.5h4l-1 5.5L13 7H9l0.5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="rp-stat-label">High priority products</div>
              <div className="rp-stat-val" style={{ color: highPriorityCount > 0 ? "var(--amber)" : "var(--green)" }}>
                {isLoading ? "—" : highPriorityCount}
              </div>
            </div>
          </div>
          <div className="rp-stat">
            <div className="rp-stat-icon">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </div>
            <div>
              <div className="rp-stat-label">Avg AI score</div>
              <div className="rp-stat-val" style={{ color: avgScore >= 70 ? "var(--green)" : avgScore >= 50 ? "var(--amber)" : "var(--red)" }}>
                {isLoading ? "—" : avgScore}
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="rp-toolbar">
          <input
            className="rp-search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
            <button
              key={p}
              className={`rp-filter${filterPri === p ? " active" : ""}`}
              onClick={() => setFilterPri(p)}
            >
              {p === "ALL" ? "All" : PRIORITY_CONFIG[p].label}
            </button>
          ))}
          <span className="rp-count">{isLoading ? "" : `${filtered.length} products`}</span>
        </div>

        {/* ── Analysis cards ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Product recommendations</h2>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Skeleton /><Skeleton />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rp-card"><div className="rp-empty">No products match your filter.</div></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map((analysis: any) => {
                const priority = analysis.aiInsights?.improvementPriority ?? "MEDIUM";
                const priCfg   = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
                const score    = analysis.scores?.overallScore ?? 0;
                const issueLen = analysis.issues?.length ?? 0;
                const recLen   = analysis.recommendations?.length ?? 0;
                const isOpen   = expanded === analysis._id;

                return (
                  <div key={analysis._id} className={`rp-card${isOpen ? " expanded" : ""}`}>

                    {/* Header row */}
                    <div className="rp-card-hd" onClick={() => setExpanded(isOpen ? null : analysis._id)}>
                      <ScoreRing score={score} />

                      <div className="rp-card-info">
                        <div className="rp-card-title">{analysis.productId?.title ?? "Untitled product"}</div>
                        <div className="rp-card-meta">
                          <span className="rp-chip" style={{ background: priCfg.bg, color: priCfg.color }}>
                            {priCfg.label}
                          </span>
                          {issueLen > 0 && (
                            <span className="rp-issue-badge">{issueLen} issue{issueLen !== 1 ? "s" : ""}</span>
                          )}
                          {recLen > 0 && (
                            <span className="rp-rec-badge">{recLen} rec{recLen !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </div>

                      <svg className={`rp-chevron${isOpen ? " open" : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div className="rp-body">

                        {/* AI summary */}
                        {analysis.aiInsights?.optimizedTitle && (
                          <div className="rp-ai-summary">
                            <div className="rp-ai-icon">
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M7.5 2v2.5M7.5 10.5V13M2 7.5h2.5M10.5 7.5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <div className="rp-ai-text">
                              AI agents are currently under-ranking this product due to missing semantic signals.
                              Implementing the recommendations below can significantly improve retrieval confidence
                              across ChatGPT, Perplexity, and Amazon Rufus.
                            </div>
                          </div>
                        )}

                        {/* Issues + recommendations */}
                        <div className="rp-two">
                          <div>
                            <div className="rp-col-title" style={{ color: "var(--red)" }}>Issues detected</div>
                            {analysis.issues?.length === 0
                              ? <div className="rp-empty-note">No issues found.</div>
                              : analysis.issues?.map((issue: string, i: number) => (
                                <div className="rp-issue-item" key={i}>
                                  <span className="rp-issue-dot" />
                                  {issue}
                                </div>
                              ))
                            }
                          </div>
                          <div>
                            <div className="rp-col-title" style={{ color: "var(--blue)" }}>AI recommendations</div>
                            {analysis.recommendations?.length === 0
                              ? <div className="rp-empty-note">No recommendations yet.</div>
                              : analysis.recommendations?.map((rec: string, i: number) => (
                                <div className="rp-rec-item" key={i}>
                                  <span className="rp-rec-dot" />
                                  {rec}
                                </div>
                              ))
                            }
                          </div>
                        </div>

                        {/* Semantic gaps */}
                        {analysis.aiInsights?.semanticGaps?.length > 0 && (
                          <div>
                            <div className="rp-col-title" style={{ color: "var(--amber)" }}>Missing semantic signals</div>
                            <div className="rp-gaps">
                              {analysis.aiInsights.semanticGaps.map((gap: string) => (
                                <span key={gap} className="rp-gap-chip">{gap}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Optimised content */}
                        {(analysis.aiInsights?.optimizedTitle || analysis.aiInsights?.optimizedDescription) && (
                          <div>
                            <div className="rp-col-title" style={{ color: "var(--ink3)" }}>AI-optimised content</div>
                            <div className="rp-opt-grid">
                              {analysis.aiInsights?.optimizedTitle && (
                                <div className="rp-opt-card">
                                  <div className="rp-opt-label">Suggested title</div>
                                  <div className="rp-opt-title">{analysis.aiInsights.optimizedTitle}</div>
                                </div>
                              )}
                              {analysis.aiInsights?.optimizedDescription && (
                                <div className="rp-opt-card">
                                  <div className="rp-opt-label">Suggested description</div>
                                  <div className="rp-opt-val">{analysis.aiInsights.optimizedDescription}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expected impact */}
                        <div className="rp-impact">
                          <div className="rp-impact-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M11 5h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <div className="rp-impact-title">Expected visibility gain</div>
                            <div className="rp-impact-desc">
                              Resolving these issues can improve AI shopping assistant retrieval,
                              semantic ranking, and visibility confidence across ChatGPT, Perplexity, and Amazon Rufus.
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}