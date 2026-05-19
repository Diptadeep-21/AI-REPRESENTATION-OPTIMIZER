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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .auth-root {
          min-height: 100vh;
          background: #04070f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow: hidden;
        }

        .auth-glow-1 {
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(77,122,255,0.10) 0%, transparent 70%);
          top: -100px; left: -100px; pointer-events: none;
        }
        .auth-glow-2 {
          position: absolute;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(22,185,140,0.07) 0%, transparent 70%);
          bottom: -80px; right: -80px; pointer-events: none;
        }

        .auth-card {
          width: 100%; max-width: 420px;
          background: #080e1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 40px;
          position: relative; z-index: 1;
        }

        .auth-logo {
          display: flex; align-items: center; gap: 9px; margin-bottom: 36px;
        }
        .auth-logo-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #4d7aff; box-shadow: 0 0 12px rgba(77,122,255,0.7);
        }
        .auth-logo-text {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800;
          letter-spacing: -0.03em; color: #e8edf5;
        }

        .auth-heading {
          font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
          letter-spacing: -0.04em; color: #e8edf5; margin-bottom: 6px;
        }
        .auth-sub { font-size: 13.5px; color: #4a5568; margin-bottom: 32px; line-height: 1.5; }

        /* Feature bullets */
        .auth-features {
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px;
        }
        .auth-feature {
          display: flex; align-items: center; gap: 9px;
          font-size: 12.5px; color: #4a5568;
        }
        .auth-feature-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #16b98c; flex-shrink: 0;
          box-shadow: 0 0 6px rgba(22,185,140,0.5);
        }

        .auth-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .auth-label { font-size: 12px; font-weight: 500; color: #64748b; letter-spacing: 0.02em; }
        .auth-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 11px 14px;
          color: #e8edf5;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px;
          outline: none; transition: border-color 0.15s, background 0.15s;
          width: 100%; box-sizing: border-box;
        }
        .auth-input::placeholder { color: #2d3748; }
        .auth-input:focus {
          border-color: rgba(77,122,255,0.45);
          background: rgba(77,122,255,0.04);
        }

        .auth-error {
          display: flex; align-items: center; gap: 8px;
          background: rgba(240,104,58,0.08); border: 1px solid rgba(240,104,58,0.20);
          border-radius: 9px; padding: 10px 13px;
          font-size: 12.5px; color: #f0683a; margin-bottom: 14px;
        }
        .auth-error-dot { width: 6px; height: 6px; border-radius: 50%; background: #f0683a; flex-shrink: 0; }

        .auth-submit {
          width: 100%; padding: 12px;
          background: #4d7aff; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: opacity 0.15s, box-shadow 0.15s;
          margin-top: 6px;
        }
        .auth-submit:hover:not(:disabled) {
          opacity: 0.88; box-shadow: 0 0 20px rgba(77,122,255,0.35);
        }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-divider {
          display: flex; align-items: center; gap: 12px; margin: 24px 0;
        }
        .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
        .auth-divider-text { font-size: 12px; color: #1e293b; }

        .auth-footer { text-align: center; font-size: 13px; color: #4a5568; }
        .auth-footer-link {
          color: #8aabff; cursor: pointer; font-weight: 500; transition: color 0.15s;
        }
        .auth-footer-link:hover { color: #4d7aff; }

        .auth-terms {
          font-size: 11.5px; color: #1e293b; text-align: center;
          margin-top: 16px; line-height: 1.6;
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-glow-1" />
        <div className="auth-glow-2" />

        <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo">
            <span className="auth-logo-dot" />
            <span className="auth-logo-text">AROpt</span>
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
                <span className="auth-feature-dot" />
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