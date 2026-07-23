"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { 
  Bot, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  Building, 
  Globe 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { clients, setCurrentUser } = useStore();

  // Form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        if (!name || !email || !companyName) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }

        // Mock sign up
        const newClient = {
          id: "client-" + Math.random().toString(36).substring(2, 9),
          name,
          email,
          companyName,
          website: website || "https://company.io",
          role: "client" as const,
          subscription: {
            plan: "Monthly Maintenance" as const,
            status: "Active" as const,
            supportStatus: "Active Premium Support" as const,
            price: "$199/mo",
            startDate: new Date().toISOString().substring(0, 10),
          }
        };

        // We can save client via custom logic or just inject it
        setCurrentUser(newClient);
        router.push("/dashboard");
      } else {
        // Mock Login
        if (!email) {
          setError("Please provide your email address.");
          setLoading(false);
          return;
        }

        // Find existing mock client
        const matched = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (matched) {
          setCurrentUser(matched);
          if (matched.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          // Fallback create client for easy demo
          const customClient = {
            id: "client-custom",
            name: email.split("@")[0].toUpperCase(),
            email,
            companyName: email.split("@")[0].toUpperCase() + " Enterprise",
            website: "https://yourwebsite.com",
            role: "client" as const,
            subscription: {
              plan: "Monthly Maintenance" as const,
              status: "Active" as const,
              supportStatus: "Active Premium Support" as const,
              price: "$199/mo",
              startDate: new Date().toISOString().substring(0, 10),
            }
          };
          setCurrentUser(customClient);
          router.push("/dashboard");
        }
      }
      setLoading(false);
    }, 800);
  };

  // Quick Demo logins helper
  const handleQuickLogin = (role: 'client-apex' | 'client-luxe' | 'admin') => {
    let matched;
    if (role === 'client-apex') {
      matched = clients.find(c => c.id === 'client-apex');
    } else if (role === 'client-luxe') {
      matched = clients.find(c => c.id === 'client-luxe');
    } else {
      matched = clients.find(c => c.role === 'admin');
    }

    if (matched) {
      setCurrentUser(matched);
      if (matched.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative dark-gradient-bg">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[300px] bg-pink-500/10 rounded-full blur-[80px]" />

      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
          <Bot className="w-5.5 h-5.5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-2xl tracking-tight text-white">ChatFlow</span>
          <span className="text-xs bg-indigo-500/15 text-indigo-300 font-bold px-2 py-0.5 ml-1 rounded-full border border-indigo-500/20">AI</span>
        </div>
      </Link>

      <div className="w-full max-w-md">
        {/* Main Auth Card */}
        <div className="glass-card p-8 border-slate-800 bg-slate-900/60 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white">
              {isSignUp ? "Create Custom Workspace" : "Access Platform Workspace"}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              {isSignUp ? "Get your customizable AI assistant in under 2 mins" : "Sign in to manage chatbots and download ownership codes"}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Apex Tech"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="apextech.io"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">Forgot?</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm glass-input"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg font-bold text-white premium-gradient shadow-lg shadow-indigo-500/10 hover:opacity-95 transition-all text-sm flex items-center justify-center gap-2 glow-btn disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignUp ? "Create Platform Workspace" : "Access Workspace"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle link */}
          <div className="text-center mt-6 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            {isSignUp ? "Already have a platform workspace?" : "Need a professional AI chatbot?"}{" "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 hover:underline font-bold"
            >
              {isSignUp ? "Sign In" : "Register Workspace"}
            </button>
          </div>
        </div>

        {/* High-Fidelity Quick Demo Logins Container */}
        <div className="glass-card mt-6 p-5 border-slate-800 bg-slate-900/40 text-center">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-2 py-0.5 rounded-full">
            QUICK DEMO ACCELERATORS
          </span>
          <p className="text-[11px] text-slate-400 mt-2 mb-4">
            Bypass registration to instantly preview active preloaded configurations, trained data, dashboard graphs, and custom SQL exporters.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button 
              onClick={() => handleQuickLogin('client-apex')}
              className="px-3 py-2 bg-slate-950 border border-indigo-500/20 rounded-lg text-indigo-300 hover:bg-slate-900 font-bold transition-all text-[11px]"
            >
              Alex (Apex Tech)
            </button>
            <button 
              onClick={() => handleQuickLogin('client-luxe')}
              className="px-3 py-2 bg-slate-950 border border-pink-500/20 rounded-lg text-pink-300 hover:bg-slate-900 font-bold transition-all text-[11px]"
            >
              Sophia (Luxe Spa)
            </button>
            <button 
              onClick={() => handleQuickLogin('admin')}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-900 font-bold transition-all text-[11px]"
            >
              Global Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
