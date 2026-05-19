"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api/auth";

const WORDS = ["Shopify Store", "Product Pages", "Brand Voice", "AI Visibility", "Search Ranking"];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    desc: "Perfect for exploring AI visibility for a small store.",
    color: "#4d7aff",
    features: [
      "Up to 25 products scanned",
      "Basic AI visibility score",
      "Weekly scan",
      "Email support",
    ],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "per month",
    desc: "For merchants serious about winning AI-powered discovery.",
    color: "#16b98c",
    features: [
      "Up to 500 products",
      "Full 6-dimension scoring",
      "Daily auto-scan",
      "Agent simulation (GPT-4o, Gemini)",
      "Schema fix suggestions",
      "Priority email support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$129",
    period: "per month",
    desc: "For high-volume stores needing full AI commerce coverage.",
    color: "#8b6ef5",
    features: [
      "Unlimited products",
      "All AI agents (GPT, Gemini, Perplexity, Claude)",
      "Real-time monitoring",
      "Auto schema injection",
      "Competitor benchmarking",
      "Dedicated onboarding",
      "API access",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible]     = useState(true);
  const [activeNav, setActiveNav] = useState("");
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const featuresRef  = useRef<HTMLElement>(null);
  const howRef       = useRef<HTMLElement>(null);
  const pricingRef   = useRef<HTMLElement>(null);
  const router = useRouter();

  // Rotating word
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Canvas dot grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / 36);
      const rows = Math.ceil(canvas.height / 36);
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * 36, y = r * 36;
          const wave = Math.sin(t * 0.7 + c * 0.4 + r * 0.3) * 0.5 + 0.5;
          const alpha = wave * 0.18 + 0.03;
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(77,122,255,${alpha})`; ctx.fill();
        }
      }
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  // Active nav highlight on scroll
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY + 80;
      if (pricingRef.current && sy >= pricingRef.current.offsetTop)       setActiveNav("pricing");
      else if (howRef.current && sy >= howRef.current.offsetTop)          setActiveNav("how");
      else if (featuresRef.current && sy >= featuresRef.current.offsetTop) setActiveNav("features");
      else setActiveNav("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>, id: string) => {
    setActiveNav(id);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDashboardAccess = () => {
    router.push(isAuthenticated() ? "/dashboard" : "/login");
  };
  const handleGetStarted = () => {
    router.push(isAuthenticated() ? "/dashboard" : "/register");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #04070f; --surface: #0b1120; --surface2: #101828;
          --border: rgba(255,255,255,0.07); --border-bright: rgba(77,122,255,0.30);
          --brand: #4d7aff; --brand-dim: rgba(77,122,255,0.15); --brand-glow: rgba(77,122,255,0.35);
          --teal: #16b98c; --teal-dim: rgba(22,185,140,0.12);
          --text: #e8edf5; --text-muted: #64748b; --text-faint: #2d3748;
          --font-display: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
        }
        html { scroll-behavior: smooth; }
        html, body { background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }

        .lp-root { min-height: 100vh; position: relative; overflow-x: hidden; }
        .lp-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .glow-orb { position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
        .glow-orb-1 { width:600px;height:600px;background:radial-gradient(circle,rgba(77,122,255,0.14) 0%,transparent 70%);top:-100px;left:-150px; }
        .glow-orb-2 { width:500px;height:500px;background:radial-gradient(circle,rgba(22,185,140,0.10) 0%,transparent 70%);top:200px;right:-100px; }
        .glow-orb-3 { width:400px;height:400px;background:radial-gradient(circle,rgba(77,122,255,0.08) 0%,transparent 70%);bottom:0;left:40%; }

        /* ── Nav ── */
        .nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 64px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          background: rgba(4,7,15,0.75);
          transition: box-shadow 0.2s;
        }
        .nav-logo {
          font-family: var(--font-display); font-weight: 800; font-size: 17px;
          letter-spacing: -0.03em; color: var(--text);
          display: flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .nav-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--brand); box-shadow: 0 0 12px var(--brand-glow);
        }
        .nav-links { display: flex; gap: 6px; align-items: center; list-style: none; }
        .nav-link {
          position: relative;
          color: var(--text-muted); font-size: 14px; font-weight: 400;
          text-decoration: none; background: none; border: none; cursor: pointer;
          font-family: var(--font-body); letter-spacing: 0.01em;
          padding: 7px 16px; border-radius: 7px;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .nav-link.active { color: var(--text); }
        .nav-link.active::after {
          content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%);
          width: 16px; height: 2px; border-radius: 99px; background: var(--brand);
        }
        .nav-cta {
          background: var(--brand); color: #fff !important;
          padding: 8px 18px; border-radius: 8px;
          font-weight: 500 !important; font-size: 13px !important;
          transition: opacity 0.15s, box-shadow 0.15s !important;
          border: none; cursor: pointer; font-family: var(--font-body);
        }
        .nav-cta:hover { opacity: 0.85; box-shadow: 0 0 16px var(--brand-glow); }

        /* ── Hero ── */
        .hero {
          position: relative; z-index: 5;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 120px 24px 80px;
          max-width: 900px; margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--brand-dim); border: 1px solid var(--border-bright);
          border-radius: 100px; padding: 6px 14px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.06em;
          color: #8aabff; text-transform: uppercase; margin-bottom: 36px;
          animation: fadeUp 0.5s ease both;
        }
        .badge-pulse { width:6px;height:6px;border-radius:50%;background:var(--brand);position:relative; }
        .badge-pulse::after { content:'';position:absolute;inset:-3px;border-radius:50%;border:1.5px solid var(--brand);animation:ping 1.6s ease infinite; }
        @keyframes ping { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2);opacity:0} }

        .hero-h1 {
          font-family: var(--font-display); font-size: clamp(40px,7vw,72px);
          font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; color: var(--text);
          animation: fadeUp 0.5s 0.1s ease both;
        }
        .hero-h1 .line2 {
          display: block;
          background: linear-gradient(90deg,var(--brand) 0%,#8ab4ff 50%,var(--teal) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .rotating-word { display:inline-block;min-width:340px;transition:opacity 0.35s ease,transform 0.35s ease; }
        .rotating-word.hidden { opacity:0;transform:translateY(10px); }
        .hero-sub { margin-top:28px;font-size:18px;font-weight:300;line-height:1.65;color:var(--text-muted);max-width:560px;animation:fadeUp 0.5s 0.2s ease both; }
        .hero-actions { display:flex;gap:14px;align-items:center;margin-top:44px;animation:fadeUp 0.5s 0.3s ease both; }
        .btn-primary {
          display:inline-flex;align-items:center;gap:8px;background:var(--brand);
          color:#fff;font-family:var(--font-body);font-size:15px;font-weight:500;
          padding:13px 26px;border-radius:10px;border:none;cursor:pointer;text-decoration:none;
          transition:opacity 0.15s,box-shadow 0.15s;
        }
        .btn-primary:hover { opacity:0.88;box-shadow:0 0 24px var(--brand-glow);text-decoration:none;color:#fff; }
        .btn-primary svg { transition:transform 0.2s; }
        .btn-primary:hover svg { transform:translateX(3px); }
        .btn-secondary {
          display:inline-flex;align-items:center;gap:8px;background:transparent;
          color:var(--text-muted);font-family:var(--font-body);font-size:15px;font-weight:400;
          padding:13px 22px;border-radius:10px;border:1px solid var(--border);
          cursor:pointer;text-decoration:none;transition:border-color 0.15s,color 0.15s;
        }
        .btn-secondary:hover { border-color:rgba(255,255,255,0.15);color:var(--text);text-decoration:none; }
        .social-proof { margin-top:64px;display:flex;align-items:center;gap:20px;animation:fadeUp 0.5s 0.4s ease both; }
        .avatars { display:flex; }
        .avatar { width:30px;height:30px;border-radius:50%;border:2px solid var(--bg);margin-left:-8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--text-muted); }
        .avatar:first-child { margin-left:0; }
        .social-text { font-size:13px;color:var(--text-muted); }
        .social-text strong { color:var(--text);font-weight:500; }

        /* ── Preview ── */
        .preview-wrap { position:relative;z-index:5;max-width:980px;margin:0 auto 120px;padding:0 24px;animation:fadeUp 0.6s 0.5s ease both; }
        .preview-frame { border-radius:16px;border:1px solid var(--border);background:var(--surface);overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.5),0 0 0 1px var(--border); }
        .preview-bar { display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--surface2); }
        .preview-dot { width:10px;height:10px;border-radius:50%; }
        .preview-dot:nth-child(1){background:#f05252} .preview-dot:nth-child(2){background:#f5b429} .preview-dot:nth-child(3){background:#16b98c}
        .preview-url { flex:1;text-align:center;font-size:11.5px;color:var(--text-muted);background:rgba(255,255,255,0.04);border-radius:6px;padding:4px 12px;border:1px solid var(--border);margin:0 12px; }
        .mock-dash { display:grid;grid-template-columns:200px 1fr;height:420px; }
        .mock-sidebar { background:#080e1a;border-right:1px solid var(--border);padding:20px 14px;display:flex;flex-direction:column;gap:6px; }
        .mock-nav-item { padding:8px 12px;border-radius:8px;font-size:12.5px;color:var(--text-muted);display:flex;align-items:center;gap:8px; }
        .mock-nav-item.active { background:var(--brand-dim);color:#8aabff;border:1px solid rgba(77,122,255,0.2); }
        .mock-nav-icon { width:14px;height:14px;border-radius:3px;background:currentColor;opacity:0.5;flex-shrink:0; }
        .mock-main { padding:24px;overflow:hidden;display:flex;flex-direction:column;gap:18px; }
        .mock-title { font-family:var(--font-display);font-size:16px;font-weight:700;letter-spacing:-0.02em;color:var(--text); }
        .mock-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }
        .mock-card { background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px; }
        .mock-card-label { font-size:10.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px; }
        .mock-card-val { font-family:var(--font-display);font-size:26px;font-weight:700;letter-spacing:-0.03em; }
        .mock-card-val.good{color:var(--teal)} .mock-card-val.warn{color:#f5b429} .mock-card-val.brand{color:var(--brand)}
        .mock-card-sub { font-size:11px;color:var(--text-muted);margin-top:2px; }
        .mock-bar-section { display:flex;flex-direction:column;gap:8px; }
        .mock-bar-row { display:flex;align-items:center;gap:10px; }
        .mock-bar-label { font-size:11px;color:var(--text-muted);width:100px;flex-shrink:0; }
        .mock-bar-track { flex:1;background:var(--surface2);border-radius:999px;height:6px;overflow:hidden; }
        .mock-bar-fill { height:100%;border-radius:999px; }
        .mock-bar-score { font-size:11px;color:var(--text-muted);width:30px;text-align:right; }

        /* ── Shared section helpers ── */
        .section-wrap { position:relative;z-index:5;max-width:980px;margin:0 auto 120px;padding:0 24px; }
        .section-label { font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--brand);margin-bottom:14px; }
        .section-title { font-family:var(--font-display);font-size:clamp(28px,4vw,42px);font-weight:800;letter-spacing:-0.03em;color:var(--text);margin-bottom:14px; }
        .section-sub { font-size:16px;color:var(--text-muted);max-width:500px;line-height:1.6; }

        /* ── Features ── */
        .features-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:52px; }
        .feature-card {
          background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:26px 24px;
          transition:border-color 0.2s,transform 0.2s;position:relative;overflow:hidden;
        }
        .feature-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--border-bright),transparent);opacity:0;transition:opacity 0.3s; }
        .feature-card:hover { border-color:rgba(77,122,255,0.22);transform:translateY(-2px); }
        .feature-card:hover::before { opacity:1; }
        .feature-icon { width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:18px; }
        .fi-blue{background:var(--brand-dim);border:1px solid rgba(77,122,255,0.2)}
        .fi-teal{background:var(--teal-dim);border:1px solid rgba(22,185,140,0.2)}
        .fi-amber{background:rgba(245,180,41,0.12);border:1px solid rgba(245,180,41,0.2)}
        .feature-title { font-family:var(--font-display);font-size:15px;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px;color:var(--text); }
        .feature-desc { font-size:13.5px;color:var(--text-muted);line-height:1.6; }

        /* ── How it works ── */
        .steps-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:52px;position:relative; }
        .steps-grid::before { content:'';position:absolute;top:24px;left:16%;right:16%;height:1px;background:linear-gradient(90deg,transparent,var(--border-bright),transparent); }
        .step { display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 24px; }
        .step-num { width:48px;height:48px;border-radius:50%;background:var(--surface2);border:1px solid var(--border-bright);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--brand);margin-bottom:20px;position:relative;z-index:1; }
        .step-title { font-family:var(--font-display);font-size:16px;font-weight:700;letter-spacing:-0.02em;margin-bottom:10px; }
        .step-desc { font-size:13.5px;color:var(--text-muted);line-height:1.6; }

        /* ── Pricing ── */
        .pricing-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:52px; }
        .pricing-card {
          background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px 26px;
          position:relative;overflow:hidden;display:flex;flex-direction:column;
          transition:border-color 0.2s,transform 0.2s;
        }
        .pricing-card:hover { transform:translateY(-3px); }
        .pricing-card.highlight {
          border-color: rgba(22,185,140,0.35);
          background: linear-gradient(160deg,rgba(22,185,140,0.07) 0%,var(--surface) 50%);
        }
        .pricing-card.highlight::before {
          content:''; position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,#16b98c,transparent);
        }
        .pricing-badge {
          position:absolute;top:18px;right:18px;
          background:rgba(22,185,140,0.15);border:1px solid rgba(22,185,140,0.30);
          color:#16b98c;font-size:10px;font-weight:700;letter-spacing:0.08em;
          text-transform:uppercase;padding:3px 9px;border-radius:100px;
        }
        .pricing-name { font-family:var(--font-display);font-size:14px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:var(--text-muted);margin-bottom:14px; }
        .pricing-price { font-family:var(--font-display);font-size:44px;font-weight:800;letter-spacing:-0.05em;line-height:1; }
        .pricing-period { font-size:13px;color:var(--text-muted);margin-top:4px;margin-bottom:10px; }
        .pricing-desc { font-size:13px;color:var(--text-muted);line-height:1.55;margin-bottom:22px; }
        .pricing-divider { height:1px;background:var(--border);margin-bottom:22px; }
        .pricing-features { display:flex;flex-direction:column;gap:10px;flex:1;margin-bottom:26px; }
        .pricing-feature { display:flex;align-items:flex-start;gap:9px;font-size:13px;color:var(--text-muted);line-height:1.45; }
        .pricing-check { flex-shrink:0;margin-top:1px; }
        .pricing-btn {
          display:flex;align-items:center;justify-content:center;gap:6px;
          width:100%;padding:11px 0;border-radius:10px;
          font-family:var(--font-body);font-size:14px;font-weight:500;
          cursor:pointer;border:none;transition:opacity 0.15s,box-shadow 0.15s;
          text-decoration:none;
        }

        /* ── CTA ── */
        .cta-section { position:relative;z-index:5;max-width:700px;margin:0 auto 120px;padding:0 24px;text-align:center; }
        .cta-card { background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:64px 48px;position:relative;overflow:hidden; }
        .cta-card::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(77,122,255,0.12),transparent 60%);pointer-events:none; }

        /* ── Footer ── */
        footer { position:relative;z-index:5;border-top:1px solid var(--border);padding:28px 48px;display:flex;justify-content:space-between;align-items:center; }
        .footer-logo { font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--text-faint); }
        .footer-copy { font-size:12.5px;color:var(--text-muted); }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        @media(max-width:760px){
          .nav{padding:0 20px;}
          .nav-links{display:none;}
          .features-grid,.steps-grid,.mock-cards,.pricing-grid{grid-template-columns:1fr;}
          .mock-dash{grid-template-columns:1fr;}
          .mock-sidebar{display:none;}
          .steps-grid::before{display:none;}
          footer{flex-direction:column;gap:8px;text-align:center;padding:24px;}
        }
      `}</style>

      <div className="lp-root">
        <canvas ref={canvasRef} className="lp-canvas" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        {/* ── Nav ── */}
        <nav className="nav">
          <div className="nav-logo">
            <span className="nav-logo-dot" />
            Merchanta AI
          </div>
          <ul className="nav-links">
            <li>
              <button className={`nav-link${activeNav === "features" ? " active" : ""}`}
                onClick={() => scrollTo(featuresRef, "features")}>
                Features
              </button>
            </li>
            <li>
              <button className={`nav-link${activeNav === "how" ? " active" : ""}`}
                onClick={() => scrollTo(howRef, "how")}>
                How it works
              </button>
            </li>
            <li>
              <button className={`nav-link${activeNav === "pricing" ? " active" : ""}`}
                onClick={() => scrollTo(pricingRef, "pricing")}>
                Pricing
              </button>
            </li>
            <li>
              <button onClick={handleDashboardAccess} className="nav-cta" style={{marginLeft: 10}}>
                Open Dashboard
              </button>
            </li>
          </ul>
        </nav>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-pulse" />
            AI-Powered Storefront Intelligence
          </div>
          <h1 className="hero-h1">
            How AI Agents See Your
            <span className="line2">
              <span className={`rotating-word${visible ? "" : " hidden"}`}>
                {WORDS[wordIndex]}
              </span>
            </span>
          </h1>
          <p className="hero-sub">
            Understand exactly how AI shopping agents perceive and rank your Shopify store — then act on pinpoint recommendations to win more visibility.
          </p>
          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn-primary">
              Analyze My Store
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={() => scrollTo(howRef, "how")} className="btn-secondary">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#64748b" strokeWidth="1.3"/>
                <path d="M6 5.5l4 2-4 2V5.5z" fill="#64748b"/>
              </svg>
              See how it works
            </button>
          </div>
          <div className="social-proof">
            <div className="avatars">
              {["A","B","C","D"].map((l) => <div className="avatar" key={l}>{l}</div>)}
            </div>
            <p className="social-text">Trusted by <strong>2,400+</strong> Shopify merchants</p>
          </div>
        </section>

        {/* ── Dashboard preview ── */}
        <div className="preview-wrap">
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="preview-dot"/><div className="preview-dot"/><div className="preview-dot"/>
              <div className="preview-url">app.aropt.ai/dashboard</div>
            </div>
            <div className="mock-dash">
              <div className="mock-sidebar">
                {["Overview","AI Visibility","Products","Recommendations","Settings"].map((item, i) => (
                  <div className={`mock-nav-item${i === 0 ? " active" : ""}`} key={item}>
                    <div className="mock-nav-icon"/>{item}
                  </div>
                ))}
              </div>
              <div className="mock-main">
                <div className="mock-title">AI Visibility Overview</div>
                <div className="mock-cards">
                  {[
                    {label:"AI Visibility Score", val:"84", cls:"good", sub:"+6 this week"},
                    {label:"Indexed Products",    val:"312",cls:"brand",sub:"of 340 total"},
                    {label:"Issues Found",        val:"17", cls:"warn", sub:"4 critical"},
                  ].map(({label,val,cls,sub}) => (
                    <div className="mock-card" key={label}>
                      <div className="mock-card-label">{label}</div>
                      <div className={`mock-card-val ${cls}`}>{val}</div>
                      <div className="mock-card-sub">{sub}</div>
                    </div>
                  ))}
                </div>
                <div className="mock-bar-section">
                  {[
                    {label:"Product Descriptions",val:88,color:"#16b98c"},
                    {label:"Structured Data",     val:62,color:"#f5b429"},
                    {label:"Brand Voice",         val:75,color:"#4d7aff"},
                    {label:"Image Alt Text",      val:41,color:"#f0683a"},
                  ].map(({label,val,color}) => (
                    <div className="mock-bar-row" key={label}>
                      <div className="mock-bar-label">{label}</div>
                      <div className="mock-bar-track">
                        <div className="mock-bar-fill" style={{width:`${val}%`,background:color}}/>
                      </div>
                      <div className="mock-bar-score">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <section ref={featuresRef} className="section-wrap" style={{scrollMarginTop: 64}}>
          <p className="section-label">What you get</p>
          <h2 className="section-title">Built for the AI-first era of shopping</h2>
          <p className="section-sub">AI agents now gatekeep product discovery. AROpt makes sure yours wins.</p>
          <div className="features-grid">
            {[
              {icon:"🔍",cls:"fi-blue",  title:"AI Perception Audit",    desc:"See exactly how LLM-powered shopping agents read, interpret, and rank your product pages."},
              {icon:"⚡",cls:"fi-teal",  title:"Instant Fix Suggestions", desc:"Prioritised, actionable recommendations with one-click Shopify implementation."},
              {icon:"📊",cls:"fi-amber", title:"Visibility Scoring",      desc:"Track your AI visibility score across 6 key dimensions and benchmark against competitors."},
              {icon:"🧬",cls:"fi-blue",  title:"Structured Data Check",   desc:"Validate schema markup and JSON-LD that AI agents rely on for product understanding."},
              {icon:"🎯",cls:"fi-teal",  title:"Brand Voice Analysis",    desc:"Ensure your store communicates consistently and compellingly to AI and humans alike."},
              {icon:"🔔",cls:"fi-amber", title:"Live Monitoring",         desc:"Get alerted the moment an AI model's behavior affects your store's discoverability."},
            ].map(({icon,cls,title,desc}) => (
              <div className="feature-card" key={title}>
                <div className={`feature-icon ${cls}`}>{icon}</div>
                <div className="feature-title">{title}</div>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section ref={howRef} className="section-wrap" style={{scrollMarginTop: 64}}>
          <p className="section-label">How it works</p>
          <h2 className="section-title">Up and running in minutes</h2>
          <div className="steps-grid">
            {[
              {n:"01",title:"Connect your store",  desc:"Install the Shopify app or paste your store URL. We index your entire catalog instantly."},
              {n:"02",title:"AI scans everything",  desc:"Our models simulate how GPT, Gemini, and Perplexity agents perceive your storefront."},
              {n:"03",title:"Act on insights",      desc:"Apply recommendations directly from the dashboard and watch your score climb."},
            ].map(({n,title,desc}) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <div className="step-title">{title}</div>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section ref={pricingRef} className="section-wrap" style={{scrollMarginTop: 64}}>
          <p className="section-label">Pricing</p>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-sub">Start free. Scale when your store does. No hidden fees.</p>
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`pricing-card${plan.highlight ? " highlight" : ""}`}>
                {plan.highlight && <div className="pricing-badge">Most Popular</div>}
                <div className="pricing-name">{plan.name}</div>
                <div className="pricing-price" style={{color: plan.color}}>{plan.price}</div>
                <div className="pricing-period">{plan.period}</div>
                <div className="pricing-desc">{plan.desc}</div>
                <div className="pricing-divider"/>
                <div className="pricing-features">
                  {plan.features.map((f) => (
                    <div className="pricing-feature" key={f}>
                      <svg className="pricing-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill={`${plan.color}25`}/>
                        <path d="M4 7l2 2 4-4" stroke={plan.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className="pricing-btn"
                  onClick={handleGetStarted}
                  style={{
                    background: plan.highlight ? plan.color : "transparent",
                    color: plan.highlight ? "#fff" : plan.color,
                    border: plan.highlight ? "none" : `1px solid ${plan.color}40`,
                    boxShadow: plan.highlight ? `0 0 20px ${plan.color}40` : "none",
                  }}
                >
                  {plan.cta}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p style={{textAlign:"center",fontSize:12,color:"var(--text-faint)",marginTop:28}}>
            All plans include a 14-day free trial. No credit card required.
          </p>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-card">
            <p className="section-label">Get started free</p>
            <h2 className="section-title">Stop guessing what AI sees</h2>
            <p className="section-sub" style={{margin:"0 auto 36px"}}>Join 2,400+ merchants already optimizing for the AI shopping revolution.</p>
            <button onClick={handleGetStarted} className="btn-primary" style={{margin:"0 auto"}}>
              Analyze My Store Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

        <footer>
          <div className="footer-logo">Merchanta AI</div>
          <div className="footer-copy">© 2025 AI Representation Optimizer. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}