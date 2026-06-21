"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ScoreCard from "@/components/dashboard/ScoreCard";
import { getDashboardOverview } from "@/services/dashboardService";
import { getAllAnalyses } from "@/lib/api/analysis";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface Issue {
  id: string | number;
  productId?: string;
  severity: "critical" | "warning" | "info";
  product: string;
  issue: string;
  action: string;
}

interface Product {
  productId?: string;
  name: string;
  score: number;
  status: "great" | "good" | "warn" | "bad";
}

interface IssueBreakdown {
  category: string;
  score: number;
  issues: number;
  color: string;
}

// ── Config ────────────────────────────────────────────────────────────────
const SEV_CONFIG = {
  critical: { label: "Critical", dot: "#e05555", bg: "rgba(224,85,85,0.08)", text: "#e05555" },
  warning:  { label: "Warning",  dot: "#e8a838", bg: "rgba(232,168,56,0.08)", text: "#e8a838" },
  info:     { label: "Info",     dot: "#8c8a83", bg: "rgba(140,138,131,0.08)", text: "#8c8a83" },
};

const STATUS_CONFIG = {
  great: { color: "#3ecf8e", label: "Great" },
  good:  { color: "#8c8a83", label: "Good" },
  warn:  { color: "#e8a838", label: "Needs work" },
  bad:   { color: "#e05555", label: "Poor" },
};

const LAST_SCAN_KEY_PREFIX = "merchanta:lastScanAt:";

