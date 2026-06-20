"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getProductAnalysis } from "@/services/productAnalysisService";

// ── Score key formatting ────────────────────────────────────────────────────
const SCORE_LABELS: Record<string, { label: string; color: string }> = {
  overallScore:         { label: "Overall",         color: "#8aa8e8" },
  semanticScore:        { label: "Semantic",        color: "#b89ee8" },
  trustScore:           { label: "Trust",           color: "#e8a838" },
  discoverabilityScore: { label: "Discoverability", color: "#3ecf8e" },
  schemaScore:          { label: "Schema",          color: "#5ed8b4" },
  contentScore:         { label: "Content",         color: "#e08a55" },
};

const PLATFORM_ICONS: Record<string, string> = {
  chatgpt: "◐", perplexity: "◑", amazonRufus: "◒",
  gemini: "◓", default: "○",
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  HIGH:   { color: "#e05555", bg: "rgba(224,85,85,0.1)", label: "High priority"   },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.1)", label: "Medium priority" },
  LOW:    { color: "#3ecf8e", bg: "rgba(62,207,142,0.1)", label: "Low priority"    },
};

// ── Score arc card ──────────────────────────────────────────────────────────
function ScoreArc({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 29, circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value ?? 0, 0), 100);
  return (
    <div className="arc-card">
      <svg width="74" height="74" viewBox="0 0 74 74">
        <circle cx="37" cy="37" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="37" cy="37" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          strokeLinecap="round" transform="rotate(-90 37 37)"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.16,1,.3,1)" }}
        />
        <text x="37" y="42" textAnchor="middle" fontSize="15" fontFamily="'DM Serif Display', serif" fill={color}>
          {pct}
        </text>
      </svg>
      <div className="arc-label">{label}</div>
    </div>
  );
}

