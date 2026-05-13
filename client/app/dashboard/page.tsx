"use client";
import ScoreCard from "@/components/dashboard/ScoreCard";
import { dashboardData } from "@/lib/mockData";

const SEV_CONFIG = {
  critical: { label: "Critical", dot: "#f0683a", bg: "rgba(240,104,58,0.10)", text: "#f0683a" },
  warning:  { label: "Warning",  dot: "#f5b429", bg: "rgba(245,180,41,0.10)", text: "#f5b429" },
  info:     { label: "Info",     dot: "#4d7aff", bg: "rgba(77,122,255,0.10)", text: "#8aabff" },
};

const STATUS_CONFIG = {
  great: { color: "#16b98c", label: "Great" },
  good:  { color: "#4d7aff", label: "Good" },
  warn:  { color: "#f5b429", label: "Needs work" },
  bad:   { color: "#f0683a", label: "Poor" },
};

// Tiny inline sparkline SVG
function Sparkline({ data }: { data: { day: string; score: number }[] }) {
  const W = 160, H = 48, pad = 6;
  const min = Math.min(...data.map((d) => d.score)) - 5;
  const max = Math.max(...data.map((d) => d.score)) + 5;
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - pad * 2));
  const ys = data.map((d) => H - pad - ((d.score - min) / (max - min)) * (H - pad * 2));
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1]},${H} L${xs[0]},${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d7aff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4d7aff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-grad)" />
      <path d={linePath} stroke="#4d7aff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill="#4d7aff" />
    </svg>
  );
}

