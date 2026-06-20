"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsIntelligence } from "@/services/productService";
import Link from "next/link";

// ── Config ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  EXCELLENT: { color: "#3ecf8e", bg: "rgba(62,207,142,0.1)",  label: "Excellent" },
  GOOD:      { color: "#8aa8e8", bg: "rgba(138,168,232,0.1)", label: "Good"      },
  MODERATE:  { color: "#e8a838", bg: "rgba(232,168,56,0.1)",  label: "Moderate"  },
  POOR:      { color: "#e05555", bg: "rgba(224,85,85,0.1)",   label: "Poor"      },
};

const PRIORITY_CONFIG: Record<string, { color: string }> = {
  HIGH:   { color: "#e05555" },
  MEDIUM: { color: "#e8a838" },
  LOW:    { color: "#3ecf8e" },
};

const FILTERS = ["ALL", "EXCELLENT", "GOOD", "MODERATE", "POOR"];

// ── Score ring ───────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 17, circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100);
  const color =
    pct >= 80 ? "#3ecf8e" :
    pct >= 60 ? "#8aa8e8" :
    pct >= 40 ? "#e8a838" :
    "#e05555";
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" style={{ flexShrink: 0 }}>
      <circle cx="23" cy="23" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
      <circle
        cx="23" cy="23" r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 23 23)"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.16,1,.3,1)" }}
      />
      <text
        x="23" y="27" textAnchor="middle" fontSize="11" fontWeight="400"
        fontFamily="'DM Serif Display', serif" fill={color}
      >
        {pct}
      </text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-intelligence"],
    queryFn: getProductsIntelligence,
  });

  const filtered = products?.filter((p: any) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || p.status === filter;
    return matchSearch && matchFilter;
  }) ?? [];

  const totalProducts = products?.length ?? 0;
  const criticalCount  = products?.filter((p: any) => p.status === "POOR").length ?? 0;
  const avgScore = products?.length
    ? Math.round(products.reduce((s: number, p: any) => s + (p.overallScore ?? 0), 0) / products.length)
    : 0;
  const highPriority = products?.filter((p: any) => p.improvementPriority === "HIGH").length ?? 0;

  if (isLoading) {
    return (
      <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center", color: "#8c8a83", fontFamily: "'DM Sans', sans-serif" }}>
        Loading products…
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

        .pp-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 32px;
        }

        /* ── page header ── */
        .pp-hd {
          display: flex; align-items: flex-end; justify-content: space-between;
          padding-bottom: 28px; border-bottom: 1px solid var(--border);
        }
        .pp-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .pp-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .pp-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }

        /* ── stats ── */
        .pp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .pp-stat {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 22px 24px;
          transition: border-color 0.2s;
        }
        .pp-stat:hover { border-color: var(--border-mid); }
        .pp-stat-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 12px;
        }
        .pp-stat-val {
          font-family: var(--font-serif);
          font-size: 38px; letter-spacing: -0.04em; line-height: 1;
        }

        /* ── toolbar ── */
        .pp-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pp-search {
          flex: 1; min-width: 220px; max-width: 340px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 9px; padding: 10px 16px;
          font-family: var(--font); font-size: 13.5px; color: var(--ink);
          outline: none; transition: border-color 0.2s;
        }
        .pp-search::placeholder { color: var(--ink3); }
        .pp-search:focus { border-color: var(--border-mid); }

        .pp-filter-btn {
          padding: 8px 16px; border-radius: 8px;
          font-family: var(--font); font-size: 12.5px; font-weight: 500;
          cursor: pointer; border: 1px solid var(--border);
          background: transparent; color: var(--ink2);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .pp-filter-btn:hover { border-color: var(--border-mid); color: var(--ink); }
        .pp-filter-btn.active {
          background: var(--ink); border-color: var(--ink); color: var(--bg);
        }

        .pp-reanalyze {
          margin-left: auto;
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px;
          font-family: var(--font); font-size: 13.5px; font-weight: 500;
          background: var(--ink); color: var(--bg);
          border: none; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .pp-reanalyze:hover { opacity: 0.85; transform: translateY(-1px); }

        /* ── section header ── */
        .sec-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .sec-title { font-family: var(--font-serif); font-size: 18px; letter-spacing: -0.02em; color: var(--ink); }
        .sec-count { font-size: 12.5px; color: var(--ink3); font-family: var(--font-mono); }

        /* ── panel & table ── */
        .pp-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }

        .pp-thead {
          display: grid;
          grid-template-columns: 2fr 84px 110px 70px 70px 100px 110px;
          gap: 14px; padding: 13px 24px;
          border-bottom: 1px solid var(--border);
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--ink3);
        }
        .pp-row {
          display: grid;
          grid-template-columns: 2fr 84px 110px 70px 70px 100px 110px;
          gap: 14px; padding: 14px 24px;
          border-bottom: 1px solid var(--border);
          align-items: center;
          transition: background 0.15s;
        }
        .pp-row:last-child { border-bottom: none; }
        .pp-row:hover { background: rgba(255,255,255,0.02); }

        .pp-product { display: flex; align-items: center; gap: 13px; min-width: 0; }
        .pp-img {
          width: 40px; height: 40px; border-radius: 10px;
          object-fit: cover; flex-shrink: 0;
          border: 1px solid var(--border); background: var(--surface2);
        }
        .pp-name { font-size: 13.5px; font-weight: 500; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .pp-pill {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 100px;
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .pp-num { font-family: var(--font-serif); font-size: 16px; }

        .pp-action {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; font-family: var(--font);
          color: var(--ink2); background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 7px; padding: 6px 13px;
          cursor: pointer; white-space: nowrap;
          transition: border-color 0.2s, color 0.2s;
        }
        .pp-action:hover { border-color: var(--border-mid); color: var(--ink); }

        .pp-empty { padding: 56px 24px; text-align: center; color: var(--ink3); font-size: 13.5px; }

        /* ── responsive ── */
        @media (max-width: 1000px) {
          .pp-stats { grid-template-columns: repeat(2, 1fr); }
          .pp-thead, .pp-row { grid-template-columns: 1.6fr 70px 90px 60px 100px; }
          .pp-thead > div:nth-child(4), .pp-row > div:nth-child(5) { display: none; }
        }
        @media (max-width: 680px) {
          .pp-root { padding: 24px 20px 60px; gap: 24px; }
          .pp-hd { flex-direction: column; align-items: flex-start; gap: 16px; }
          .pp-stats { grid-template-columns: 1fr; }
          .pp-reanalyze { margin-left: 0; width: 100%; justify-content: center; }
          .pp-thead { display: none; }
          .pp-row {
            grid-template-columns: 1fr;
            gap: 10px; padding: 16px;
          }
        }
      `}</style>

      <div className="pp-root">

        {/* ── Page header ── */}
        <div className="pp-hd">
          <div>
            <p className="pp-eyebrow">Inventory</p>
            <h1 className="pp-title">Products</h1>
            <p className="pp-sub">AI visibility breakdown for every product in your store</p>
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="pp-stats">
          <div className="pp-stat">
            <div className="pp-stat-label">Total products</div>
            <div className="pp-stat-val" style={{ color: "var(--ink)" }}>{totalProducts}</div>
          </div>
          <div className="pp-stat">
            <div className="pp-stat-label">Avg AI score</div>
            <div className="pp-stat-val" style={{ color: avgScore >= 70 ? "var(--green)" : avgScore >= 50 ? "var(--amber)" : "var(--red)" }}>
              {avgScore}
            </div>
          </div>
          <div className="pp-stat">
            <div className="pp-stat-label">Poor visibility</div>
            <div className="pp-stat-val" style={{ color: criticalCount > 0 ? "var(--red)" : "var(--green)" }}>{criticalCount}</div>
          </div>
          <div className="pp-stat">
            <div className="pp-stat-label">High priority</div>
            <div className="pp-stat-val" style={{ color: highPriority > 0 ? "var(--amber)" : "var(--green)" }}>{highPriority}</div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="pp-toolbar">
          <input
            className="pp-search"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`pp-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : STATUS_CONFIG[f]?.label ?? f}
            </button>
          ))}
          <button className="pp-reanalyze">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5a4.5 4.5 0 018-2.8M11 6.5a4.5 4.5 0 01-8 2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M9.5 1.5v2.5H7M3.5 11.5V9H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Re-analyze all
          </button>
        </div>

        {/* ── Table ── */}
        <div>
          <div className="sec-hd">
            <h2 className="sec-title">Product intelligence</h2>
            <span className="sec-count">{filtered.length} products</span>
          </div>

          <div className="pp-panel">
            <div className="pp-thead">
              <div>Product</div>
              <div>Score</div>
              <div>Status</div>
              <div>Issues</div>
              <div>Recs</div>
              <div>Priority</div>
              <div>Action</div>
            </div>

            {filtered.length === 0 ? (
              <div className="pp-empty">No products match your search.</div>
            ) : (
              filtered.map((product: any, i: number) => {
                const statusCfg   = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.POOR;
                const priorityCfg = PRIORITY_CONFIG[product.improvementPriority] ?? PRIORITY_CONFIG.MEDIUM;
                return (
                  <div className="pp-row" key={`${product.productId}-${i}`}>

                    <div className="pp-product">
                      <img
                        className="pp-img"
                        src={product.image || "https://placehold.co/80x80/1c1b1a/504e49?text=—"}
                        alt={product.title}
                      />
                      <span className="pp-name">{product.title}</span>
                    </div>

                    <div><ScoreRing score={product.overallScore ?? 0} /></div>

                    <div>
                      <span className="pp-pill" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                    </div>

                    <div className="pp-num" style={{ color: product.issuesCount > 0 ? "var(--red)" : "var(--ink3)" }}>
                      {product.issuesCount ?? 0}
                    </div>

                    <div className="pp-num" style={{ color: product.recommendationCount > 0 ? "var(--amber)" : "var(--ink3)" }}>
                      {product.recommendationCount ?? 0}
                    </div>

                    <div>
                      <span className="pp-pill" style={{ background: `${priorityCfg.color}18`, color: priorityCfg.color }}>
                        {product.improvementPriority ?? "—"}
                      </span>
                    </div>

                    <div>
                      <Link href={`/products/${product.productId}`}>
                        <button className="pp-action">
                          Optimize
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 5.5h7M6.5 2.5L9.5 5.5L6.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </Link>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </>
  );
}