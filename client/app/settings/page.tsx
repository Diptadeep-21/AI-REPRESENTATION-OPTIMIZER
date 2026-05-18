"use client";

import { useState } from "react";

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={checked} style={{
      width: 44, height: 24, borderRadius: 12, flexShrink: 0, border: "none",
      background: checked ? "#4d7aff" : "rgba(255,255,255,0.08)",
      outline: `1px solid ${checked ? "rgba(77,122,255,0.5)" : "rgba(255,255,255,0.10)"}`,
      position: "relative", cursor: "pointer", transition: "all 0.2s",
      boxShadow: checked ? "0 0 12px rgba(77,122,255,0.35)" : "none",
    }}>
      <span style={{
        position: "absolute", top: 3, left: checked ? 22 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s cubic-bezier(.4,0,.2,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ online, label }: { online: boolean; label: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: online ? "rgba(22,185,140,0.10)" : "rgba(240,104,58,0.10)",
      border: `1px solid ${online ? "rgba(22,185,140,0.25)" : "rgba(240,104,58,0.25)"}`,
      color: online ? "#16b98c" : "#f0683a",
      fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100, flexShrink: 0,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: online ? "#16b98c" : "#f0683a",
        boxShadow: `0 0 6px ${online ? "rgba(22,185,140,0.6)" : "rgba(240,104,58,0.6)"}`,
        animation: online ? "blink 2s ease infinite" : "none",
      }} />
      {label}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#0b1120", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, fontSize: 16, flexShrink: 0,
          background: "rgba(77,122,255,0.10)", border: "1px solid rgba(77,122,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</div>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#2d3748" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ title, desc, status, online = true }: {
  title: string; desc: string; status: string; online?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 10, padding: "13px 16px", gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#e8edf5", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#4a5568" }}>{desc}</div>
      </div>
      <StatusPill online={online} label={status} />
    </div>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({ title, desc, checked, onChange }: {
  title: string; desc: string; checked: boolean; onChange: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
      borderRadius: 10, padding: "13px 16px", gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#e8edf5", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [storeName,            setStoreName]            = useState("AI Commerce Store");
  const [storeUrl,             setStoreUrl]             = useState("your-store.myshopify.com");
  const [aiModel,              setAiModel]              = useState("GPT-4o Shopping");
  const [scanFrequency,        setScanFrequency]        = useState("daily");
  const [semanticOptimization, setSemanticOptimization] = useState(true);
  const [notifications,        setNotifications]        = useState(true);
  const [autoSimulation,       setAutoSimulation]       = useState(true);
  const [autoSchema,           setAutoSchema]           = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sharedInputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9,
    padding: "10px 14px", color: "#e8edf5",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes pop    { 0%{transform:scale(0.9);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        .sp-root {
          width: 100%;
          display: flex; flex-direction: column; gap: 24px;
          font-family: 'DM Sans', sans-serif; color: #e8edf5;
          animation: fadeUp 0.4s ease both;
        }

        /* Two-column grid for section pairs */
        .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        @media(max-width: 900px) { .sp-grid { grid-template-columns: 1fr; } }

        /* select styling */
        .sp-select {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 9px;
          padding: 10px 14px; color: #e8edf5;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; outline: none;
          transition: border-color 0.15s; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          padding-right: 36px;
        }
        .sp-select:focus { border-color: rgba(77,122,255,0.40); }
        .sp-select option { background: #0b1120; color: #e8edf5; }

        /* Save button */
        .sp-save-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #4d7aff; color: #fff; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
          padding: 11px 28px; border-radius: 10px; cursor: pointer;
          transition: opacity 0.15s, box-shadow 0.15s, background 0.2s;
        }
        .sp-save-btn:hover  { opacity: 0.87; box-shadow: 0 0 20px rgba(77,122,255,0.35); }
        .sp-save-btn.saved  { background: #16b98c; box-shadow: 0 0 16px rgba(22,185,140,0.35); }

        /* Toast */
        .sp-toast {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(22,185,140,0.10); border: 1px solid rgba(22,185,140,0.25);
          color: #16b98c; font-size: 12.5px; font-weight: 500;
          padding: 8px 14px; border-radius: 100px;
          animation: pop 0.3s ease both;
        }

        /* Danger zone */
        .sp-danger {
          background: #0b1120; border: 1px solid rgba(240,104,58,0.18);
          border-radius: 14px; overflow: hidden;
        }
        .sp-danger-hd {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 24px; border-bottom: 1px solid rgba(240,104,58,0.10);
        }
        .sp-danger-body { padding: 20px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media(max-width:700px){ .sp-danger-body { grid-template-columns: 1fr; } }
        .sp-danger-row {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(240,104,58,0.03); border: 1px solid rgba(240,104,58,0.08);
          border-radius: 10px; padding: 13px 16px; gap: 16px;
        }
        .sp-danger-btn {
          flex-shrink: 0; font-size: 12px; color: #f0683a; font-weight: 500;
          background: rgba(240,104,58,0.08); border: 1px solid rgba(240,104,58,0.20);
          border-radius: 7px; padding: 6px 14px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: background 0.15s; white-space: nowrap;
        }
        .sp-danger-btn:hover { background: rgba(240,104,58,0.14); }
      `}</style>

      <div className="sp-root">

        {/* ── Row 1: Store + AI Engine ── */}
        <div className="sp-grid">

          <Section icon="🏪" title="Store Configuration">
            <Field label="Store Name">
              <input
                type="text" value={storeName} style={sharedInputStyle}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Your store display name"
                onFocus={(e) => (e.target.style.borderColor = "rgba(77,122,255,0.40)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </Field>
            <Field label="Shopify URL">
              <input
                type="text" value={storeUrl} style={sharedInputStyle}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="your-store.myshopify.com"
                onFocus={(e) => (e.target.style.borderColor = "rgba(77,122,255,0.40)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </Field>
            <InfoRow
              title="Shopify Integration"
              desc="OAuth token active — product catalog syncing."
              status="Connected" online={true}
            />
          </Section>

          <Section icon="🤖" title="AI Engine Configuration">
            <Field label="Active AI Model">
              <select className="sp-select" value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
                <option>GPT-4o Shopping</option>
                <option>Gemini 1.5 Pro</option>
                <option>Claude 3.5</option>
                <option>Perplexity AI</option>
              </select>
            </Field>
            <Field label="Scan Frequency">
              <select className="sp-select" value={scanFrequency} onChange={(e) => setScanFrequency(e.target.value)}>
                <option value="realtime">Real-time (on product update)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual only</option>
              </select>
            </Field>
            <InfoRow
              title="AI Engine Status"
              desc="FastAPI semantic engine is operational."
              status="Online" online={true}
            />
            <InfoRow
              title="Last Full Scan"
              desc="All products re-indexed against active model."
              status="Just now" online={true}
            />
          </Section>

        </div>

        {/* ── Row 2: Optimisation preferences (full width) ── */}
        <Section icon="⚡" title="Optimisation Preferences">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <ToggleRow
              title="Semantic Optimisation"
              desc="Automatically enhance semantic metadata on product pages."
              checked={semanticOptimization}
              onChange={() => setSemanticOptimization(!semanticOptimization)}
            />
            <ToggleRow
              title="Auto Simulation"
              desc="Run AI agent simulations after each analysis cycle."
              checked={autoSimulation}
              onChange={() => setAutoSimulation(!autoSimulation)}
            />
            <ToggleRow
              title="Auto Schema Injection"
              desc="Push validated JSON-LD schema fixes directly to Shopify."
              checked={autoSchema}
              onChange={() => setAutoSchema(!autoSchema)}
            />
            <ToggleRow
              title="Visibility Notifications"
              desc="Receive alerts when AI visibility drops or issues appear."
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>
        </Section>

        {/* ── Row 3: Danger zone (full width) ── */}
        <div className="sp-danger">
          <div className="sp-danger-hd">
            <div style={{
              width: 34, height: 34, borderRadius: 9, fontSize: 16, flexShrink: 0,
              background: "rgba(240,104,58,0.10)", border: "1px solid rgba(240,104,58,0.20)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>⚠️</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: "#f0683a" }}>
              Danger Zone
            </div>
          </div>
          <div className="sp-danger-body">
            <div className="sp-danger-row">
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: "#e8edf5", marginBottom: 3 }}>Clear All Analyses</div>
                <div style={{ fontSize: 12, color: "#4a5568" }}>Delete all cached AI analysis data. Cannot be undone.</div>
              </div>
              <button className="sp-danger-btn">Clear Data</button>
            </div>
            <div className="sp-danger-row">
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: "#e8edf5", marginBottom: 3 }}>Disconnect Store</div>
                <div style={{ fontSize: 12, color: "#4a5568" }}>Remove Shopify integration and revoke access tokens.</div>
              </div>
              <button className="sp-danger-btn">Disconnect</button>
            </div>
          </div>
        </div>

        {/* ── Save row ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, paddingBottom: 8 }}>
          {saved && (
            <div className="sp-toast"><span>✓</span> Settings saved</div>
          )}
          <button className={`sp-save-btn${saved ? " saved" : ""}`} onClick={handleSave}>
            {saved ? "✓ Saved" : "Save Settings"}
          </button>
        </div>

      </div>
    </>
  );
}