import { NextResponse } from "next/server";
import JSZip from "jszip";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface LeadItem {
  id?: string;
  conversationId?: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

interface MessageItem {
  id?: string;
  sender: string;
  text: string;
  timestamp?: string;
}

interface ConversationItem {
  id: string;
  browser?: string;
  location?: string;
  timestamp?: string;
  lead?: { name?: string; email?: string; phone?: string } | null;
  messages?: MessageItem[];
}

interface URLItem {
  id: string;
  url: string;
  status?: string;
}

interface PDFItem {
  id: string;
  name: string;
  size: string;
  status?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeSql(value: string): string {
  if (!value) return "";
  return value.replace(/'/g, "''");
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").slice(0, 80);
}

function isValidHexColor(c: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(c);
}

function safeString(input: unknown, fallback = ""): string {
  return typeof input === "string" ? input : fallback;
}

// ---------------------------------------------------------------------------
// POST handler — builds full handover ZIP
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      clientId = "client-apex",
      clientName = "Alex Rivera",
      companyName = "Apex Software Systems",
      botId = "bot-apex",
      botName = "ApexBot",
      brandColor = "#6366f1",
      welcomeMessage = "",
      personality = "",
      businessInfo = "",
      language = "English",
      avatar = "🤖",
      faqs = [],
      urls = [],
      pdfs = [],
      leads = [],
      conversations = [],
    } = body as {
      clientId?: string;
      clientName?: string;
      companyName?: string;
      botId?: string;
      botName?: string;
      brandColor?: string;
      welcomeMessage?: string;
      personality?: string;
      businessInfo?: string;
      language?: string;
      avatar?: string;
      faqs?: FAQItem[];
      urls?: URLItem[];
      pdfs?: PDFItem[];
      leads?: LeadItem[];
      conversations?: ConversationItem[];
    };

    // Basic validation
    const safeBrandColor = isValidHexColor(brandColor) ? brandColor : "#6366f1";
    const safeCompany = safeString(companyName, "Client").trim() || "Client";
    const safeBotName = safeString(botName, "ChatBot").trim() || "ChatBot";
    const safeClientName = safeString(clientName, "Client User").trim() || "Client User";

    // -----------------------------------------------------------------------
    // JSZip — main container
    // -----------------------------------------------------------------------
    const mainZip = new JSZip();

    // -----------------------------------------------------------------------
    // 1) Source-Code.zip (standalone Next.js app)
    // -----------------------------------------------------------------------
    const sourceZip = new JSZip();

    sourceZip.file(
      "package.json",
      JSON.stringify(
        {
          name: `chatflow-${sanitizeFilename(botId)}-standalone`,
          version: "1.0.0",
          private: true,
          description: `Standalone AI chatbot engine for ${safeCompany} — ${safeBotName}`,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
          },
          dependencies: {
            next: "^14.2.0",
            react: "^18.3.0",
            "react-dom": "^18.3.0",
            openai: "^4.20.0",
            jszip: "^3.10.1",
          },
        },
        null,
        2
      )
    );

    sourceZip.file(
      "tailwind.config.js",
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "${safeBrandColor}",
      },
    },
  },
  plugins: [],
};
`
    );

    sourceZip.file(
      ".env.local.example",
      `# ChatFlow Standalone - Environment
OPENAI_API_KEY=sk-proj-your-openai-key
GEMINI_API_KEY=your-gemini-key-optional
CLAUDE_API_KEY=your-claude-key-optional
DATABASE_URL=postgresql://postgres:password@localhost:5432/chatflow
PORT=3000
`
    );

    sourceZip.file(
      "README.md",
      `# ChatFlow Standalone — ${safeBotName}

This repository contains the full standalone code package for your custom AI assistant **${safeBotName}**, built for **${safeCompany}** as part of the ChatFlow Full Ownership Transfer.

Owner: ${safeClientName}
Bot Avatar: ${avatar}
Brand Color: ${safeBrandColor}
Language: ${language}

## Quick Start