// ── Platform visibility card ────────────────────────────────────────────────
function PlatformCard({ platform, value }: { platform: string; value: unknown }) {
  const icon = PLATFORM_ICONS[platform] ?? PLATFORM_ICONS.default;
  const str = String(value ?? "—");
  const isScore = typeof value === "number";
  const color = isScore
    ? (value >= 70 ? "#3ecf8e" : value >= 50 ? "#8aa8e8" : value >= 30 ? "#e8a838" : "#e05555")
    : "var(--ink2)";
  const label = platform.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  return (
    <div className="platform-card">
      <div className="platform-icon">{icon}</div>
      <div className="platform-info">
        <div className="platform-label">{label}</div>
        <div className="platform-val" style={{ color, fontSize: isScore ? 26 : 15 }}>{str}</div>
      </div>
      {isScore && <div className="platform-bar" style={{ background: `linear-gradient(180deg, ${color}, ${color}20)` }} />}
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonBlock({ h = 80, w = "100%" }: { h?: number; w?: string }) {
  return <div className="skel" style={{ height: h, width: w }} />;
}

// ── Main ─────────────────────────────────────────────────────────────────────
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
  const overallColor =
    overallScore >= 80 ? "#3ecf8e" :
    overallScore >= 60 ? "#8aa8e8" :
    overallScore >= 40 ? "#e8a838" :
    "#e05555";

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

        .pdp-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 32px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .skel {
          border-radius: 12px;
          background: linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* ── back link ── */
        .pdp-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--ink2); cursor: pointer;
          background: none; border: none; font-family: var(--font);
          transition: color 0.2s; padding: 0; width: fit-content;
        }
        .pdp-back:hover { color: var(--ink); }

        /* ── hero card ── */
        .pdp-hero {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 18px; padding: 32px 36px;
          display: flex; align-items: flex-start; gap: 32px;
        }
        .pdp-hero-score {
          flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding-right: 32px; border-right: 1px solid var(--border);
        }
        .pdp-score-big {
          font-family: var(--font-serif); font-size: 56px;
          letter-spacing: -0.04em; line-height: 1;
        }
        .pdp-score-label { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

        .pdp-hero-info { flex: 1; min-width: 0; }
        .pdp-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 10px;
        }
        .pdp-title {
          font-family: var(--font-serif);
          font-size: 28px; letter-spacing: -0.025em; color: var(--ink);
          margin-bottom: 12px; line-height: 1.15;
        }
        .pdp-summary { font-size: 14px; color: var(--ink2); line-height: 1.65; max-width: 640px; font-weight: 300; }
        .pdp-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
        .pdp-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 100px;
          font-size: 11.5px; font-weight: 500; letter-spacing: 0.02em;
        }

        /* ── section header ── */
        .sec-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .sec-title {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3);
        }

        /* ── score arcs ── */
        .pdp-arcs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
        .arc-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 20px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          transition: border-color 0.2s;
        }
        .arc-card:hover { border-color: var(--border-mid); }
        .arc-label {
          font-size: 11px; color: var(--ink3); text-transform: uppercase;
          letter-spacing: 0.06em; font-weight: 500; text-align: center;
        }

        /* ── platform grid ── */
        .pdp-platforms { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .platform-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 20px 22px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.2s;
        }
        .platform-card:hover { border-color: var(--border-mid); }
        .platform-icon {
          width: 42px; height: 42px; border-radius: 11px;
          font-size: 18px; flex-shrink: 0;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink2);
        }
        .platform-info { flex: 1; min-width: 0; }
        .platform-label { font-size: 12px; color: var(--ink3); margin-bottom: 5px; }
        .platform-val { font-family: var(--font-serif); letter-spacing: -0.02em; }
        .platform-bar { width: 4px; height: 42px; border-radius: 99px; flex-shrink: 0; }

        /* ── two-col panels ── */
        .pdp-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .pdp-panel {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px 26px;
        }
        .pdp-panel-title {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 16px;
        }

        /* item rows */
        .pdp-issue-item {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(224,85,85,0.05); border: 1px solid rgba(224,85,85,0.15);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 8px;
          font-size: 13px; color: var(--ink); line-height: 1.55; font-weight: 300;
        }
        .pdp-issue-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); flex-shrink: 0; margin-top: 6px; }

        .pdp-rec-item {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(138,168,232,0.05); border: 1px solid rgba(138,168,232,0.15);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 8px;
          font-size: 13px; color: var(--ink); line-height: 1.55; font-weight: 300;
        }
        .pdp-rec-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; margin-top: 6px; }

        .pdp-empty-note { font-size: 13px; color: var(--ink3); font-weight: 300; }

        /* ── semantic gaps ── */
        .pdp-gaps { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }
        .pdp-gap-chip {
          font-size: 12px; color: var(--amber);
          background: rgba(232,168,56,0.08); border: 1px solid rgba(232,168,56,0.2);
          border-radius: 100px; padding: 5px 13px; font-weight: 400;
        }

        /* ── AI content cards ── */
        .pdp-ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .pdp-ai-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 22px 24px;
        }
        .pdp-ai-label {
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 12px;
        }
        .pdp-ai-title {
          font-family: var(--font-serif); font-size: 18px;
          letter-spacing: -0.02em; color: var(--ink); line-height: 1.3;
        }
        .pdp-ai-desc { font-size: 13.5px; color: var(--ink2); line-height: 1.65; font-weight: 300; }

        /* ── simulation cta ── */
        .pdp-sim {
          display: flex; align-items: center; gap: 20px;
          background: var(--surface); border: 1px solid rgba(62,207,142,0.2);
          border-radius: 18px; padding: 26px 30px;
        }
        .pdp-sim-icon {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          background: rgba(62,207,142,0.1); border: 1px solid rgba(62,207,142,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 19px;
        }
        .pdp-sim-title { font-family: var(--font-serif); font-size: 17px; color: var(--green); margin-bottom: 5px; letter-spacing: -0.01em; }
        .pdp-sim-desc { font-size: 13.5px; color: var(--ink2); line-height: 1.55; font-weight: 300; max-width: 520px; }
        .pdp-sim-btn {
          margin-left: auto; flex-shrink: 0;
          background: var(--ink); color: var(--bg); border: none;
          font-family: var(--font); font-size: 13.5px; font-weight: 500;
          padding: 11px 22px; border-radius: 10px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s; white-space: nowrap;
        }
        .pdp-sim-btn:hover { opacity: 0.85; transform: translateY(-1px); }

        /* ── error ── */
        .pdp-error {
          display: flex; align-items: center; gap: 10px;
          background: rgba(232,168,56,0.06); border: 1px solid rgba(232,168,56,0.2);
          border-radius: 12px; padding: 13px 18px; font-size: 13px; color: var(--amber);
        }

        /* ── responsive ── */
        @media (max-width: 1000px) {
          .pdp-arcs { grid-template-columns: repeat(3, 1fr); }
          .pdp-platforms { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 760px) {
          .pdp-two, .pdp-ai-grid { grid-template-columns: 1fr; }
          .pdp-hero { flex-direction: column; gap: 20px; }
          .pdp-hero-score { flex-direction: row; border-right: none; border-bottom: 1px solid var(--border); padding: 0 0 16px; width: 100%; justify-content: flex-start; gap: 14px; }
        }
        @media (max-width: 600px) {
          .pdp-root { padding: 24px 20px 60px; gap: 24px; }
          .pdp-arcs { grid-template-columns: repeat(2, 1fr); }
          .pdp-platforms { grid-template-columns: 1fr; }
          .pdp-hero { padding: 24px; }
          .pdp-sim { flex-direction: column; align-items: flex-start; gap: 16px; }
          .pdp-sim-btn { margin-left: 0; width: 100%; }
        }
      `}</style>

      <div className="pdp-root">

        <button className="pdp-back" onClick={() => router.push("/products")}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.5 3L4 7l4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to products
        </button>

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
                <div className="pdp-score-label">AI score</div>
              </div>

              <div className="pdp-hero-info">
                <p className="pdp-eyebrow">Product analysis</p>
                <div className="pdp-title">{analysis?.productId?.title ?? "Product details"}</div>
                {ai?.summary && <div className="pdp-summary">{ai.summary}</div>}
                <div className="pdp-chips">
                  <span className="pdp-chip" style={{ background: priCfg.bg, color: priCfg.color }}>
                    {priCfg.label}
                  </span>
                  {analysis?.issues?.length > 0 && (
                    <span className="pdp-chip" style={{ background: "rgba(224,85,85,0.1)", color: "var(--red)" }}>
                      {analysis.issues.length} issue{analysis.issues.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {analysis?.recommendations?.length > 0 && (
                    <span className="pdp-chip" style={{ background: "rgba(138,168,232,0.1)", color: "var(--blue)" }}>
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
          <div className="sec-hd"><span className="sec-title">Score breakdown</span></div>
          {isLoading ? (
            <div className="pdp-arcs">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonBlock key={i} h={130} />)}
            </div>
          ) : (
            <div className="pdp-arcs">
              {Object.entries(scores).map(([key, val]) => {
                const cfg = SCORE_LABELS[key] ?? { label: key.replace(/Score$/, ""), color: "var(--ink2)" };
                return <ScoreArc key={key} label={cfg.label} value={Number(val)} color={cfg.color} />;
              })}
            </div>
          )}
        </div>

        {/* ── AI Visibility Predictions ── */}
        {(isLoading || Object.keys(ai?.visibilityPrediction ?? {}).length > 0) && (
          <div>
            <div className="sec-hd"><span className="sec-title">AI platform visibility</span></div>
            {isLoading ? (
              <div className="pdp-platforms">
                {[1, 2, 3].map((i) => <SkeletonBlock key={i} h={88} />)}
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
            <div className="sec-hd"><span className="sec-title">AI-optimised content</span></div>
            <div className="pdp-ai-grid">
              {(isLoading || ai?.optimizedTitle) && (
                <div className="pdp-ai-card">
                  <div className="pdp-ai-label">Suggested title</div>
                  {isLoading ? <SkeletonBlock h={28} /> : <div className="pdp-ai-title">{ai?.optimizedTitle}</div>}
                </div>
              )}
              {(isLoading || ai?.optimizedDescription) && (
                <div className="pdp-ai-card">
                  <div className="pdp-ai-label">Suggested description</div>
                  {isLoading ? <SkeletonBlock h={72} /> : <div className="pdp-ai-desc">{ai?.optimizedDescription}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Semantic gaps ── */}
        {(isLoading || (ai?.semanticGaps?.length ?? 0) > 0) && (
          <div className="pdp-panel">
            <div className="pdp-panel-title" style={{ color: "var(--amber)" }}>Missing semantic signals</div>
            {isLoading ? (
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3, 4].map((i) => <SkeletonBlock key={i} h={28} w="80px" />)}
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
            <div className="pdp-panel-title" style={{ color: "var(--red)" }}>AI visibility issues</div>
            {isLoading
              ? [1, 2, 3].map((i) => <SkeletonBlock key={i} h={52} />)
              : analysis?.issues?.length === 0
                ? <div className="pdp-empty-note">No issues found.</div>
                : analysis?.issues?.map((issue: string, i: number) => (
                  <div className="pdp-issue-item" key={i}>
                    <span className="pdp-issue-dot" />
                    {issue}
                  </div>
                ))
            }
          </div>

          <div className="pdp-panel">
            <div className="pdp-panel-title" style={{ color: "var(--blue)" }}>AI optimization actions</div>
            {isLoading
              ? [1, 2, 3].map((i) => <SkeletonBlock key={i} h={52} />)
              : analysis?.recommendations?.length === 0
                ? <div className="pdp-empty-note">No recommendations yet.</div>
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
          <div className="pdp-sim-icon">↗</div>
          <div>
            <div className="pdp-sim-title">Ready for AI simulation</div>
            <div className="pdp-sim-desc">
              Test this product against real semantic shopping queries across ChatGPT, Perplexity, and Amazon Rufus.
            </div>
          </div>
          <button
            className="pdp-sim-btn"
            onClick={() => {
              const title = analysis?.productId?.title || "product";
              const simulationQuery = `best ${title}`;
              router.push(`/simulation?product=${encodeURIComponent(title)}&query=${encodeURIComponent(simulationQuery)}`);
            }}
          >
            Run simulation →
          </button>
        </div>

      </div>
    </>
  );
}