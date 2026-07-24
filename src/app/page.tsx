"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  ChevronDown,
  Code,
  Database,
  FileText,
  Globe,
  LineChart,
  MessageSquare,
  Send,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";

const features = [
  {
    icon: Database,
    title: "Train on your knowledge",
    copy: "Bring in web pages, documents, and Q&As. Keep every answer grounded in the information your team trusts.",
  },
  {
    icon: Sliders,
    title: "Make it yours",
    copy: "Set your assistant’s tone, welcome message, language, and brand color without asking engineering for help.",
  },
  {
    icon: Code,
    title: "Embed in minutes",
    copy: "Copy one lightweight script into any site. Your assistant is ready wherever your customers have questions.",
  },
  {
    icon: MessageSquare,
    title: "Turn chats into leads",
    copy: "Capture contact details naturally in conversations and give your team context before they follow up.",
  },
  {
    icon: LineChart,
    title: "See what matters",
    copy: "Review conversations, common questions, and lead activity in one focused workspace.",
  },
  {
    icon: FileText,
    title: "Own your deployment",
    copy: "Choose managed maintenance or receive a complete handover package for your own infrastructure.",
  },
];

const faqs = [
  {
    question: "What can I use to train my assistant?",
    answer:
      "You can add website URLs, PDF manuals, business context, and manual question-and-answer pairs. The workspace keeps those sources together for each chatbot.",
  },
  {
    question: "Do I need a developer to install the widget?",
    answer:
      "No. Generate the embed snippet in your workspace and paste it before the closing body tag of your site. It works with static sites, WordPress, Webflow, Shopify, and custom applications.",
  },
  {
    question: "Can I tailor the assistant to my brand?",
    answer:
      "Yes. Every assistant has its own name, avatar, brand color, welcome message, language, and response instructions, all editable in the builder.",
  },
  {
    question: "What is included in the ownership handover?",
    answer:
      "The full-ownership option prepares a download with your source code, widget instructions, database export, deployment documentation, and transfer materials.",
  },
];

