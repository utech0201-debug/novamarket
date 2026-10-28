"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Sign-in is temporarily unavailable. Please try again later.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "Those details don't match an account. Check them and try again."
            : signInError.message
        );
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("We couldn't sign you in. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "apple") {
    setError("");
    if (!supabase) {
      setError("Sign-in is temporarily unavailable. Please try again later.");
      return;
    }

    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("We couldn't start sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="y-login">
      <style>{styles}</style>

      <section className="y-brand" aria-label="YBG Garments">
        <div className="y-glow" />
        <svg className="y-silk" viewBox="0 0 800 220" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="y-silk-gradient" x1="0" x2="1">
              <stop offset="0" stopColor="#7d6330" />
              <stop offset=".5" stopColor="#f1dfa9" />
              <stop offset="1" stopColor="#7d6330" />
            </linearGradient>
          </defs>
          <g stroke="url(#y-silk-gradient)">
            {Array.from({ length: 7 }, (_, index) => (
              <path
                key={index}
                d={`M-60 ${40 + index * 22} C 140 ${-20 + index * 22}, 300 ${100 + index * 22}, 450 ${40 + index * 22} S 760 ${-20 + index * 22}, 860 ${40 + index * 22}`}
                strokeWidth="1"
                opacity={0.9 - index * 0.1}
                className="y-fold"
                style={{ animationDelay: `-${index * 1.1}s` }}
              />
            ))}
          </g>
        </svg>

        <div className="y-seal" aria-hidden="true">
          <svg viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="192" stroke="#B8985A" strokeOpacity=".35" />
            <circle cx="200" cy="200" r="148" stroke="#B8985A" strokeOpacity=".2" />
            <path id="y-ring" d="M200 200 m-170 0 a170 170 0 1 1 340 0 a170 170 0 1 1 -340 0" />
            <text fill="#C9AB6B" fontSize="14" fontFamily="sans-serif">
              <textPath href="#y-ring" textLength="1060" lengthAdjust="spacing">
                TAILORED WITH PRECISION ✦ CRAFTED BY HAND ✦ YBG GARMENTS ✦
              </textPath>
            </text>
          </svg>
        </div>

        <div className="y-frame" aria-hidden="true">
          <i className="y-corner y-tl" />
          <i className="y-corner y-tr" />
          <i className="y-corner y-bl" />
          <i className="y-corner y-br" />
        </div>

        <div className="y-badge"><i /> Designer portal</div>
        <div className="y-brand-center">
          <div className="y-monogram">YBG</div>
          <div className="y-rule" />
          <div className="y-brand-name">GARMENTS</div>
        </div>
        <p className="y-tagline">Cut with intention. Finished by hand.</p>
      </section>

      <section className="y-panel">
        <form className="y-form" onSubmit={handleSubmit} noValidate>
          <span className="y-gold-bar" />
          <p className="y-eyebrow">YOUR YBG ACCOUNT</p>
          <h1>Designer sign in</h1>
          <p className="y-subtitle">Welcome back. Your collections, sketches and fittings are waiting.</p>

          <div className="y-field">
            <input
              id="y-email"
              type="email"
              autoComplete="email"
              placeholder=" "
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              required
            />
            <label htmlFor="y-email">Email address</label>
          </div>

          <div className="y-field">
            <input
              id="y-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder=" "
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(error)}
              required
            />
            <label htmlFor="y-password">Password</label>
            <button
              type="button"
              className="y-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="y-error" role="alert" aria-live="polite">{error}</p>

          <button type="submit" className="y-submit" disabled={loading}>
            <span>{loading ? "Signing in…" : "Sign in"}</span>
            <b className="y-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </b>
          </button>

          <div className="y-or"><span>or continue with</span></div>

          <div className="y-social">
            <button type="button" onClick={() => handleSocialSignIn("google")} disabled={loading}>
              <span aria-hidden="true" className="y-google-mark">G</span> Google
            </button>
            <button type="button" onClick={() => handleSocialSignIn("apple")} disabled={loading}>
              <span aria-hidden="true" className="y-apple-mark">●</span> Apple
            </button>
          </div>

          <p className="y-foot">
            New to YBG? <Link href="/signup">Create an account</Link>
          </p>
          <p className="y-security">Secure sign-in powered by Supabase</p>
        </form>
      </section>
    </main>
  );
}

