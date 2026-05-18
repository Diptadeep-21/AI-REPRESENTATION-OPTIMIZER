"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const links = [
  { title: "Overview",      href: "/dashboard",   icon: LayoutDashboard, section: "main" },
  { title: "AI Visibility", href: "/analysis",    icon: Brain,           section: "main" },
  { title: "Products",      href: "/products",    icon: Sparkles,        section: "main",    showBadge: true },
  { title: "Recommendations", href: "/recommendations", icon: Lightbulb,     section: "analyse" },
  { title: "Simulation",    href: "/simulation",  icon: Sparkles,        section: "analyse" },
  { title: "Reports",       href: "/reports",     icon: FileText,        section: "analyse" },
  { title: "Settings",      href: "/settings",    icon: Settings,        section: "account" },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Derive critical count from real analyses for the Products badge
  const { data: analyses } = useQuery({
    queryKey: ["analyses"],
    queryFn: getAllAnalyses,
  });

  const criticalCount =
    analyses?.filter((a: any) => a.scores?.overallScore < 60).length ?? 0;

  const mainLinks    = links.filter((l) => l.section === "main");
  const analyseLinks = links.filter((l) => l.section === "analyse");
  const accountLinks = links.filter((l) => l.section === "account");

  const NavItem = ({ link }: { link: (typeof links)[0] }) => {
    const Icon = link.icon;
    const active = pathname === link.href || pathname.startsWith(link.href + "/");
    const badge = link.showBadge && criticalCount > 0 ? criticalCount : null;

    return (
      <Link
        href={link.href}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 9,
          fontSize: 13,
          color: active ? "#8aabff" : "#4a5568",
          background: active ? "rgba(77,122,255,0.10)" : "transparent",
          border: `1px solid ${active ? "rgba(77,122,255,0.20)" : "transparent"}`,
          textDecoration: "none",
          transition: "all 0.15s",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
            (e.currentTarget as HTMLElement).style.color = "#94a3b8";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#4a5568";
          }
        }}
      >
        <Icon size={15} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{link.title}</span>
        {badge !== null && (
          <span style={{
            background: "rgba(240,104,58,0.15)",
            color: "#f0683a",
            fontSize: 10, fontWeight: 600,
            padding: "2px 6px", borderRadius: 100,
          }}>
            {badge}
          </span>
        )}
        {active && !badge && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
      </Link>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        .sidebar-root {
          width: 220px; flex-shrink: 0;
          background: #080e1a;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
          overflow-y: auto;
        }
        .sidebar-root::-webkit-scrollbar { width: 0; }

        .sidebar-logo {
          padding: 22px 20px 18px;
          display: flex; align-items: center; gap: 9px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4d7aff;
          box-shadow: 0 0 10px rgba(77,122,255,0.65);
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 15px;
          letter-spacing: -0.03em; color: #e8edf5;
          line-height: 1;
        }
        .logo-sub {
          font-size: 10px; color: #2d3748;
          font-family: 'DM Sans', sans-serif;
          margin-top: 2px; letter-spacing: 0.01em;
        }

        .sidebar-nav { padding: 14px 12px; flex: 1; display: flex; flex-direction: column; gap: 2px; }

        .nav-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #1e293b;
          padding: 10px 10px 5px;
          user-select: none;
        }

        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .store-chip {
          display: flex; align-items: center; gap: 9px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 9px; padding: 10px 12px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .store-chip:hover { border-color: rgba(255,255,255,0.10); }
        .store-avatar {
          width: 26px; height: 26px; border-radius: 6px;
          background: linear-gradient(135deg, #4d7aff, #16b98c);
          flex-shrink: 0;
        }
        .store-name { font-size: 12px; color: #94a3b8; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .store-url  { font-size: 10.5px; color: #2d3748; margin-top: 1px; }
        .store-status {
          margin-left: auto; width: 6px; height: 6px;
          border-radius: 50%; background: #16b98c; flex-shrink: 0;
          box-shadow: 0 0 6px rgba(22,185,140,0.6);
        }
      `}</style>

      <aside className="sidebar-root">
        <div className="sidebar-logo">
          <span className="logo-dot" />
          <div>
            <div className="logo-text">AROpt</div>
            <div className="logo-sub">AI Commerce Intelligence</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {mainLinks.map((l) => <NavItem key={l.href} link={l} />)}

          <div className="nav-section-label" style={{ marginTop: 8 }}>Analyse</div>
          {analyseLinks.map((l) => <NavItem key={l.href} link={l} />)}

          <div className="nav-section-label" style={{ marginTop: 8 }}>Account</div>
          {accountLinks.map((l) => <NavItem key={l.href} link={l} />)}
        </nav>

        {/* Store chip — shows active store with live status dot */}
        <div className="sidebar-footer">
          <div className="store-chip">
            <div className="store-avatar" />
            <div style={{ minWidth: 0 }}>
              <div className="store-name">your-store</div>
              <div className="store-url">myshopify.com</div>
            </div>
            <div className="store-status" />
          </div>
        </div>
      </aside>
    </>
  );
}