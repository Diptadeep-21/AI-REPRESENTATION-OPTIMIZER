"use client";

import { usePathname } from "next/navigation";
import { Bell, RefreshCw, Download } from "lucide-react";
import { useState } from "react";

const PAGE_META: Record<string, { title: string; sub: string }> = {
  "/dashboard":  { title: "AI Commerce Overview",  sub: "Monitor how AI shopping agents perceive your store" },
  "/analysis":   { title: "AI Visibility Analysis", sub: "Deep-dive into how agents rank your products" },
  "/simulation": { title: "Agent Simulation",       sub: "Simulate real AI shopping agent queries" },
  "/reports":    { title: "Reports",                sub: "Export and share visibility insights" },
  "/settings":   { title: "Settings",               sub: "Manage your store connection and preferences" },
};

export default function Navbar() {
  const pathname = usePathname();
  const [scanning, setScanning] = useState(false);

  const meta = PAGE_META[pathname] ?? { title: "AI Optimizer", sub: "AI Commerce Intelligence" };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .navbar-root {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          height: 60px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(4,7,15,0.85);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 20;
          gap: 16px;
        }

        .navbar-left { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .navbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800;
          letter-spacing: -0.03em; color: #e8edf5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .navbar-sub { font-size: 11.5px; color: #2d3748; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .navbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        .sync-pill {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: #2d3748;
          padding: 4px 10px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          white-space: nowrap;
        }
        .sync-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #16b98c;
          box-shadow: 0 0 5px rgba(22,185,140,0.6);
        }

        .nb-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          padding: 7px 13px; border-radius: 8px;
          cursor: pointer; border: none;
          transition: all 0.15s; text-decoration: none;
        }
        .nb-btn.ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.07);
          color: #4a5568;
        }
        .nb-btn.ghost:hover { border-color: rgba(255,255,255,0.12); color: #94a3b8; }

        .nb-btn.primary {
          background: #4d7aff; color: #fff;
          box-shadow: 0 0 0 0 rgba(77,122,255,0.4);
        }
        .nb-btn.primary:hover {
          opacity: 0.88;
          box-shadow: 0 0 16px rgba(77,122,255,0.35);
        }

        .nb-icon-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.07);
          color: #4a5568; cursor: pointer;
          transition: all 0.15s; position: relative;
        }
        .nb-icon-btn:hover { border-color: rgba(255,255,255,0.12); color: #94a3b8; }

        .notif-badge {
          position: absolute; top: -3px; right: -3px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #f0683a;
          border: 1.5px solid #04070f;
        }

        .avatar-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #4d7aff 0%, #16b98c 100%);
          border: none; cursor: pointer; flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .avatar-btn:hover { opacity: 0.85; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}</style>

      <header className="navbar-root">
        <div className="navbar-left">
          <div className="navbar-title">{meta.title}</div>
          <div className="navbar-sub">{meta.sub}</div>
        </div>

        <div className="navbar-right">
          <div className="sync-pill">
            <span className="sync-dot" />
            Synced · just now
          </div>

          <button
            className="nb-btn ghost"
            onClick={handleScan}
            style={{ gap: 6 }}
          >
            <RefreshCw
              size={13}
              className={scanning ? "spinning" : ""}
              style={{ transition: "none" }}
            />
            {scanning ? "Scanning…" : "Re-scan"}
          </button>

          <button className="nb-btn primary">
            <Download size={13} />
            Export
          </button>

          <button className="nb-icon-btn">
            <Bell size={14} />
            <span className="notif-badge" />
          </button>

          <button className="avatar-btn" />
        </div>
      </header>
    </>
  );
}