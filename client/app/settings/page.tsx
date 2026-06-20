"use client";

import { useState } from "react";

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button className={`toggle${checked ? " on" : ""}`} onClick={onChange} role="switch" aria-checked={checked}>
      <span className="toggle-knob" />
    </button>
  );
}

// ── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ online, label }: { online: boolean; label: string }) {
  return (
    <div className={`status-pill${online ? " online" : " offline"}`}>
      <span className="status-dot" />
      {label}
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="panel">
      <div className="panel-hd">
        <div className="panel-icon">{icon}</div>
        <div className="panel-title">{title}</div>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ title, desc, status, online = true }: {
  title: string; desc: string; status: string; online?: boolean;
}) {
  return (
    <div className="row">
      <div>
        <div className="row-title">{title}</div>
        <div className="row-desc">{desc}</div>
      </div>
      <StatusPill online={online} label={status} />
    </div>
  );
}

// ── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({ title, desc, checked, onChange }: {
  title: string; desc: string; checked: boolean; onChange: () => void;
}) {
  return (
    <div className="row">
      <div>
        <div className="row-title">{title}</div>
        <div className="row-desc">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [storeName,            setStoreName]            = useState("AI Commerce Store");
  const [storeUrl,             setStoreUrl]             = useState("your-store.myshopify.com");
  const [aiModel,               setAiModel]              = useState("GPT-4o Shopping");
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
        @keyframes blink  { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes pop    { 0% { transform: scale(0.92); opacity: 0; } 60% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }

        .sp-root {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 48px 80px;
          display: flex; flex-direction: column; gap: 28px;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── page header ── */
        .sp-hd { padding-bottom: 28px; border-bottom: 1px solid var(--border); }
        .sp-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 8px;
        }
        .sp-title {
          font-family: var(--font-serif);
          font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink);
        }
        .sp-sub { font-size: 14px; color: var(--ink2); margin-top: 6px; font-weight: 300; }

        /* ── grid ── */
        .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }

        /* ── panel ── */
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .panel-hd {
          display: flex; align-items: center; gap: 13px;
          padding: 18px 24px; border-bottom: 1px solid var(--border);
        }
        .panel-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; color: var(--ink2);
        }
        .panel-title { font-family: var(--font-serif); font-size: 16px; letter-spacing: -0.01em; color: var(--ink); }
        .panel-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }

        /* ── field ── */
        .field { display: flex; flex-direction: column; gap: 8px; }
        .field-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink3);
        }
        .sp-input {
          width: 100%; background: var(--surface2);
          border: 1px solid var(--border); border-radius: 9px;
          padding: 10px 14px; color: var(--ink);
          font-family: var(--font); font-size: 13.5px; outline: none;
          transition: border-color 0.2s;
        }
        .sp-input::placeholder { color: var(--ink3); }
        .sp-input:focus { border-color: var(--border-mid); }

        .sp-select {
          width: 100%; background: var(--surface2);
          border: 1px solid var(--border); border-radius: 9px;
          padding: 10px 14px; color: var(--ink);
          font-family: var(--font); font-size: 13.5px; outline: none;
          transition: border-color 0.2s; cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238c8a83' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          padding-right: 36px;
        }
        .sp-select:focus { border-color: var(--border-mid); }
        .sp-select option { background: var(--surface); color: var(--ink); }

        /* ── info/toggle row ── */
        .row {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.015); border: 1px solid var(--border);
          border-radius: 11px; padding: 14px 16px; gap: 16px;
        }
        .row-title { font-size: 13.5px; font-weight: 500; color: var(--ink); margin-bottom: 3px; }
        .row-desc { font-size: 12px; color: var(--ink3); line-height: 1.5; font-weight: 300; }

        .toggle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* ── toggle switch ── */
        .toggle {
          width: 42px; height: 24px; border-radius: 12px; flex-shrink: 0; border: 1px solid var(--border);
          background: var(--surface3); position: relative; cursor: pointer;
          transition: background 0.2s, border-color 0.2s; padding: 0;
        }
        .toggle.on { background: var(--green); border-color: var(--green); }
        .toggle-knob {
          position: absolute; top: 2px; left: 2px;
          width: 18px; height: 18px; border-radius: 50%; background: var(--ink);
          transition: left 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .toggle.on .toggle-knob { left: 21px; background: var(--bg); }

        /* ── status pill ── */
        .status-pill {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 500; padding: 5px 13px;
          border-radius: 100px; flex-shrink: 0;
        }
        .status-pill.online  { background: rgba(62,207,142,0.1);  border: 1px solid rgba(62,207,142,0.22);  color: var(--green); }
        .status-pill.offline { background: rgba(224,85,85,0.1);   border: 1px solid rgba(224,85,85,0.22);   color: var(--red);   }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .status-pill.online .status-dot { animation: blink 2.2s ease infinite; }

        /* ── save row ── */
        .sp-save-row { display: flex; justify-content: flex-end; align-items: center; gap: 14px; }
        .sp-save-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--ink); color: var(--bg); border: none;
          font-family: var(--font); font-size: 13.5px; font-weight: 500;
          padding: 11px 26px; border-radius: 10px; cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, background 0.2s;
        }
        .sp-save-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .sp-save-btn.saved { background: var(--green); color: var(--bg); }
        .sp-toast {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(62,207,142,0.1); border: 1px solid rgba(62,207,142,0.22);
          color: var(--green); font-size: 12.5px; font-weight: 500;
          padding: 8px 15px; border-radius: 100px;
          animation: pop 0.3s ease both;
        }

        /* ── danger zone ── */
        .sp-danger { background: var(--surface); border: 1px solid rgba(224,85,85,0.18); border-radius: 16px; overflow: hidden; }
        .sp-danger-hd {
          display: flex; align-items: center; gap: 13px;
          padding: 18px 24px; border-bottom: 1px solid rgba(224,85,85,0.15);
        }
        .sp-danger-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(224,85,85,0.1); border: 1px solid rgba(224,85,85,0.22);
          display: flex; align-items: center; justify-content: center; color: var(--red);
        }
        .sp-danger-title { font-family: var(--font-serif); font-size: 16px; letter-spacing: -0.01em; color: var(--red); }
        .sp-danger-body { padding: 22px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .sp-danger-row {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(224,85,85,0.04); border: 1px solid rgba(224,85,85,0.1);
          border-radius: 11px; padding: 14px 16px; gap: 16px;
        }
        .sp-danger-btn {
          flex-shrink: 0; font-size: 12px; color: var(--red); font-weight: 500;
          background: rgba(224,85,85,0.08); border: 1px solid rgba(224,85,85,0.22);
          border-radius: 8px; padding: 7px 15px; cursor: pointer;
          font-family: var(--font); transition: background 0.2s; white-space: nowrap;
        }
        .sp-danger-btn:hover { background: rgba(224,85,85,0.16); }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .sp-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .sp-danger-body { grid-template-columns: 1fr; }
          .toggle-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 680px) {
          .sp-root { padding: 24px 20px 60px; gap: 24px; }
          .sp-save-row { flex-direction: column-reverse; align-items: stretch; }
          .sp-save-btn { justify-content: center; }
          .row { flex-direction: column; align-items: flex-start; gap: 10px; }
        }
      `}</style>

      <div className="sp-root">

        {/* ── Page header ── */}
        <div className="sp-hd">
          <p className="sp-eyebrow">Configuration</p>
          <h1 className="sp-title">Settings</h1>
          <p className="sp-sub">Manage your store connection, AI engine, and optimization preferences</p>
        </div>

        {/* ── Row 1: Store + AI Engine ── */}
        <div className="sp-grid">

          <Section
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 6l1-3.5h10L14 6M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6M2 6h12M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Store configuration"
          >
            <Field label="Store name">
              <input
                type="text" value={storeName} className="sp-input"
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Your store display name"
              />
            </Field>
            <Field label="Shopify URL">
              <input
                type="text" value={storeUrl} className="sp-input"
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="your-store.myshopify.com"
              />
            </Field>
            <InfoRow
              title="Shopify integration"
              desc="OAuth token active — product catalog syncing."
              status="Connected" online={true}
            />
          </Section>

          <Section
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 2v2.5M8 11.5V14M2 8h2.5M11.5 8H14M3.8 3.8l1.8 1.8M10.4 10.4l1.8 1.8M3.8 12.2l1.8-1.8M10.4 5.6l1.8-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            }
            title="AI engine configuration"
          >
            <Field label="Active AI model">
              <select className="sp-select" value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
                <option>GPT-4o Shopping</option>
                <option>Gemini 1.5 Pro</option>
                <option>Claude 3.5</option>
                <option>Perplexity AI</option>
              </select>
            </Field>
            <Field label="Scan frequency">
              <select className="sp-select" value={scanFrequency} onChange={(e) => setScanFrequency(e.target.value)}>
                <option value="realtime">Real-time (on product update)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual only</option>
              </select>
            </Field>
            <InfoRow
              title="AI engine status"
              desc="FastAPI semantic engine is operational."
              status="Online" online={true}
            />
            <InfoRow
              title="Last full scan"
              desc="All products re-indexed against active model."
              status="Just now" online={true}
            />
          </Section>

        </div>

        {/* ── Row 2: Optimisation preferences ── */}
        <Section
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M9 1L3 9h4l-1 6 6-8H8l1-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          }
          title="Optimisation preferences"
        >
          <div className="toggle-grid">
            <ToggleRow
              title="Semantic optimisation"
              desc="Automatically enhance semantic metadata on product pages."
              checked={semanticOptimization}
              onChange={() => setSemanticOptimization(!semanticOptimization)}
            />
            <ToggleRow
              title="Auto simulation"
              desc="Run AI agent simulations after each analysis cycle."
              checked={autoSimulation}
              onChange={() => setAutoSimulation(!autoSimulation)}
            />
            <ToggleRow
              title="Auto schema injection"
              desc="Push validated JSON-LD schema fixes directly to Shopify."
              checked={autoSchema}
              onChange={() => setAutoSchema(!autoSchema)}
            />
            <ToggleRow
              title="Visibility notifications"
              desc="Receive alerts when AI visibility drops or issues appear."
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>
        </Section>

        {/* ── Row 3: Danger zone ── */}
        <div className="sp-danger">
          <div className="sp-danger-hd">
            <div className="sp-danger-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5l6.5 11.5H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
              </svg>
            </div>
            <div className="sp-danger-title">Danger zone</div>
          </div>
          <div className="sp-danger-body">
            <div className="sp-danger-row">
              <div>
                <div className="row-title">Clear all analyses</div>
                <div className="row-desc">Delete all cached AI analysis data. Cannot be undone.</div>
              </div>
              <button className="sp-danger-btn">Clear data</button>
            </div>
            <div className="sp-danger-row">
              <div>
                <div className="row-title">Disconnect store</div>
                <div className="row-desc">Remove Shopify integration and revoke access tokens.</div>
              </div>
              <button className="sp-danger-btn">Disconnect</button>
            </div>
          </div>
        </div>

        {/* ── Save row ── */}
        <div className="sp-save-row">
          {saved && (
            <div className="sp-toast">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Settings saved
            </div>
          )}
          <button className={`sp-save-btn${saved ? " saved" : ""}`} onClick={handleSave}>
            {saved && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7l3 3 6-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {saved ? "Saved" : "Save settings"}
          </button>
        </div>

      </div>
    </>
  );
}