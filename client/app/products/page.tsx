"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsIntelligence } from "@/services/productService";

import Link from "next/link";

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    EXCELLENT: { color: "#16b98c", bg: "rgba(22,185,140,0.10)", label: "Excellent" },
    GOOD: { color: "#4d7aff", bg: "rgba(77,122,255,0.10)", label: "Good" },
    MODERATE: { color: "#f5b429", bg: "rgba(245,180,41,0.10)", label: "Moderate" },
    POOR: { color: "#f0683a", bg: "rgba(240,104,58,0.10)", label: "Poor" },
};

const PRIORITY_CONFIG: Record<string, { color: string }> = {
    HIGH: { color: "#f0683a" },
    MEDIUM: { color: "#f5b429" },
    LOW: { color: "#16b98c" },
};

function ScoreRing({ score }: { score: number }) {
    const r = 16, circ = 2 * Math.PI * r;
    const pct = Math.min(Math.max(score, 0), 100);
    const color = pct >= 80 ? "#16b98c" : pct >= 60 ? "#4d7aff" : pct >= 40 ? "#f5b429" : "#f0683a";
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle
                cx="22" cy="22" r={r} fill="none"
                stroke={color} strokeWidth="3"
                strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
            />
            <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700"
                fontFamily="'Syne', sans-serif" fill={color}>
                {pct}
            </text>
        </svg>
    );
}

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
    const criticalCount = products?.filter((p: any) => p.status === "POOR").length ?? 0;
    const avgScore = products?.length
        ? Math.round(products.reduce((s: number, p: any) => s + (p.overallScore ?? 0), 0) / products.length)
        : 0;
    const highPriority = products?.filter((p: any) => p.improvementPriority === "HIGH").length ?? 0;

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center" style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
                Loading products…
            </div>
        );
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .pp-root {
          display: flex; flex-direction: column; gap: 28px;
          color: #e8edf5;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Summary cards */
        .pp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media(max-width:900px){ .pp-stats { grid-template-columns: repeat(2,1fr); } }
        .pp-stat {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 20px 22px;
        }
        .pp-stat-label { font-size: 12px; color: #64748b; margin-bottom: 10px; }
        .pp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 30px; font-weight: 800;
          letter-spacing: -0.04em;
        }

        /* Toolbar */
        .pp-toolbar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .pp-search {
          flex: 1; min-width: 200px; max-width: 320px;
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; padding: 9px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #e8edf5;
          outline: none; transition: border-color 0.15s;
        }
        .pp-search::placeholder { color: #2d3748; }
        .pp-search:focus { border-color: rgba(77,122,255,0.4); }

        .pp-filter-btn {
          padding: 8px 14px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.07);
          background: transparent; color: #64748b;
          transition: all 0.15s;
        }
        .pp-filter-btn:hover { border-color: rgba(255,255,255,0.12); color: #94a3b8; }
        .pp-filter-btn.active {
          background: rgba(77,122,255,0.12);
          border-color: rgba(77,122,255,0.25);
          color: #8aabff;
        }

        .pp-reanalyze {
          margin-left: auto;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          background: #4d7aff; color: #fff;
          border: none; cursor: pointer;
          transition: opacity 0.15s;
        }
        .pp-reanalyze:hover { opacity: 0.85; }

        /* Table panel */
        .pp-panel {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
        }
        .pp-thead {
          display: grid;
          grid-template-columns: 2fr 80px 100px 70px 80px 80px 90px;
          gap: 12px;
          padding: 12px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #2d3748;
        }
        .pp-row {
          display: grid;
          grid-template-columns: 2fr 80px 100px 70px 80px 80px 90px;
          gap: 12px;
          padding: 14px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          align-items: center;
          transition: background 0.15s;
        }
        .pp-row:last-child { border-bottom: none; }
        .pp-row:hover { background: rgba(255,255,255,0.02); }

        /* Product cell */
        .pp-product { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .pp-img { width: 40px; height: 40px; border-radius: 9px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.06); }
        .pp-title { font-size: 13px; font-weight: 500; color: #e8edf5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Status pill */
        .pp-pill {
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: 100px;
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.03em;
          white-space: nowrap;
        }

        /* Action button */
        .pp-action {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: #4d7aff; font-weight: 500;
          background: rgba(77,122,255,0.08);
          border: 1px solid rgba(77,122,255,0.15);
          border-radius: 6px; padding: 5px 11px;
          cursor: pointer; white-space: nowrap;
          transition: background 0.15s;
        }
        .pp-action:hover { background: rgba(77,122,255,0.15); }

        .pp-empty {
          padding: 48px; text-align: center;
          color: #2d3748; font-size: 13px;
        }

        /* Section header */
        .section-hd { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: -0.02em;
        }
      `}</style>

            <div className="pp-root">

                {/* Summary stats */}
                <div className="pp-stats">
                    <div className="pp-stat">
                        <div className="pp-stat-label">Total Products</div>
                        <div className="pp-stat-val" style={{ color: "#e8edf5" }}>{totalProducts}</div>
                    </div>
                    <div className="pp-stat">
                        <div className="pp-stat-label">Avg AI Score</div>
                        <div className="pp-stat-val" style={{ color: avgScore >= 70 ? "#16b98c" : avgScore >= 50 ? "#f5b429" : "#f0683a" }}>
                            {avgScore}
                        </div>
                    </div>
                    <div className="pp-stat">
                        <div className="pp-stat-label">Poor Visibility</div>
                        <div className="pp-stat-val" style={{ color: criticalCount > 0 ? "#f0683a" : "#16b98c" }}>{criticalCount}</div>
                    </div>
                    <div className="pp-stat">
                        <div className="pp-stat-label">High Priority</div>
                        <div className="pp-stat-val" style={{ color: highPriority > 0 ? "#f5b429" : "#16b98c" }}>{highPriority}</div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="pp-toolbar">
                    <input
                        className="pp-search"
                        type="text"
                        placeholder="Search products…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {["ALL", "EXCELLENT", "GOOD", "MODERATE", "POOR"].map((f) => (
                        <button
                            key={f}
                            className={`pp-filter-btn${filter === f ? " active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === "ALL" ? "All" : STATUS_CONFIG[f]?.label ?? f}
                        </button>
                    ))}
                    <button className="pp-reanalyze">
                        ↺ Re-analyze All
                    </button>
                </div>

                {/* Table */}
                <div>
                    <div className="section-hd">
                        <div className="section-title">Product Intelligence</div>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{filtered.length} products</span>
                    </div>
                    <div className="pp-panel">

                        {/* Header */}
                        <div className="pp-thead">
                            <div>Product</div>
                            <div>Score</div>
                            <div>Status</div>
                            <div>Issues</div>
                            <div>Recs</div>
                            <div>Priority</div>
                            <div>Action</div>
                        </div>

                        {/* Rows */}
                        {filtered.length === 0 ? (
                            <div className="pp-empty">No products match your search.</div>
                        ) : (
                            filtered.map((product: any, i: number) => {
                                const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.POOR;
                                const priorityCfg = PRIORITY_CONFIG[product.improvementPriority] ?? PRIORITY_CONFIG.MEDIUM;
                                return (
                                    <div className="pp-row" key={`${product.productId}-${i}`}>

                                        {/* Product */}
                                        <div className="pp-product">
                                            <img
                                                className="pp-img"
                                                src={product.image || "https://placehold.co/80x80/0b1120/334155?text=—"}
                                                alt={product.title}
                                            />
                                            <span className="pp-title">{product.title}</span>
                                        </div>

                                        {/* Score */}
                                        <div>
                                            <ScoreRing score={product.overallScore ?? 0} />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <span className="pp-pill" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                                {statusCfg.label}
                                            </span>
                                        </div>

                                        {/* Issues */}
                                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: product.issuesCount > 0 ? "#f0683a" : "#64748b" }}>
                                            {product.issuesCount ?? 0}
                                        </div>

                                        {/* Recommendations */}
                                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: product.recommendationCount > 0 ? "#f5b429" : "#64748b" }}>
                                            {product.recommendationCount ?? 0}
                                        </div>

                                        {/* Priority */}
                                        <div>
                                            <span className="pp-pill" style={{ background: `${priorityCfg.color}18`, color: priorityCfg.color }}>
                                                {product.improvementPriority ?? "—"}
                                            </span>
                                        </div>

                                        {/* Action */}
                                        <div>
                                            <Link
                                                href={`/products/${product.productId}`}
                                            > <button className="pp-action">Optimize →</button></Link>


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