const styles = `
.y-login{--y-gold:#b8985a;--y-gold-dark:#8a6d33;--y-muted:#666;min-height:100svh;display:grid;grid-template-columns:1.1fr 1fr;gap:14px;padding:14px;background:#050505;color:#111;font-family:Arial,Helvetica,sans-serif}
.y-login *{box-sizing:border-box}
.y-brand{position:relative;min-height:680px;overflow:hidden;border:1px solid rgba(184,152,90,.28);border-radius:30px;background:#090909;display:flex;align-items:center;justify-content:center;padding:64px 36px}
.y-brand:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 48%,rgba(184,152,90,.22),transparent 70%),repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 1px,transparent 1px 22px)}
.y-brand:after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 35%,#000 100%);pointer-events:none}
.y-glow{position:absolute;inset:0;background:radial-gradient(380px circle at var(--mx,50%) var(--my,45%),rgba(217,191,132,.13),transparent 65%)}
.y-frame{position:absolute;inset:22px;border:1px solid rgba(184,152,90,.3);border-radius:22px;z-index:1;pointer-events:none}
.y-corner{position:absolute;width:42px;height:42px;border:2px solid var(--y-gold)}
.y-tl{top:-1px;left:-1px;border-right:0;border-bottom:0;border-radius:20px 0 0}
.y-tr{top:-1px;right:-1px;border-left:0;border-bottom:0;border-radius:0 20px 0 0}
.y-bl{bottom:-1px;left:-1px;border-right:0;border-top:0;border-radius:0 0 0 20px}
.y-br{bottom:-1px;right:-1px;border-left:0;border-top:0;border-radius:0 0 20px}
.y-brand-center{position:relative;z-index:2;text-align:center;animation:y-fade-in 1.1s ease both}
.y-monogram{font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:clamp(110px,15vw,230px);line-height:.9;letter-spacing:.02em;background:linear-gradient(105deg,#7d6330 0%,#d9bf84 22%,#fff3cf 34%,#b8985a 48%,#7d6330 70%,#d9bf84 100%);background-size:220% 100%;background-clip:text;-webkit-background-clip:text;color:transparent;animation:y-shine 4.5s ease-in-out .4s both}
.y-rule{width:120px;height:1px;margin:30px auto 26px;background:linear-gradient(90deg,transparent,var(--y-gold),transparent)}
.y-brand-name{font-size:15px;font-weight:300;letter-spacing:.75em;margin-right:-.75em;color:#f3efe6}
.y-badge{position:absolute;z-index:2;top:48px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:9px 18px;border:1px solid rgba(184,152,90,.45);border-radius:999px;background:rgba(184,152,90,.08);color:#e6d7b0;font-size:12px;letter-spacing:.08em;white-space:nowrap}
.y-badge i{width:6px;height:6px;border-radius:50%;background:var(--y-gold);box-shadow:0 0 10px var(--y-gold)}
.y-tagline{position:absolute;z-index:2;bottom:58px;left:0;right:0;margin:0;text-align:center;font-family:Georgia,serif;font-style:italic;font-size:17px;color:#cdbf9f;padding:0 30px}
.y-silk{position:absolute;left:0;bottom:0;width:100%;height:40%;z-index:1;pointer-events:none;mask-image:linear-gradient(to top,#000 25%,transparent 100%)}
.y-fold{animation:y-drift 8s ease-in-out infinite alternate}
.y-seal{position:absolute;z-index:1;top:47%;left:50%;width:clamp(320px,38vw,580px);aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none;opacity:.65}
.y-seal svg{width:100%;height:100%;animation:y-spin 70s linear infinite}
.y-panel{display:flex;align-items:center;justify-content:center;background:#fff;border-radius:30px;padding:52px 32px}
.y-form{width:100%;max-width:410px}
.y-gold-bar{display:block;width:44px;height:4px;border-radius:4px;background:var(--y-gold);margin-bottom:24px}
.y-eyebrow{margin:0 0 12px;color:var(--y-gold-dark);font-size:10px;font-weight:600;letter-spacing:.2em}
.y-form h1{font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:clamp(34px,3.2vw,46px);line-height:1.08;margin:0 0 14px;letter-spacing:-.02em}
.y-subtitle{margin:0 0 34px;color:var(--y-muted);font-size:15px;font-weight:300;line-height:1.7;max-width:36ch}
.y-field{position:relative;margin-bottom:15px}
.y-field input{width:100%;height:62px;border:1px solid #d3d3d3;background:#fafafa;border-radius:15px;padding:24px 66px 8px 18px;font:400 15px Arial,sans-serif;color:#111;outline:none;transition:border-color .2s,box-shadow .2s}
.y-field input:hover{border-color:#777;background:#fff}
.y-field input:focus{border-color:var(--y-gold);background:#fff;box-shadow:0 0 0 4px rgba(184,152,90,.16)}
.y-field label{position:absolute;left:19px;top:21px;font-size:15px;color:var(--y-muted);pointer-events:none;transition:all .2s}
.y-field input:focus+label,.y-field input:not(:placeholder-shown)+label{top:9px;font-size:10px;letter-spacing:.07em;color:var(--y-gold-dark)}
.y-toggle{position:absolute;right:15px;top:50%;transform:translateY(-50%);background:none;border:0;font-size:12px;color:var(--y-muted);cursor:pointer;padding:7px}
.y-toggle:hover{color:#111}
.y-error{min-height:20px;margin:8px 0 10px;font-size:12px;line-height:1.5;color:#a12b2b}
.y-submit{position:relative;overflow:hidden;width:100%;height:60px;border-radius:999px;background:#050505;color:#fff;border:1px solid #050505;box-shadow:0 10px 24px -10px rgba(0,0,0,.4);font-size:13px;font-weight:600;letter-spacing:.15em;cursor:pointer;transition:color .3s,border-color .3s}
.y-submit span{position:relative;z-index:1}
.y-submit:before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,#9c7d3f,#d9bf84 50%,#9c7d3f);transform:translateY(101%);transition:transform .35s}
.y-submit:hover:not(:disabled):before{transform:none}
.y-submit:hover:not(:disabled){color:#000;border-color:var(--y-gold)}
.y-submit:disabled{cursor:wait;opacity:.8}
.y-arrow{position:absolute;z-index:1;right:7px;top:7px;bottom:7px;aspect-ratio:1;border-radius:50%;background:var(--y-gold);display:grid;place-items:center;transition:background .3s,transform .3s}
.y-submit:hover:not(:disabled) .y-arrow{background:#050505;color:#d9bf84;transform:rotate(-45deg)}
.y-or{display:flex;align-items:center;gap:14px;margin:23px 0;color:#777;font-size:11px}
.y-or:before,.y-or:after{content:"";flex:1;height:1px;background:#e4e4e4}
.y-social{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.y-social button{height:50px;border-radius:999px;background:#fff;border:1px solid #d4d4d4;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:border-color .2s,background .2s}
.y-social button:hover:not(:disabled){border-color:#111;background:#fafafa}
.y-social button:disabled{opacity:.55;cursor:wait}
.y-google-mark{font-weight:700;font-size:16px;color:#4285f4}
.y-apple-mark{font-size:13px;color:#111}
.y-foot{margin:32px 0 0;text-align:center;font-size:13px;color:#666}
.y-foot a{color:#111;text-decoration:none;border-bottom:1px solid var(--y-gold);padding-bottom:2px}
.y-foot a:hover{color:var(--y-gold-dark)}
.y-security{margin:20px 0 0;text-align:center;font-size:10px;letter-spacing:.04em;color:#999}
.y-login a:focus-visible,.y-login button:focus-visible{outline:2px solid var(--y-gold);outline-offset:3px}
@keyframes y-fade-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
@keyframes y-shine{from{background-position:100% 0}to{background-position:0% 0}}
@keyframes y-drift{from{transform:translateY(0) scaleY(1)}to{transform:translateY(-16px) scaleY(1.25)}}
@keyframes y-spin{to{transform:rotate(360deg)}}
@media(max-width:900px){.y-login{grid-template-columns:1fr;padding:10px;gap:10px}.y-brand{min-height:360px;padding:90px 24px 56px;border-radius:25px}.y-panel{border-radius:25px;padding:38px 25px}.y-badge{top:28px}.y-frame{inset:12px;border-radius:16px}.y-corner{width:30px;height:30px}.y-monogram{font-size:96px}.y-rule{margin:18px auto 16px}.y-tagline{display:none}.y-seal{width:340px;top:50%}.y-silk{height:55%}.y-form h1{font-size:37px}}
@media(max-width:380px){.y-panel{padding:32px 18px}.y-social{gap:8px}.y-brand-name{font-size:12px}}
@media(prefers-reduced-motion:reduce){.y-brand-center,.y-seal svg,.y-fold,.y-monogram{animation:none}.y-login *{transition:none!important}}
`;
