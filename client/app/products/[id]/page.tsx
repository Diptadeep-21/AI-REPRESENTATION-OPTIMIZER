"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getProductAnalysis } from "@/services/productAnalysisService";

// ─── Score key formatting ─────────────────────────────────────────────────────
const SCORE_LABELS: Record<string, { label: string; color: string }> = {
    overallScore: { label: "Overall", color: "#4d7aff" },
    semanticScore: { label: "Semantic", color: "#8b6ef5" },
    trustScore: { label: "Trust", color: "#f5b429" },
    discoverabilityScore: { label: "Discoverability", color: "#16b98c" },
    schemaScore: { label: "Schema", color: "#5ed8b4" },
    contentScore: { label: "Content", color: "#f0683a" },
};

const PLATFORM_ICONS: Record<string, string> = {
    chatgpt: "🤖", perplexity: "🔍", amazonRufus: "📦",
    gemini: "✦", default: "🌐",
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    HIGH: { color: "#f0683a", bg: "rgba(240,104,58,0.10)", label: "High Priority" },
    MEDIUM: { color: "#f5b429", bg: "rgba(245,180,41,0.10)", label: "Medium Priority" },
    LOW: { color: "#16b98c", bg: "rgba(22,185,140,0.10)", label: "Low Priority" },
};

// ─── Score arc card ───────────────────────────────────────────────────────────
function ScoreArc({ label, value, color }: { label: string; value: number; color: string }) {
    const r = 28, circ = 2 * Math.PI * r;
    const pct = Math.min(Math.max(value ?? 0, 0), 100);
    return (
        <div style={{
            background: "#0b1120", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "18px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            transition: "border-color 0.2s",
        }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
        >
            <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle
                    cx="36" cy="36" r={r} fill="none"
                    stroke={color} strokeWidth="5"
                    strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                    strokeLinecap="round" transform="rotate(-90 36 36)"
                    style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
                />
                <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="700"
                    fontFamily="'Syne', sans-serif" fill={color}>{pct}</text>
            </svg>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, textAlign: "center" }}>{label}</div>
        </div>
    );
}

