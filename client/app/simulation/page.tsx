"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsIntelligence } from "@/services/productService";
import { runSimulation } from "@/services/simulationService";

const AGENTS = [
  "GPT-4o Shopping",
  "Gemini 1.5 Pro",
  "Perplexity AI",
  "Claude 3.5",
];

export default function SimulationPage() {

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsIntelligence,
  });

  const [query, setQuery]     = useState("best waterproof hiking boots");
  const [agent, setAgent]     = useState("GPT-4o Shopping");
  const [product, setProduct] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [ran, setRan]         = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  useEffect(() => {
    if (products?.length && !product) {
      setProduct(products[0].productId);
    }
  }, [products]);

  const handleRun = async () => {
    try {
      setRunning(true);
      setRan(false);
      const result = await runSimulation({ query, product, agent });
      setSimulationResult(result);
      setRan(true);
    } catch (error) {
      console.error("Simulation failed", error);
    } finally {
      setRunning(false);
    }
  };

  const data = simulationResult;
  const confidenceColor =
    (data?.confidenceScore ?? 0) >= 70 ? "var(--green)" :
    (data?.confidenceScore ?? 0) >= 40 ? "var(--amber)" :
    "var(--red)";

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

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse2 { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        .sim-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 28px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── page header ── */
        .sim-hd { padding-bottom: 28px; border-bottom: 1px solid var(--border); }
        .sim-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .sim-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .sim-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }

        /* ── config panel ── */
        .sim-config { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px 26px; }
        .sim-config-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 18px;
        }
        .sim-config-grid {
          display: grid; grid-template-columns: 1fr 200px 200px auto;
          gap: 12px; align-items: end;
        }
        .sim-field { display: flex; flex-direction: column; gap: 8px; }
        .sim-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink3);
        }
        .sim-input, .sim-select {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 9px; padding: 10px 14px; color: var(--ink);
          font-family: var(--font); font-size: 13.5px; outline: none;
          width: 100%; transition: border-color 0.2s;
        }
        .sim-input::placeholder { color: var(--ink3); }
        .sim-input:focus, .sim-select:focus { border-color: var(--border-mid); }
        .sim-select {
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238c8a83' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          padding-right: 36px;
        }
        .sim-select option { background: var(--surface); color: var(--ink); }

        .sim-run-btn {
          display: inline-flex; align-items: center; gap: 8px; justify-content: center;
          background: var(--ink); color: var(--bg); border: none;
          border-radius: 9px; padding: 0 22px; height: 41px;
          font-family: var(--font); font-size: 13.5px; font-weight: 500;
          cursor: pointer; transition: opacity 0.2s, transform 0.2s; white-space: nowrap;
        }
        .sim-run-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .sim-run-btn:disabled { opacity: 0.6; cursor: default; }
        .sim-spinner {
          width: 13px; height: 13px; border-radius: 50%;
          border: 2px solid rgba(17,17,16,0.25); border-top-color: var(--bg);
          animation: spin 0.7s linear infinite;
        }

        /* ── loading panel ── */
        .sim-loading {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 32px;
          display: flex; align-items: center; gap: 14px;
          font-size: 14px; color: var(--ink2); font-weight: 300;
        }
        .sim-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--blue); animation: pulse2 1.2s ease infinite; }

        /* ── results layout ── */
        .sim-results { display: grid; grid-template-columns: 1fr 360px; gap: 16px; }
        .sim-col { display: flex; flex-direction: column; gap: 16px; }

        /* ── panel ── */
        .sim-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .sim-panel-hd { padding: 17px 22px; border-bottom: 1px solid var(--border); }
        .sim-panel-title {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink3);
        }
        .sim-panel-body { padding: 22px; }

        /* ── rank display ── */
        .rank-display { display: flex; align-items: center; gap: 28px; }
        .rank-num {
          font-family: var(--font-serif); font-size: 56px;
          letter-spacing: -0.04em; line-height: 1; color: var(--ink);
        }
        .rank-info { display: flex; flex-direction: column; gap: 10px; }
        .rank-total { font-size: 13.5px; color: var(--ink2); font-weight: 300; }
        .rank-confidence { font-size: 13.5px; font-weight: 500; }
        .rank-conf-bar {
          margin-top: 4px; height: 4px; width: 160px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 99px; overflow: hidden;
        }
        .rank-conf-fill { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(0.16,1,0.3,1); }

        /* ── insight items ── */
        .insight-item { margin-bottom: 16px; }
        .insight-item:last-child { margin-bottom: 0; }
        .insight-title { font-size: 13.5px; font-weight: 500; margin-bottom: 4px; }
        .insight-detail { font-size: 13px; color: var(--ink2); line-height: 1.6; font-weight: 300; }
        .insight-empty { font-size: 13px; color: var(--ink3); font-weight: 300; }

        /* ── empty state (no run yet) ── */
        .sim-empty {
          background: var(--surface); border: 1px dashed var(--border-mid);
          border-radius: 16px; padding: 56px 32px; text-align: center;
        }
        .sim-empty-icon {
          width: 48px; height: 48px; border-radius: 13px; margin: 0 auto 18px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; color: var(--ink3);
        }
        .sim-empty-title { font-family: var(--font-serif); font-size: 18px; color: var(--ink); margin-bottom: 8px; letter-spacing: -0.01em; }
        .sim-empty-desc { font-size: 13.5px; color: var(--ink3); font-weight: 300; max-width: 360px; margin: 0 auto; line-height: 1.6; }

        /* ── responsive ── */
        @media (max-width: 1000px) {
          .sim-results { grid-template-columns: 1fr; }
        }
        @media (max-width: 900px) {
          .sim-config-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 680px) {
          .sim-root { padding: 24px 20px 60px; gap: 24px; }
          .sim-config-grid { grid-template-columns: 1fr; }
          .rank-display { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

      <div className="sim-root">

        {/* ── Page header ── */}
        <div className="sim-hd">
          <p className="sim-eyebrow">Testing</p>
          <h1 className="sim-title">AI simulation</h1>
          <p className="sim-sub">See how your product ranks against real shopping queries across AI agents</p>
        </div>

        {/* ── Config ── */}
        <div className="sim-config">
          <div className="sim-config-label">Simulation parameters</div>

          <div className="sim-config-grid">

            <div className="sim-field">
              <label className="sim-label">Buyer query</label>
              <input
                className="sim-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. best waterproof hiking boots"
              />
            </div>

            <div className="sim-field">
              <label className="sim-label">AI agent</label>
              <select className="sim-select" value={agent} onChange={(e) => setAgent(e.target.value)}>
                {AGENTS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div className="sim-field">
              <label className="sim-label">Your product</label>
              <select className="sim-select" value={product} onChange={(e) => setProduct(e.target.value)}>
                {products?.map((p: any) => (
                  <option key={p.productId} value={p.productId}>{p.title}</option>
                ))}
              </select>
            </div>

            <button className="sim-run-btn" onClick={handleRun} disabled={running}>
              {running ? (
                <>
                  <span className="sim-spinner" />
                  Running
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M3.5 2.5l7 4-7 4v-8z" fill="currentColor" />
                  </svg>
                  Run simulation
                </>
              )}
            </button>

          </div>
        </div>

        {/* ── Loading ── */}
        {running && (
          <div className="sim-loading">
            <span className="sim-loading-dot" />
            Running AI simulation across {agent}…
          </div>
        )}

        {/* ── Empty state ── */}
        {!running && !ran && (
          <div className="sim-empty">
            <div className="sim-empty-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 3l11 6-11 6V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="sim-empty-title">No simulation run yet</div>
            <div className="sim-empty-desc">Configure a buyer query, pick an AI agent and product, then run a simulation to see how it ranks.</div>
          </div>
        )}

        {/* ── Results ── */}
        {ran && data && (
          <div className="sim-results">

            <div className="sim-col">

              {/* Rank */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <span className="sim-panel-title">Simulation result</span>
                </div>
                <div className="sim-panel-body">
                  <div className="rank-display">
                    <div className="rank-num">#{data?.rankedAt}</div>
                    <div className="rank-info">
                      <div className="rank-total">Ranked among {data?.totalResults} products</div>
                      <div>
                        <span className="rank-confidence" style={{ color: confidenceColor }}>
                          Confidence: {data?.confidenceScore}%
                        </span>
                        <div className="rank-conf-bar">
                          <div className="rank-conf-fill" style={{ width: `${data?.confidenceScore ?? 0}%`, background: confidenceColor }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Positives */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <span className="sim-panel-title">Why it ranked</span>
                </div>
                <div className="sim-panel-body">
                  {data?.positives?.length === 0 || !data?.positives ? (
                    <div className="insight-empty">No ranking signals found.</div>
                  ) : (
                    data.positives.map((p: any, i: number) => (
                      <div className="insight-item" key={i}>
                        <div className="insight-title" style={{ color: "var(--green)" }}>{p.title}</div>
                        <div className="insight-detail">{p.detail}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right side */}
            <div className="sim-col">
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <span className="sim-panel-title">Semantic gaps</span>
                </div>
                <div className="sim-panel-body">
                  {data?.gaps?.length === 0 || !data?.gaps ? (
                    <div className="insight-empty">No semantic gaps detected.</div>
                  ) : (
                    data.gaps.map((g: any, i: number) => (
                      <div className="insight-item" key={i}>
                        <div className="insight-title" style={{ color: "var(--amber)" }}>{g.title}</div>
                        <div className="insight-detail">{g.detail}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}