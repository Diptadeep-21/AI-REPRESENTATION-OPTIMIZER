"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api/auth";

const WORDS = ["AI agents", "customers", "search bots", "LLM agents"];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    desc: "Perfect for exploring AI visibility for a small store.",
    features: [
      "25 products scanned",
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
    features: [
      "Unlimited products",
      "All AI agents (GPT, Gemini, Claude)",
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

const FEATURES = [
  { n: "01", title: "AI perception audit", desc: "See exactly how LLM-powered shopping agents read, interpret, and rank your product pages — before customers ever search." },
  { n: "02", title: "Instant fix suggestions", desc: "Prioritised, actionable recommendations with one-click Shopify implementation. No guesswork, no developer needed." },
  { n: "03", title: "Visibility scoring across 6 dimensions", desc: "Track your AI visibility score — product descriptions, structured data, brand voice, image alt text, and more." },
  { n: "04", title: "Agent simulation", desc: "We simulate how GPT-4o, Gemini, Perplexity, and Claude each perceive your storefront, so nothing is left to chance." },
  { n: "05", title: "Live monitoring & alerts", desc: "Get notified the moment a model update or content change affects your store's discoverability." },
  { n: "06", title: "Competitor benchmarking", desc: "See how your AI visibility score stacks up against similar stores in your category." },
];

const BARS = [
  { label: "Product descriptions", val: 88, color: "#3ecf8e" },
  { label: "Structured data", val: 62, color: "#e8a838" },
  { label: "Brand voice", val: 75, color: "#8c8a83" },
  { label: "Image alt text", val: 41, color: "#e05555" },
];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [barsAnimated, setBarsAnimated] = useState(false);

  const featuresRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Rotating word in hero
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setWordVisible(true);
      }, 320);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Animate bars on scroll
  useEffect(() => {
    if (!frameRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setBarsAnimated(true), 400);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(frameRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDashboardAccess = () => router.push(isAuthenticated() ? "/dashboard" : "/login");
  const handleGetStarted = () => router.push(isAuthenticated() ? "/dashboard" : "/register");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #111110;
          --surface: #1c1b1a;
          --surface2: #242321;
          --surface3: #2e2c2a;
          --border: rgba(255,255,255,0.07);
          --border-mid: rgba(255,255,255,0.13);
          --ink: #f0ede8;
          --ink2: #8c8a83;
          --ink3: #504e49;
          --green: #3ecf8e;
          --green-bg: rgba(62,207,142,0.1);
          --green-border: rgba(62,207,142,0.2);
          --amber: #e8a838;
          --red: #e05555;
          --sand: #f5ede0;
          --sand2: #ede3d4;
          --sand3: #ecdcc8;
          --sand-ink: #2a1f10;
          --sand-ink2: #7a6550;
          --font-serif: 'DM Serif Display', serif;
          --font: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        html { scroll-behavior: smooth; }
        html, body {
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── REVEAL ── */
        .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.06s; }
        .d2 { transition-delay: 0.13s; }
        .d3 { transition-delay: 0.20s; }
        .d4 { transition-delay: 0.27s; }
        .d5 { transition-delay: 0.34s; }
        .d6 { transition-delay: 0.41s; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 54px;
          border-bottom: 1px solid var(--border);
          background: rgba(17,17,16,0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .nav-logo {
          font-family: var(--font-serif);
          font-size: 18px;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .nav-r { display: flex; align-items: center; gap: 6px; }
        .nav-link {
          font-size: 13px; color: var(--ink2);
          padding: 6px 14px; border-radius: 7px;
          background: none; border: 1px solid var(--border);
          cursor: pointer; font-family: var(--font);
          transition: border-color 0.2s, color 0.2s;
        }
        .nav-link:hover { border-color: var(--border-mid); color: var(--ink); }
        .nav-btn {
          font-size: 13px; font-weight: 500;
          color: var(--bg); background: var(--ink);
          padding: 7px 16px; border-radius: 8px;
          border: none; cursor: pointer; font-family: var(--font);
          transition: opacity 0.2s;
        }
        .nav-btn:hover { opacity: 0.85; }

        /* ── HERO ── */
        .hero {
          padding: 96px 48px 80px;
          max-width: 860px;
          margin: 0 auto;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 500; color: var(--green);
          background: var(--green-bg); border: 1px solid var(--green-border);
          padding: 4px 12px 4px 10px; border-radius: 100px; margin-bottom: 36px;
          animation: badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green);
          animation: pulse 2.2s ease infinite;
        }
        @keyframes badgePop {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.75); }
        }
        .hero-h1 {
          font-family: var(--font-serif);
          font-size: clamp(42px, 6.5vw, 72px);
          line-height: 1.05; letter-spacing: -0.025em;
          color: var(--ink); max-width: 640px;
          margin-bottom: 22px;
          animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }
        .hero-line {
          display: inline-flex;
          align-items: baseline;
          white-space: nowrap;
          gap: 0.2em;
        }
        .hero-em {
          font-style: italic; color: var(--ink2);
          display: inline-block;
          min-width: 11ch;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .hero-em.hidden { opacity: 0; transform: translateY(6px); }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-desc {
          font-size: 17px; color: var(--ink2); line-height: 1.7;
          max-width: 460px; font-weight: 300; margin-bottom: 40px;
          animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }
        .hero-actions {
          display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
          animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--ink); color: var(--bg);
          font-size: 14px; font-weight: 500;
          padding: 11px 22px; border-radius: 9px;
          border: none; cursor: pointer; font-family: var(--font);
          transition: opacity 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); color: var(--bg); }
        .btn-primary .arrow { transition: transform 0.2s; }
        .btn-primary:hover .arrow { transform: translateX(3px); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--ink2);
          font-size: 14px; font-weight: 400;
          padding: 11px 20px; border-radius: 9px;
          border: 1px solid var(--border-mid); cursor: pointer;
          font-family: var(--font);
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: var(--ink); transform: translateY(-1px); }

        .proof {
          display: flex; align-items: center; gap: 18px;
          margin-top: 56px; padding-top: 56px;
          border-top: 1px solid var(--border);
          animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both;
          flex-wrap: wrap;
        }
        .proof-stat { display: flex; flex-direction: column; gap: 3px; }
        .ps-n {
          font-family: var(--font-serif);
          font-size: 32px; color: var(--ink);
          letter-spacing: -0.03em; line-height: 1;
        }
        .ps-l { font-size: 12px; color: var(--ink3); }
        .proof-div { width: 1px; height: 40px; background: var(--border); }

        /* ── DASHBOARD PREVIEW ── */
        .preview-wrap {
          max-width: 860px; margin: 0 auto 112px;
          padding: 0 48px;
          animation: heroIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both;
        }
        .frame {
          border: 1px solid var(--border); border-radius: 18px;
          overflow: hidden; background: var(--surface);
          box-shadow: 0 0 0 1px var(--border), 0 32px 80px rgba(0,0,0,0.5);
        }
        .frame-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 11px 16px; border-bottom: 1px solid var(--border);
          background: var(--surface2);
        }
        .fd { width: 10px; height: 10px; border-radius: 50%; }
        .frame-url {
          flex: 1; text-align: center;
          font-size: 11.5px; color: var(--ink3);
          font-family: var(--font-mono);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border); border-radius: 6px;
          padding: 4px 12px; margin: 0 12px;
        }
        .dash { display: grid; grid-template-columns: 180px 1fr; height: 380px; }
        .sidebar {
          background: rgba(255,255,255,0.02);
          border-right: 1px solid var(--border);
          padding: 16px 10px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .si {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 11px; border-radius: 8px;
          font-size: 12.5px; color: var(--ink3); cursor: default;
          transition: background 0.2s, color 0.2s;
        }
        .si:hover { background: rgba(255,255,255,0.04); color: var(--ink2); }
        .si.on {
          background: rgba(255,255,255,0.06);
          color: var(--ink); border: 1px solid var(--border);
        }
        .si-dot { width: 12px; height: 12px; border-radius: 3px; background: currentColor; opacity: 0.45; flex-shrink: 0; }
        .si.on .si-dot { opacity: 0.85; }
        .dash-main { padding: 24px; display: flex; flex-direction: column; gap: 18px; overflow: hidden; }
        .dash-title { font-family: var(--font-serif); font-size: 18px; color: var(--ink); letter-spacing: -0.01em; }
        .stat-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        .stat {
          background: var(--surface2); border-radius: 10px;
          padding: 14px 16px; border: 1px solid var(--border);
          transition: border-color 0.2s;
        }
        .stat:hover { border-color: var(--border-mid); }
        .stat-label { font-size: 10px; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
        .stat-val { font-family: var(--font-serif); font-size: 28px; line-height: 1; letter-spacing: -0.03em; }
        .stat-sub { font-size: 11px; color: var(--ink3); margin-top: 3px; }
        .bars { display: flex; flex-direction: column; gap: 10px; }
        .bar-row { display: flex; align-items: center; gap: 12px; }
        .bar-label { font-size: 12px; color: var(--ink3); width: 150px; flex-shrink: 0; }
        .bar-track {
          flex: 1; background: var(--surface2); border-radius: 99px;
          height: 5px; overflow: hidden; border: 1px solid var(--border);
        }
        .bar-fill {
          height: 100%; border-radius: 99px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 1.2s cubic-bezier(0.16,1,0.3,1);
        }
        .bar-fill.on { transform: scaleX(1); }
        .bar-pct { font-size: 11.5px; color: var(--ink3); width: 28px; text-align: right; font-family: var(--font-mono); }

        /* ── SECTIONS ── */
        .section { max-width: 860px; margin: 0 auto 100px; padding: 0 48px; }
        .sec-eyebrow {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink3); margin-bottom: 16px;
        }
        .sec-h {
          font-family: var(--font-serif);
          font-size: clamp(26px, 3.5vw, 42px);
          letter-spacing: -0.025em; line-height: 1.12;
          color: var(--ink); margin-bottom: 12px;
        }
        .sec-p { font-size: 15px; color: var(--ink2); line-height: 1.65; max-width: 440px; font-weight: 300; }

        /* ── FEATURES (numbered list) ── */
        .feat-list { margin-top: 48px; border-top: 1px solid var(--border); }
        .feat-item {
          display: grid; grid-template-columns: 44px 1fr;
          padding: 22px 0; border-bottom: 1px solid var(--border);
          align-items: start; cursor: default;
        }
        .feat-item:hover .feat-title { color: var(--ink); }
        .feat-num { font-family: var(--font-mono); font-size: 12px; color: var(--ink3); padding-top: 2px; }
        .feat-title { font-size: 14px; font-weight: 500; margin-bottom: 5px; color: var(--ink2); transition: color 0.2s; }
        .feat-desc { font-size: 13px; color: var(--ink3); line-height: 1.65; font-weight: 300; max-width: 520px; }

        /* ── HOW IT WORKS ── */
        .steps-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-top: 48px; }
        .step-card {
          padding: 24px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 14px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .step-card:hover { border-color: var(--border-mid); transform: translateY(-3px); }
        .step-icon-box {
          width: 36px; height: 36px; border-radius: 9px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .step-n { font-family: var(--font-mono); font-size: 11px; color: var(--ink3); margin-bottom: 8px; }
        .step-t { font-size: 14px; font-weight: 500; color: var(--ink); margin-bottom: 7px; }
        .step-d { font-size: 13px; color: var(--ink3); line-height: 1.6; font-weight: 300; }

        /* ── PRICING ── */
        .price-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 48px; }
        .pc {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 28px 24px;
          display: flex; flex-direction: column; position: relative;
          transition: border-color 0.25s, transform 0.25s;
        }
        .pc:hover { border-color: var(--border-mid); transform: translateY(-2px); }
        /* Sand card — highlighted Growth */
        .pc.hl {
          background: var(--sand);
          border-color: rgba(245,237,224,0.3);
        }
        .pc.hl:hover { transform: translateY(-4px); }
        .pc-badge {
          position: absolute; top: 18px; right: 18px;
          background: rgba(42,31,16,0.1); color: var(--sand-ink2);
          font-size: 10px; font-weight: 500; letter-spacing: 0.05em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 100px;
        }
        .pc-name {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--ink3); margin-bottom: 14px;
        }
        .pc.hl .pc-name { color: var(--sand-ink2); }
        .pc-price { font-family: var(--font-serif); font-size: 44px; letter-spacing: -0.04em; line-height: 1; color: var(--ink); }
        .pc.hl .pc-price { color: var(--sand-ink); }
        .pc-per { font-size: 12px; color: var(--ink3); margin: 5px 0 10px; }
        .pc.hl .pc-per { color: var(--sand-ink2); }
        .pc-desc { font-size: 12.5px; color: var(--ink2); line-height: 1.55; margin-bottom: 20px; font-weight: 300; }
        .pc.hl .pc-desc { color: var(--sand-ink2); }
        .pc-div { height: 1px; background: var(--border); margin-bottom: 20px; }
        .pc.hl .pc-div { background: rgba(42,31,16,0.1); }
        .pc-feats { flex: 1; display: flex; flex-direction: column; gap: 9px; margin-bottom: 24px; }
        .pf {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 12.5px; color: var(--ink3); font-weight: 300; line-height: 1.5;
        }
        .pc.hl .pf { color: var(--sand-ink2); }
        .pf-icon { flex-shrink: 0; margin-top: 2px; }
        .pc-btn {
          width: 100%; padding: 10px 0; border-radius: 9px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: var(--font);
          transition: opacity 0.2s, transform 0.2s;
        }
        .pc-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .pc-btn.dark { background: var(--surface2); color: var(--ink); border: 1px solid var(--border); }
        .pc-btn.dark:hover { background: var(--surface3); }
        .pc-btn.sand-btn { background: var(--sand-ink); color: var(--sand); border: none; }

        /* ── CTA ── */
        .cta-wrap { max-width: 860px; margin: 0 auto 96px; padding: 0 48px; }
        .cta-inner {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 64px 56px;
          display: grid; grid-template-columns: 1fr auto;
          gap: 48px; align-items: center;
        }
        .cta-btns { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; min-width: 200px; }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid var(--border);
          padding: 24px 48px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .f-logo { font-family: var(--font-serif); font-size: 16px; color: var(--ink3); }
        .f-copy { font-size: 12px; color: var(--ink3); }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 99px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 680px) {
          .nav { padding: 0 20px; }
          .nav-r .nav-link { display: none; }
          .hero, .preview-wrap, .section, .cta-wrap { padding-left: 20px; padding-right: 20px; }
          .hero-h1 { font-size: 38px; }
          .stat-row, .steps-row, .price-grid { grid-template-columns: 1fr; }
          .dash { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .cta-inner { grid-template-columns: 1fr; gap: 28px; padding: 36px 28px; }
          footer { flex-direction: column; gap: 8px; text-align: center; padding: 20px; }
          .proof { flex-wrap: wrap; gap: 14px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">Merchanta AI</div>
        <div className="nav-r">
          <button className="nav-link" onClick={() => scrollTo(featuresRef)}>Features</button>
          <button className="nav-link" onClick={() => scrollTo(pricingRef)}>Pricing</button>
          <button className="nav-btn" onClick={handleDashboardAccess}>Open dashboard</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          AI commerce intelligence
        </div>
        <h1 className="hero-h1">
          Your store, through<br />
          <span className="hero-line">
            the eyes of {" "}
            <em className={`hero-em${wordVisible ? "" : " hidden"}`}>
              {WORDS[wordIndex]}
            </em>
          </span>
        </h1>
        <p className="hero-desc">
          LLM-powered shopping agents now decide what customers discover. Understand how they read your Shopify store — and win more of that traffic.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={handleGetStarted}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Analyze my store
            <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-ghost" onClick={() => scrollTo(howRef)}>
            How it works
          </button>
        </div>
        <div className="proof">
          <div className="proof-stat"><span className="ps-n">2,400+</span><span className="ps-l">Shopify merchants</span></div>
          <div className="proof-div" />
          <div className="proof-stat"><span className="ps-n">6</span><span className="ps-l">Scoring dimensions</span></div>
          <div className="proof-div" />
          <div className="proof-stat"><span className="ps-n">4</span><span className="ps-l">AI agents simulated</span></div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <div className="preview-wrap" ref={frameRef}>
        <div className="frame">
          <div className="frame-bar">
            <div className="fd" style={{ background: "#f05252" }} />
            <div className="fd" style={{ background: "#f5b429" }} />
            <div className="fd" style={{ background: "#3ecf8e" }} />
            <div className="frame-url">app.merchanta.ai/dashboard</div>
          </div>
          <div className="dash">
            <div className="sidebar">
              {["Overview", "AI visibility", "Products", "Recommendations", "Settings"].map((item, i) => (
                <div className={`si${i === 0 ? " on" : ""}`} key={item}>
                  <div className="si-dot" />
                  {item}
                </div>
              ))}
            </div>
            <div className="dash-main">
              <div className="dash-title">AI visibility overview</div>
              <div className="stat-row">
                <div className="stat">
                  <div className="stat-label">Visibility score</div>
                  <div className="stat-val" style={{ color: "#3ecf8e" }}>84</div>
                  <div className="stat-sub">+6 this week</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Products indexed</div>
                  <div className="stat-val">312</div>
                  <div className="stat-sub">of 340 total</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Issues found</div>
                  <div className="stat-val" style={{ color: "#e8a838" }}>17</div>
                  <div className="stat-sub">4 critical</div>
                </div>
              </div>
              <div className="bars">
                {BARS.map(({ label, val, color }) => (
                  <div className="bar-row" key={label}>
                    <div className="bar-label">{label}</div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill${barsAnimated ? " on" : ""}`}
                        style={{ width: `${val}%`, background: color }}
                      />
                    </div>
                    <div className="bar-pct">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section" ref={featuresRef} style={{ scrollMarginTop: 64 }}>
        <p className="sec-eyebrow reveal">Features</p>
        <h2 className="sec-h reveal d1">Everything your store needs<br />to win AI discovery</h2>
        <div className="feat-list">
          {FEATURES.map(({ n, title, desc }, i) => (
            <div className={`feat-item reveal d${Math.min(i + 1, 6)}`} key={n}>
              <div className="feat-num">{n}</div>
              <div>
                <div className="feat-title">{title}</div>
                <p className="feat-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" ref={howRef} style={{ scrollMarginTop: 64 }}>
        <p className="sec-eyebrow reveal">How it works</p>
        <h2 className="sec-h reveal d1">Up and running in minutes</h2>
        <div className="steps-row">
          {[
            { n: "01", title: "Connect your store", desc: "Install the Shopify app or paste your store URL. We index your entire catalog instantly.", icon: <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--ink3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> },
            { n: "02", title: "AI scans everything", desc: "Our models simulate how GPT, Gemini, and Perplexity agents perceive your storefront.", icon: <><circle cx="8" cy="8" r="5" stroke="var(--ink3)" strokeWidth="1.4" fill="none" /><path d="M8 5.5v2.5l1.5 1.5" stroke="var(--ink3)" strokeWidth="1.4" strokeLinecap="round" /></> },
            { n: "03", title: "Act on insights", desc: "Apply recommendations directly from the dashboard and watch your score climb.", icon: <path d="M3 10l3-3 2.5 2.5L13 5" stroke="var(--ink3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> },
          ].map(({ n, title, desc, icon }, i) => (
            <div className={`step-card reveal d${i + 1}`} key={n}>
              <div className="step-icon-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{icon}</svg>
              </div>
              <div className="step-n">{n}</div>
              <div className="step-t">{title}</div>
              <p className="step-d">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" ref={pricingRef} style={{ scrollMarginTop: 64 }}>
        <p className="sec-eyebrow reveal">Pricing</p>
        <h2 className="sec-h reveal d1">Simple, transparent pricing</h2>
        <p className="sec-p reveal d2">Start free. Scale when your store does.</p>
        <div className="price-grid">
          {PLANS.map((plan, i) => (
            <div className={`pc${plan.highlight ? " hl" : ""} reveal d${i + 1}`} key={plan.name}>
              {plan.highlight && <div className="pc-badge">Most popular</div>}
              <div className="pc-name">{plan.name}</div>
              <div className="pc-price">{plan.price}</div>
              <div className="pc-per">{plan.period}</div>
              <div className="pc-desc">{plan.desc}</div>
              <div className="pc-div" />
              <div className="pc-feats">
                {plan.features.map((f) => (
                  <div className="pf" key={f}>
                    <svg className="pf-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-5" stroke={plan.highlight ? "var(--sand-ink2)" : "var(--ink3)"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
              <button
                className={`pc-btn${plan.highlight ? " sand-btn" : " dark"}`}
                onClick={handleGetStarted}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink3)", marginTop: 20 }}>
          14-day free trial on all plans. No credit card required.
        </p>
      </section>

      {/* ── CTA ── */}
      <div className="cta-wrap">
        <div className="cta-inner reveal">
          <div>
            <h2 className="sec-h" style={{ maxWidth: 340 }}>Ready to see what AI sees?</h2>
            <p className="sec-p" style={{ marginTop: 10 }}>
              Join 2,400+ merchants already optimizing for the AI shopping revolution.
            </p>
          </div>
          <div className="cta-btns">
            <button className="btn-primary" onClick={handleGetStarted}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Analyze my store
              <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btn-ghost" onClick={handleDashboardAccess}>Talk to sales</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="f-logo">Merchanta AI</div>
        <div className="f-copy">© 2025 Merchanta AI. All rights reserved.</div>
      </footer>
    </>
  );
}