function getLastScanKey(userId: string | undefined | null): string | null {
  if (!userId) return null;
  return `${LAST_SCAN_KEY_PREFIX}${userId}`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatLastScan(iso: string | null): string {
  if (!iso) return "No scan run yet";

  const date = new Date(iso);
  if (isNaN(date.getTime())) return "No scan run yet";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  if (diffMin < 1) return "Last scanned just now";
  if (diffMin < 60) return `Last scanned ${diffMin} min ago`;

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return `Last scanned today at ${time}`;
  if (isYesterday) return `Last scanned yesterday at ${time}`;
  if (diffHr < 24 * 7) {
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    return `Last scanned ${day} at ${time}`;
  }
  const dateStr = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `Last scanned ${dateStr} at ${time}`;
}

// ── Sparkline ─────────────────────────────────────────────────────────────
function Sparkline({ data }: { data: { day: string; score: number }[] }) {
  const W = 180, H = 52, pad = 6;
  const min = Math.min(...data.map((d) => d.score)) - 5;
  const max = Math.max(...data.map((d) => d.score)) + 5;
  const xs  = data.map((_, i) => pad + (i / (data.length - 1)) * (W - pad * 2));
  const ys  = data.map((d) => H - pad - ((d.score - min) / (max - min)) * (H - pad * 2));
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1]},${H} L${xs[0]},${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3ecf8e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3ecf8e" stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sg)" />
      <path d={linePath} stroke="#3ecf8e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill="#3ecf8e" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
  });

  const { data: analyses } = useQuery({
    queryKey: ["analyses"],
    queryFn: getAllAnalyses,
  });

  const { user } = useAuth();
  const scanKey = getLastScanKey(user?.id ?? user?.email);

  // ── Last scan tracking (client-side, scoped to the logged-in account) ────
  const [lastScanAt, setLastScanAt] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanKey) {
      setLastScanAt(null);
      return;
    }
    const stored = localStorage.getItem(scanKey);
    setLastScanAt(stored);
  }, [scanKey]);

  // Re-render the relative "X min ago" label every 30s without needing a real scan
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRunScan = () => {
    if (!scanKey) return;
    setScanning(true);
    const now = new Date().toISOString();
    // Simulate scan duration — swap this for an actual await apiClient.post('/scan') call when ready
    setTimeout(() => {
      localStorage.setItem(scanKey, now);
      setLastScanAt(now);
      setScanning(false);
    }, 1400);
  };

  // Scores
  const aiReadinessScore    = data?.scores?.semanticScore        || 0;
  const discoverabilityScore = data?.scores?.discoverabilityScore || 0;
  const trustScore           = data?.scores?.trustScore           || 0;
  const comparisonScore      = Math.round((aiReadinessScore + discoverabilityScore + trustScore) / 3) || 0;
  const totalStores          = data?.totalStores   || 0;
  const totalProducts        = data?.totalProducts || 0;

  const weeklyDeltas = { aiReadiness: 12, discoverability: 8, trust: 5, comparison: 7 };

  const recentIssues: Issue[] =
    analyses
      ?.map((analysis: any) => ({
        id:        analysis._id,
        productId: analysis.productId?._id,
        severity:
          analysis.issues?.length >= 5 ? "critical"
          : analysis.issues?.length >= 3 ? "warning"
          : "info",
        product: analysis.productId?.title || "Unknown Product",
        issue:
          analysis.issues?.slice(0, 2).join(", ") +
          (analysis.issues?.length > 2 ? "…" : ""),
        action: "Fix now",
      }))
      .sort((a: any, b: any) => {
        const o: Record<string, number> = { critical: 3, warning: 2, info: 1 };
        return (o[b.severity] || 0) - (o[a.severity] || 0);
      })
      .slice(0, 5) ?? [];

  const issueBreakdown: IssueBreakdown[] = [
    { category: "Metadata",        score: aiReadinessScore,    issues: recentIssues.filter((i) => i.issue.toLowerCase().includes("metadata")).length,  color: "#3ecf8e" },
    { category: "Trust",           score: trustScore,          issues: recentIssues.filter((i) => i.issue.toLowerCase().includes("trust")).length,     color: "#e8a838" },
    { category: "Discoverability", score: discoverabilityScore,issues: recentIssues.filter((i) => i.issue.toLowerCase().includes("semantic")).length,  color: "#e05555" },
  ];

  const weeklyTrend = [
    { day: "Mon", score: 58 }, { day: "Tue", score: 61 }, { day: "Wed", score: 64 },
    { day: "Thu", score: 67 }, { day: "Fri", score: 72 }, { day: "Sat", score: 76 },
    { day: "Sun", score: aiReadinessScore },
  ];

  const topProducts: Product[] =
    analyses
      ?.map((analysis: any) => ({
        productId: analysis.productId?._id,
        name:  analysis.productId?.title ?? "Unknown",
        score: analysis.scores.overallScore,
        status:
          analysis.scores.overallScore >= 85 ? "great"
          : analysis.scores.overallScore >= 70 ? "good"
          : analysis.scores.overallScore >= 50 ? "warn"
          : "bad",
      }))
      .sort((a: Product, b: Product) => b.score - a.score)
      .slice(0, 5) ?? [];

  const criticalCount = recentIssues.filter((i) => i.severity === "critical").length;

  if (isLoading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#111110", color: "#f0ede8", fontFamily: "'DM Sans', sans-serif" }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap');

        /* ── tokens ── */
        :root {
          --bg:          #111110;
          --surface:     #1c1b1a;
          --surface2:    #242321;
          --surface3:    #2e2c2a;
          --border:      rgba(255,255,255,0.07);
          --border-mid:  rgba(255,255,255,0.13);
          --ink:         #f0ede8;
          --ink2:        #8c8a83;
          --ink3:        #504e49;
          --green:       #3ecf8e;
          --amber:       #e8a838;
          --red:         #e05555;
          --font-serif:  'DM Serif Display', serif;
          --font:        'DM Sans', sans-serif;
          --font-mono:   'DM Mono', monospace;
        }

        /* ── reset ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          background: var(--bg); color: var(--ink);
          font-family: var(--font); -webkit-font-smoothing: antialiased;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── shell ── */
        .db {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 36px;
        }

        /* ── page header ── */
        .page-hd {
          display: flex; align-items: flex-end; justify-content: space-between;
          padding-bottom: 28px; border-bottom: 1px solid var(--border);
        }
        .page-hd-left {}
        .page-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .page-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .page-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }
        .page-actions { display: flex; align-items: center; gap: 10px; }
        .hd-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 500; font-family: var(--font);
          padding: 8px 16px; border-radius: 9px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, border-color 0.2s, color 0.2s;
          border: none; white-space: nowrap; overflow: hidden;
        }
        .hd-btn span { overflow: hidden; text-overflow: ellipsis; }
        .hd-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .hd-btn:disabled { opacity: 0.6; cursor: default; transform: none; }
        .hd-btn.ghost {
          background: transparent; color: var(--ink2);
          border: 1px solid var(--border-mid);
        }
        .hd-btn.ghost:hover:not(:disabled) { border-color: rgba(255,255,255,0.25); color: var(--ink); }
        .hd-btn.solid { background: var(--ink); color: var(--bg); }
        .hd-spin { animation: spin 0.8s linear infinite; }

        /* ── alert banner ── */
        .alert {
          display: flex; align-items: center; gap: 12px;
          background: rgba(224,85,85,0.07);
          border: 1px solid rgba(224,85,85,0.18);
          border-radius: 12px; padding: 13px 18px;
          font-size: 13.5px;
        }
        .alert-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--red); flex-shrink: 0;
          animation: blink 1.8s ease infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .alert-strong { color: var(--red); font-weight: 500; }
        .alert-muted  { color: var(--ink2); margin-left: 4px; font-weight: 300; }
        .alert-cta {
          margin-left: auto; font-size: 12.5px; color: var(--red);
          font-weight: 500; text-decoration: none; white-space: nowrap;
          opacity: 0.85; transition: opacity 0.2s;
        }
        .alert-cta:hover { opacity: 1; }

        /* ── stats row ── */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .stat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 22px 24px;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: var(--border-mid); }
        .stat-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink3); margin-bottom: 12px; }
        .stat-val {
          font-family: var(--font-serif);
          font-size: 38px; letter-spacing: -0.04em; line-height: 1; color: var(--ink);
        }
        .stat-val.green  { color: var(--green); }
        .stat-val.amber  { color: var(--amber); }
        .stat-val.red    { color: var(--red);   }
        .stat-sub { font-size: 12px; color: var(--ink3); margin-top: 6px; font-weight: 300; }
        .stat-delta {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 500; color: var(--green);
          background: rgba(62,207,142,0.1); padding: 2px 8px;
          border-radius: 100px; margin-top: 8px;
        }

        /* ── score cards ── */
        .scores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

        /* ── section shell ── */
        .sec-hd {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 16px;
        }
        .sec-title {
          font-family: var(--font-serif);
          font-size: 18px; letter-spacing: -0.02em; color: var(--ink);
        }
        .sec-link {
          font-size: 12.5px; color: var(--ink2); text-decoration: none;
          transition: color 0.2s;
        }
        .sec-link:hover { color: var(--ink); }

        /* ── panel ── */
        .panel {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
        }
        .panel-body { padding: 22px 24px; }

        /* ── two-col layout ── */
        .two-col { display: grid; grid-template-columns: 1fr 360px; gap: 20px; }

        /* ── issues ── */
        .issue-list { display: flex; flex-direction: column; }
        .issue-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 15px 24px; border-bottom: 1px solid var(--border);
          transition: background 0.15s; cursor: default;
        }
        .issue-row:last-child { border-bottom: none; }
        .issue-row:hover { background: rgba(255,255,255,0.02); }
        .issue-sev {
          flex-shrink: 0; padding: 3px 10px; border-radius: 100px;
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em;
          margin-top: 2px; white-space: nowrap;
        }
        .issue-info { flex: 1; min-width: 0; }
        .issue-product {
          font-size: 13.5px; font-weight: 500; color: var(--ink);
          margin-bottom: 3px; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .issue-desc { font-size: 12.5px; color: var(--ink2); font-weight: 300; }
        .issue-btn {
          flex-shrink: 0; font-size: 12px; font-weight: 500;
          font-family: var(--font); color: var(--ink2);
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 7px; padding: 5px 12px; cursor: pointer;
          white-space: nowrap; transition: border-color 0.2s, color 0.2s;
        }
        .issue-btn:hover { border-color: var(--border-mid); color: var(--ink); }

        /* ── right column panels ── */
        .right-col { display: flex; flex-direction: column; gap: 20px; }

        /* weekly trend */
        .trend-top {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 16px;
        }
        .trend-val {
          font-family: var(--font-serif);
          font-size: 38px; letter-spacing: -0.04em; line-height: 1; color: var(--green);
        }
        .trend-label { font-size: 12px; color: var(--ink3); margin-top: 4px; font-weight: 300; }
        .trend-badge {
          font-size: 12px; color: var(--green); font-weight: 500;
          background: rgba(62,207,142,0.1); padding: 4px 10px;
          border-radius: 100px;
        }

        /* category bars */
        .cat-list { display: flex; flex-direction: column; gap: 16px; }
        .cat-row {}
        .cat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
        .cat-label { font-size: 13px; color: var(--ink2); font-weight: 300; }
        .cat-right { display: flex; align-items: center; gap: 8px; }
        .cat-score { font-family: var(--font-serif); font-size: 15px; }
        .cat-issues { font-size: 11px; color: var(--ink3); font-family: var(--font-mono); }
        .bar-track {
          height: 4px; background: var(--surface2);
          border-radius: 99px; overflow: hidden;
          border: 1px solid var(--border);
        }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

        /* ── products table ── */
        .product-list { display: flex; flex-direction: column; }
        .product-row {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 24px; border-bottom: 1px solid var(--border);
          cursor: pointer; transition: background 0.15s;
        }
        .product-row:last-child { border-bottom: none; }
        .product-row:hover { background: rgba(255,255,255,0.02); }
        .product-rank { font-family: var(--font-mono); font-size: 11px; color: var(--ink3); width: 20px; text-align: center; }
        .product-name { flex: 1; font-size: 13.5px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-score { font-family: var(--font-serif); font-size: 18px; letter-spacing: -0.02em; }
        .product-status {
          font-size: 10.5px; font-weight: 500; padding: 3px 9px;
          border-radius: 100px; white-space: nowrap;
        }

        /* ── responsive ── */
        @media (max-width: 1100px) {
          .two-col { grid-template-columns: 1fr; }
          .scores-grid, .stats-row { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .db { padding: 32px 28px 60px; }
        }

        @media (max-width: 680px) {
          .db { padding: 20px 16px 48px; gap: 24px; }

          /* page header stacks, actions become a full-width row of equal buttons */
          .page-hd {
            flex-direction: column; align-items: stretch; gap: 16px;
            padding-bottom: 20px;
          }
          .page-title { font-size: 26px; }
          .page-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; width: 100%; }
          .hd-btn { justify-content: center; padding: 10px 8px; font-size: 12px; }
          .hd-btn span, .hd-btn svg { flex-shrink: 0; }

          /* alert banner wraps cleanly instead of overflowing */
          .alert {
            flex-wrap: wrap; padding: 12px 14px; gap: 8px;
          }
          .alert-cta { margin-left: 0; width: 100%; text-align: right; }

          /* stat + score grids go single column */
          .scores-grid, .stats-row { grid-template-columns: 1fr; }
          .stat-card { padding: 18px 20px; }
          .stat-val { font-size: 32px; }

          /* issue rows: drop the fixed action button to its own line */
          .issue-row {
            flex-wrap: wrap; padding: 14px 16px; gap: 10px;
          }
          .issue-info { width: 100%; order: 1; }
          .issue-sev { order: 0; }
          .issue-btn { order: 2; margin-left: auto; }

          /* product rows: let name truncate, keep score+status inline */
          .product-row { padding: 12px 16px; gap: 10px; }
          .product-name { font-size: 13px; }
          .product-score { font-size: 16px; }

          .panel-body { padding: 18px 16px; }

          /* trend + category headers shouldn't overflow */
          .trend-val { font-size: 32px; }
        }

        @media (max-width: 380px) {
          .page-actions { grid-template-columns: 1fr 1fr; }
          .page-actions .hd-btn:last-child { grid-column: span 2; }
        }
      `}</style>

      <div className="db">

        {/* ── Page header ── */}
        <div className="page-hd">
          <div className="page-hd-left">
            <p className="page-eyebrow">Overview</p>
            <h1 className="page-title">AI Visibility Dashboard</h1>
            <p className="page-sub">
              {formatLastScan(lastScanAt)}
              {lastScanAt && " · Auto-scan enabled"}
            </p>
          </div>
          <div className="page-actions">
            <Link href="/reports" className="hd-btn ghost">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M2 7h7M2 10h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Reports
            </Link>
            <Link href="/products" className="hd-btn ghost">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="3" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 3V2.5a2 2 0 014 0V3" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Products
            </Link>
            <button className="hd-btn solid" onClick={handleRunScan} disabled={scanning || !scanKey}>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className={scanning ? "hd-spin" : ""}
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 4.5v3l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {scanning ? "Scanning…" : "Run scan"}
            </button>
          </div>
        </div>

        {/* ── Alert banner ── */}
        {criticalCount > 0 && (
          <div className="alert">
            <div className="alert-dot" />
            <span className="alert-strong">{criticalCount} critical {criticalCount === 1 ? "issue" : "issues"}</span>
            <span className="alert-muted">require immediate attention to restore AI visibility.</span>
            <Link href="/recommendations" className="alert-cta">View all →</Link>
          </div>
        )}

        {/* ── Store stats ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-eyebrow">Total stores</div>
            <div className="stat-val">{totalStores}</div>
            <div className="stat-sub">Connected via Shopify</div>
          </div>
          <div className="stat-card">
            <div className="stat-eyebrow">Products indexed</div>
            <div className="stat-val">{totalProducts}</div>
            <div className="stat-sub">Across all stores</div>
          </div>
          <div className="stat-card">
            <div className="stat-eyebrow">Open issues</div>
            <div className={`stat-val ${recentIssues.length > 3 ? "amber" : "green"}`}>{recentIssues.length}</div>
            <div className="stat-sub">{criticalCount} critical</div>
          </div>
          <div className="stat-card">
            <div className="stat-eyebrow">AI score</div>
            <div className={`stat-val ${aiReadinessScore >= 70 ? "green" : aiReadinessScore >= 50 ? "amber" : "red"}`}>{aiReadinessScore}</div>
            <div className="stat-delta">↑ +{weeklyDeltas.aiReadiness} this week</div>
          </div>
        </div>

        {/* ── Visibility scores ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Visibility scores</h2>
            <Link href="/reports" className="sec-link">Score history →</Link>
          </div>
          <div className="scores-grid">
            <ScoreCard title="AI Readiness"    value={aiReadinessScore}    delta={weeklyDeltas.aiReadiness}    color="brand" />
            <ScoreCard title="Discoverability" value={discoverabilityScore} delta={weeklyDeltas.discoverability} color="teal"  />
            <ScoreCard title="Trust Score"     value={trustScore}           delta={weeklyDeltas.trust}           color="amber" />
            <ScoreCard title="Comparison"      value={comparisonScore}      delta={weeklyDeltas.comparison}      color="coral" />
          </div>
        </div>

        {/* ── Issues + sidebar ── */}
        <div className="two-col">

          {/* Left: issues */}
          <div>
            <div className="sec-hd">
              <h2 className="sec-title">Open issues</h2>
              <Link href="/recommendations" className="sec-link">View all →</Link>
            </div>
            <div className="panel">
              <div className="issue-list">
                {recentIssues.length === 0 ? (
                  <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--ink3)", fontSize: 13 }}>
                    No issues found — your store is looking great.
                  </div>
                ) : recentIssues.map((issue) => {
                  const cfg = SEV_CONFIG[issue.severity];
                  return (
                    <div className="issue-row" key={issue.id}>
                      <div className="issue-sev" style={{ background: cfg.bg, color: cfg.text }}>
                        {cfg.label}
                      </div>
                      <div className="issue-info">
                        <div className="issue-product">{issue.product}</div>
                        <div className="issue-desc">{issue.issue}</div>
                      </div>
                      <button
                        className="issue-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/recommendations?product=${issue.productId}`);
                        }}
                      >
                        {issue.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="right-col">

            {/* Weekly trend */}
            <div>
              <div className="sec-hd">
                <h2 className="sec-title">Weekly trend</h2>
              </div>
              <div className="panel">
                <div className="panel-body">
                  <div className="trend-top">
                    <div>
                      <div className="trend-val">{aiReadinessScore}</div>
                      <div className="trend-label">Overall AI score · 7 days</div>
                    </div>
                    <div className="trend-badge">↑ +{weeklyDeltas.aiReadiness}</div>
                  </div>
                  <Sparkline data={weeklyTrend} />
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div>
              <div className="sec-hd">
                <h2 className="sec-title">By category</h2>
              </div>
              <div className="panel">
                <div className="panel-body">
                  <div className="cat-list">
                    {issueBreakdown.map(({ category, score, issues, color }) => (
                      <div className="cat-row" key={category}>
                        <div className="cat-top">
                          <span className="cat-label">{category}</span>
                          <div className="cat-right">
                            <span className="cat-score" style={{ color }}>{score}</span>
                            <span className="cat-issues">{issues} issue{issues !== 1 ? "s" : ""}</span>
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

        {/* ── Top products ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Top products by AI score</h2>
            <Link href="/products" className="sec-link">All products →</Link>
          </div>
          <div className="panel">
            <div className="product-list">
              {topProducts.length === 0 ? (
                <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--ink3)", fontSize: 13 }}>
                  No products analysed yet.{" "}
                  <Link href="/products" style={{ color: "var(--ink2)" }}>Add a store →</Link>
                </div>
              ) : topProducts.map((product, i) => {
                const cfg = STATUS_CONFIG[product.status];
                return (
                  <div
                    key={`${i}-${product.name}`}
                    className="product-row"
                    onClick={() => router.push(`/products/${product.productId}`)}
                  >
                    <span className="product-rank">#{i + 1}</span>
                    <span className="product-name">{product.name}</span>
                    <span className="product-score" style={{ color: cfg.color }}>{product.score}</span>
                    <span
                      className="product-status"
                      style={{ background: `${cfg.color}14`, color: cfg.color }}
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
    </>
  );
}