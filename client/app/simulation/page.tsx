"use client";

import { useState } from "react";

import { useQuery }
  from "@tanstack/react-query";

import { useEffect } from "react";

import {
  getProductsIntelligence,
} from "@/services/productService";

import {
  runSimulation,
} from "@/services/simulationService";

const AGENTS = [
  "GPT-4o Shopping",
  "Gemini 1.5 Pro",
  "Perplexity AI",
  "Claude 3.5",
];

export default function
  SimulationPage() {

  /*
   =====================================
   FETCH PRODUCTS
   =====================================
  */

  const {
    data: products,
  } = useQuery({

    queryKey: ["products"],

    queryFn:
      getProductsIntelligence,
  });

  /*
   =====================================
   STATE
   =====================================
  */

  const [query, setQuery]
    = useState(
      "best waterproof hiking boots"
    );

  const [agent, setAgent]
    = useState(
      "GPT-4o Shopping"
    );

  const [product, setProduct] = useState<string>("");

  const [running,
    setRunning] =
    useState(false);

  const [ran, setRan]
    = useState(false);

  const [
    simulationResult,

    setSimulationResult,
  ] = useState<any>(null);

  useEffect(() => {

    if (
      products?.length &&
      !product
    ) {

      setProduct(
        products[0].productId
      );
    }

  }, [products]);

  /*
   =====================================
   RUN SIMULATION
   =====================================
  */

  const handleRun =
    async () => {

      try {

        setRunning(true);

        setRan(false);

        const result =
          await runSimulation({

            query,

            product,

            agent,
          });

        setSimulationResult(
          result
        );

        setRan(true);

      } catch (error) {

        console.error(
          "Simulation failed",
          error
        );

      } finally {

        setRunning(false);
      }
    };

  /*
   =====================================
   RESULT
   =====================================
  */

  const data =
    simulationResult;

  return (
    <>

      {/* KEEP YOUR EXISTING STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .sim-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 24px; }

        .sim-config {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 22px;
        }

        .sim-config-grid {
          display: grid;
          grid-template-columns: 1fr 200px 200px auto;
          gap: 10px;
          align-items: end;
        }

        @media(max-width:900px){
          .sim-config-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .sim-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sim-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #2d3748;
        }

        .sim-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          padding: 10px 14px;
          color: #e8edf5;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          width: 100%;
        }

        .sim-select {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          padding: 10px 12px;
          color: #94a3b8;
          font-size: 13px;
          outline: none;
          width: 100%;
        }

        .sim-run-btn {
          background: #4d7aff;
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: 10px 22px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          height: 40px;
        }

        .sim-results {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
        }

        @media(max-width:1000px){
          .sim-results {
            grid-template-columns: 1fr;
          }
        }

        .sim-panel {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
        }

        .sim-panel-hd {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .sim-panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
        }

        .sim-panel-body {
          padding: 20px;
        }

        .rank-display {
          display: flex;
          gap: 20px;
          padding: 20px;
          background: rgba(77,122,255,0.05);
          border-radius: 12px;
        }

        .rank-num {
          font-size: 52px;
          font-weight: 800;
          color: #4d7aff;
        }

      `}</style>

      <div className="sim-root">

        {/* CONFIG */}

        <div className="sim-config">

          <div
            style={{
              marginBottom: 16,
            }}
          >

            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#e8edf5",
              }}
            >

              Simulation Parameters

            </div>

          </div>

          <div className="sim-config-grid">

            {/* QUERY */}

            <div className="sim-field">

              <label className="sim-label">

                Buyer Query

              </label>

              <input
                className="sim-input"
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
              />

            </div>

            {/* AGENT */}

            <div className="sim-field">

              <label className="sim-label">

                AI Agent

              </label>

              <select
                className="sim-select"
                value={agent}
                onChange={(e) =>
                  setAgent(
                    e.target.value
                  )
                }
              >

                {AGENTS.map(
                  (a) => (

                    <option key={a}>

                      {a}

                    </option>
                  )
                )}

              </select>

            </div>

            {/* PRODUCT */}

            <div className="sim-field">

              <label className="sim-label">

                Your Product

              </label>

              <select
                className="sim-select"
                value={product}
                onChange={(e) =>
                  setProduct(
                    e.target.value
                  )
                }
              >

                {products?.map(
                  (p: any) => (

                    <option
                      key={p.productId}
                      value={p.productId}
                    >
                      {p.title}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* BUTTON */}

            <button
              className="sim-run-btn"
              onClick={handleRun}
              disabled={running}
            >

              {running
                ? "Running..."
                : "▶ Run Simulation"}

            </button>

          </div>

        </div>

        {/* LOADING */}

        {running && (

          <div className="sim-panel">

            <div
              className="sim-panel-body"
            >

              Running AI simulation...

            </div>

          </div>
        )}

        {/* RESULTS */}

        {ran &&
          data && (

            <div className="sim-results">

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 16,
                }}
              >

                {/* RANK */}

                <div className="sim-panel">

                  <div className="sim-panel-hd">

                    <div className="sim-panel-title">

                      Simulation Result

                    </div>

                  </div>

                  <div className="sim-panel-body">

                    <div className="rank-display">

                      <div>

                        <div
                          className="rank-num"
                        >

                          #
                          {
                            data?.rankedAt
                          }

                        </div>

                      </div>

                      <div>

                        <div
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >

                          Ranked among
                          {" "}
                          {
                            data?.totalResults
                          }
                          {" "}
                          products

                        </div>

                        <div
                          style={{
                            marginTop: 12,
                            color:
                              "#4d7aff",
                          }}
                        >

                          Confidence:
                          {" "}
                          {
                            data?.confidenceScore
                          }
                          %

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* POSITIVES */}

                <div className="sim-panel">

                  <div className="sim-panel-hd">

                    <div className="sim-panel-title">

                      Why It Ranked

                    </div>

                  </div>

                  <div className="sim-panel-body">

                    {data?.positives?.map(
                      (
                        p: any,
                        i: number
                      ) => (

                        <div
                          key={i}
                          style={{
                            marginBottom:
                              14,
                          }}
                        >

                          <div
                            style={{
                              color:
                                "#5ed8b4",
                              fontWeight:
                                600,
                            }}
                          >

                            {p.title}

                          </div>

                          <div
                            style={{
                              color:
                                "#94a3b8",
                              fontSize:
                                13,
                            }}
                          >

                            {p.detail}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>

              {/* RIGHT SIDE */}

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 16,
                }}
              >

                {/* GAPS */}

                <div className="sim-panel">

                  <div className="sim-panel-hd">

                    <div className="sim-panel-title">

                      Semantic Gaps

                    </div>

                  </div>

                  <div className="sim-panel-body">

                    {data?.gaps?.map(
                      (
                        g: any,
                        i: number
                      ) => (

                        <div
                          key={i}
                          style={{
                            marginBottom:
                              14,
                          }}
                        >

                          <div
                            style={{
                              color:
                                "#f5b429",
                              fontWeight:
                                600,
                            }}
                          >

                            {g.title}

                          </div>

                          <div
                            style={{
                              color:
                                "#94a3b8",
                              fontSize:
                                13,
                            }}
                          >

                            {g.detail}

                          </div>

                        </div>
                      )
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