export default function LandingPage() {
  const { clients, setCurrentUser } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const startWorkspace = () => {
    const demoClient = clients.find((client) => client.role === "client");
    if (demoClient) setCurrentUser(demoClient);
  };

  return (
    <div className="marketing-shell">
      <div className="marketing-container">
        <header className="site-header">
          <Link href="/" className="brand-lockup" aria-label="ChatFlow home">
            <span className="brand-mark"><Bot /></span>
            <span>ChatFlow</span>
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#product">Product</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="text-link">Log in</Link>
            <Link href="/dashboard" onClick={startWorkspace} className="button-primary">
              Start building <ArrowRight size={15} />
            </Link>
          </div>
        </header>
      </div>

      <main>
        <section className="hero-section">
          <div className="marketing-container">
            <div className="hero-content">
              <span className="eyebrow"><Sparkles /> AI customer support, made simple</span>
              <h1 className="hero-title">
                Build an AI assistant<br />your customers <span className="accent">trust.</span>
              </h1>
              <p className="hero-copy">
                Train a helpful chatbot on your business, add it to your website, and turn every conversation into a better customer experience.
              </p>
              <div className="hero-actions">
                <Link href="/dashboard" onClick={startWorkspace} className="button-primary">
                  Create your assistant <ArrowRight size={16} />
                </Link>
                <a href="#product" className="button-secondary">See how it works</a>
              </div>
              <div className="reassurance">
                <span><CheckCircle /> No code required</span>
                <span><CheckCircle /> Set up in minutes</span>
                <span><CheckCircle /> Your knowledge, your voice</span>
              </div>
            </div>

            <div id="product" className="product-frame" aria-label="ChatFlow dashboard preview">
              <div className="product-bar">
                <span className="window-dots"><i /><i /><i /></span>
                <span className="product-url">app.chatflow.ai / workspace</span>
              </div>
              <div className="product-body">
                <aside className="preview-sidebar">
                  <div className="preview-brand"><span>✦</span> Acme workspace</div>
                  <div className="preview-menu">
                    <span><LineChart /> Overview</span>
                    <span><Bot /> Assistants</span>
                    <span><Database /> Knowledge</span>
                    <span><MessageSquare /> Conversations</span>
                    <span><Code /> Integrations</span>
                  </div>
                </aside>
                <div className="preview-main">
                  <div className="preview-topline">
                    <div>
                      <p className="preview-kicker">Good morning, Alex</p>
                      <h2 className="preview-title">Your assistant is ready to help</h2>
                    </div>
                    <span className="live-pill">Live on your website</span>
                  </div>
                  <div className="preview-stats">
                    <div className="preview-stat"><small>Conversations</small><strong>1,284</strong></div>
                    <div className="preview-stat"><small>Leads captured</small><strong>186</strong></div>
                    <div className="preview-stat"><small>Resolution rate</small><strong>92%</strong></div>
                  </div>
                  <div className="preview-grid">
                    <div className="preview-card">
                      <div className="preview-card-title"><span>Conversations this week</span><span>+18.4%</span></div>
                      <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-title"><span>Recent conversations</span><span>View all</span></div>
                      <div className="conversation-list">
                        <div className="conversation-item"><span className="conversation-avatar">J</span><span className="conversation-text"><b>Pricing question</b><small>2 minutes ago</small></span></div>
                        <div className="conversation-item"><span className="conversation-avatar">M</span><span className="conversation-text"><b>Need setup help</b><small>12 minutes ago</small></span></div>
                        <div className="conversation-item"><span className="conversation-avatar">A</span><span className="conversation-text"><b>Product comparison</b><small>28 minutes ago</small></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section section-soft">
          <div className="marketing-container">
            <div className="section-heading">
              <span className="eyebrow">Everything in one place</span>
              <h2>From first question to meaningful conversation</h2>
              <p>Give your team a clear, calm way to create and improve AI support without adding another complicated tool.</p>
            </div>
            <div className="feature-grid">
              {features.map(({ icon: Icon, title, copy }) => (
                <article className="feature-card" key={title}>
                  <span className="feature-icon"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="marketing-container split-feature">
            <div className="split-copy">
              <span className="eyebrow"><Globe /> Built for your website</span>
              <h2>A helpful answer is always one click away.</h2>
              <p>Give visitors a fast, on-brand conversation before they leave your site. ChatFlow keeps the experience personal while your team stays in control.</p>
              <ul className="tick-list">
                <li><CheckCircle /> Match your brand with custom colors and assistant settings.</li>
                <li><CheckCircle /> Keep answers aligned to approved business knowledge.</li>
                <li><CheckCircle /> Capture qualified leads with the full conversation context.</li>
              </ul>
            </div>
            <div className="chat-demo" aria-label="Assistant chat preview">
              <div className="chat-demo-head">
                <span className="chat-demo-avatar"><Bot size={18} /></span>
                <div><b>Acme Assistant</b><small>● Online now</small></div>
              </div>
              <div className="chat-demo-body">
                <div className="message">Hi! I can help with plans, product details, or getting started. What would you like to know?</div>
                <div className="message message-user">Which plan is best for a growing team?</div>
                <div className="message">For a growing team, I’d recommend starting with the managed plan. It includes setup, ongoing knowledge updates, and priority support.</div>
              </div>
              <div className="chat-demo-input"><span className="chat-demo-placeholder">Ask a question…</span><span className="chat-demo-send"><Send /></span></div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section section-soft">
          <div className="marketing-container">
            <div className="section-heading">
              <span className="eyebrow">Simple options</span>
              <h2>Choose the support model that fits</h2>
              <p>Start with a fully managed chatbot, or choose a complete ownership handover when you are ready to run it yourself.</p>
            </div>
            <div className="pricing-grid">
              <article className="pricing-card">
                <span className="plan-label">Managed</span>
                <h3>Managed AI Chatbot</h3>
                <p>Hands-on setup and ongoing maintenance from our team.</p>
                <div className="price"><strong>$199</strong><span>per month</span></div>
                <ul className="tick-list">
                  <li><CheckCircle /> Custom assistant configuration</li>
                  <li><CheckCircle /> Knowledge and content updates</li>
                  <li><CheckCircle /> Embed support and maintenance</li>
                  <li><CheckCircle /> Priority technical assistance</li>
                </ul>
                <Link href="/dashboard" onClick={startWorkspace} className="button-secondary">Explore managed plans</Link>
              </article>
              <article className="pricing-card featured">
                <span className="plan-label">Full ownership</span>
                <h3>Ownership Handover</h3>
                <p>One payment for a complete, self-hostable handover bundle.</p>
                <div className="price"><strong>$2,499</strong><span>one-time</span></div>
                <ul className="tick-list">
                  <li><CheckCircle /> Complete source-code package</li>
                  <li><CheckCircle /> Database export and widget code</li>
                  <li><CheckCircle /> Deployment documentation</li>
                  <li><CheckCircle /> No future platform fee</li>
                </ul>
                <Link href="/dashboard" onClick={startWorkspace} className="button-primary">View ownership option <ArrowRight size={15} /></Link>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="marketing-container">
            <div className="section-heading">
              <span className="eyebrow">Questions, answered</span>
              <h2>Everything you need to know</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <button
                    type="button"
                    className="faq-item"
                    data-open={isOpen}
                    key={faq.question}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question"><span>{faq.question}</span><ChevronDown /></span>
                    {isOpen && <span className="faq-answer">{faq.answer}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bottom-cta">
          <div className="marketing-container">
            <h2>Make every customer conversation count.</h2>
            <p>Build an assistant your team can trust—and your visitors will want to talk to.</p>
            <Link href="/dashboard" onClick={startWorkspace} className="button-primary">Start building for free <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="marketing-container footer-content">
          <span>© 2026 ChatFlow. AI customer conversations, made clear.</span>
          <div className="footer-links"><a href="#features">Product</a><a href="#pricing">Pricing</a><Link href="/login">Log in</Link></div>
        </div>
      </footer>
    </div>
  );
}
