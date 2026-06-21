"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, RefreshCw, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useSidebar } from "./SidebarContext";

const PAGE_META: Record<string, { title: string; sub: string }> = {
  "/dashboard":   { title: "AI Commerce Overview", sub: "Monitor how AI shopping agents perceive your store" },
  "/analysis":    { title: "AI Visibility Analysis", sub: "Deep-dive into how agents rank your products" },
  "/simulation":  { title: "Agent Simulation", sub: "Simulate real AI shopping agent queries" },
  "/reports":     { title: "Reports", sub: "Export and share visibility insights" },
  "/settings":    { title: "Settings", sub: "Manage your store connection and preferences" },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  const meta = PAGE_META[pathname] ?? { title: "AI Optimizer", sub: "AI Commerce Intelligence" };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

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
          --font-serif: 'DM Serif Display', serif;
          --font:       'DM Sans', sans-serif;
        }

        .navbar-root {
          display: flex; align-items: center; justify-content: space-between;
          height: 72px; padding: 0 32px;
          border-bottom: 1px solid var(--border);
          background: rgba(17,17,16,0.85);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          position: sticky; top: 0; z-index: 20;
          gap: 16px;
        }

        .navbar-left { display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1; }

        .hamburger-btn {
          display: none;
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          background: var(--surface); border: 1px solid var(--border);
          align-items: center; justify-content: center;
          color: var(--ink2); cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .hamburger-btn:hover { border-color: var(--border-mid); color: var(--ink); }

        .navbar-title-wrap { min-width: 0; }
        .navbar-title {
          font-family: var(--font-serif); font-size: 21px;
          letter-spacing: -0.02em; color: var(--ink); line-height: 1.2;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .navbar-sub {
          margin-top: 3px; font-size: 12.5px; color: var(--ink3); font-weight: 300;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .navbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        .sync-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 12px; border-radius: 999px;
          background: rgba(62,207,142,0.08); border: 1px solid rgba(62,207,142,0.18);
          font-size: 11.5px; color: var(--green); font-weight: 400;
          white-space: nowrap;
        }
        .sync-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

        .nb-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font); font-size: 12.5px; font-weight: 500;
          border-radius: 9px; padding: 8px 15px; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.2s, background 0.2s;
          white-space: nowrap; border: none;
        }
        .nb-btn.ghost {
          background: transparent; border: 1px solid var(--border); color: var(--ink2);
        }
        .nb-btn.ghost:hover { border-color: var(--border-mid); color: var(--ink); }
        .nb-btn.primary {
          background: var(--ink); border: 1px solid var(--ink); color: var(--bg);
        }
        .nb-btn.primary:hover { opacity: 0.85; transform: translateY(-1px); }

        .nb-icon-btn {
          width: 36px; height: 36px; border-radius: 9px;
          background: var(--surface); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--ink2); cursor: pointer; transition: border-color 0.2s, color 0.2s;
          position: relative; flex-shrink: 0;
        }
        .nb-icon-btn:hover { border-color: var(--border-mid); color: var(--ink); }

        .notif-badge {
          position: absolute; top: 7px; right: 7px;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red); border: 2px solid var(--bg);
        }

        .nb-divider { width: 1px; height: 24px; background: var(--border); margin: 0 4px; flex-shrink: 0; }

        .user-block { display: flex; align-items: center; gap: 10px; }
        .user-text { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.25; }
        .user-name { font-size: 12.5px; font-weight: 500; color: var(--ink); white-space: nowrap; }
        .user-email { font-size: 10.5px; color: var(--ink3); white-space: nowrap; }

        .avatar-btn {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(62,207,142,0.12); border: 1px solid rgba(62,207,142,0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--green); font-family: var(--font-serif); font-size: 14px;
          cursor: default;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }

        /* ── tablet ── */
        @media (max-width: 900px) {
          .hamburger-btn { display: flex; }
        }

        /* ── mobile ── */
        @media (max-width: 720px) {
          .navbar-root { padding: 0 16px; height: 64px; gap: 10px; }
          .navbar-sub, .sync-pill, .user-text, .nb-divider { display: none; }
          .nb-btn span { display: none; }
          .nb-btn.ghost { width: 36px; height: 36px; padding: 0; justify-content: center; }
          .navbar-title { font-size: 17px; }
        }
      `}</style>

      <header className="navbar-root">
        <div className="navbar-left">
          <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div className="navbar-title-wrap">
            <div className="navbar-title">{meta.title}</div>
            <div className="navbar-sub">{meta.sub}</div>
          </div>
        </div>

        <div className="navbar-right">
          <div className="sync-pill">
            <span className="sync-dot" />
            Synced · just now
          </div>

          <button className="nb-btn ghost" onClick={handleScan}>
            <RefreshCw size={13} className={scanning ? "spinning" : ""} />
            <span>{scanning ? "Scanning…" : "Re-scan"}</span>
          </button>

          <div className="nb-divider" />

          <button className="nb-icon-btn">
            <Bell size={15} />
            <span className="notif-badge" />
          </button>

          <div className="user-block">
            <div className="user-text">
              <span className="user-name">{user?.name || "Merchant"}</span>
              <span className="user-email">{user?.email}</span>
            </div>

            <button className="avatar-btn" title="Merchant account">
              {user?.name?.charAt(0)?.toUpperCase() || "M"}
            </button>

            <button className="nb-icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}