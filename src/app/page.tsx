"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { 
  Bot, 
  Sparkles, 
  Database, 
  Code, 
  Cpu, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  LineChart, 
  Globe, 
  FileText, 
  Sliders, 
  MessageSquare,
  Users,
  ChevronDown,
  Wrench,
  Download
} from "lucide-react";

export default function LandingPage() {
  const { clients, chatbots, setCurrentUser } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // FAQ structure
  const landingFaqs = [
    {
      q: "How does the training process work?",
      a: "Simply upload your PDF manuals, paste your website URLs, or manually type FAQs. Our AI engine indexes your data instantly, preparing your customized chatbot to answer inquiries within seconds."
    },
    {
      q: "What is the Monthly Maintenance Plan?",
      a: "This is a fully managed service. We handle the initial chatbot setup, embed code generation, knowledge updates, performance optimization, and regular model fine-tuning. It's hands-free AI support starting at $199/mo."
    },
    {
      q: "What is the Full Ownership Transfer Plan?",
      a: "A unique plan for enterprise independence. For a one-time fee, we transfer the complete software intellectual property to you. You get a downloadable handover ZIP containing the Next.js frontend/backend source code, a PostgreSQL database dump with your historical conversation logs & leads, a deployment guide, and a signed ownership transfer agreement."
    },
    {
      q: "Which AI models power ChatFlow AI?",
      a: "We support industry-leading LLMs including OpenAI GPT-4o, Google Gemini, and Anthropic Claude. If you host the system yourself, you can easily plug in any custom API key."
    },
    {
      q: "Can I customize the design to match my brand?",
      a: "Absolutely! Our widget builder lets you customize the bot name, profile avatar, background brand color (with full hex gradient support), welcome message, and AI personality prompts to fit your corporate guidelines."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white dark-gradient-bg">
      {/* Decorative Radial Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass-card mx-4 my-3 px-6 py-4 flex items-center justify-between border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">ChatFlow</span>
            <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">AI</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Core Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing Options</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            onClick={() => {
              // Automatically switch to client workspace for easy onboarding
              const clientUser = clients.find(c => c.role === 'client');
              if (clientUser) setCurrentUser(clientUser);
            }}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard"
            onClick={() => {
              const clientUser = clients.find(c => c.role === 'client');
              if (clientUser) setCurrentUser(clientUser);
            }}
            className="px-4.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 glow-btn"
          >
            Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/admin"
            className="hidden sm:flex px-4 py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/40 border border-pink-500/30 hover:bg-pink-900/30 transition-all items-center gap-1.5"
          >
            Admin Panel
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-6 pt-16 pb-24 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Over 1,200+ Businesses Worldwide
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Build Custom AI Assistants <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Trained On Your Data
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create premium, enterprise-grade AI chatbots. Integrate with your website instantly, capture organic leads, and choose between hands-free monthly maintenance or complete codebase transfer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 mb-16">
            <Link 
              href="/dashboard"
              onClick={() => {
                const clientUser = clients.find(c => c.role === 'client');
                if (clientUser) setCurrentUser(clientUser);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white premium-gradient shadow-xl shadow-purple-500/20 hover:opacity-95 transition-all text-base flex items-center justify-center gap-2 glow-btn"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all text-base flex items-center justify-center gap-2"
            >
              <Cpu className="w-5 h-5 text-indigo-400" />
              Try Widget Preview
            </a>
          </div>

          {/* Luxury Glassmorphic Dashboard Preview */}
          <div className="relative mx-auto max-w-4xl p-2 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-pink-500/5 border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl" />
            <div className="relative rounded-xl overflow-hidden bg-slate-900/90 aspect-[16/10] border border-slate-800/60 p-4 md:p-6 flex flex-col text-left">
              {/* Fake Window Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-500 ml-4 font-mono">dashboard.chatflow.ai/apextech</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-indigo-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> GPT-4o Model Active
                </div>
              </div>

              {/* Main Preview Container */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {/* Left Panel - Bot Config */}
                <div className="md:col-span-1 space-y-4 text-xs">
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-bold">CHATBOT NAME</span>
                    <p className="text-white font-semibold">ApexBot 🤖</p>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-bold">KNOWLEDGE TRAINED</span>
                    <div className="flex flex-col gap-1 mt-1 text-slate-300">
                      <span className="flex items-center gap-1 text-[11px]"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Apex_Specs_2026.pdf</span>
                      <span className="flex items-center gap-1 text-[11px]"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> https://apextech.io/pricing</span>
                      <span className="flex items-center gap-1 text-[11px]"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 3 Custom FAQs Loaded</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-bold">BRAND INTEGRATION</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded-full bg-indigo-500" />
                      <span className="text-slate-300">Hex: #6366f1</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Live Chat Mock */}
                <div className="md:col-span-2 flex flex-col bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
                  <div className="p-3 bg-indigo-950/30 border-b border-indigo-500/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">ApexBot Preview</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Live
                    </span>
                  </div>
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto text-[11px] max-h-[180px]">
                    <div className="bg-slate-900 p-2.5 rounded-lg text-slate-300 border border-slate-800 max-w-[85%]">
                      Welcome to Apex Software! I&apos;m here to answer any questions about our Cloud Hosting or DevOps integrations.
                    </div>
                    <div className="bg-indigo-600 text-white p-2.5 rounded-lg ml-auto max-w-[80%] text-right font-medium">
                      What is your uptime guarantee?
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg text-slate-300 border border-slate-800 max-w-[85%]">
                      We guarantee a 99.99% uptime for all Cloud Hosting customers backed by our premium Service Level Agreement (SLA).
                    </div>
                  </div>
                  <div className="p-2 border-t border-slate-800 bg-slate-950 flex gap-2">
                    <div className="flex-1 bg-slate-900 text-[11px] text-slate-500 px-2.5 py-1.5 rounded border border-slate-800">
                      Type message...
                    </div>
                    <button className="px-3 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/60 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                SaaS Features Engineered for High Conversions
              </h2>
              <p className="text-slate-400 text-base">
                Everything you need to launch AI agents that capture leads, solve complex technical queries, and blend seamlessly into your codebase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-card p-6 border-slate-800/50 hover:border-slate-700/60 transition-all group hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-all">
                  <Database className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Multi-Source Training</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Train your chatbot across multiple corporate documents simultaneously. Support for PDF guides, website scraping URLs, manual FAQs, and general business information.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-6 border-slate-800/50 hover:border-slate-700/60 transition-all group hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500/20 transition-all">
                  <Sliders className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Exquisite Widget Customizer</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Modify the chatbot avatar, name, custom branding hex colors, warm welcome greetings, and direct GPT personality scripts to blend smoothly into your exact UI guidelines.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-6 border-slate-800/50 hover:border-slate-700/60 transition-all group hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-5 group-hover:bg-pink-500/20 transition-all">
                  <Code className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Embeddable Script Widget</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Generate a lightweight, vanilla JavaScript embed code that you can copy-paste into any web host (WordPress, Shopify, Webflow, React). Loaded instantly in the DOM.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card p-6 border-slate-800/50 hover:border-slate-700/60 transition-all group hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-all">
                  <LineChart className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Intelligent Analytics</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Track total messaging logs, captured organic leads (email, phone), most frequently asked inquiries, and performance curves with full details on user browsers & countries.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass-card p-6 border-slate-800/50 hover:border-slate-700/60 transition-all group hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-all">
                  <Wrench className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Managed Maintenance Option</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Sit back while our engineers configure your initial database settings, generate optimal prompt sets, and manage regular information and model updates monthly.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass-card p-6 border-slate-800/50 hover:border-slate-700/60 transition-all group hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition-all">
                  <Download className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Full Code Ownership Handover</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Click and download a complete bundle: fully operational Next.js codebase, PostgreSQL script dump, official agreement PDFs, and zero-subscription self-hosting code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Demo Section */}
        <section id="demo" className="py-20 bg-slate-900/30 border-y border-slate-900 relative">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-indigo-400 text-sm font-bold tracking-widest uppercase mb-2 block">Live Demo</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Experience ChatFlow Assistant In Real-Time
                </h2>
                <p className="text-slate-400 text-base mb-6 leading-relaxed">
                  Interact with our live workspace test-bed. Try submitting a message to test how the AI retrieves details instantly from its preloaded corporate FAQs or company specs.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] mt-0.5">✓</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Dynamic Brand Hex Coloring</h4>
                      <p className="text-xs text-slate-400">Preview UI matches client corporate identity.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] mt-0.5">✓</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Lead-Capture Optimization</h4>
                      <p className="text-xs text-slate-400">Share your email in the chatbot to see how leads are stored.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] mt-0.5">✓</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Advanced Response Tuning</h4>
                      <p className="text-xs text-slate-400">Leverages OpenAI, Gemini, or Claude APIs seamlessly.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated Embedded Device Widget Mock */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 opacity-20 blur-lg" />
                <div className="relative glass-card border-slate-800/80 p-1 bg-slate-950 shadow-2xl overflow-hidden aspect-[4/5] flex flex-col max-w-[360px] mx-auto rounded-2xl">
                  {/* Top Header */}
                  <div className="flex items-center gap-3 p-3 bg-indigo-600 rounded-t-xl text-white">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">🤖</div>
                    <div>
                      <h4 className="font-bold text-sm">Demo Assistant</h4>
                      <span className="text-[10px] text-indigo-200">Answers inquiries instantly</span>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-900/50">
                    <div className="bg-slate-850 p-3 rounded-lg text-slate-300 max-w-[85%]">
                      Hello! I am trained on ChatFlow AI specifications. Ask me about our Pricing or Ownership Transfer!
                    </div>
                    <div className="bg-indigo-600 text-white p-3 rounded-lg ml-auto max-w-[80%]">
                      How can I buy the source code?
                    </div>
                    <div className="bg-slate-850 p-3 rounded-lg text-slate-300 max-w-[85%] leading-relaxed">
                      You can purchase our **Full Ownership Transfer Plan**. It transfers 100% of the IP, including Next.js frontend/backend source code, SQL data dumps, and complete setups!
                    </div>
                  </div>
                  {/* Input */}
                  <div className="p-3 bg-slate-950 border-t border-slate-900 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type &apos;pricing plans&apos; to test..." 
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" 
                      disabled 
                    />
                    <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded transition-all">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plan Grid Section */}
        <section id="pricing" className="py-24 relative bg-slate-950 border-t border-slate-900">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-pink-400 text-xs font-bold uppercase tracking-wider bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">BUSINESS MODELS</span>
              <h2 className="text-4xl font-black text-white tracking-tight mt-4 mb-4">
                Two Exceptional Frameworks, Structured For Success
              </h2>
              <p className="text-slate-400 text-base">
                Whether you prefer hands-free expert updates or full digital code autonomy, we have the absolute blueprint for your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Option 1: Monthly Maintenance */}
              <div className="glass-card p-8 border-slate-800/80 bg-slate-900/30 flex flex-col relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Managed AI Chatbot</h3>
                  <p className="text-slate-400 text-xs mt-1">Hands-free active maintenance & setup</p>
                </div>

                <div className="flex items-baseline gap-2 mb-6 border-b border-slate-800 pb-6">
                  <span className="text-4xl font-black text-white">$199</span>
                  <span className="text-slate-500 text-sm font-semibold">/ month</span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300 flex-1 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <span>Expert AI Chatbot configuration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <span>Unique Website script embed generation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <span>Managed model knowledge updates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <span>Regular database optimizations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <span>Premium active server updates & fixes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                    <span>Priority email & developer support</span>
                  </li>
                </ul>

                <Link 
                  href="/dashboard"
                  onClick={() => {
                    const clientUser = clients.find(c => c.id === 'client-apex');
                    if (clientUser) setCurrentUser(clientUser);
                  }}
                  className="w-full text-center py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-sm shadow-md shadow-indigo-600/20"
                >
                  Subscribe Managed Plan
                </Link>
              </div>

              {/* Option 2: Full Ownership Transfer */}
              <div className="glass-card p-8 border-purple-500/30 bg-purple-950/5 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300 shadow-xl shadow-purple-500/5">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-purple-500 text-white font-bold text-[10px] tracking-wider uppercase">
                  ENTERPRISE FREEDOM
                </div>
                <div className="absolute top-10 right-10 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all" />
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Full Ownership Transfer</h3>
                  <p className="text-purple-300 text-xs mt-1">One-time payment, complete codebase ownership</p>
                </div>

                <div className="flex items-baseline gap-2 mb-6 border-b border-slate-800 pb-6">
                  <span className="text-4xl font-black text-white">$2,499</span>
                  <span className="text-slate-500 text-sm font-semibold">one-time</span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300 flex-1 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span className="font-semibold text-white">Downloadable Handover ZIP</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span>Complete Next.js React frontend/backend codebase</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span>PostgreSQL database SQL schema & client data export</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span>Comprehensive Developer Setup Guides (.PDF)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span>Signed official IP and usage agreement (.PDF)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span>Host on your own Vercel or AWS (No subscription cost!)</span>
                  </li>
                </ul>

                <Link 
                  href="/dashboard"
                  onClick={() => {
                    const clientUser = clients.find(c => c.id === 'client-luxe');
                    if (clientUser) setCurrentUser(clientUser);
                  }}
                  className="w-full text-center py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white transition-all text-sm shadow-lg shadow-purple-600/20"
                >
                  Buy Ownership Handover Package
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-slate-900/10 border-t border-slate-900 relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Answered Queries</h2>
              <p className="text-slate-400 text-sm mt-3">Got questions about licensing, training, or code ownership? We have answers.</p>
            </div>

            <div className="space-y-4">
              {landingFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="glass-card border-slate-800/80 overflow-hidden cursor-pointer transition-all duration-200"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <div className="p-5 flex items-center justify-between gap-4">
                    <h3 className="font-bold text-white text-base md:text-md select-none">{faq.q}</h3>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${activeFaq === index ? "transform rotate-180 text-white" : ""}`} />
                  </div>
                  {activeFaq === index && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-900/50 text-slate-400 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="py-20 relative overflow-hidden border-t border-slate-900">
          <div className="absolute inset-0 premium-gradient opacity-5" />
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Ready to Deploy Your Customized AI Agent?
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Set up your chatbot in under 2 minutes. Train on documents and enjoy complete corporate deployment autonomy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard"
                onClick={() => {
                  const clientUser = clients.find(c => c.role === 'client');
                  if (clientUser) setCurrentUser(clientUser);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                Go to Client Workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/admin"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Users className="w-4.5 h-4.5 text-pink-400" />
                Access Administration
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">ChatFlow AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create premium trained AI assistants for websites. Powered by OpenAI, Gemini, and Claude models. Customizable to match corporate guidelines.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Plans</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#pricing" className="hover:text-white transition-colors">Managed Chatbot Plan</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Full Ownership Plan</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">SLA and Uptime Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Integrations</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="hover:text-white transition-colors cursor-pointer">Vanilla JS Script</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">WordPress Integration</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Webflow embed module</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Enterprise</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="/admin" className="hover:text-white transition-colors">Global Admin Panel</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Security Certifications</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">SOC2 Compliance whitepaper</span></li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 ChatFlow AI Platforms Inc. All global rights, codes, and schemas reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition-all cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-all cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-all cursor-pointer">Agreement Forms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
