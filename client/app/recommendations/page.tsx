"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAnalyses } from "@/services/analysisService";

// ─── Configs ──────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  HIGH:   { color: "#f0683a", bg: "rgba(240,104,58,0.10)",  label: "High Priority"   },
  MEDIUM: { color: "#f5b429", bg: "rgba(245,180,41,0.10)",  label: "Medium Priority" },
  LOW:    { color: "#16b98c", bg: "rgba(22,185,140,0.10)",  label: "Low Priority"    },
};

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 28, circ = 2 * Math.PI * r;
  const pct   = Math.min(Math.max(score ?? 0, 0), 100);
  const color = pct >= 80 ? "#16b98c" : pct >= 60 ? "#4d7aff" : pct >= 40 ? "#f5b429" : "#f0683a";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="700"
        fontFamily="'Syne', sans-serif" fill={color}>{pct}</text>
    </svg>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  const s: React.CSSProperties = {
    background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
    borderRadius: 8,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, background: "#0b1120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
      <div style={{ ...s, height: 20, width: "40%" }} />
      <div style={{ display: "flex", gap: 12 }}>
        {[1,2,3].map(i => <div key={i} style={{ ...s, height: 80, flex: 1 }} />)}
      </div>
      <div style={{ ...s, height: 140, width: "100%" }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RecommendationsPage() {
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [filterPri, setFilterPri] = useState<string>("ALL");
  const [search, setSearch]       = useState("");

  const { data: analyses, isLoading, isError } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getAllAnalyses,
  });

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalIssues      = analyses?.reduce((acc: number, a: any) => acc + (a.issues?.length ?? 0), 0) ?? 0;
  const highPriorityCount = analyses?.filter((a: any) => a.aiInsights?.improvementPriority === "HIGH").length ?? 0;
  const avgScore          = analyses?.length
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin     { to{transform:rotate(360deg)} }

        .rp-root { display:flex;flex-direction:column;gap:28px;font-family:'DM Sans',sans-serif;color:#e8edf5;animation:fadeUp 0.4s ease both; }

        /* Summary chips */
        .rp-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
        @media(max-width:800px){ .rp-stats{grid-template-columns:repeat(2,1fr);} }
        .rp-stat {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:20px 22px;
          display:flex;align-items:center;gap:14px;
          transition:border-color 0.2s;
        }
        .rp-stat:hover { border-color:rgba(255,255,255,0.11); }
        .rp-stat-icon {
          width:40px;height:40px;border-radius:10px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;font-size:18px;
        }
        .rp-stat-label { font-size:11.5px;color:#64748b;margin-bottom:4px; }
        .rp-stat-val   { font-family:'Syne',sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.04em;line-height:1; }

        /* Toolbar */
        .rp-toolbar { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
        .rp-search {
          flex:1;min-width:180px;max-width:300px;
          background:#0b1120;border:1px solid rgba(255,255,255,0.08);
          border-radius:9px;padding:9px 14px;
          font-family:'DM Sans',sans-serif;font-size:13px;color:#e8edf5;
          outline:none;transition:border-color 0.15s;
        }
        .rp-search::placeholder { color:#2d3748; }
        .rp-search:focus { border-color:rgba(77,122,255,0.4); }
        .rp-filter {
          padding:8px 14px;border-radius:8px;
          font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;
          cursor:pointer;border:1px solid rgba(255,255,255,0.07);
          background:transparent;color:#64748b;transition:all 0.15s;
        }
        .rp-filter:hover { border-color:rgba(255,255,255,0.12);color:#94a3b8; }
        .rp-filter.active { background:rgba(77,122,255,0.12);border-color:rgba(77,122,255,0.25);color:#8aabff; }
        .rp-count { font-size:12px;color:#2d3748;margin-left:auto; }

        /* Analysis card */
        .rp-card {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;overflow:hidden;
          transition:border-color 0.2s;
        }
        .rp-card:hover { border-color:rgba(255,255,255,0.11); }
        .rp-card.expanded { border-color:rgba(77,122,255,0.25); }

        /* Card header */
        .rp-card-hd {
          display:flex;align-items:center;gap:18px;
          padding:18px 22px;cursor:pointer;
          border-bottom:1px solid transparent;transition:border-color 0.15s;
        }
        .rp-card.expanded .rp-card-hd { border-color:rgba(255,255,255,0.05); }
        .rp-card-info { flex:1;min-width:0; }
        .rp-card-title {
          font-family:'Syne',sans-serif;font-size:14px;font-weight:700;
          letter-spacing:-0.02em;color:#e8edf5;
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        }
        .rp-card-meta { display:flex;align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap; }
        .rp-card-score-txt { font-size:12px;color:#64748b; }

        .rp-chip {
          display:inline-flex;align-items:center;
          padding:3px 9px;border-radius:100px;
          font-size:10.5px;font-weight:600;letter-spacing:0.04em;
          white-space:nowrap;
        }
        .rp-issue-badge {
          font-size:11px;color:#f0683a;font-weight:600;
          background:rgba(240,104,58,0.08);border:1px solid rgba(240,104,58,0.15);
          padding:3px 9px;border-radius:100px;white-space:nowrap;
        }
        .rp-chevron { color:#2d3748;transition:transform 0.25s;font-size:13px;flex-shrink:0; }
        .rp-chevron.open { transform:rotate(180deg); }

        /* Expand body */
        .rp-body { padding:22px;display:flex;flex-direction:column;gap:18px; }

        /* AI summary box */
        .rp-ai-summary {
          display:flex;gap:12px;align-items:flex-start;
          background:rgba(77,122,255,0.06);border:1px solid rgba(77,122,255,0.15);
          border-radius:12px;padding:16px;
        }
        .rp-ai-icon {
          width:28px;height:28px;border-radius:7px;flex-shrink:0;
          background:rgba(77,122,255,0.15);border:1px solid rgba(77,122,255,0.25);
          display:flex;align-items:center;justify-content:center;font-size:14px;
        }
        .rp-ai-text { font-size:12.5px;color:#8aabff;line-height:1.65; }

        /* Two-col issues + recs */
        .rp-two { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        @media(max-width:760px){ .rp-two{grid-template-columns:1fr;} }
        .rp-col-title {
          font-size:11px;font-weight:600;letter-spacing:0.08em;
          text-transform:uppercase;margin-bottom:10px;
        }

        .rp-issue-item {
          display:flex;align-items:flex-start;gap:8px;
          background:rgba(240,104,58,0.04);
          border:1px solid rgba(240,104,58,0.10);
          border-radius:9px;padding:11px 13px;margin-bottom:8px;
          font-size:12.5px;color:#e8edf5;line-height:1.5;
        }
        .rp-issue-dot { width:6px;height:6px;border-radius:50%;background:#f0683a;flex-shrink:0;margin-top:5px; }

        .rp-rec-item {
          display:flex;align-items:flex-start;gap:8px;
          background:rgba(77,122,255,0.04);
          border:1px solid rgba(77,122,255,0.10);
          border-radius:9px;padding:11px 13px;margin-bottom:8px;
          font-size:12.5px;color:#e8edf5;line-height:1.5;
        }
        .rp-rec-dot { width:6px;height:6px;border-radius:50%;background:#4d7aff;flex-shrink:0;margin-top:5px; }

        /* Semantic gaps */
        .rp-gaps { display:flex;flex-wrap:wrap;gap:7px; }
        .rp-gap-chip {
          font-size:11.5px;color:#f5b429;
          background:rgba(245,180,41,0.07);
          border:1px solid rgba(245,180,41,0.18);
          border-radius:100px;padding:4px 12px;
        }

        /* Optimised content */
        .rp-opt-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        @media(max-width:760px){ .rp-opt-grid{grid-template-columns:1fr;} }
        .rp-opt-card {
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:11px;padding:16px;
        }
        .rp-opt-label { font-size:10.5px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#2d3748;margin-bottom:8px; }
        .rp-opt-val   { font-size:13px;color:#c8d0de;line-height:1.6; }
        .rp-opt-title { font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:-0.02em;color:#e8edf5; }

        /* Impact bar */
        .rp-impact {
          display:flex;align-items:center;gap:14px;
          background:rgba(22,185,140,0.05);
          border:1px solid rgba(22,185,140,0.18);
          border-radius:12px;padding:16px 18px;
        }
        .rp-impact-icon { font-size:20px;flex-shrink:0; }
        .rp-impact-title { font-size:13px;font-weight:600;color:#16b98c;margin-bottom:3px; }
        .rp-impact-desc  { font-size:12px;color:#4a5568;line-height:1.5; }

        /* Empty state */
        .rp-empty { text-align:center;padding:60px 24px;color:#2d3748;font-size:13.5px; }

        /* Error */
        .rp-error { display:flex;align-items:center;gap:10px;background:rgba(245,180,41,0.06);border:1px solid rgba(245,180,41,0.18);border-radius:10px;padding:12px 16px;font-size:13px;color:#f5b429; }

        .section-hd    { display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px; }
        .section-title { font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:-0.02em; }
      `}</style>

      <div className="rp-root">

        {/* Error notice */}
        {isError && (
          <div className="rp-error">⚠ Failed to load recommendations — check your server connection.</div>
        )}

        {/* Summary stats */}
        <div className="rp-stats">
          <div className="rp-stat">
            <div className="rp-stat-icon" style={{ background: "rgba(240,104,58,0.10)", border: "1px solid rgba(240,104,58,0.18)" }}>🐛</div>
            <div>
              <div className="rp-stat-label">Total Issues</div>
              <div className="rp-stat-val" style={{ color: totalIssues > 0 ? "#f0683a" : "#16b98c" }}>{isLoading ? "—" : totalIssues}</div>
            </div>
          </div>
          <div className="rp-stat">
            <div className="rp-stat-icon" style={{ background: "rgba(245,180,41,0.10)", border: "1px solid rgba(245,180,41,0.18)" }}>⚡</div>
            <div>
              <div className="rp-stat-label">High Priority Products</div>
              <div className="rp-stat-val" style={{ color: highPriorityCount > 0 ? "#f5b429" : "#16b98c" }}>{isLoading ? "—" : highPriorityCount}</div>
            </div>
          </div>
          <div className="rp-stat">
            <div className="rp-stat-icon" style={{ background: "rgba(77,122,255,0.10)", border: "1px solid rgba(77,122,255,0.18)" }}>🎯</div>
            <div>
              <div className="rp-stat-label">Avg AI Score</div>
              <div className="rp-stat-val" style={{ color: avgScore >= 70 ? "#16b98c" : avgScore >= 50 ? "#f5b429" : "#f0683a" }}>{isLoading ? "—" : avgScore}</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
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

        {/* Analysis cards */}
        <div>
          <div className="section-hd">
            <div className="section-title">Product Recommendations</div>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Skeleton /><Skeleton />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rp-card"><div className="rp-empty">No products match your filter.</div></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((analysis: any) => {
                const priority  = analysis.aiInsights?.improvementPriority ?? "MEDIUM";
                const priCfg    = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
                const score     = analysis.scores?.overallScore ?? 0;
                const issueLen  = analysis.issues?.length ?? 0;
                const recLen    = analysis.recommendations?.length ?? 0;
                const isOpen    = expanded === analysis._id;

                return (
                  <div key={analysis._id} className={`rp-card${isOpen ? " expanded" : ""}`}>

                    {/* Header row */}
                    <div className="rp-card-hd" onClick={() => setExpanded(isOpen ? null : analysis._id)}>
                      <ScoreRing score={score} />

                      <div className="rp-card-info">
                        <div className="rp-card-title">{analysis.productId?.title ?? "Untitled Product"}</div>
                        <div className="rp-card-meta">
                          <span className="rp-chip" style={{ background: priCfg.bg, color: priCfg.color }}>
                            {priCfg.label}
                          </span>
                          {issueLen > 0 && (
                            <span className="rp-issue-badge">{issueLen} issue{issueLen !== 1 ? "s" : ""}</span>
                          )}
                          {recLen > 0 && (
                            <span style={{ fontSize: 11, color: "#4d7aff", background: "rgba(77,122,255,0.08)", border: "1px solid rgba(77,122,255,0.15)", padding: "3px 9px", borderRadius: "100px" }}>
                              {recLen} rec{recLen !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`rp-chevron${isOpen ? " open" : ""}`}>▾</span>
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div className="rp-body">

                        {/* AI summary */}
                        {analysis.aiInsights?.optimizedTitle && (
                          <div className="rp-ai-summary">
                            <div className="rp-ai-icon">🤖</div>
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
                            <div className="rp-col-title" style={{ color: "#f0683a" }}>Issues Detected</div>
                            {analysis.issues?.length === 0
                              ? <div style={{ fontSize: 12.5, color: "#2d3748" }}>No issues found.</div>
                              : analysis.issues?.map((issue: string, i: number) => (
                                <div className="rp-issue-item" key={i}>
                                  <span className="rp-issue-dot" />
                                  {issue}
                                </div>
                              ))
                            }
                          </div>
                          <div>
                            <div className="rp-col-title" style={{ color: "#4d7aff" }}>AI Recommendations</div>
                            {analysis.recommendations?.length === 0
                              ? <div style={{ fontSize: 12.5, color: "#2d3748" }}>No recommendations yet.</div>
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
                            <div className="rp-col-title" style={{ color: "#f5b429" }}>Missing Semantic Signals</div>
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
                            <div className="rp-col-title" style={{ color: "#64748b" }}>AI-Optimised Content</div>
                            <div className="rp-opt-grid">
                              {analysis.aiInsights?.optimizedTitle && (
                                <div className="rp-opt-card">
                                  <div className="rp-opt-label">Suggested Title</div>
                                  <div className="rp-opt-title">{analysis.aiInsights.optimizedTitle}</div>
                                </div>
                              )}
                              {analysis.aiInsights?.optimizedDescription && (
                                <div className="rp-opt-card">
                                  <div className="rp-opt-label">Suggested Description</div>
                                  <div className="rp-opt-val">{analysis.aiInsights.optimizedDescription}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expected impact */}
                        <div className="rp-impact">
                          <div className="rp-impact-icon">📈</div>
                          <div>
                            <div className="rp-impact-title">Expected Visibility Gain</div>
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