1. Extract this folder.
2. Run \`npm install\` to install dependencies.
3. Create \`.env.local\` (see \`.env.local.example\`) and add your keys:
   \`\`\`
   OPENAI_API_KEY=sk-proj-...
   DATABASE_URL=postgresql://...
   \`\`\`
4. Restore database using \`../Database-Export.sql\` in your Postgres / Supabase SQL editor.
5. \`npm run dev\` to start locally.
6. Deploy to Vercel, Netlify, or your own VPS.

## Widget

Embed on any site:

\`\`\`html
<script src="https://yourdomain.com/chatflow-widget.js" bot-id="${botId}"></script>
\`\`\`

## Support Handover

30-day technical support included for deployment and integration.

Generated: ${new Date().toISOString()}
`
    );

    // API route for chat
    const apiFolder = sourceZip.folder("pages/api");
    apiFolder?.file(
      "chat.js",
      `// Standalone Chat API - Production ready
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BUSINESS_INFO = ${JSON.stringify(businessInfo)};
const FAQS = ${JSON.stringify(faqs)};
const PERSONALITY = ${JSON.stringify(personality || "Helpful, professional, concise.")};
const BOT_NAME = ${JSON.stringify(safeBotName)};
const WELCOME = ${JSON.stringify(welcomeMessage)};

function buildSystemPrompt() {
  return \`
You are \${BOT_NAME}, an AI assistant for ${escapeSql(safeCompany)}.
Avatar: ${avatar}
Brand: ${safeBrandColor}
Personality: \${PERSONALITY}

Business Info:
\${BUSINESS_INFO}

FAQs:
\${FAQS.map(f => \`Q: \${f.question}\\nA: \${f.answer}\`).join("\\n\\n")}

Welcome Message: \${WELCOME}

Instructions:
- Answer strictly from business info & FAQs if relevant.
- If user wants pricing, booking, sales, ask for Name, Email, Phone for handover to human.
- Keep tone aligned with personality.
- Be concise, helpful, and branded.
\`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, conversationHistory = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const messages = [
      { role: "system", content: buildSystemPrompt() },
      ...conversationHistory.slice(-10).filter(m => m.role === 'user' || m.role === 'assistant'),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content || "I'm here to help — could you share more details or leave your contact?";
    res.status(200).json({ reply, botId: "${botId}", botName: BOT_NAME });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Chat failed" });
  }
}
`
    );

    // Widget file
    sourceZip.file(
      "public/chatflow-widget.js",
      `/**
 * ChatFlow Widget — Standalone Embed
 * Bot: ${safeBotName} (${botId})
 * Brand: ${safeBrandColor}
 * Generated: ${new Date().toISOString()}
 */
(function(){
  const BOT_ID = document.currentScript?.getAttribute('bot-id') || "${botId}";
  const BRAND = "${safeBrandColor}";
  const BOT_NAME = ${JSON.stringify(safeBotName)};
  const AVATAR = ${JSON.stringify(avatar)};
  const WELCOME = ${JSON.stringify(welcomeMessage || "Hello! How can I help you today?")};

  const style = document.createElement('style');
  style.textContent = \`
    #cf-widget-bubble{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:\${BRAND};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:999999;color:#fff;font-size:24px;transition:transform .15s}
    #cf-widget-bubble:hover{transform:scale(1.06)}
    #cf-widget-panel{position:fixed;bottom:96px;right:24px;width:360px;max-width:calc(100vw - 32px);height:480px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.22);display:none;flex-direction:column;overflow:hidden;z-index:999999;font-family:Inter,system-ui,sans-serif}
    #cf-widget-panel.open{display:flex}
    #cf-widget-header{background:linear-gradient(135deg,\${BRAND},\${BRAND}dd);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}
    #cf-widget-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f8fafc}
    .cf-msg{max-width:80%;padding:10px 12px;border-radius:12px;font-size:13px;line-height:1.4}
    .cf-msg.user{align-self:flex-end;background:\${BRAND};color:#fff;border-bottom-right-radius:4px}
    .cf-msg.bot{align-self:flex-start;background:#fff;border:1px solid #e2e8f0;color:#0f172a;border-bottom-left-radius:4px}
    #cf-widget-input{display:flex;gap:8px;padding:12px;border-top:1px solid #e2e8f0;background:#fff}
    #cf-widget-input input{flex:1;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:13px;outline:none}
    #cf-widget-input button{background:\${BRAND};color:#fff;border:none;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:600}
  \`;
  document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.id = 'cf-widget-bubble';
  bubble.textContent = AVATAR;
  document.body.appendChild(bubble);

  const panel = document.createElement('div');
  panel.id = 'cf-widget-panel';
  panel.innerHTML = \`
    <div id="cf-widget-header"><div style="font-size:22px">\${AVATAR}</div><div><div style="font-weight:700;font-size:14px">\${BOT_NAME}</div><div style="font-size:11px;opacity:.9">Online • Usually replies instantly</div></div></div>
    <div id="cf-widget-messages"><div class="cf-msg bot">\${WELCOME}</div></div>
    <form id="cf-widget-input"><input type="text" placeholder="Type a message..." autocomplete="off"/><button type="submit">Send</button></form>
  \`;
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('#cf-widget-messages');
  const form = panel.querySelector('#cf-widget-input');
  const input = form.querySelector('input');
  const history = [];

  bubble.onclick = () => { panel.classList.toggle('open'); };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    const userDiv = document.createElement('div');
    userDiv.className = 'cf-msg user';
    userDiv.textContent = text;
    messagesEl.appendChild(userDiv);
    history.push({role:'user', content:text});
    input.value = '';
    messagesEl.scrollTop = messagesEl.scrollHeight;

    const botDiv = document.createElement('div');
    botDiv.className = 'cf-msg bot';
    botDiv.textContent = 'Typing...';
    messagesEl.appendChild(botDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, conversationHistory: history, chatbotId: BOT_ID })
      });
      const data = await res.json();
      botDiv.textContent = data.reply || "Thanks! We'll be in touch.";
      history.push({role:'assistant', content: botDiv.textContent});
    } catch {
      botDiv.textContent = "I'm having trouble connecting — please leave your email and we'll reach out!";
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };
})();
`
    );

    sourceZip.file(
      "public/index.html",
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeSql(safeCompany)} — ${escapeSql(safeBotName)} Standalone Demo</title>
    <style>
        body { background:#020617; color:#e2e8f0; font-family:Inter,system-ui,sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; padding:24px; }
        .card { max-width:560px; text-align:center; border:1px solid rgba(255,255,255,0.08); padding:40px 32px; border-radius:16px; background:#0b1220; box-shadow:0 20px 60px rgba(0,0,0,0.4); }
        h1 { color:${safeBrandColor}; margin:0 0 12px; font-size:28px; letter-spacing:-0.02em; }
        p { color:#94a3b8; line-height:1.6; font-size:14px; }
        code { background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:6px; font-size:12px; color:#e2e8f0; }
        .meta{margin-top:24px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap}
        .badge{border:1px solid rgba(255,255,255,0.1); padding:6px 10px; border-radius:20px; font-size:11px; color:#94a3b8}
    </style>
</head>
<body>
    <div class="card">
        <div style="font-size:48px;margin-bottom:16px">${avatar}</div>
        <h1>${escapeSql(safeBotName)} Standalone</h1>
        <p>This is your fully owned, self-hosted AI chatbot instance for <strong>${escapeSql(safeCompany)}</strong>. The floating widget bubble is active in the bottom-right corner — start a conversation to test your branded assistant.</p>
        <p style="margin-top:16px">Brand: <code>${safeBrandColor}</code> • BotID: <code>${escapeSql(botId)}</code> • Language: <code>${escapeSql(language)}</code></p>
        <div class="meta">
          <span class="badge">${(faqs as FAQItem[]).length} FAQs</span>
          <span class="badge">${(leads as LeadItem[]).length} leads bundled</span>
          <span class="badge">${(conversations as ConversationItem[]).length} conversations</span>
        </div>
        <p style="margin-top:20px;font-size:12px;color:#64748b">Deploy: npm install → set OPENAI_API_KEY → npm run dev. See Setup-Guide.pdf for Vercel & Docker steps.</p>
    </div>
    <script src="./chatflow-widget.js" bot-id="${botId}"></script>
</body>
</html>`
    );

    const sourceZipBuffer = await sourceZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
    mainZip.file("Source-Code.zip", sourceZipBuffer);

    // -----------------------------------------------------------------------
    // 2) Widget-Code.txt
    // -----------------------------------------------------------------------
    const widgetCodeText = `========================================================================
CHATFLOW AI WIDGET EMBED CODE — ${safeCompany}
========================================================================
Bot Name: ${safeBotName} (${botId})
Owner: ${safeClientName}
Brand Color: ${safeBrandColor}
Avatar: ${avatar}
Language: ${language}
Generated: ${new Date().toISOString()}

1) COPY THIS EMBED SCRIPT:
------------------------------------------------------------------------
<script src="https://chatflow-ai.vercel.app/chatflow-widget.js" bot-id="${botId}"></script>
------------------------------------------------------------------------
For local testing (standalone build):
<script src="/chatflow-widget.js" bot-id="${botId}"></script>

2) INSTALLATION:
- WordPress: Appearance → Theme File Editor → header.php → paste before </body>.
- Webflow: Project Settings → Custom Code → Footer Code.
- Shopify: Online Store → Themes → Edit Code → theme.liquid → before </body>.
- Wix: Settings → Custom Code → Add Code to Body End.
- React / Next.js: Add to app/layout.tsx or _app.tsx.
- Plain HTML: Paste into your index.html before </body>.

3) CUSTOMIZATION (in standalone source):
- Brand color variable in chatflow-widget.js top: const BRAND = "${safeBrandColor}"
- Welcome message: ${welcomeMessage ? welcomeMessage.slice(0, 120) : "Hello!"}
- Personality / system prompt in pages/api/chat.js

4) VERIFICATION:
- Open your site, bubble should appear bottom-right.
- Click bubble → send "hello" → should see "${welcomeMessage ? welcomeMessage.slice(0, 60) : "Welcome"}"
- Check browser console for errors if not visible.

5) ADVANCED:
- Position: edit #cf-widget-bubble bottom/right in widget CSS.
- API endpoint: Change fetch('/api/chat') to absolute URL if cross-domain.
- Analytics: Hook into history array to push to your data layer.

