"use client";

import { useState } from "react";
import { simulationData, products } from "@/lib/mockData";

const AGENTS = ["GPT-4o Shopping", "Gemini 1.5 Pro", "Perplexity AI", "Claude 3.5"];

export default function SimulationPage() {
  const [query, setQuery]         = useState(simulationData.query);
  const [agent, setAgent]         = useState(simulationData.agentModel);
  const [product, setProduct]     = useState(products[1].name); // Running Shoes
  const [running, setRunning]     = useState(false);
  const [ran, setRan]             = useState(true);

  const data = simulationData;

  const handleRun = () => {
    setRunning(true);
    setRan(false);
    setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 1800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .sim-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 24px; }

        /* Config card */
        .sim-config {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 22px;
        }
        .sim-config-grid {
          display: grid; grid-template-columns: 1fr 200px 200px auto;
          gap: 10px; align-items: end;
        }
        @media(max-width:900px){ .sim-config-grid { grid-template-columns: 1fr 1fr; } }

        .sim-field { display: flex; flex-direction: column; gap: 6px; }
        .sim-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #2d3748; }
        .sim-input {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 10px 14px;
          color: #e8edf5; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.15s; width: 100%;
        }
        .sim-input::placeholder { color: #2d3748; }
        .sim-input:focus { border-color: rgba(77,122,255,0.35); }
        .sim-select {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px; padding: 10px 12px;
          color: #94a3b8; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; cursor: pointer; width: 100%;
        }
        .sim-run-btn {
          background: #4d7aff; color: #fff;
          border: none; border-radius: 9px;
          padding: 10px 22px; font-size: 13.5px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; white-space: nowrap;
          transition: opacity 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; gap: 8px;
          height: 40px;
        }
        .sim-run-btn:hover  { opacity: 0.85; box-shadow: 0 0 18px rgba(77,122,255,0.35); }
        .sim-run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.7s linear infinite; }

        /* Results layout */
        .sim-results { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
        @media(max-width:1000px){ .sim-results { grid-template-columns: 1fr; } }

        /* Panel */
        .sim-panel {
          background: #0b1120; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
        }
        .sim-panel-hd {
          padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .sim-panel-title {
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: -0.02em;
        }
        .sim-panel-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

        /* Rank display */
        .rank-display {
          display: flex; align-items: center; gap: 20px;
          padding: 20px;
          background: rgba(77,122,255,0.05);
          border: 1px solid rgba(77,122,255,0.15);
          border-radius: 12px;
        }
        .rank-num {
          font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800;
          letter-spacing: -0.05em; color: #4d7aff; line-height: 1;
          flex-shrink: 0;
        }
        .rank-of { font-size: 14px; color: #2d3748; }
        .rank-label { font-size: 13px; color: #64748b; margin-top: 4px; }
        .rank-conf-bar { margin-top: 10px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; width: 120px; }
        .rank-conf-fill { height: 100%; border-radius: 99px; background: #4d7aff; }
        .rank-conf-label { font-size: 11px; color: #4d7aff; margin-top: 4px; }

        /* Positive / gap items */
        .sim-pos-item {
          border-left: 2px solid #16b98c;
          padding: 10px 14px;
          background: rgba(22,185,140,0.04);
          border-radius: 0 8px 8px 0;
        }
        .sim-gap-item {
          border-left: 2px solid #f5b429;
          padding: 10px 14px;
          background: rgba(245,180,41,0.04);
          border-radius: 0 8px 8px 0;
        }
        .sim-item-title { font-size: 13px; font-weight: 500; color: #e8edf5; margin-bottom: 3px; }
        .sim-item-detail { font-size: 12px; color: #64748b; line-height: 1.5; }

        /* Competitor table */
        .comp-list { display: flex; flex-direction: column; gap: 8px; }
        .comp-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px;
          border-radius: 9px; border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
        }
        .comp-row.you {
          border-color: rgba(77,122,255,0.25);
          background: rgba(77,122,255,0.06);
        }
        .comp-rank { font-size: 11px; color: #2d3748; width: 18px; text-align: center; flex-shrink: 0; }
        .comp-name { font-size: 13px; color: #94a3b8; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .comp-name.you { color: #8aabff; font-weight: 500; }
        .comp-score { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .comp-reason { font-size: 10.5px; color: #2d3748; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Suggested queries */
        .query-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .query-chip {
          font-size: 12px; color: #64748b;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px; padding: 5px 12px;
          cursor: pointer; transition: all 0.15s;
        }
        .query-chip:hover { border-color: rgba(77,122,255,0.3); color: #8aabff; background: rgba(77,122,255,0.07); }

        /* Section label */
        .sim-section-label {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #2d3748;
        }

        /* Loading overlay */
        .sim-loading {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; padding: 60px 24px; color: #2d3748; font-size: 13px;
        }
        .sim-loading-ring {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2.5px solid rgba(77,122,255,0.15);
          border-top-color: #4d7aff;
          animation: spin 0.8s linear infinite;
        }
        .sim-loading-text { color: #4a5568; }
      `}</style>

      <div className="sim-root">

        {/* Config */}
        <div className="sim-config">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: "#e8edf5", letterSpacing: "-0.02em" }}>
              Simulation Parameters
            </div>
            <div style={{ fontSize: 12, color: "#2d3748", marginTop: 2 }}>
              Simulate how an AI shopping agent responds to a buyer query and ranks your product
            </div>
          </div>
          <div className="sim-config-grid">
            <div className="sim-field">
              <label className="sim-label">Buyer Query</label>
              <input
                className="sim-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Best waterproof hiking shoes under $120"
              />
            </div>
            <div className="sim-field">
              <label className="sim-label">AI Agent</label>
              <select className="sim-select" value={agent} onChange={(e) => setAgent(e.target.value)}>
                {AGENTS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="sim-field">
              <label className="sim-label">Your Product</label>
              <select className="sim-select" value={product} onChange={(e) => setProduct(e.target.value)}>
                {products.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
            <button className="sim-run-btn" onClick={handleRun} disabled={running}>
              {running
                ? <><span className="spinning" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} /> Running…</>
                : <>▶ Run Simulation</>
              }
            </button>
          </div>
        </div>

        {/* Results */}
        {!ran && !running && null}
        {running && (
          <div className="sim-panel">
            <div className="sim-loading">
              <div className="sim-loading-ring" />
              <div className="sim-loading-text">Simulating {agent} response…</div>
            </div>
          </div>
        )}

        {ran && !running && (
          <div className="sim-results">

            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Rank + confidence */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <div className="sim-panel-title">Simulation Result</div>
                  <div style={{ fontSize: 11.5, color: "#2d3748" }}>{agent} · "{query.slice(0, 40)}{query.length > 40 ? "…" : ""}"</div>
                </div>
                <div className="sim-panel-body">
                  <div className="rank-display">
                    <div>
                      <div style={{ fontSize: 11, color: "#4d7aff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Ranked</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span className="rank-num">#{data.rankedAt}</span>
                        <span className="rank-of">of {data.totalResults}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="rank-label">AI Confidence Score</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                        <div className="rank-conf-bar">
                          <div className="rank-conf-fill" style={{ width: `${data.confidenceScore}%` }} />
                        </div>
                        <span className="rank-conf-label">{data.confidenceScore}%</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#4a5568", marginTop: 8, lineHeight: 1.5 }}>
                        Your product was included in the recommendation set but ranked below two competitors with richer spec data.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why recommended */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <div className="sim-panel-title" style={{ color: "#5ed8b4" }}>✓ Why It Was Recommended</div>
                </div>
                <div className="sim-panel-body">
                  {data.positives.map((p, i) => (
                    <div className="sim-pos-item" key={i}>
                      <div className="sim-item-title">{p.title}</div>
                      <div className="sim-item-detail">{p.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <div className="sim-panel-title" style={{ color: "#f5b429" }}>⚠ Gaps Holding You Back</div>
                </div>
                <div className="sim-panel-body">
                  {data.gaps.map((g, i) => (
                    <div className="sim-gap-item" key={i}>
                      <div className="sim-item-title">{g.title}</div>
                      <div className="sim-item-detail">{g.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Competitor ranking */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <div className="sim-panel-title">Agent Ranking</div>
                </div>
                <div className="sim-panel-body">
                  <div className="comp-list">
                    {data.competitorComparison.map((c, i) => {
                      const isYou = c.name === product || c.name === "Running Shoes Pro X2";
                      const scoreColor = c.score >= 85 ? "#16b98c" : c.score >= 70 ? "#4d7aff" : "#f5b429";
                      return (
                        <div key={i} className={`comp-row${isYou ? " you" : ""}`}>
                          <span className="comp-rank">#{i + 1}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className={`comp-name${isYou ? " you" : ""}`}>{c.name}{isYou ? " (you)" : ""}</div>
                            <div className="comp-reason">{c.reason}</div>
                          </div>
                          <span className="comp-score" style={{ color: scoreColor }}>{c.score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Suggested queries */}
              <div className="sim-panel">
                <div className="sim-panel-hd">
                  <div className="sim-panel-title">Related Queries to Test</div>
                </div>
                <div className="sim-panel-body">
                  <div className="query-chips">
                    {data.suggestedQueries.map((q) => (
                      <div key={q} className="query-chip" onClick={() => setQuery(q)}>{q}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#2d3748", marginTop: 4 }}>
                    Click a query to load it, then re-run the simulation.
                  </div>
                </div>
              </div>

              {/* Quick fix CTA */}
              <div style={{
                background: "rgba(77,122,255,0.07)",
                border: "1px solid rgba(77,122,255,0.20)",
                borderRadius: 12, padding: "18px 18px",
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#8aabff", marginBottom: 8 }}>
                  Fix gaps to reach #1
                </div>
                <div style={{ fontSize: 12.5, color: "#4a5568", lineHeight: 1.6, marginBottom: 14 }}>
                  Resolving the 4 identified gaps could push your product to rank #1 for this query.
                </div>
                <button style={{
                  width: "100%", background: "#4d7aff", color: "#fff",
                  border: "none", borderRadius: 8, padding: "9px 0",
                  fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                }}>
                  View Recommendations →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}