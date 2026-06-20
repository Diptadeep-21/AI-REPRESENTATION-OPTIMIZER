"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllAnalyses } from "@/lib/api/analysis";
import {
  LayoutDashboard,
  Brain,
  Sparkles,
  FileText,
  Settings,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { setupDemoWorkspace } from "@/services/demoService";

const links = [
  { title: "Overview",        href: "/dashboard",        icon: LayoutDashboard, section: "main" },
  { title: "AI Visibility",   href: "/analysis",          icon: Brain,           section: "main" },
  { title: "Products",        href: "/products",          icon: Sparkles,        section: "main", showBadge: true },
  { title: "Recommendations", href: "/recommendations",   icon: Lightbulb,       section: "analyse" },
  { title: "Simulation",      href: "/simulation",         icon: Sparkles,        section: "analyse" },
  { title: "Reports",         href: "/reports",            icon: FileText,        section: "analyse" },
  { title: "Settings",        href: "/settings",           icon: Settings,        section: "account" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: analyses } = useQuery({
    queryKey: ["analyses"],
    queryFn: getAllAnalyses,
  });

  const criticalCount = analyses?.filter((a: any) => a.scores?.overallScore < 60).length ?? 0;

  const mainLinks    = links.filter((l) => l.section === "main");
  const analyseLinks = links.filter((l) => l.section === "analyse");
  const accountLinks = links.filter((l) => l.section === "account");

  const NavItem = ({ link }: { link: (typeof links)[0] }) => {
    const Icon = link.icon;
    const active = pathname === link.href || pathname.startsWith(link.href + "/");
    const badge = link.showBadge && criticalCount > 0 ? criticalCount : null;

    return (
      <Link href={link.href} className={`nav-item${active ? " active" : ""}`}>
        <Icon size={15} className="nav-icon" />
        <span className="nav-label">{link.title}</span>
        {badge !== null && <span className="nav-badge">{badge}</span>}
        {active && !badge && <ChevronRight size={13} className="nav-chevron" />}
      </Link>
    );
  };

  const handleConnectStore = async () => {
    try {
      setLoading(true);
      await setupDemoWorkspace();
      router.refresh();
    } catch (error: any) {
      console.error("Failed to connect workspace", error);
    } finally {
      setLoading(false);
    }
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
          --red:        #e05555;
          --font-serif: 'DM Serif Display', serif;
          --font:       'DM Sans', sans-serif;
        }

        .sidebar-root {
          width: 232px; flex-shrink: 0;
          background: var(--bg); border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
        }
        .sidebar-root::-webkit-scrollbar { width: 0; }

        .sidebar-logo { padding: 20px 22px; border-bottom: 1px solid var(--border); }
        .logo-text {
          font-family: var(--font-serif); font-size: 19px;
          letter-spacing: -0.02em; color: var(--ink); line-height: 1;
        }
        .logo-sub-row { display: flex; align-items: center; gap: 7px; margin-top: 9px; }
        .logo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
        .logo-sub { font-family: var(--font); font-size: 11px; color: var(--ink3); letter-spacing: 0.02em; font-weight: 300; }

        .sidebar-nav {
          flex: 1; min-height: 0; padding: 10px 12px;
          display: flex; flex-direction: column; gap: 1px; overflow-y: auto;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-section-label {
          font-size: 10px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink3);
          padding: 16px 10px 6px;
        }
        .nav-section-label:first-child { padding-top: 8px; }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 9px;
          font-family: var(--font); font-size: 13.5px; font-weight: 500;
          color: var(--ink2); text-decoration: none;
          border: 1px solid transparent;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,0.03); color: var(--ink); }
        .nav-item.active {
          background: var(--surface); border-color: var(--border-mid); color: var(--ink);
        }
        .nav-icon { flex-shrink: 0; color: inherit; opacity: 0.85; }
        .nav-label { flex: 1; }
        .nav-chevron { color: var(--ink3); flex-shrink: 0; }
        .nav-badge {
          background: rgba(224,85,85,0.12); color: var(--red);
          font-size: 10.5px; font-weight: 500;
          padding: 2px 7px; border-radius: 100px; flex-shrink: 0;
        }

        .sidebar-footer { flex-shrink: 0; padding: 12px; border-top: 1px solid var(--border); }

        .store-chip {
          display: flex; align-items: center; gap: 11px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 11px; cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
        }
        .store-chip:hover { border-color: var(--border-mid); transform: translateY(-1px); }

        .store-avatar {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          background: rgba(62,207,142,0.12); border: 1px solid rgba(62,207,142,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-serif); color: var(--green); font-size: 14px;
        }
        .store-text { min-width: 0; flex: 1; }
        .store-name {
          font-size: 13px; color: var(--ink); font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .store-url { font-size: 11px; color: var(--ink3); margin-top: 2px; font-weight: 300; }
        .store-status { width: 7px; height: 7px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
      `}</style>

      <aside className="sidebar-root">
        <div className="sidebar-logo">
          <div className="logo-text">Merchanta AI</div>
          <div className="logo-sub-row">
            <span className="logo-dot" />
            <span className="logo-sub">AI Commerce Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {mainLinks.map((l) => <NavItem key={l.href} link={l} />)}

          <div className="nav-section-label">Analyse</div>
          {analyseLinks.map((l) => <NavItem key={l.href} link={l} />)}

          <div className="nav-section-label">Account</div>
          {accountLinks.map((l) => <NavItem key={l.href} link={l} />)}
        </nav>

        <div className="sidebar-footer">
          <div className="store-chip" onClick={handleConnectStore}>
            <div className="store-avatar">M</div>
            <div className="store-text">
              <div className="store-name">{loading ? "Connecting…" : "Connect store"}</div>
              <div className="store-url">Launch AI demo workspace</div>
            </div>
            <div className="store-status" />
          </div>
        </div>
      </aside>
    </>
  );
}