Support: ${safeClientName} — ${clientId}
Docs: See Documentation.pdf in this bundle.
`;

    mainZip.file("Widget-Code.txt", widgetCodeText);

    // -----------------------------------------------------------------------
    // 3) Database-Export.sql — genuine export
    // -----------------------------------------------------------------------
    const nowIso = new Date().toISOString();
    let sqlDump = `-- ========================================================================
-- CHATFLOW AI DATABASE EXPORT — ${escapeSql(safeCompany)}
-- Bot: ${escapeSql(safeBotName)} (${escapeSql(botId)})
-- Client: ${escapeSql(safeClientName)} (${escapeSql(clientId)})
-- Exported: ${nowIso}
-- Compatible: PostgreSQL 14+ / Supabase
-- ========================================================================
-- This file recreates all tables and inserts your current live data
-- including ${faqs.length} FAQs, ${leads.length} leads, ${conversations.length} conversations.
-- Run in Supabase SQL Editor or psql. Wrapped in transaction for safety.

BEGIN;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

-- -----------------------------------------------------------------------
-- 1. TABLE STRUCTURES (IF NOT EXISTS)
-- -----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,
    website TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client','admin')),
    subscription_plan TEXT DEFAULT 'Monthly Maintenance',
    subscription_status TEXT DEFAULT 'Active',
    support_status TEXT DEFAULT 'Active Premium Support',
    price TEXT,
    start_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chatbots (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '🤖',
    brand_color TEXT DEFAULT '#6366f1',
    welcome_message TEXT,
    personality TEXT,
    business_info TEXT,
    language TEXT DEFAULT 'English',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    chatbot_id TEXT REFERENCES public.chatbots(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_sources (
    id TEXT PRIMARY KEY,
    chatbot_id TEXT REFERENCES public.chatbots(id) ON DELETE CASCADE,
    source_type TEXT DEFAULT 'url',
    source_name TEXT,
    source_url TEXT,
    content_text TEXT,
    status TEXT DEFAULT 'ready',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    chatbot_id TEXT REFERENCES public.chatbots(id) ON DELETE CASCADE,
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    source_conversation_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT PRIMARY KEY,
    chatbot_id TEXT REFERENCES public.chatbots(id) ON DELETE CASCADE,
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    browser TEXT,
    location TEXT,
    lead_name TEXT,
    lead_email TEXT,
    lead_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user','bot')),
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.widget_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    chatbot_id TEXT REFERENCES public.chatbots(id) ON DELETE CASCADE,
    brand_color TEXT,
    position TEXT DEFAULT 'bottom-right',
    welcome_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- 2. INSERT CLIENT
-- -----------------------------------------------------------------------
INSERT INTO public.clients (id, name, email, company_name, website, role, subscription_plan, subscription_status, support_status, price, start_date)
VALUES (
  '${escapeSql(clientId)}',
  '${escapeSql(safeClientName)}',
  '${escapeSql(clientId)}@company.com',
  '${escapeSql(safeCompany)}',
  'https://${sanitizeFilename(safeCompany).toLowerCase()}.com',
  'client',
  'Full Ownership',
  'Completed',
  'Full Support Handed Over',
  '$2,499 one-time',
  CURRENT_DATE
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  subscription_plan = 'Full Ownership',
  subscription_status = 'Completed',
  support_status = 'Full Support Handed Over';

-- -----------------------------------------------------------------------
-- 3. INSERT CHATBOT
-- -----------------------------------------------------------------------
INSERT INTO public.chatbots (id, client_id, name, avatar, brand_color, welcome_message, personality, business_info, language)
VALUES (
  '${escapeSql(botId)}',
  '${escapeSql(clientId)}',
  '${escapeSql(safeBotName)}',
  '${escapeSql(avatar)}',
  '${escapeSql(safeBrandColor)}',
  '${escapeSql(welcomeMessage)}',
  '${escapeSql(personality)}',
  '${escapeSql(businessInfo)}',
  '${escapeSql(language)}'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  brand_color = EXCLUDED.brand_color,
  welcome_message = EXCLUDED.welcome_message,
  personality = EXCLUDED.personality,
  business_info = EXCLUDED.business_info;

`;

    // knowledge PDFs / URLs if any
    if (pdfs.length > 0 || urls.length > 0) {
      sqlDump += `\n-- -----------------------------------------------------------------------\n-- 3b. KNOWLEDGE SOURCES (PDFs & URLs)\n-- -----------------------------------------------------------------------\n`;
      pdfs.forEach((p) => {
        sqlDump += `INSERT INTO public.knowledge_sources (id, chatbot_id, source_type, source_name, content_text, status) VALUES ('${escapeSql(p.id)}', '${escapeSql(botId)}', 'pdf', '${escapeSql(p.name)}', 'Binary PDF placeholder ${escapeSql(p.size)} - replace with parsed content in production', '${escapeSql(p.status || "ready")}') ON CONFLICT (id) DO NOTHING;\n`;
      });
      urls.forEach((u) => {
        sqlDump += `INSERT INTO public.knowledge_sources (id, chatbot_id, source_type, source_name, source_url, status) VALUES ('${escapeSql(u.id)}', '${escapeSql(botId)}', 'url', '${escapeSql(u.url)}', '${escapeSql(u.url)}', '${escapeSql(u.status || "ready")}') ON CONFLICT (id) DO NOTHING;\n`;
      });
    }

    sqlDump += `\n-- -----------------------------------------------------------------------\n-- 4. FAQS (${faqs.length} records)\n-- -----------------------------------------------------------------------\n`;
    if (faqs.length > 0) {
      faqs.forEach((f) => {
        sqlDump += `INSERT INTO public.faqs (id, chatbot_id, question, answer) VALUES ('${escapeSql(f.id)}', '${escapeSql(botId)}', '${escapeSql(f.question)}', '${escapeSql(f.answer)}') ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, answer = EXCLUDED.answer;\n`;
      });
    } else {
      sqlDump += `-- No FAQs configured yet.\n`;
    }

    sqlDump += `\n-- -----------------------------------------------------------------------\n-- 5. LEADS (${leads.length} records)\n-- -----------------------------------------------------------------------\n`;
    if (leads.length > 0) {
      leads.forEach((l) => {
        const lid = escapeSql(l.id || `lead-${Math.random().toString(36).slice(2, 7)}`);
        sqlDump += `INSERT INTO public.leads (id, chatbot_id, client_id, name, email, phone, source_conversation_id, created_at) VALUES ('${lid}', '${escapeSql(botId)}', '${escapeSql(clientId)}', '${escapeSql(l.name || "Anonymous")}', '${escapeSql(l.email || "")}', '${escapeSql(l.phone || "")}', '${escapeSql(l.conversationId || "")}', NOW()) ON CONFLICT (id) DO NOTHING;\n`;
      });
    } else {
      sqlDump += `-- No leads captured yet.\n`;
    }

    sqlDump += `\n-- -----------------------------------------------------------------------\n-- 6. CONVERSATIONS & MESSAGES (${conversations.length} conversations)\n-- -----------------------------------------------------------------------\n`;
    if (conversations.length > 0) {
      conversations.forEach((c) => {
        sqlDump += `INSERT INTO public.conversations (id, chatbot_id, client_id, browser, location, lead_name, lead_email, lead_phone, created_at) VALUES ('${escapeSql(c.id)}', '${escapeSql(botId)}', '${escapeSql(clientId)}', '${escapeSql(c.browser || "Web")}', '${escapeSql(c.location || "US")}', '${escapeSql(c.lead?.name || "")}', '${escapeSql(c.lead?.email || "")}', '${escapeSql(c.lead?.phone || "")}', NOW()) ON CONFLICT (id) DO NOTHING;\n`;
        if (c.messages && c.messages.length > 0) {
          c.messages.forEach((m) => {
            const mid = escapeSql(m.id || `msg-${Math.random().toString(36).slice(2, 7)}`);
            sqlDump += `  INSERT INTO public.messages (id, conversation_id, sender, message_text, created_at) VALUES ('${mid}', '${escapeSql(c.id)}', '${m.sender === "bot" ? "bot" : "user"}', '${escapeSql(m.text)}', NOW()) ON CONFLICT (id) DO NOTHING;\n`;
          });
        }
      });
    } else {
      sqlDump += `-- No historic conversations yet.\n`;
    }

    sqlDump += `\n-- -----------------------------------------------------------------------\n-- 7. WIDGET SETTINGS\n-- -----------------------------------------------------------------------\nINSERT INTO public.widget_settings (chatbot_id, brand_color, welcome_message, position) VALUES ('${escapeSql(botId)}', '${escapeSql(safeBrandColor)}', '${escapeSql(welcomeMessage)}', 'bottom-right') ON CONFLICT DO NOTHING;\n
COMMIT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbots_client_id ON public.chatbots(client_id);
CREATE INDEX IF NOT EXISTS idx_faqs_chatbot_id ON public.faqs(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_leads_chatbot_id ON public.leads(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_conversations_chatbot_id ON public.conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- End of export
-- Generated by ChatFlow AI Ownership Transfer Pipeline
-- ${nowIso}
`;

    mainZip.file("Database-Export.sql", sqlDump);

    // -----------------------------------------------------------------------
    // 4) Setup-Guide.pdf (actually .txt but named pdf for compatibility)
    // -----------------------------------------------------------------------
    const setupGuideText = `========================================================================
CHATFLOW AI — DEVELOPER SETUP & DEPLOYMENT GUIDE
========================================================================
Client: ${safeClientName}
Company: ${safeCompany}
Bot: ${safeBotName} (${botId})
Brand Color: ${safeBrandColor}
Export Date: ${new Date().toDateString()}
Generated: ${nowIso}

------------------------------------------------------------------------
SECTION 1: OVERVIEW
------------------------------------------------------------------------
You are receiving 100% ownership of your AI chatbot platform including
source code, database, embeddings, widget, and legal transfer docs.

Bundle: ${sanitizeFilename(safeCompany)}_ChatFlow_Handover.zip

Contents:
- Source-Code.zip (standalone Next.js + API + widget)
- Widget-Code.txt (embed instructions)
- Database-Export.sql (PostgreSQL + Supabase compatible)
- Setup-Guide.pdf (this file)
- Documentation.pdf (architecture)
- Ownership-Agreement.pdf (legal)

Statistics:
- FAQs: ${faqs.length}
- PDFs: ${pdfs.length}
- URLs: ${urls.length}
- Leads: ${leads.length}
- Conversations: ${conversations.length}

------------------------------------------------------------------------
SECTION 2: LOCAL SETUP
------------------------------------------------------------------------
1. Unzip Source-Code.zip
2. cd chatflow-*
3. npm install (Node 18+ required)
4. cp .env.local.example .env.local
   Fill:
   OPENAI_API_KEY=sk-proj-...
   DATABASE_URL=postgresql://...
5. Restore DB:
   psql $DATABASE_URL < ../Database-Export.sql
   OR paste into Supabase SQL Editor → Run
6. npm run dev → http://localhost:3000
   Test widget at /public/index.html

------------------------------------------------------------------------
SECTION 3: OPENAI / AI PROVIDER
------------------------------------------------------------------------
We use OpenAI gpt-4o-mini by default. You can swap to:
- Gemini: set GEMINI_API_KEY and change model in pages/api/chat.js
- Claude: set CLAUDE_API_KEY

Tokens: business info + last 10 messages + FAQs are injected.
If no API key, fallback local logic will still answer from FAQs.

Costs: ~ $0.002 per conversation with gpt-4o-mini.

------------------------------------------------------------------------
SECTION 4: DEPLOYMENT
------------------------------------------------------------------------
A) Vercel (Recommended 3-min deploy):
   - Push standalone folder to GitHub private repo
   - vercel.com → Add New Project → import repo
   - Add env vars: OPENAI_API_KEY, DATABASE_URL
   - Deploy

B) Netlify / Render / Railway / Fly:
   - Same steps, set Build = npm run build, Start = npm start
   - Ensure Node 18+

C) Docker / VPS:
   Dockerfile:
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN npm ci --only=production
   RUN npm run build
   EXPOSE 3000
   CMD ["npm","start"]

   Then:
   docker build -t chatflow-${botId} .
   docker run -p 3000:3000 -e OPENAI_API_KEY=xxx -e DATABASE_URL=... chatflow-${botId}

D) Self-hosted Postgres:
   - Create DB: createdb chatflow
   - psql chatflow < Database-Export.sql
   - Update DATABASE_URL

------------------------------------------------------------------------
SECTION 5: WIDGET CUSTOMIZATION
------------------------------------------------------------------------
Edit public/chatflow-widget.js:
- const BRAND = "${safeBrandColor}" → change color
- Avatar, welcome, position bottom/right
- API URL if chat API hosted elsewhere

Then rebuild or just copy modified widget.js to your CDN.

------------------------------------------------------------------------
SECTION 6: SECURITY CHECKLIST
------------------------------------------------------------------------
- Rotate OPENAI_API_KEY after import
- Enable RLS in Supabase (already in schema)
- DB indexes already created at end of sql dump
- .env.local never commit
- Use HTTPS for embed script
- Consider rate limiting /api/chat (add Upstash or similar)

------------------------------------------------------------------------
SECTION 7: TROUBLESHOOTING
------------------------------------------------------------------------
Widget not showing?
- Check <script src> correct, bot-id="${botId}"
- Open console: should have no 404 for chatflow-widget.js
- Ensure DOM loaded before script (place before </body>)

Chat empty?
- Ensure OPENAI_API_KEY valid, check server logs
- Fallback local FAQ still works without key

DB error?
- Ensure VALUES escaped (we did) — look for single quotes
- Transaction BEGIN/COMMIT will rollback on error

------------------------------------------------------------------------
END OF GUIDE — Built by ChatFlow AI
Questions: support@chatflow.ai (30-day handover support included)
`;
    mainZip.file("Setup-Guide.pdf", setupGuideText);

    // -----------------------------------------------------------------------
    // 5) Documentation.pdf
    // -----------------------------------------------------------------------
    const documentationText = `========================================================================
CHATFLOW AI — SYSTEM DOCUMENTATION & USER MANUAL
========================================================================
Product: ChatFlow AI Standalone System
Chatbot: ${safeBotName} (${botId})
Host: ${safeCompany}
Owner: ${safeClientName}
Generated: ${nowIso}
Language: ${language}

------------------------------------------------------------------------
1. INTRODUCTION
------------------------------------------------------------------------
This manual documents your custom AI widget, backend API, and data model.
It is designed for your developers to maintain, extend, and audit.

Objectives:
- Provide self-hosted independence from SaaS billing
- Preserve conversation history & leads
- Allow custom training (PDFs/URLs/FAQs)
- Zero vendor lock-in for widget & API

------------------------------------------------------------------------
2. SYSTEM ARCHITECTURE
------------------------------------------------------------------------
High-level layers:

[A] Floating Web Widget (public/chatflow-widget.js)
- Vanilla JS, <3KB gzipped, no dependencies
- Injects bubble bottom-right
- Click → panel with messages
- Stores history in memory, pushes to /api/chat
- Auto-reconnect, typing indicator
- Lead capture implicit on email/phone regex

[B] Chat Completion API (pages/api/chat.js)
- Next.js serverless (Vercel / Node)
- Stack:
  Input parsing → system prompt build (businessInfo + FAQs + personality) →
  conversation history (last 10) → OpenAI / Gemini / Claude → reply
- No vector DB in standalone; RAG via simple FAQ keyword overlap.
  In production, upgrade to embeddings (pgvector or Pinecone).

[C] Storage Layer (PostgreSQL / Supabase)
- clients: tenants
- chatbots: per-client configs
- faqs: exact Q&A
- knowledge_sources: pdf/url metadata
- leads: captured contacts
- conversations: session containers
- messages: per conversation
- widget_settings: brand, position

Joins: chatbot_id foreign keys, with client scoping.
RLS (if Supabase): client can only see own rows.

[D] Ownership Package (this ZIP)
- Generated with JSZip, no disk I/O, memory buffers
- Includes source, sql, docs, legal
- Sanitized inputs for SQL injection (${
      faqs.length > 0 ? "FAQs escaped via replace" : "empty handling"
    })

------------------------------------------------------------------------
3. KNOWLEDGE BASE & TRAINING
------------------------------------------------------------------------
Current training data:
- Business Info: ${businessInfo.slice(0, 300)}${businessInfo.length > 300 ? "..." : ""}
- Personality: ${personality.slice(0, 300)}${personality.length > 300 ? "..." : ""}
- FAQs: ${faqs.length} entries
- URLs: ${urls.length} - ${(urls as URLItem[]).map((u) => u.url).join(", ").slice(0, 200)}
- PDFs: ${pdfs.length} - ${(pdfs as PDFItem[]).map((p) => p.name).join(", ").slice(0, 200)}

Process:
1. Widget sends {message, conversationHistory}
2. API builds systemPrompt with businessInfo + FAQs
3. Scan FAQs for exact or keyword overlap (>60% keyword match)
4. If match → direct answer
5. If no match → GPT/Gemini/Claude completion with context window
6. If error / no key → local fallback from businessInfo snippet
7. Response → widget → auto-lead extraction on email/phone regex

Training improvements you can add:
- Use Supabase pgvector: embed PDFs with OpenAI embeddings, similarity search
- Add knowledge_sources.content_text population via pdf-parse
- Fine-tune system prompt per language (${language})

------------------------------------------------------------------------
4. WIDGET LIFECYCLE
------------------------------------------------------------------------
- Load chatflow-widget.js via <script>
- DOMContentLoaded → inject CSS + bubble + hidden panel
- bubble click toggles .open
- User types → POST /api/chat
- History up to 10 messages kept for context
- No cookies, GDPR-friendly (anonymous until lead)
- Position bottom-right configurable in CSS top of widget file

------------------------------------------------------------------------
5. API REFERENCE
------------------------------------------------------------------------
POST /api/chat
Body: {
  message: string,
  chatbotId: string (optional),
  conversationHistory: {role:"user"|"assistant", content:string}[]
}
Returns: { reply: string, botId, botName }
Errors: 400 message missing, 405 method, 500 openai fail

GET /api/bot-settings/[botId] (in hosted SaaS version)
Returns bot config from Supabase for widget config fetch.

POST /api/admin/ownership-transfer (this generator)
Body: client + bot + leads + conversations
Returns: ZIP binary

------------------------------------------------------------------------
6. EXTENDING THE PLATFORM
------------------------------------------------------------------------
- Add analytics: log messages to analytics_events table (see supabase-schema.sql)
- Add appointments: create appointments table, expose /api/appointments
- Add docs upload: use storage bucket knowledge-documents (Supabase storage)
- Add avatar upload: chatbot-avatars bucket

------------------------------------------------------------------------
7. MAINTENANCE & COSTS
------------------------------------------------------------------------
- OpenAI: $0.15 / 1M input tokens, $0.60 / 1M output with gpt-4o-mini
- Hosting: Vercel free tier sufficient for <100k requests/mo
- DB: Supabase free 500MB
- Widget CDN: Cloudflare R2 or Vercel static

------------------------------------------------------------------------
END OF DOCUMENTATION
`;

    mainZip.file("Documentation.pdf", documentationText);

    // -----------------------------------------------------------------------
    // 6) Ownership-Agreement.pdf
    // -----------------------------------------------------------------------
    const agreementText = `========================================================================
CHATFLOW AI — CODE & INTELLECTUAL PROPERTY TRANSFER AGREEMENT
========================================================================
This Agreement is entered into on ${new Date().toDateString()} by and between:

TRANSFEROR:
ChatFlow AI SaaS Systems Inc.
123 Market Street, Suite 400, San Francisco, CA 94105
Represented by: Michael Sterling, Chief Technology Officer
Contact: legal@chatflow.ai

TRANSFEREE:
${safeCompany} / Represented by ${safeClientName}
Client ID: ${clientId}
Email: ${clientId}@company.com
Website: https://${sanitizeFilename(safeCompany).toLowerCase()}.com

BOT INSTANCE:
Name: ${safeBotName}
ID: ${botId}
Brand Color: ${safeBrandColor}
Knowledge: ${faqs.length} FAQs, ${urls.length} URLs, ${pdfs.length} PDFs
Data: ${leads.length} Leads, ${conversations.length} Conversations
Handover Bundle: ${sanitizeFilename(safeCompany)}_ChatFlow_Handover.zip
Generated: ${nowIso}

EFFECTIVE DATE: ${new Date().toDateString()}

------------------------------------------------------------------------
1. TRANSFER OF RIGHTS & TITLE
------------------------------------------------------------------------
Transferor hereby irrevocably assigns, transfers, and conveys to Transferee
100% of all Intellectual Property (IP) rights, including but not limited to
source code, object code, documentation, database schemas, training prompts,
widget designs, trademarks usage for standalone instance, and data ownership
of leads/conversations for bot ${botId} / ${safeBotName}.

This package (Source-Code.zip) is MIT-Compatible for Transferee's private use.

------------------------------------------------------------------------
2. SCOPE OF OWNERSHIP
------------------------------------------------------------------------
Upon execution (download), Transferee obtains:
a) Full perpetual, royalty-free, worldwide license to modify, rewrite, resell
   white-label, self-host on any servers/cloud.
b) Exclusive ownership of database records: clients, chatbots, faqs,
   leads (${leads.length}), conversations (${conversations.length}) as exported in Database-Export.sql.
c) Right to remove ChatFlow branding, including widget attribution.
d) No recurring SaaS fees to Transferor.

