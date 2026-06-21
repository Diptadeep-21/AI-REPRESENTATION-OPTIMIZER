"use client";

import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/services/reportService";

// ── Helpers ──────────────────────────────────────────────────────────────────
const METRIC_COLORS: Record<string, string> = {
  semanticCoverage:   "#8aa8e8",
  trustSignals:        "#e8a838",
  discoverability:     "#3ecf8e",
  schemaCompleteness:  "#b89ee8",
  contentQuality:      "#5ed8b4",
  imageOptimization:   "#e08a55",
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  HIGH:   { color: "#e05555", bg: "rgba(224,85,85,0.1)"  },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.1)" },
  LOW:    { color: "#3ecf8e", bg: "rgba(62,207,142,0.1)" },
};

function metricLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

// ── Score arc ────────────────────────────────────────────────────────────────
function ScoreArc({ value, color, size = 64 }: { value: number; color: string; size?: number }) {
  const r = size * 0.38, circ = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
  const pct = Math.min(Math.max(value ?? 0, 0), 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="4.5" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="4.5"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.16,1,.3,1)" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={size * 0.21} fontFamily="'DM Serif Display', serif" fill={color}>
        {pct}
      </text>
    </svg>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ h = 60, w = "100%", r = 10 }: { h?: number; w?: string | number; r?: number }) {
  return <div className="skel" style={{ height: h, width: w, borderRadius: r }} />;
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  const summary    = data?.executiveSummary;
  const metrics    = data?.visibilityMetrics ?? {};
  const readiness  = summary?.averageAIReadiness ?? 0;
  const readinessColor =
    readiness >= 70 ? "#3ecf8e" :
    readiness >= 50 ? "#e8a838" :
    "#e05555";

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-optimization-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

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

        .rr-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 32px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .skel {
          background: linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* ── page header ── */
        .rr-hd {
          display: flex; align-items: flex-end; justify-content: space-between;
          padding-bottom: 28px; border-bottom: 1px solid var(--border);
        }
        .rr-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .rr-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .rr-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }
        .rr-download {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--ink); color: var(--bg); border: none;
          font-family: var(--font); font-size: 13.5px; font-weight: 500;
          padding: 11px 22px; border-radius: 10px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s; flex-shrink: 0;
        }
        .rr-download:hover { opacity: 0.85; transform: translateY(-1px); }

        /* ── section header ── */
        .sec-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .sec-title { font-family: var(--font-serif); font-size: 18px; letter-spacing: -0.02em; color: var(--ink); }
        .sec-tag {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink3);
        }
        .sec-count { font-size: 12.5px; color: var(--ink3); font-family: var(--font-mono); }

        /* ── executive summary stats ── */
        .rr-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .rr-stat {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 24px;
          display: flex; align-items: center; gap: 18px;
          transition: border-color 0.2s;
        }
        .rr-stat:hover { border-color: var(--border-mid); }
        .rr-stat-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface2); border: 1px solid var(--border); color: var(--ink2);
        }
        .rr-stat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink3); margin-bottom: 8px; }
        .rr-stat-val { font-family: var(--font-serif); font-size: 36px; letter-spacing: -0.04em; line-height: 1; }
        .rr-stat-sub { font-size: 12px; color: var(--ink3); margin-top: 6px; font-weight: 300; }

        /* ── readiness hero bar ── */
        .rr-readiness {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 18px; padding: 32px 36px;
          display: flex; align-items: center; gap: 32px;
        }
        .rr-readiness-info { flex: 1; }
        .rr-readiness-title { font-family: var(--font-serif); font-size: 19px; letter-spacing: -0.015em; color: var(--ink); margin-bottom: 8px; }
        .rr-readiness-sub { font-size: 13.5px; color: var(--ink2); line-height: 1.6; font-weight: 300; max-width: 560px; }
        .rr-bar-track {
          height: 6px; background: var(--surface2); border: 1px solid var(--border);
          border-radius: 99px; overflow: hidden; margin-top: 18px; max-width: 460px;
        }
        .rr-bar-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

        /* ── metrics grid ── */
        .rr-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .rr-metric {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 20px 22px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.2s;
        }
        .rr-metric:hover { border-color: var(--border-mid); }
        .rr-metric-info { flex: 1; min-width: 0; }
        .rr-metric-label { font-size: 12px; color: var(--ink3); margin-bottom: 7px; }
        .rr-metric-val { font-family: var(--font-serif); font-size: 28px; letter-spacing: -0.03em; line-height: 1; }
        .rr-metric-track {
          height: 4px; background: var(--surface2); border: 1px solid var(--border);
          border-radius: 99px; overflow: hidden; margin-top: 10px;
        }
        .rr-metric-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

        /* ── weak products panel ── */
        .rr-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .rr-thead {
          display: grid; grid-template-columns: 1fr 130px 80px 90px;
          gap: 14px; padding: 13px 24px;
          border-bottom: 1px solid var(--border);
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink3);
        }
        .rr-product-row {
          display: grid; grid-template-columns: 1fr 130px 80px 90px;
          gap: 14px; align-items: center;
          padding: 14px 24px; border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .rr-product-row:last-child { border-bottom: none; }
        .rr-product-row:hover { background: rgba(255,255,255,0.02); }
        .rr-product-id {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: var(--ink3); font-family: var(--font-mono);
        }
        .rr-product-name-wrap { display: flex; align-items: center; gap: 13px; min-width: 0; }
        .rr-product-name { font-size: 13.5px; font-weight: 500; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rr-product-priority-wrap { display: flex; align-items: center; }
        .rr-product-priority { font-size: 10.5px; font-weight: 500; padding: 3px 10px; border-radius: 100px; white-space: nowrap; width: fit-content; }
        .rr-product-score-wrap { display: flex; align-items: center; }
        .rr-product-score { font-family: var(--font-serif); font-size: 20px; letter-spacing: -0.02em; }
        .rr-product-action-wrap { display: flex; align-items: center; }
        .rr-mobile-label { display: none; }
        .rr-fix-btn {
          font-size: 12px; color: var(--ink2); font-weight: 500;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 7px; padding: 6px 13px; cursor: pointer;
          font-family: var(--font); transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .rr-fix-btn:hover { border-color: var(--border-mid); color: var(--ink); }

        .rr-empty { padding: 48px 24px; text-align: center; color: var(--ink3); font-size: 13.5px; }

        /* ── weekly recs ── */
        .rr-recs-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px 26px; }
        .rr-rec-item {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(62,207,142,0.05); border: 1px solid rgba(62,207,142,0.15);
          border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
          font-size: 13.5px; color: var(--ink); line-height: 1.6; font-weight: 300;
        }
        .rr-rec-item:last-child { margin-bottom: 0; }
        .rr-rec-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; margin-top: 6px; }

        /* ── error ── */
        .rr-error {
          display: flex; align-items: center; gap: 10px;
          background: rgba(232,168,56,0.06); border: 1px solid rgba(232,168,56,0.2);
          border-radius: 12px; padding: 13px 18px; font-size: 13px; color: var(--amber);
        }

        /* ── responsive ── */
        @media (max-width: 1000px) {
          .rr-metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .rr-stats { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 760px) {
          .rr-readiness { flex-direction: column; align-items: flex-start; gap: 24px; }
          .rr-thead { display: none; }

          .rr-product-row {
            grid-template-columns: 1fr;
            gap: 0; padding: 16px;
          }
          .rr-product-name-wrap { margin-bottom: 14px; }
          .rr-product-priority-wrap,
          .rr-product-score-wrap,
          .rr-product-action-wrap {
            display: flex; align-items: center; justify-content: space-between;
            padding: 10px 0; border-top: 1px solid var(--border);
          }
          .rr-product-action-wrap { border-top: 1px solid var(--border); margin-top: 4px; }
          .rr-mobile-label {
            display: inline-block; font-size: 11px; color: var(--ink3);
            font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
          }
          .rr-fix-btn { width: auto; }
        }
        @media (max-width: 680px) {
          .rr-root { padding: 24px 20px 60px; gap: 24px; }
          .rr-hd { flex-direction: column; align-items: flex-start; gap: 16px; }
          .rr-stats, .rr-metrics { grid-template-columns: 1fr; }
          .rr-download { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="rr-root">

        {/* ── Page header ── */}
        <div className="rr-hd">
          <div>
            <p className="rr-eyebrow">Insights</p>
            <h1 className="rr-title">Reports</h1>
            <p className="rr-sub">A full breakdown of your store's AI readiness</p>
          </div>
          <button className="rr-download" onClick={handleDownload}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5v7.5M3.5 6.5L7 10l3.5-3.5M2 12.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download full report
          </button>
        </div>

        {isError && (
          <div className="rr-error">⚠ Failed to load report data — check your server connection.</div>
        )}

        {/* ── Executive summary ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Executive summary</h2>
            <span className="sec-tag">Live data</span>
          </div>
          <div className="rr-stats">

            <div className="rr-stat">
              <div className="rr-stat-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2.5" y="4" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M6 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </div>
              <div>
                <div className="rr-stat-label">Total products</div>
                {isLoading
                  ? <Sk h={34} w={60} r={6} />
                  : <div className="rr-stat-val" style={{ color: "var(--blue)" }}>{summary?.totalProducts ?? "—"}</div>
                }
                <div className="rr-stat-sub">in your catalog</div>
              </div>
            </div>

            <div className="rr-stat">
              <div className="rr-stat-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </div>
              <div>
                <div className="rr-stat-label">AI readiness</div>
                {isLoading
                  ? <Sk h={34} w={60} r={6} />
                  : <div className="rr-stat-val" style={{ color: readinessColor }}>{readiness}%</div>
                }
                <div className="rr-stat-sub">avg across store</div>
              </div>
            </div>

            <div className="rr-stat">
              <div className="rr-stat-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9.5 2L4.5 10h4l-1 6L13.5 8h-4l0.5-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="rr-stat-label">High priority issues</div>
                {isLoading
                  ? <Sk h={34} w={60} r={6} />
                  : (
                    <div className="rr-stat-val" style={{ color: (summary?.highPriorityProducts ?? 0) > 0 ? "var(--amber)" : "var(--green)" }}>
                      {summary?.highPriorityProducts ?? "—"}
                    </div>
                  )
                }
                <div className="rr-stat-sub">need immediate action</div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Readiness overview bar ── */}
        <div className="rr-readiness">
          <div className="rr-readiness-info">
            <div className="rr-readiness-title">Overall AI readiness score</div>
            <div className="rr-readiness-sub">
              Measures how well your store is optimised for LLM-powered shopping agents across semantic understanding, trust, and discoverability.
            </div>
            <div className="rr-bar-track">
              <div className="rr-bar-fill" style={{ width: isLoading ? "0%" : `${readiness}%`, background: readinessColor }} />
            </div>
          </div>
          {isLoading
            ? <Sk h={72} w={72} r={72} />
            : <ScoreArc value={readiness} color={readinessColor} size={76} />
          }
        </div>

        {/* ── Visibility metrics ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Visibility metrics</h2>
          </div>
          {isLoading ? (
            <div className="rr-metrics">
              {[1, 2, 3, 4, 5, 6].map((i) => <Sk key={i} h={100} r={14} />)}
            </div>
          ) : (
            <div className="rr-metrics">
              {Object.entries(metrics).map(([key, value]) => {
                const color = METRIC_COLORS[key] ?? "var(--ink2)";
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
                    <ScoreArc value={num} color={color} size={58} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Products requiring optimisation ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Products requiring optimisation</h2>
            {!isLoading && <span className="sec-count">{data?.weakProducts?.length ?? 0} products</span>}
          </div>
          <div className="rr-panel">
            <div className="rr-thead">
              <div>Product</div><div>Priority</div><div>Score</div><div></div>
            </div>

            {isLoading ? (
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map((i) => <Sk key={i} h={48} r={10} />)}
              </div>
            ) : !data?.weakProducts?.length ? (
              <div className="rr-empty">No products need optimisation right now — nice work.</div>
            ) : (
              data.weakProducts.map((product: any, i: number) => {
                const pri = product.priority ?? "MEDIUM";
                const priCfg = PRIORITY_CONFIG[pri] ?? PRIORITY_CONFIG.MEDIUM;
                const score = product.score ?? 0;
                const sColor =
                  score >= 70 ? "var(--green)" :
                  score >= 50 ? "var(--amber)" :
                  "var(--red)";
                return (
                  <div className="rr-product-row" key={i}>
                    <div className="rr-product-name-wrap">
                      <div className="rr-product-id">{i + 1}</div>
                      <span className="rr-product-name">{product.title}</span>
                    </div>
                    <div className="rr-product-priority-wrap">
                      <span className="rr-mobile-label">Priority</span>
                      <span className="rr-product-priority" style={{ background: priCfg.bg, color: priCfg.color }}>
                        {pri}
                      </span>
                    </div>
                    <div className="rr-product-score-wrap">
                      <span className="rr-mobile-label">Score</span>
                      <span className="rr-product-score" style={{ color: sColor }}>{score}</span>
                    </div>
                    <div className="rr-product-action-wrap">
                      <button className="rr-fix-btn">
                        Fix
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ marginLeft: 5, display: "inline" }}>
                          <path d="M2 5.5h7M6.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
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
            <div className="sec-hd">
              <h2 className="sec-title">Weekly AI recommendations</h2>
            </div>
            <div className="rr-recs-panel">
              {isLoading
                ? [1, 2, 3].map((i) => <Sk key={i} h={52} r={10} />)
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

      </div>
    </>
  );
}