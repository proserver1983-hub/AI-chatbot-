"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { 
  Bot, 
  ArrowLeft, 
  CheckCircle, 
  Wrench, 
  Layers 
} from "lucide-react";

export default function PricingPage() {
  const { clients, setCurrentUser } = useStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden dark-gradient-bg">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="glass-card mx-4 my-3 px-6 py-4 flex items-center justify-between border-slate-800/80">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-400" />
          <span className="font-extrabold text-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">ChatFlow AI</span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </Link>
      </header>

      {/* Pricing Header Banner */}
      <main className="flex-1 container mx-auto px-6 py-16 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">COMMERCIAL OFFERS</span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4">
            Flexible Structure For Global Enterprises
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Choose whether to subscribe to our fully-managed monthly support program or transfer the complete software source code & database logs into your self-hosted cloud.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20">
          {/* Option 1: Monthly Maintenance */}
          <div className="glass-card p-8 border-slate-800 bg-slate-900/40 flex flex-col relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Managed AI Chatbot</h3>
              <p className="text-slate-400 text-xs mt-1">Initial config, embedding help, and ongoing management.</p>
            </div>

            <div className="flex items-baseline gap-2 mb-6 border-b border-slate-850 pb-6">
              <span className="text-4xl font-black text-white">$199</span>
              <span className="text-slate-500 text-sm font-semibold">/ month</span>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-300 flex-1 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Expert setup of system configurations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Custom script code generation (chatflow-widget.js)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>We manage data updates and knowledge scraping</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Database auditing and conversation logging</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Active OpenAI / Gemini api token maintenance</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Priority SLA developer assistance</span>
              </li>
            </ul>

            <Link 
              href="/dashboard"
              onClick={() => {
                const clientUser = clients.find(c => c.id === 'client-apex');
                if (clientUser) setCurrentUser(clientUser);
              }}
              className="w-full text-center py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-sm shadow-md shadow-indigo-600/20"
            >
              Subscribe Managed Plan
            </Link>
          </div>

          {/* Option 2: Full Ownership Transfer */}
          <div className="glass-card p-8 border-purple-500/20 bg-purple-950/5 flex flex-col relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300 shadow-xl shadow-purple-500/5">
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-purple-500 text-white font-bold text-[10px] tracking-wider">
              100% OWNERSHIP
            </div>
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Full Ownership Transfer</h3>
              <p className="text-purple-300 text-xs mt-1">One-time purchase, zero recurring fees.</p>
            </div>

            <div className="flex items-baseline gap-2 mb-6 border-b border-slate-850 pb-6">
              <span className="text-4xl font-black text-white">$2,499</span>
              <span className="text-slate-500 text-sm font-semibold">one-time</span>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-300 flex-1 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-semibold text-white">Instantly download Handover ZIP</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Next.js, React, Tailwind & API router source code</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Full PostgreSQL schema & customized INSERT data SQL dump</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Comprehensive setup & Vercel deploy guides (.PDF)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Official signed code transfer & agreement form (.PDF)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Self-host on any hosting server (zero recurring ChatFlow fees)</span>
              </li>
            </ul>

            <Link 
              href="/dashboard"
              onClick={() => {
                const clientUser = clients.find(c => c.id === 'client-luxe');
                if (clientUser) setCurrentUser(clientUser);
              }}
              className="w-full text-center py-3.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white transition-all text-sm shadow-lg shadow-purple-600/20"
            >
              Download Complete Handover ZIP
            </Link>
          </div>
        </div>

        {/* Informative Table comparing features */}
        <div className="glass-card overflow-hidden border-slate-800">
          <div className="p-6 bg-slate-900/60 border-b border-slate-800">
            <h4 className="font-bold text-white text-lg">Direct Feature Matrix Comparison</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 font-bold uppercase tracking-wider">
                  <th className="p-4">Feature Core</th>
                  <th className="p-4">Monthly Maintenance</th>
                  <th className="p-4">Ownership Handover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                <tr>
                  <td className="p-4 font-bold text-white">Codebase Storage Location</td>
                  <td className="p-4 text-slate-400">ChatFlow Secure Cloud Server</td>
                  <td className="p-4 text-emerald-400 font-semibold">Your Private Github & local drive (Full Transfer)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Database Isolation</td>
                  <td className="p-4 text-slate-400">Multi-tenant secure sandbox</td>
                  <td className="p-4 text-emerald-400 font-semibold">100% Isolated SQL schema export (.sql)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Custom Integrations</td>
                  <td className="p-4 text-slate-400">Standard embed scripts</td>
                  <td className="p-4 text-emerald-400 font-semibold">Full API modification & layout edits</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">SaaS Platform Branding</td>
                  <td className="p-4 text-slate-400">Appearance config only</td>
                  <td className="p-4 text-emerald-400 font-semibold">White-label capability, delete any ChatFlow headers</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Ongoing Hosting Cost</td>
                  <td className="p-4 text-slate-400">Included in $199/mo</td>
                  <td className="p-4 text-emerald-400 font-semibold">Zero SaaS fees (Host on Free Tier Vercel/Supabase)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>© 2026 ChatFlow AI Platforms Inc. All pricing models backed by binding digital licenses.</p>
      </footer>
    </div>
  );
}
