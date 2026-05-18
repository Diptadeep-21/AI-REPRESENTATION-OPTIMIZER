"use client";

import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/services/reportService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const METRIC_COLORS: Record<string, string> = {
    semanticCoverage: "#4d7aff",
    trustSignals: "#f5b429",
    discoverability: "#16b98c",
    schemaCompleteness: "#8b6ef5",
    contentQuality: "#5ed8b4",
    imageOptimization: "#f0683a",
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
    HIGH: { color: "#f0683a", bg: "rgba(240,104,58,0.10)" },
    MEDIUM: { color: "#f5b429", bg: "rgba(245,180,41,0.10)" },
    LOW: { color: "#16b98c", bg: "rgba(22,185,140,0.10)" },
};

function metricLabel(key: string) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());
}

// ─── Score arc ────────────────────────────────────────────────────────────────
function ScoreArc({ value, color, size = 64 }: { value: number; color: string; size?: number }) {
    const r = size * 0.38, circ = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
    const pct = Math.min(Math.max(value ?? 0, 0), 100);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" />
            <circle
                cx={cx} cy={cy} r={r} fill="none"
                stroke={color} strokeWidth="4.5"
                strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size * 0.19} fontWeight="700"
                fontFamily="'Syne', sans-serif" fill={color}>{pct}</text>
        </svg>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ h = 60, w = "100%", r = 10 }: { h?: number; w?: string | number; r?: number }) {
    return (
        <div style={{
            height: h, width: w, borderRadius: r, flexShrink: 0,
            background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
            backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite",
        }} />
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["reports"],
        queryFn: getReports,
    });

    const summary = data?.executiveSummary;
    const metrics = data?.visibilityMetrics ?? {};
    const readiness = summary?.averageAIReadiness ?? 0;
    const readinessColor = readiness >= 70 ? "#16b98c" : readiness >= 50 ? "#f5b429" : "#f0683a";

    const handleDownload =
        () => {

            if (!data) return;

            const blob =
                new Blob(

                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],

                    {
                        type:
                            "application/json",
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const a =
                document.createElement(
                    "a"
                );

            a.href = url;

            a.download =
                "ai-optimization-report.json";

            a.click();

            URL.revokeObjectURL(
                url
            );
        };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .rr-root { display:flex;flex-direction:column;gap:28px;font-family:'DM Sans',sans-serif;color:#e8edf5;animation:fadeUp 0.4s ease both; }

        /* Executive summary cards */
        .rr-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
        @media(max-width:800px){ .rr-stats{grid-template-columns:1fr 1fr;} }
        .rr-stat {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:22px;
          display:flex;align-items:center;gap:16px;
          position:relative;overflow:hidden;
          transition:border-color 0.2s;
        }
        .rr-stat:hover { border-color:rgba(255,255,255,0.11); }
        .rr-stat::before {
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 0% 0%,var(--stat-glow,rgba(77,122,255,0.06)),transparent 60%);
          pointer-events:none;
        }
        .rr-stat-icon {
          width:42px;height:42px;border-radius:11px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;font-size:20px;
        }
        .rr-stat-label { font-size:11.5px;color:#64748b;margin-bottom:5px; }
        .rr-stat-val {
          font-family:'Syne',sans-serif;font-size:34px;font-weight:800;
          letter-spacing:-0.05em;line-height:1;
        }
        .rr-stat-sub { font-size:11px;color:#2d3748;margin-top:4px; }

        /* Readiness hero bar */
        .rr-readiness {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:22px 26px;
          display:flex;align-items:center;gap:24px;
          position:relative;overflow:hidden;
        }
        .rr-readiness::before {
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 50% 0%,rgba(77,122,255,0.07),transparent 60%);
          pointer-events:none;
        }
        .rr-readiness-info { flex:1; }
        .rr-readiness-title { font-family:'Syne',sans-serif;font-size:15px;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px; }
        .rr-readiness-sub   { font-size:12.5px;color:#64748b;line-height:1.5; }
        .rr-bar-track { height:6px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden;margin-top:14px;max-width:440px; }
        .rr-bar-fill  { height:100%;border-radius:99px;transition:width 1s cubic-bezier(.4,0,.2,1); }

        /* Metrics grid */
        .rr-metrics { display:grid;grid-template-columns:repeat(3,1fr);gap:14px; }
        @media(max-width:900px){ .rr-metrics{grid-template-columns:repeat(2,1fr);} }
        .rr-metric {
          background:#0b1120;border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;padding:18px 20px;
          display:flex;align-items:center;gap:16px;
          transition:border-color 0.2s;
        }
        .rr-metric:hover { border-color:rgba(255,255,255,0.11); }
        .rr-metric-info { flex:1;min-width:0; }
        .rr-metric-label { font-size:12px;color:#64748b;margin-bottom:6px; }
        .rr-metric-val {
          font-family:'Syne',sans-serif;font-size:26px;font-weight:800;
          letter-spacing:-0.04em;line-height:1;
        }
        .rr-metric-track { height:4px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden;margin-top:8px; }
        .rr-metric-fill  { height:100%;border-radius:99px; }

        /* Weak products panel */
        .rr-panel { background:#0b1120;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden; }
        .rr-panel-hd {
          padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);
          display:flex;align-items:center;justify-content:space-between;
        }
        .rr-panel-title { font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:-0.02em; }

        .rr-product-row {
          display:flex;align-items:center;gap:14px;
          padding:14px 22px;border-bottom:1px solid rgba(255,255,255,0.04);
          transition:background 0.15s;
        }
        .rr-product-row:last-child { border-bottom:none; }
        .rr-product-row:hover { background:rgba(255,255,255,0.02); }
        .rr-product-name { flex:1;font-size:13px;font-weight:500;color:#e8edf5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .rr-product-priority {
          font-size:10.5px;font-weight:600;padding:3px 9px;
          border-radius:100px;flex-shrink:0;
        }
        .rr-product-score {
          font-family:'Syne',sans-serif;font-size:20px;font-weight:800;
          letter-spacing:-0.03em;flex-shrink:0;
        }

        /* Weekly recs */
        .rr-rec-item {
          display:flex;align-items:flex-start;gap:10px;
          background:rgba(22,185,140,0.04);border:1px solid rgba(22,185,140,0.10);
          border-radius:10px;padding:13px 16px;margin-bottom:9px;
          font-size:13px;color:#e8edf5;line-height:1.6;
        }
        .rr-rec-dot { width:6px;height:6px;border-radius:50%;background:#16b98c;flex-shrink:0;margin-top:5px; }

        /* Section header */
        .section-hd    { display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px; }
        .section-title { font-family:'Syne',sans-serif;font-size:14px;font-weight:700;letter-spacing:-0.02em; }
        .section-sub   { font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;font-weight:600; }

        /* Download btn */
        .rr-download {
          display:inline-flex;align-items:center;gap:8px;
          background:#4d7aff;color:#fff;border:none;
          font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;
          padding:11px 24px;border-radius:10px;cursor:pointer;
          transition:opacity 0.15s,box-shadow 0.15s;
        }
        .rr-download:hover { opacity:0.87;box-shadow:0 0 20px rgba(77,122,255,0.35); }

        /* Error */
        .rr-error { display:flex;align-items:center;gap:10px;background:rgba(245,180,41,0.06);border:1px solid rgba(245,180,41,0.18);border-radius:10px;padding:12px 16px;font-size:13px;color:#f5b429; }
      `}</style>

            <div className="rr-root">

                {isError && (
                    <div className="rr-error">⚠ Failed to load report data — check your server connection.</div>
                )}

                {/* ── Executive summary ── */}
                <div>
                    <div className="section-hd">
                        <div className="section-title">Executive Summary</div>
                        <span className="section-sub">Live data</span>
                    </div>
                    <div className="rr-stats">

                        {/* Total products */}
                        <div className="rr-stat" style={{ "--stat-glow": "rgba(77,122,255,0.07)" } as React.CSSProperties}>
                            <div className="rr-stat-icon" style={{ background: "rgba(77,122,255,0.10)", border: "1px solid rgba(77,122,255,0.18)" }}>📦</div>
                            <div>
                                <div className="rr-stat-label">Total Products</div>
                                {isLoading
                                    ? <Sk h={32} w={60} r={6} />
                                    : <div className="rr-stat-val" style={{ color: "#4d7aff" }}>{summary?.totalProducts ?? "—"}</div>
                                }
                                <div className="rr-stat-sub">in your catalog</div>
                            </div>
                        </div>

                        {/* AI readiness */}
                        <div className="rr-stat" style={{ "--stat-glow": "rgba(22,185,140,0.07)" } as React.CSSProperties}>
                            <div className="rr-stat-icon" style={{ background: "rgba(22,185,140,0.10)", border: "1px solid rgba(22,185,140,0.18)" }}>🎯</div>
                            <div>
                                <div className="rr-stat-label">AI Readiness</div>
                                {isLoading
                                    ? <Sk h={32} w={60} r={6} />
                                    : <div className="rr-stat-val" style={{ color: readinessColor }}>{readiness}%</div>
                                }
                                <div className="rr-stat-sub">avg across store</div>
                            </div>
                        </div>

                        {/* High priority */}
                        <div className="rr-stat" style={{ "--stat-glow": "rgba(240,104,58,0.06)" } as React.CSSProperties}>
                            <div className="rr-stat-icon" style={{ background: "rgba(240,104,58,0.10)", border: "1px solid rgba(240,104,58,0.18)" }}>⚡</div>
                            <div>
                                <div className="rr-stat-label">High Priority Issues</div>
                                {isLoading
                                    ? <Sk h={32} w={60} r={6} />
                                    : <div className="rr-stat-val" style={{ color: (summary?.highPriorityProducts ?? 0) > 0 ? "#f0683a" : "#16b98c" }}>
                                        {summary?.highPriorityProducts ?? "—"}
                                    </div>
                                }
                                <div className="rr-stat-sub">need immediate action</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Readiness overview bar ── */}
                <div className="rr-readiness">
                    <div className="rr-readiness-info">
                        <div className="rr-readiness-title">Overall AI Readiness Score</div>
                        <div className="rr-readiness-sub">
                            Measures how well your store is optimised for LLM-powered shopping agents across semantic understanding, trust, and discoverability.
                        </div>
                        <div className="rr-bar-track">
                            <div className="rr-bar-fill" style={{ width: isLoading ? "0%" : `${readiness}%`, background: readinessColor }} />
                        </div>
                    </div>
                    {isLoading
                        ? <Sk h={64} w={64} r={64} />
                        : <ScoreArc value={readiness} color={readinessColor} size={72} />
                    }
                </div>

                {/* ── Visibility metrics ── */}
                <div>
                    <div className="section-hd">
                        <div className="section-title">Visibility Metrics</div>
                    </div>
                    {isLoading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                            {[1, 2, 3, 4, 5, 6].map(i => <Sk key={i} h={100} />)}
                        </div>
                    ) : (
                        <div className="rr-metrics">
                            {Object.entries(metrics).map(([key, value]) => {
                                const color = METRIC_COLORS[key] ?? "#64748b";
                                const num = typeof value === "number" ? value : parseFloat(String(value)) || 0;
                                return (
                                    <div className="rr-metric" key={key}>
                                        <div className="rr-metric-info">
                                            <div className="rr-metric-label">{metricLabel(key)}</div>
                                            <div className="rr-metric-val" style={{ color }}>{num}%</div>
                                            <div className="rr-metric-track">
                                                <div className="rr-metric-fill" style={{ width: `${num}%`, background: color }} />
                                            </div>
                                        </div>
                                        <ScoreArc value={num} color={color} size={56} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Products requiring optimisation ── */}
                <div>
                    <div className="section-hd">
                        <div className="section-title">Products Requiring Optimisation</div>
                        {!isLoading && <span style={{ fontSize: 12, color: "#64748b" }}>{data?.weakProducts?.length ?? 0} products</span>}
                    </div>
                    <div className="rr-panel">
                        {/* Table header */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 120px 80px 60px",
                            gap: 12, padding: "11px 22px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em",
                            textTransform: "uppercase", color: "#2d3748",
                        }}>
                            <div>Product</div><div>Priority</div><div>Score</div><div></div>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                                {[1, 2, 3].map(i => <Sk key={i} h={48} />)}
                            </div>
                        ) : !data?.weakProducts?.length ? (
                            <div style={{ padding: "40px 22px", textAlign: "center", color: "#2d3748", fontSize: 13 }}>
                                No products need optimisation right now 🎉
                            </div>
                        ) : (
                            data.weakProducts.map((product: any, i: number) => {
                                const pri = product.priority ?? "MEDIUM";
                                const priCfg = PRIORITY_CONFIG[pri] ?? PRIORITY_CONFIG.MEDIUM;
                                const score = product.score ?? 0;
                                const sColor = score >= 70 ? "#16b98c" : score >= 50 ? "#f5b429" : "#f0683a";
                                return (
                                    <div className="rr-product-row" key={i}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 13, color: "#2d3748", fontWeight: 700,
                                            }}>{i + 1}</div>
                                            <span className="rr-product-name">{product.title}</span>
                                        </div>
                                        <div>
                                            <span className="rr-product-priority" style={{ background: priCfg.bg, color: priCfg.color }}>
                                                {pri}
                                            </span>
                                        </div>
                                        <div className="rr-product-score" style={{ color: sColor }}>{score}</div>
                                        <div>
                                            <button style={{
                                                fontSize: 11.5, color: "#4d7aff", fontWeight: 500,
                                                background: "rgba(77,122,255,0.08)", border: "1px solid rgba(77,122,255,0.15)",
                                                borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                                                fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s",
                                            }}
                                                onMouseEnter={e => ((e.target as HTMLElement).style.background = "rgba(77,122,255,0.15)")}
                                                onMouseLeave={e => ((e.target as HTMLElement).style.background = "rgba(77,122,255,0.08)")}
                                            >Fix →</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Weekly AI recommendations ── */}
                {(isLoading || (data?.weeklyRecommendations?.length ?? 0) > 0) && (
                    <div>
                        <div className="section-hd">
                            <div className="section-title">Weekly AI Recommendations</div>
                        </div>
                        <div style={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
                            {isLoading
                                ? [1, 2, 3].map(i => <Sk key={i} h={52} r={10} />)
                                : data?.weeklyRecommendations?.map((rec: string, i: number) => (
                                    <div className="rr-rec-item" key={i}>
                                        <span className="rr-rec-dot" />
                                        {rec}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* ── Download ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 8 }}>
                    <button
                        className="rr-download"
                        onClick={handleDownload}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M7.5 2v8M4 7l3.5 3.5L11 7M2.5 13h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download Full Report
                    </button>
                </div>

            </div>
        </>
    );
}