// ─── Platform visibility card ─────────────────────────────────────────────────
function PlatformCard({ platform, value }: { platform: string; value: unknown }) {
    const icon = PLATFORM_ICONS[platform] ?? PLATFORM_ICONS.default;
    const str = String(value ?? "—");
    const isScore = typeof value === "number";
    const color = isScore ? (value >= 70 ? "#16b98c" : value >= 50 ? "#4d7aff" : value >= 30 ? "#f5b429" : "#f0683a") : "#64748b";
    const label = platform.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    return (
        <div style={{
            background: "#0b1120", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "20px 20px",
            display: "flex", alignItems: "center", gap: 14,
            transition: "border-color 0.2s",
        }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
        >
            <div style={{
                width: 40, height: 40, borderRadius: 10, fontSize: 18, flexShrink: 0,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 4 }}>{label}</div>
                <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: isScore ? 26 : 15,
                    fontWeight: 800, letterSpacing: "-0.03em", color,
                }}>{str}</div>
            </div>
            {isScore && (
                <div style={{
                    width: 4, height: 40, borderRadius: 99,
                    background: `linear-gradient(180deg, ${color}, ${color}30)`,
                    flexShrink: 0,
                }} />
            )}
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonBlock({ h = 80, w = "100%" }: { h?: number; w?: string }) {
    return (
        <div style={{
            height: h, width: w, borderRadius: 10,
            background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
            backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite",
        }} />
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { data: analysis, isLoading, isError } = useQuery({
        queryKey: ["product-analysis", productId],
        queryFn: () => getProductAnalysis(productId),
    });

    const ai = analysis?.aiInsights;
    const scores = analysis?.scores ?? {};
    const priority = ai?.improvementPriority ?? "MEDIUM";
    const priCfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
    const overallScore = scores.overallScore ?? 0;
    const overallColor = overallScore >= 80 ? "#16b98c" : overallScore >= 60 ? "#4d7aff" : overallScore >= 40 ? "#f5b429" : "#f0683a";

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .pdp-root { display:flex;flex-direction:column;gap:28px;font-family:'DM Sans',sans-serif;color:#e8edf5;animation:fadeUp 0.4s ease both; }

        .pdp-hero {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:26px 28px;
          display:flex;align-items:flex-start;gap:24px;
          position:relative;overflow:hidden;
        }
        .pdp-hero::before {
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 0% 0%,rgba(77,122,255,0.08),transparent 60%);
          pointer-events:none;
        }
        .pdp-hero-score {
          flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:6px;
        }
        .pdp-score-big {
          font-family:'Syne',sans-serif;font-size:52px;font-weight:800;
          letter-spacing:-0.05em;line-height:1;
        }
        .pdp-score-label { font-size:11px;color:#2d3748;text-transform:uppercase;letter-spacing:0.08em; }

        .pdp-hero-info { flex:1;min-width:0; }
        .pdp-title {
          font-family:'Syne',sans-serif;font-size:22px;font-weight:800;
          letter-spacing:-0.03em;color:#e8edf5;margin-bottom:10px;line-height:1.2;
        }
        .pdp-summary { font-size:13.5px;color:#64748b;line-height:1.65;max-width:620px; }
        .pdp-chips { display:flex;gap:8px;flex-wrap:wrap;margin-top:14px; }
        .pdp-chip {
          display:inline-flex;align-items:center;gap:5px;
          padding:4px 11px;border-radius:100px;
          font-size:11px;font-weight:600;letter-spacing:0.04em;
        }

        /* Score arcs grid */
        .pdp-arcs { display:grid;grid-template-columns:repeat(6,1fr);gap:12px; }
        @media(max-width:1000px){ .pdp-arcs{grid-template-columns:repeat(3,1fr);} }
        @media(max-width:600px) { .pdp-arcs{grid-template-columns:repeat(2,1fr);} }

        /* Platform grid */
        .pdp-platforms { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
        @media(max-width:800px){ .pdp-platforms{grid-template-columns:1fr 1fr;} }

        /* Two-col panel */
        .pdp-two { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        @media(max-width:760px){ .pdp-two{grid-template-columns:1fr;} }

        /* Panel */
        .pdp-panel {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:22px 24px;
        }
        .pdp-panel-title {
          font-family:'Syne',sans-serif;font-size:13px;font-weight:700;
          letter-spacing:-0.01em;margin-bottom:16px;
        }

        /* Item rows */
        .pdp-issue-item {
          display:flex;align-items:flex-start;gap:9px;
          background:rgba(240,104,58,0.04);border:1px solid rgba(240,104,58,0.10);
          border-radius:9px;padding:11px 13px;margin-bottom:8px;
          font-size:12.5px;color:#e8edf5;line-height:1.55;
        }
        .pdp-issue-dot { width:6px;height:6px;border-radius:50%;background:#f0683a;flex-shrink:0;margin-top:5px; }

        .pdp-rec-item {
          display:flex;align-items:flex-start;gap:9px;
          background:rgba(77,122,255,0.04);border:1px solid rgba(77,122,255,0.10);
          border-radius:9px;padding:11px 13px;margin-bottom:8px;
          font-size:12.5px;color:#e8edf5;line-height:1.55;
        }
        .pdp-rec-dot { width:6px;height:6px;border-radius:50%;background:#4d7aff;flex-shrink:0;margin-top:5px; }

        /* Semantic gaps */
        .pdp-gaps { display:flex;flex-wrap:wrap;gap:7px;margin-top:2px; }
        .pdp-gap-chip {
          font-size:11.5px;color:#f5b429;
          background:rgba(245,180,41,0.07);border:1px solid rgba(245,180,41,0.18);
          border-radius:100px;padding:4px 12px;
        }

        /* AI content cards */
        .pdp-ai-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        @media(max-width:760px){ .pdp-ai-grid{grid-template-columns:1fr;} }
        .pdp-ai-card {
          background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);
          border-radius:11px;padding:18px;
        }
        .pdp-ai-label { font-size:10.5px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#2d3748;margin-bottom:10px; }
        .pdp-ai-title { font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#e8edf5;line-height:1.3; }
        .pdp-ai-desc  { font-size:13px;color:#94a3b8;line-height:1.65; }

        /* Simulation ready */
        .pdp-sim {
          display:flex;align-items:center;gap:16px;
          background:rgba(22,185,140,0.05);border:1px solid rgba(22,185,140,0.18);
          border-radius:14px;padding:20px 24px;
        }
        .pdp-sim-icon { font-size:28px;flex-shrink:0; }
        .pdp-sim-title { font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#16b98c;margin-bottom:4px; }
        .pdp-sim-desc  { font-size:13px;color:#4a5568;line-height:1.55; }
        .pdp-sim-btn {
          margin-left:auto;flex-shrink:0;
          background:#4d7aff;color:#fff;border:none;
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
          padding:9px 18px;border-radius:9px;cursor:pointer;
          transition:opacity 0.15s;white-space:nowrap;
        }
        .pdp-sim-btn:hover { opacity:0.85; }

        /* Section header */
        .section-hd    { display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px; }
        .section-title { font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:-0.02em;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;font-size:11px; }

        /* Error */
        .pdp-error { display:flex;align-items:center;gap:10px;background:rgba(245,180,41,0.06);border:1px solid rgba(245,180,41,0.18);border-radius:10px;padding:12px 16px;font-size:13px;color:#f5b429; }
      `}</style>

            <div className="pdp-root">

                {isError && (
                    <div className="pdp-error">⚠ Failed to load product analysis — check your server.</div>
                )}

                {/* ── Hero card ── */}
                <div className="pdp-hero">
                    {isLoading ? (
                        <SkeletonBlock h={100} w="100%" />
                    ) : (
                        <>
                            <div className="pdp-hero-score">
                                <div className="pdp-score-big" style={{ color: overallColor }}>{overallScore}</div>
                                <div className="pdp-score-label">AI Score</div>
                                {/* mini arc */}
                                <svg width="60" height="4" viewBox="0 0 60 4" style={{ marginTop: 6 }}>
                                    <rect width="60" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
                                    <rect width={`${overallScore * 0.6}`} height="4" rx="2" fill={overallColor} />
                                </svg>
                            </div>

                            <div className="pdp-hero-info">
                                <div className="pdp-title">{analysis?.productId?.title ?? "Product Details"}</div>
                                {ai?.summary && <div className="pdp-summary">{ai.summary}</div>}
                                <div className="pdp-chips">
                                    <span className="pdp-chip" style={{ background: priCfg.bg, color: priCfg.color }}>
                                        {priCfg.label}
                                    </span>
                                    {analysis?.issues?.length > 0 && (
                                        <span className="pdp-chip" style={{ background: "rgba(240,104,58,0.10)", color: "#f0683a" }}>
                                            {analysis.issues.length} issue{analysis.issues.length !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                    {analysis?.recommendations?.length > 0 && (
                                        <span className="pdp-chip" style={{ background: "rgba(77,122,255,0.10)", color: "#8aabff" }}>
                                            {analysis.recommendations.length} fix{analysis.recommendations.length !== 1 ? "es" : ""}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ── Score breakdowns ── */}
                <div>
                    <div className="section-hd"><div className="section-title">Score Breakdown</div></div>
                    {isLoading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
                            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonBlock key={i} h={120} />)}
                        </div>
                    ) : (
                        <div className="pdp-arcs">
                            {Object.entries(scores).map(([key, val]) => {
                                const cfg = SCORE_LABELS[key] ?? { label: key.replace(/Score$/, ""), color: "#64748b" };
                                return <ScoreArc key={key} label={cfg.label} value={Number(val)} color={cfg.color} />;
                            })}
                        </div>
                    )}
                </div>

                {/* ── AI Visibility Predictions ── */}
                {(isLoading || Object.keys(ai?.visibilityPrediction ?? {}).length > 0) && (
                    <div>
                        <div className="section-hd"><div className="section-title">AI Platform Visibility</div></div>
                        {isLoading ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                                {[1, 2, 3].map(i => <SkeletonBlock key={i} h={84} />)}
                            </div>
                        ) : (
                            <div className="pdp-platforms">
                                {Object.entries(ai?.visibilityPrediction ?? {}).map(([platform, value]) => (
                                    <PlatformCard key={platform} platform={platform} value={value} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── AI-optimised content ── */}
                {(isLoading || ai?.optimizedTitle || ai?.optimizedDescription) && (
                    <div>
                        <div className="section-hd"><div className="section-title">AI-Optimised Content</div></div>
                        <div className="pdp-ai-grid">
                            {(isLoading || ai?.optimizedTitle) && (
                                <div className="pdp-ai-card">
                                    <div className="pdp-ai-label">Suggested Title</div>
                                    {isLoading ? <SkeletonBlock h={28} /> : <div className="pdp-ai-title">{ai?.optimizedTitle}</div>}
                                </div>
                            )}
                            {(isLoading || ai?.optimizedDescription) && (
                                <div className="pdp-ai-card">
                                    <div className="pdp-ai-label">Suggested Description</div>
                                    {isLoading ? <SkeletonBlock h={72} /> : <div className="pdp-ai-desc">{ai?.optimizedDescription}</div>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Semantic gaps ── */}
                {(isLoading || (ai?.semanticGaps?.length ?? 0) > 0) && (
                    <div className="pdp-panel">
                        <div className="pdp-panel-title" style={{ color: "#f5b429" }}>Missing Semantic Signals</div>
                        {isLoading ? (
                            <div style={{ display: "flex", gap: 8 }}>
                                {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} h={28} w="80px" />)}
                            </div>
                        ) : (
                            <div className="pdp-gaps">
                                {ai?.semanticGaps?.map((gap: string) => (
                                    <span key={gap} className="pdp-gap-chip">{gap}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Issues + Fixes ── */}
                <div className="pdp-two">
                    <div className="pdp-panel">
                        <div className="pdp-panel-title" style={{ color: "#f0683a" }}>AI Visibility Issues</div>
                        {isLoading
                            ? [1, 2, 3].map(i => <SkeletonBlock key={i} h={52} />)
                            : analysis?.issues?.length === 0
                                ? <div style={{ fontSize: 12.5, color: "#2d3748" }}>No issues found.</div>
                                : analysis?.issues?.map((issue: string, i: number) => (
                                    <div className="pdp-issue-item" key={i}>
                                        <span className="pdp-issue-dot" />
                                        {issue}
                                    </div>
                                ))
                        }
                    </div>

                    <div className="pdp-panel">
                        <div className="pdp-panel-title" style={{ color: "#4d7aff" }}>AI Optimization Actions</div>
                        {isLoading
                            ? [1, 2, 3].map(i => <SkeletonBlock key={i} h={52} />)
                            : analysis?.recommendations?.length === 0
                                ? <div style={{ fontSize: 12.5, color: "#2d3748" }}>No recommendations yet.</div>
                                : analysis?.recommendations?.map((rec: string, i: number) => (
                                    <div className="pdp-rec-item" key={i}>
                                        <span className="pdp-rec-dot" />
                                        {rec}
                                    </div>
                                ))
                        }
                    </div>
                </div>

                {/* ── Simulation readiness ── */}
                <div className="pdp-sim">
                    <div className="pdp-sim-icon">🚀</div>
                    <div>
                        <div className="pdp-sim-title">Ready for AI Simulation</div>
                        <div className="pdp-sim-desc">
                            Test this product against real semantic shopping queries across ChatGPT, Perplexity, and Amazon Rufus.
                        </div>
                    </div>
                    <button
                        className="pdp-sim-btn"

                        onClick={() => {

                            const title =
                                analysis?.productId
                                    ?.title || "product";

                            const simulationQuery =
                                `best ${title}`;

                            router.push(

                                `/simulation?product=${encodeURIComponent(title)}&query=${encodeURIComponent(simulationQuery)}`

                            );
                        }}
                    >
                        Run Simulation →
                    </button>
                </div>

            </div>
        </>
    );
}