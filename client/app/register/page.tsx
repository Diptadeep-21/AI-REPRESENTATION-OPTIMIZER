"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await apiClient.post("/auth/register", { name, email, password });
      await login(res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
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

        *, *::before, *::after { box-sizing: border-box; }

        .auth-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
          position: relative; overflow: hidden;
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse2 { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

        /* ── card ── */
        .auth-card {
          width: 100%; max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 40px;
          position: relative; z-index: 1;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── logo ── */
        .auth-logo {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 32px;
        }
        .auth-logo-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green);
          animation: pulse2 2.2s ease infinite;
        }
        .auth-logo-text {
          font-family: var(--font-serif);
          font-size: 18px; letter-spacing: -0.02em; color: var(--ink);
        }

        /* ── heading ── */
        .auth-heading {
          font-family: var(--font-serif);
          font-size: 28px; letter-spacing: -0.025em; color: var(--ink);
          margin-bottom: 8px; line-height: 1.15;
        }
        .auth-sub {
          font-size: 13.5px; color: var(--ink2); font-weight: 300;
          margin-bottom: 24px; line-height: 1.55;
        }

        /* ── feature bullets ── */
        .auth-features {
          display: flex; flex-direction: column; gap: 9px;
          margin-bottom: 28px;
          padding: 16px 18px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .auth-feature {
          display: flex; align-items: center; gap: 10px;
          font-size: 12.5px; color: var(--ink2); font-weight: 300;
        }
        .auth-feature-icon {
          width: 16px; height: 16px; flex-shrink: 0;
          color: var(--green);
        }

        /* ── fields ── */
        .auth-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
        .auth-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--ink3);
        }
        .auth-input {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 9px; padding: 11px 14px;
          color: var(--ink);
          font-family: var(--font); font-size: 13.5px;
          outline: none; transition: border-color 0.2s;
          width: 100%;
        }
        .auth-input::placeholder { color: var(--ink3); }
        .auth-input:focus { border-color: var(--border-mid); }

        /* ── error ── */
        .auth-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(224,85,85,0.07);
          border: 1px solid rgba(224,85,85,0.2);
          border-radius: 10px; padding: 11px 14px;
          font-size: 12.5px; color: var(--red);
          margin-bottom: 14px;
        }
        .auth-error-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); flex-shrink: 0; }

        /* ── submit ── */
        .auth-submit {
          width: 100%; padding: 12px;
          background: var(--ink); color: var(--bg);
          border: none; border-radius: 9px;
          font-family: var(--font);
          font-size: 14px; font-weight: 500;
          cursor: pointer; transition: opacity 0.2s, transform 0.2s;
          margin-top: 6px;
          display: flex; align-items: center; justify-content: center;
        }
        .auth-submit:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .auth-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .auth-spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(17,17,16,0.25);
          border-top-color: var(--bg);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
        }

        /* ── divider ── */
        .auth-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .auth-divider-line { flex: 1; height: 1px; background: var(--border); }
        .auth-divider-text { font-size: 12px; color: var(--ink3); }

        /* ── footer ── */
        .auth-footer { text-align: center; font-size: 13px; color: var(--ink2); font-weight: 300; }
        .auth-footer-link {
          color: var(--ink); cursor: pointer; font-weight: 500;
          transition: opacity 0.2s; text-decoration: underline; text-decoration-color: var(--border-mid);
        }
        .auth-footer-link:hover { opacity: 0.8; }

        .auth-terms {
          font-size: 11.5px; color: var(--ink3); text-align: center;
          margin-top: 16px; line-height: 1.6; font-weight: 300;
        }

        @media (max-width: 460px) {
          .auth-card { padding: 32px 24px; }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo">
            <span className="auth-logo-dot" />
            <span className="auth-logo-text">Merchanta AI</span>
          </div>

          {/* Heading */}
          <div className="auth-heading">Create your account</div>
          <div className="auth-sub">Start optimizing your store's AI commerce visibility</div>

          {/* Feature bullets */}
          <div className="auth-features">
            {[
              "Real-time AI visibility scoring",
              "Product-level issue detection",
              "Actionable optimization recommendations",
            ].map((f) => (
              <div className="auth-feature" key={f}>
                <svg className="auth-feature-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error">
              <span className="auth-error-dot" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister}>
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <input
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading && <span className="auth-spinner" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          <div className="auth-footer">
            Already have an account?{" "}
            <span className="auth-footer-link" onClick={() => router.push("/login")}>
              Sign in
            </span>
          </div>

          <div className="auth-terms">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </>
  );
}