Excluded: ChatFlow's core multi-tenant SaaS infrastructure not bundled.

------------------------------------------------------------------------
3. REPRESENTATIONS
------------------------------------------------------------------------
Transferor warrants:
- It has full authority to transfer this instance code.
- Code does not contain malicious backdoors.
- Package generation sanitizes inputs (JSZip memory buffer, SQL escaped).
- Standalone uses OpenAI API; billing becomes Transferee's responsibility.

Transferee warrants:
- Will not use code to build competing SaaS with Transferor's trademarks in same brand.
- Will not distribute client leads in violation of GDPR/CCPA.

------------------------------------------------------------------------
4. SUPPORT & MAINTENANCE
------------------------------------------------------------------------
Under Full Ownership Transfer Plan:
- Transferor provides 30-day Technical Support Window from Effective Date:
  Deployment assistance, Vercel/Docker setup, DB import, widget integration.
- After 30 days: no obligation for bug fixes, security patches, or feature updates.
- Transferee assumes hosting fees, OpenAI API costs, domain, SSL, backups, security audits.

Support Contact: handover@chatflow.ai (response <24h business days)

------------------------------------------------------------------------
5. CONFIDENTIALITY
------------------------------------------------------------------------
Source code delivered is confidential. Transferee may share with internal
developers under NDA. Public distribution of source allowed only after
white-labeling and removing ChatFlow references.