export default function DashboardPage() {
  const {
    aiReadinessScore = 0,
    discoverabilityScore = 0,
    trustScore = 0,
    comparisonScore = 0,
    weeklyDeltas = { aiReadiness: 0, discoverability: 0, trust: 0, comparison: 0 },
    issueBreakdown = [],
    recentIssues = [],
    weeklyTrend = [],
    topProducts = [],
  } = dashboardData ?? {};
  const criticalCount = recentIssues.filter((i) => i.severity === "critical").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .dash-root {
          min-height: 100vh;
          background: #04070f;
          color: #e8edf5;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Layout */
        .dash-layout { display: flex; min-height: 100vh; }

        /* Sidebar */
        .dash-sidebar {
          width: 220px; flex-shrink: 0;
          background: #080e1a;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
          overflow-y: auto;
        }
        .sidebar-logo {
          padding: 24px 20px 20px;
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 16px;
          letter-spacing: -0.03em;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4d7aff;
          box-shadow: 0 0 10px rgba(77,122,255,0.6);
        }
        .sidebar-nav { padding: 14px 12px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .nav-section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #2d3748;
          padding: 10px 10px 6px;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 8px;
          font-size: 13px; color: #64748b;
          cursor: pointer; transition: background 0.15s, color 0.15s;
          border: 1px solid transparent;
          text-decoration: none;
        }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
        .nav-item.active {
          background: rgba(77,122,255,0.1);
          border-color: rgba(77,122,255,0.2);
          color: #8aabff;
        }
        .nav-icon { font-size: 15px; width: 18px; text-align: center; }
        .nav-badge {
          margin-left: auto; background: rgba(240,104,58,0.15);
          color: #f0683a; font-size: 10px; font-weight: 600;
          padding: 2px 6px; border-radius: 100px;
        }

        /* Main content */
        .dash-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

        /* Top bar */
        .dash-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(4,7,15,0.8);
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-left { display: flex; flex-direction: column; }
        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800;
          letter-spacing: -0.03em; color: #e8edf5;
        }
        .topbar-sub { font-size: 12.5px; color: #64748b; margin-top: 1px; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }

        .btn-sm {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          padding: 8px 14px; border-radius: 8px;
          cursor: pointer; border: none; transition: opacity 0.15s, background 0.15s;
          text-decoration: none;
        }
        .btn-sm.outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
        }
        .btn-sm.outline:hover { border-color: rgba(255,255,255,0.14); color: #e8edf5; }
        .btn-sm.primary { background: #4d7aff; color: #fff; }
        .btn-sm.primary:hover { opacity: 0.85; }

        /* Page body */
        .dash-body { padding: 32px; display: flex; flex-direction: column; gap: 28px; }

        /* Alert banner */
        .alert-banner {
          display: flex; align-items: center; gap: 12px;
          background: rgba(240,104,58,0.08);
          border: 1px solid rgba(240,104,58,0.20);
          border-radius: 10px; padding: 12px 16px;
          font-size: 13.5px;
        }
        .alert-dot { width: 8px; height: 8px; border-radius: 50%; background: #f0683a; flex-shrink: 0; animation: blink 1.8s ease infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .alert-text { color: #f0683a; font-weight: 500; }
        .alert-sub { color: #64748b; margin-left: 4px; font-weight: 400; }
        .alert-action { margin-left: auto; font-size: 12px; color: #f0683a; font-weight: 500; cursor: pointer; white-space: nowrap; text-decoration: underline; }

        /* Score cards grid */
        .scores-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        @media(max-width:900px){ .scores-grid { grid-template-columns: repeat(2,1fr); } }

        /* Section header */
        .section-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: -0.02em;
        }
        .section-link { font-size: 12px; color: #4d7aff; cursor: pointer; text-decoration: none; }
        .section-link:hover { text-decoration: underline; }

        /* Two-col layout */
        .two-col { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
        @media(max-width:1100px){ .two-col { grid-template-columns: 1fr; } }

        /* Panel */
        .panel {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
        }
        .panel-body { padding: 20px 22px; }

        /* Issues table */
        .issue-list { display: flex; flex-direction: column; }
        .issue-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .issue-row:last-child { border-bottom: none; }
        .issue-row:hover { background: rgba(255,255,255,0.02); }
        .issue-sev {
          flex-shrink: 0; padding: 3px 9px; border-radius: 100px;
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em;
          margin-top: 1px;
        }
        .issue-info { flex: 1; min-width: 0; }
        .issue-product { font-size: 13px; font-weight: 500; color: #e8edf5; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .issue-desc { font-size: 12px; color: #64748b; }
        .issue-action {
          flex-shrink: 0; font-size: 11.5px; color: #4d7aff; font-weight: 500;
          background: rgba(77,122,255,0.08); border: 1px solid rgba(77,122,255,0.15);
          border-radius: 6px; padding: 4px 10px; cursor: pointer;
          white-space: nowrap; transition: background 0.15s;
        }
        .issue-action:hover { background: rgba(77,122,255,0.15); }

        /* Category breakdown */
        .cat-list { display: flex; flex-direction: column; gap: 14px; }
        .cat-row { display: flex; flex-direction: column; gap: 6px; }
        .cat-top { display: flex; justify-content: space-between; align-items: center; }
        .cat-label { font-size: 13px; color: #94a3b8; }
        .cat-meta { display: flex; align-items: center; gap: 8px; }
        .cat-score { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
        .cat-issues { font-size: 11px; color: #64748b; }
        .bar-track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(.4,0,.2,1); }

        /* Top products */
        .product-list { display: flex; flex-direction: column; gap: 10px; }
        .product-row {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 10px; padding: 11px 14px;
          transition: border-color 0.15s;
        }
        .product-row:hover { border-color: rgba(255,255,255,0.08); }
        .product-rank { font-size: 11px; color: #2d3748; font-weight: 600; width: 16px; text-align: center; }
        .product-name { flex: 1; font-size: 13px; color: #c8d0de; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-score { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
        .product-status { font-size: 10.5px; font-weight: 500; padding: 2px 7px; border-radius: 100px; }

        /* Sparkline card */
        .spark-card { display: flex; flex-direction: column; gap: 8px; }
        .spark-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .spark-val { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.04em; color: #8aabff; }
        .spark-label { font-size: 11px; color: #64748b; margin-top: 2px; }
        .spark-trend { font-size: 12px; color: #16b98c; font-weight: 500; background: rgba(22,185,140,0.1); padding: 3px 8px; border-radius: 100px; }
      `}</style>

      <div className="dash-root">
        <div className="dash-layout">

          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="sidebar-logo">
              <span className="logo-dot" />
              AROpt
            </div>
            <nav className="sidebar-nav">
              <div className="nav-section-label">Main</div>
              {[
                { icon: "◈", label: "Overview", active: true },
                { icon: "◎", label: "AI Visibility" },
                { icon: "⊞", label: "Products", badge: criticalCount.toString() },
              ].map(({ icon, label, active, badge }) => (
                <a key={label} href="#" className={`nav-item${active ? " active" : ""}`}>
                  <span className="nav-icon">{icon}</span>
                  {label}
                  {badge && <span className="nav-badge">{badge}</span>}
                </a>
              ))}

              <div className="nav-section-label" style={{ marginTop: 8 }}>Analyse</div>
              {[
                { icon: "⟁", label: "Recommendations" },
                { icon: "◷", label: "Competitors" },
                { icon: "⌗", label: "Schema Audit" },
              ].map(({ icon, label }) => (
                <a key={label} href="#" className="nav-item">
                  <span className="nav-icon">{icon}</span>
                  {label}
                </a>
              ))}

              <div className="nav-section-label" style={{ marginTop: 8 }}>Account</div>
              {[
                { icon: "⚙", label: "Settings" },
              ].map(({ icon, label }) => (
                <a key={label} href="#" className="nav-item">
                  <span className="nav-icon">{icon}</span>
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="dash-main">
            {/* Topbar */}
            <header className="dash-topbar">
              <div className="topbar-left">
                <div className="topbar-title">AI Commerce Overview</div>
                <div className="topbar-sub">Last synced · just now &nbsp;·&nbsp; your-store.myshopify.com</div>
              </div>
              <div className="topbar-right">
                <button className="btn-sm outline">
                  <span>↺</span> Re-scan
                </button>
                <button className="btn-sm primary">
                  Export Report
                </button>
              </div>
            </header>

            <div className="dash-body">

              {/* Alert banner */}
              <div className="alert-banner">
                <div className="alert-dot" />
                <span className="alert-text">{criticalCount} critical issues</span>
                <span className="alert-sub">require immediate attention to restore AI visibility.</span>
                <span className="alert-action">View all →</span>
              </div>

              {/* Score cards */}
              <div>
                <div className="section-hd">
                  <div className="section-title">Visibility Scores</div>
                  <span className="section-link">History →</span>
                </div>
                <div className="scores-grid">
                  <ScoreCard title="AI Readiness"    value={aiReadinessScore}     delta={weeklyDeltas.aiReadiness}    color="brand" />
                  <ScoreCard title="Discoverability" value={discoverabilityScore} delta={weeklyDeltas.discoverability} color="teal"  />
                  <ScoreCard title="Trust Score"     value={trustScore}           delta={weeklyDeltas.trust}           color="amber" />
                  <ScoreCard title="Comparison"      value={comparisonScore}      delta={weeklyDeltas.comparison}      color="coral" />
                </div>
              </div>

              {/* Issues + sidebar */}
              <div className="two-col">

                {/* Left: Issues */}
                <div>
                  <div className="section-hd">
                    <div className="section-title">Open Issues</div>
                    <span className="section-link">View all {recentIssues.length} →</span>
                  </div>
                  <div className="panel">
                    <div className="issue-list">
                      {recentIssues.map((issue) => {
                        const cfg = SEV_CONFIG[issue.severity as keyof typeof SEV_CONFIG];
                        return (
                          <div className="issue-row" key={issue.id}>
                            <div
                              className="issue-sev"
                              style={{ background: cfg.bg, color: cfg.text }}
                            >
                              {cfg.label}
                            </div>
                            <div className="issue-info">
                              <div className="issue-product">{issue.product}</div>
                              <div className="issue-desc">{issue.issue}</div>
                            </div>
                            <div className="issue-action">{issue.action}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Sparkline / weekly trend */}
                  <div>
                    <div className="section-hd">
                      <div className="section-title">Weekly Trend</div>
                    </div>
                    <div className="panel">
                      <div className="panel-body spark-card">
                        <div className="spark-top">
                          <div>
                            <div className="spark-val">{aiReadinessScore}</div>
                            <div className="spark-label">Overall AI Score · 7d</div>
                          </div>
                          <div className="spark-trend">↑ +{weeklyDeltas.aiReadiness} this week</div>
                        </div>
                        <Sparkline data={weeklyTrend} />
                      </div>
                    </div>
                  </div>

                  {/* Category breakdown */}
                  <div>
                    <div className="section-hd">
                      <div className="section-title">By Category</div>
                    </div>
                    <div className="panel">
                      <div className="panel-body">
                        <div className="cat-list">
                          {issueBreakdown.map(({ category, score, issues, color }) => (
                            <div className="cat-row" key={category}>
                              <div className="cat-top">
                                <span className="cat-label">{category}</span>
                                <div className="cat-meta">
                                  <span className="cat-score" style={{ color }}>{score}</span>
                                  <span className="cat-issues">{issues} issues</span>
                                </div>
                              </div>
                              <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${score}%`, background: color }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Top products */}
              <div>
                <div className="section-hd">
                  <div className="section-title">Top Products by AI Score</div>
                  <span className="section-link">All products →</span>
                </div>
                <div className="panel">
                  <div className="panel-body">
                    <div className="product-list">
                      {topProducts.map(({ name, score, status }, i) => {
                        const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                        return (
                          <div className="product-row" key={name}>
                            <span className="product-rank">#{i + 1}</span>
                            <span className="product-name">{name}</span>
                            <span className="product-score" style={{ color: cfg.color }}>{score}</span>
                            <span
                              className="product-status"
                              style={{ background: `${cfg.color}18`, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}