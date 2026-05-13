"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const WORDS = ["Shopify Store", "Product Pages", "Brand Voice", "AI Visibility", "Search Ranking"];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Animated dot-grid canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / 36);
      const rows = Math.ceil(canvas.height / 36);
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * 36;
          const y = r * 36;
          const wave = Math.sin(t * 0.7 + c * 0.4 + r * 0.3) * 0.5 + 0.5;
          const alpha = wave * 0.18 + 0.03;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(77,122,255,${alpha})`;
          ctx.fill();
        }
      }
      t += 0.016;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #04070f;
          --surface: #0b1120;
          --surface2: #101828;
          --border: rgba(255,255,255,0.07);
          --border-bright: rgba(77,122,255,0.30);
          --brand: #4d7aff;
          --brand-dim: rgba(77,122,255,0.15);
          --brand-glow: rgba(77,122,255,0.35);
          --teal: #16b98c;
          --teal-dim: rgba(22,185,140,0.12);
          --text: #e8edf5;
          --text-muted: #64748b;
          --text-faint: #2d3748;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        html, body { background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }

        .lp-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Canvas bg */
        .lp-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        /* Glows */
        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(77,122,255,0.14) 0%, transparent 70%);
          top: -100px; left: -150px;
        }
        .glow-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(22,185,140,0.10) 0%, transparent 70%);
          top: 200px; right: -100px;
        }
        .glow-orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(77,122,255,0.08) 0%, transparent 70%);
          bottom: 0; left: 40%;
        }

        /* Nav */
        .nav {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
          background: rgba(4,7,15,0.6);
        }
        .nav-logo {
          font-family: var(--font-display);
          font-weight: 800; font-size: 17px;
          letter-spacing: -0.03em;
          color: var(--text);
          display: flex; align-items: center; gap: 8px;
        }
        .nav-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--brand);
          box-shadow: 0 0 12px var(--brand-glow);
        }
        .nav-links {
          display: flex; gap: 32px; align-items: center;
          list-style: none;
        }
        .nav-links a {
          color: var(--text-muted); font-size: 14px; font-weight: 400;
          text-decoration: none; transition: color 0.15s;
          letter-spacing: 0.01em;
        }
        .nav-links a:hover { color: var(--text); }
        .nav-cta {
          background: var(--brand);
          color: #fff !important;
          padding: 8px 18px; border-radius: 8px;
          font-weight: 500 !important; font-size: 13px !important;
          transition: opacity 0.15s !important;
        }
        .nav-cta:hover { opacity: 0.85; color: #fff !important; }

        /* Hero */
        .hero {
          position: relative; z-index: 5;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          padding: 120px 24px 80px;
          max-width: 900px; margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--brand-dim);
          border: 1px solid var(--border-bright);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.06em;
          color: #8aabff; text-transform: uppercase;
          margin-bottom: 36px;
          animation: fadeUp 0.5s ease both;
        }
        .badge-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--brand);
          position: relative;
        }
        .badge-pulse::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%; border: 1.5px solid var(--brand);
          animation: ping 1.6s ease infinite;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }

        .hero-h1 {
          font-family: var(--font-display);
          font-size: clamp(40px, 7vw, 72px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.05;
          color: var(--text);
          animation: fadeUp 0.5s 0.1s ease both;
        }
        .hero-h1 .line2 {
          display: block;
          background: linear-gradient(90deg, var(--brand) 0%, #8ab4ff 50%, var(--teal) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rotating-word {
          display: inline-block;
          min-width: 340px;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .rotating-word.hidden {
          opacity: 0;
          transform: translateY(10px);
        }

        .hero-sub {
          margin-top: 28px;
          font-size: 18px; font-weight: 300; line-height: 1.65;
          color: var(--text-muted); max-width: 560px;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        .hero-actions {
          display: flex; gap: 14px; align-items: center;
          margin-top: 44px;
          animation: fadeUp 0.5s 0.3s ease both;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--brand);
          color: #fff; font-family: var(--font-body);
          font-size: 15px; font-weight: 500;
          padding: 13px 26px; border-radius: 10px;
          border: none; cursor: pointer; text-decoration: none;
          transition: opacity 0.15s, box-shadow 0.15s;
          box-shadow: 0 0 0 0 var(--brand-glow);
        }
        .btn-primary:hover {
          opacity: 0.88;
          box-shadow: 0 0 24px var(--brand-glow);
          text-decoration: none; color: #fff;
        }
        .btn-primary svg { transition: transform 0.2s; }
        .btn-primary:hover svg { transform: translateX(3px); }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          color: var(--text-muted); font-family: var(--font-body);
          font-size: 15px; font-weight: 400;
          padding: 13px 22px; border-radius: 10px;
          border: 1px solid var(--border);
          cursor: pointer; text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.15);
          color: var(--text);
          text-decoration: none;
        }

        /* Social proof */
        .social-proof {
          margin-top: 64px;
          display: flex; align-items: center; gap: 20px;
          animation: fadeUp 0.5s 0.4s ease both;
        }
        .avatars {
          display: flex;
        }
        .avatar {
          width: 30px; height: 30px; border-radius: 50%;
          border: 2px solid var(--bg);
          margin-left: -8px; background: var(--surface2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: var(--text-muted);
          overflow: hidden;
        }
        .avatar:first-child { margin-left: 0; }
        .social-text { font-size: 13px; color: var(--text-muted); }
        .social-text strong { color: var(--text); font-weight: 500; }

        /* Dashboard preview */
        .preview-wrap {
          position: relative; z-index: 5;
          max-width: 980px; margin: 0 auto 120px;
          padding: 0 24px;
          animation: fadeUp 0.6s 0.5s ease both;
        }
        .preview-frame {
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--surface);
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
        }
        .preview-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--surface2);
        }
        .preview-dot { width: 10px; height: 10px; border-radius: 50%; }
        .preview-dot:nth-child(1) { background: #f05252; }
        .preview-dot:nth-child(2) { background: #f5b429; }
        .preview-dot:nth-child(3) { background: #16b98c; }
        .preview-url {
          flex: 1; text-align: center;
          font-size: 11.5px; color: var(--text-muted);
          background: rgba(255,255,255,0.04);
          border-radius: 6px; padding: 4px 12px;
          border: 1px solid var(--border);
          margin: 0 12px;
        }

        /* Mock dashboard inside */
        .mock-dash {
          display: grid; grid-template-columns: 200px 1fr;
          height: 420px;
        }
        .mock-sidebar {
          background: #080e1a;
          border-right: 1px solid var(--border);
          padding: 20px 14px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .mock-nav-item {
          padding: 8px 12px; border-radius: 8px;
          font-size: 12.5px; color: var(--text-muted);
          display: flex; align-items: center; gap: 8px;
          cursor: default;
        }
        .mock-nav-item.active {
          background: var(--brand-dim);
          color: #8aabff;
          border: 1px solid rgba(77,122,255,0.2);
        }
        .mock-nav-icon {
          width: 14px; height: 14px; border-radius: 3px;
          background: currentColor; opacity: 0.5;
          flex-shrink: 0;
        }
        .mock-main {
          padding: 24px;
          overflow: hidden;
          display: flex; flex-direction: column; gap: 18px;
        }
        .mock-title {
          font-family: var(--font-display);
          font-size: 16px; font-weight: 700;
          letter-spacing: -0.02em; color: var(--text);
        }
        .mock-cards {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .mock-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px; padding: 16px;
        }
        .mock-card-label { font-size: 10.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .mock-card-val {
          font-family: var(--font-display);
          font-size: 26px; font-weight: 700;
          letter-spacing: -0.03em;
        }
        .mock-card-val.good { color: var(--teal); }
        .mock-card-val.warn { color: #f5b429; }
        .mock-card-val.brand { color: var(--brand); }
        .mock-card-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .mock-bar-section { display: flex; flex-direction: column; gap: 8px; }
        .mock-bar-row { display: flex; align-items: center; gap: 10px; }
        .mock-bar-label { font-size: 11px; color: var(--text-muted); width: 100px; flex-shrink: 0; }
        .mock-bar-track { flex: 1; background: var(--surface2); border-radius: 999px; height: 6px; overflow: hidden; }
        .mock-bar-fill { height: 100%; border-radius: 999px; }
        .mock-bar-score { font-size: 11px; color: var(--text-muted); width: 30px; text-align: right; }

        /* Features */
        .features-section {
          position: relative; z-index: 5;
          max-width: 980px; margin: 0 auto 120px;
          padding: 0 24px;
        }
        .section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--brand);
          margin-bottom: 14px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; letter-spacing: -0.03em;
          color: var(--text); margin-bottom: 14px;
        }
        .section-sub { font-size: 16px; color: var(--text-muted); max-width: 500px; line-height: 1.6; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-top: 52px;
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 26px 24px;
          transition: border-color 0.2s, transform 0.2s;
          position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover { border-color: rgba(77,122,255,0.22); transform: translateY(-2px); }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px; font-size: 18px;
        }
        .fi-blue { background: var(--brand-dim); border: 1px solid rgba(77,122,255,0.2); }
        .fi-teal { background: var(--teal-dim); border: 1px solid rgba(22,185,140,0.2); }
        .fi-amber { background: rgba(245,180,41,0.12); border: 1px solid rgba(245,180,41,0.2); }

        .feature-title {
          font-family: var(--font-display);
          font-size: 15px; font-weight: 700;
          letter-spacing: -0.02em; margin-bottom: 8px;
          color: var(--text);
        }
        .feature-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

        /* How it works */
        .how-section {
          position: relative; z-index: 5;
          max-width: 980px; margin: 0 auto 120px;
          padding: 0 24px;
        }
        .steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
          margin-top: 52px; position: relative;
        }
        .steps-grid::before {
          content: '';
          position: absolute; top: 24px; left: 16%; right: 16%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
        }
        .step {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 0 24px;
        }
        .step-num {
          width: 48px; height: 48px; border-radius: 50%;
          background: var(--surface2);
          border: 1px solid var(--border-bright);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 16px; font-weight: 700; color: var(--brand);
          margin-bottom: 20px; position: relative; z-index: 1;
        }
        .step-title {
          font-family: var(--font-display);
          font-size: 16px; font-weight: 700;
          letter-spacing: -0.02em; margin-bottom: 10px;
        }
        .step-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

        /* CTA */
        .cta-section {
          position: relative; z-index: 5;
          max-width: 700px; margin: 0 auto 120px;
          padding: 0 24px; text-align: center;
        }
        .cta-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px; padding: 64px 48px;
          position: relative; overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(77,122,255,0.12), transparent 60%);
          pointer-events: none;
        }
        .cta-card .section-title { color: var(--text); margin-bottom: 16px; }
        .cta-card .section-sub { margin: 0 auto 36px; }

        /* Footer */
        footer {
          position: relative; z-index: 5;
          border-top: 1px solid var(--border);
          padding: 28px 48px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-logo {
          font-family: var(--font-display);
          font-size: 14px; font-weight: 700;
          color: var(--text-faint);
        }
        .footer-copy { font-size: 12.5px; color: var(--text-muted); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        @media (max-width: 760px) {
          .nav { padding: 16px 20px; }
          .nav-links { display: none; }
          .features-grid, .steps-grid, .mock-cards { grid-template-columns: 1fr; }
          .mock-dash { grid-template-columns: 1fr; }
          .mock-sidebar { display: none; }
          .steps-grid::before { display: none; }
          footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px; }
        }
      `}</style>

      <div className="lp-root">
        <canvas ref={canvasRef} className="lp-canvas" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">
            <span className="nav-logo-dot" />
            AROpt
          </div>
          <ul className="nav-links">
            <li><a href="#">Features</a></li>
            <li><a href="#">How it works</a></li>
            <li><a href="#">Pricing</a></li>
            <li><Link href="/dashboard" className="nav-cta">Open Dashboard</Link></li>
          </ul>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-pulse" />
            AI-Powered Storefront Intelligence
          </div>
          <h1 className="hero-h1">
            How AI Agents See Your
            <span className="line2">
              <span
                className={`rotating-word${visible ? "" : " hidden"}`}
              >
                {WORDS[wordIndex]}
              </span>
            </span>
          </h1>
          <p className="hero-sub">
            Understand exactly how AI shopping agents perceive and rank your Shopify store — then act on pinpoint recommendations to win more visibility.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn-primary">
              Analyze My Store
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href="#" className="btn-secondary">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#64748b" strokeWidth="1.3"/>
                <path d="M6 5.5l4 2-4 2V5.5z" fill="#64748b"/>
              </svg>
              Watch demo
            </a>
          </div>
          <div className="social-proof">
            <div className="avatars">
              {["A","B","C","D"].map((l) => (
                <div className="avatar" key={l}>{l}</div>
              ))}
            </div>
            <p className="social-text">
              Trusted by <strong>2,400+</strong> Shopify merchants
            </p>
          </div>
        </section>

        {/* Preview */}
        <div className="preview-wrap">
          <div className="preview-frame">
            <div className="preview-bar">
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-url">app.aropt.ai/dashboard</div>
            </div>
            <div className="mock-dash">
              <div className="mock-sidebar">
                {["Overview","AI Visibility","Products","Recommendations","Settings"].map((item, i) => (
                  <div className={`mock-nav-item${i === 0 ? " active" : ""}`} key={item}>
                    <div className="mock-nav-icon" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mock-main">
                <div className="mock-title">AI Visibility Overview</div>
                <div className="mock-cards">
                  <div className="mock-card">
                    <div className="mock-card-label">AI Visibility Score</div>
                    <div className="mock-card-val good">84</div>
                    <div className="mock-card-sub">+6 this week</div>
                  </div>
                  <div className="mock-card">
                    <div className="mock-card-label">Indexed Products</div>
                    <div className="mock-card-val brand">312</div>
                    <div className="mock-card-sub">of 340 total</div>
                  </div>
                  <div className="mock-card">
                    <div className="mock-card-label">Issues Found</div>
                    <div className="mock-card-val warn">17</div>
                    <div className="mock-card-sub">4 critical</div>
                  </div>
                </div>
                <div className="mock-bar-section">
                  {[
                    { label: "Product Descriptions", val: 88, color: "#16b98c" },
                    { label: "Structured Data", val: 62, color: "#f5b429" },
                    { label: "Brand Voice", val: 75, color: "#4d7aff" },
                    { label: "Image Alt Text", val: 41, color: "#f0683a" },
                  ].map(({ label, val, color }) => (
                    <div className="mock-bar-row" key={label}>
                      <div className="mock-bar-label">{label}</div>
                      <div className="mock-bar-track">
                        <div className="mock-bar-fill" style={{ width: `${val}%`, background: color }} />
                      </div>
                      <div className="mock-bar-score">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="features-section">
          <p className="section-label">What you get</p>
          <h2 className="section-title">Built for the AI-first era of shopping</h2>
          <p className="section-sub">AI agents now gatekeep product discovery. AROpt makes sure yours wins.</p>
          <div className="features-grid">
            {[
              { icon: "🔍", cls: "fi-blue", title: "AI Perception Audit", desc: "See exactly how LLM-powered shopping agents read, interpret, and rank your product pages." },
              { icon: "⚡", cls: "fi-teal", title: "Instant Fix Suggestions", desc: "Prioritised, actionable recommendations with one-click Shopify implementation." },
              { icon: "📊", cls: "fi-amber", title: "Visibility Scoring", desc: "Track your AI visibility score across 6 key dimensions and benchmark against competitors." },
              { icon: "🧬", cls: "fi-blue", title: "Structured Data Check", desc: "Validate schema markup and JSON-LD that AI agents rely on for product understanding." },
              { icon: "🎯", cls: "fi-teal", title: "Brand Voice Analysis", desc: "Ensure your store communicates consistently and compellingly to AI and humans alike." },
              { icon: "🔔", cls: "fi-amber", title: "Live Monitoring", desc: "Get alerted the moment an AI model's behavior affects your store's discoverability." },
            ].map(({ icon, cls, title, desc }) => (
              <div className="feature-card" key={title}>
                <div className={`feature-icon ${cls}`}>{icon}</div>
                <div className="feature-title">{title}</div>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="how-section">
          <p className="section-label">How it works</p>
          <h2 className="section-title">Up and running in minutes</h2>
          <div className="steps-grid">
            {[
              { n: "01", title: "Connect your store", desc: "Install the Shopify app or paste your store URL. We index your entire catalog instantly." },
              { n: "02", title: "AI scans everything", desc: "Our models simulate how GPT, Gemini, and Perplexity agents perceive your storefront." },
              { n: "03", title: "Act on insights", desc: "Apply recommendations directly from the dashboard and watch your score climb." },
            ].map(({ n, title, desc }) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <div className="step-title">{title}</div>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-card">
            <p className="section-label">Get started free</p>
            <h2 className="section-title">Stop guessing what AI sees</h2>
            <p className="section-sub">Join 2,400+ merchants already optimizing for the AI shopping revolution.</p>
            <Link href="/dashboard" className="btn-primary" style={{ margin: "0 auto" }}>
              Analyze My Store Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        <footer>
          <div className="footer-logo">AROpt</div>
          <div className="footer-copy">© 2025 AI Representation Optimizer. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}