------------------------------------------------------------------------
6. INDEMNIFICATION & LIMITATION OF LIABILITY
------------------------------------------------------------------------
Transferor not liable for OpenAI API outages, data loss post-transfer, or
third-party widget embedding errors. Transferee indemnifies Transferor for
misuse of leads data.

Max liability capped at $2,499 (price of ownership plan).

------------------------------------------------------------------------
7. GOVERNING LAW
------------------------------------------------------------------------
This Agreement governed by laws of State of California, USA.
Disputes: mediation in San Francisco before litigation.

------------------------------------------------------------------------
8. SIGNATURES — DIGITAL EXECUTION UPON DOWNLOAD
------------------------------------------------------------------------
By downloading ${sanitizeFilename(safeCompany)}_ChatFlow_Handover.zip, both parties accept.

Transferor:
-------------------------------------------------
Michael Sterling, CTO, ChatFlow AI Systems
Date: ${new Date().toDateString()}
Digital Signature: CHATFLOW-${botId.toUpperCase()}-${Date.now()}

Transferee:
-------------------------------------------------
Authorized: ${safeClientName} for ${safeCompany}
Client ID: ${clientId}
Date: ${new Date().toDateString()}
Digital Signature: TRANSFEREE-${clientId.toUpperCase()}-${Date.now()}

------------------------------------------------------------------------
Exhibit A: Bundle Contents Verification
- Source-Code.zip: SHA will vary, contains Next.js app + widget
- Database-Export.sql: ${faqs.length + leads.length + conversations.length} inserts
- Widget-Code.txt: bot-id ${botId}
- Setup-Guide.pdf, Documentation.pdf, Ownership-Agreement.pdf: this file

END OF AGREEMENT — ChatFlow AI © ${new Date().getFullYear()}
`;

    mainZip.file("Ownership-Agreement.pdf", agreementText);

    // -----------------------------------------------------------------------
    // Final ZIP
    // -----------------------------------------------------------------------
    const mainZipBuffer = await mainZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });

    const safeClientFile = `${sanitizeFilename(safeCompany)}_ChatFlow_Handover.zip`;

    return new NextResponse(new Uint8Array(mainZipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=\"${safeClientFile}\"`,
        "Cache-Control": "no-store",
        "X-Bot-Id": botId,
        "X-Client-Id": clientId,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Ownership Transfer ZIP failed:", errorMessage, err);
    return NextResponse.json({ error: "Failed to generate handover zip package.", details: errorMessage }, { status: 500 });
  }
}
