# ChatFlow AI - Premium AI Chatbot SaaS Platform

ChatFlow AI is a high-fidelity, complete full-stack AI chatbot builder SaaS platform similar to Chatbase. It enables businesses to train AI assistants on custom PDFs, documents, URLs, and FAQs, customize the chat appearance, embed a floating widget onto any website, and capture organic customer leads.

The platform stands out with its dual-commercialization business model:
1. **Monthly Maintenance Plan**: A hands-free managed subscription where platform engineers manage initial configurations, database syncs, and scraper schedules.
2. **Full Ownership Transfer Plan**: For a one-time enterprise fee, the client transfers 100% of the software's intellectual property, downloading a handover bundle containing the source code repository, PostgreSQL schema export, and signed transfer contracts.

---

## 🚀 Key Architectural Highlights

- **Frontend**: Next.js App Router (TypeScript, Tailwind CSS v4, Lucide Icons).
- **Backend API Routes**: Serverless chat completions `/api/chat` and dynamic multi-layered ZIP handovers `/api/admin/ownership-transfer`.
- **Intelligent Dual Storage**: Custom state manager (`src/lib/store.tsx`) that persists workspace states inside `localStorage` for visual interaction, with direct hooks for PostgreSQL/Supabase.
- **Multi-Brain AI Support**: Flexible routing for **OpenAI GPT-4o-mini**, **Google Gemini-Pro**, and **Anthropic Claude-3 Haiku**, with an intelligent context-aware rule solver fallback.
- **Website Chat Widget**: Vanilla JS script (`public/chatflow-widget.js`) loaded instantly in the DOM, featuring brand colors, pulsing notifications, and lead logging.

---

## 📦 Ownership Handover ZIP Contents

When an administrator executes a "Full Ownership Transfer" on behalf of a client, the server generates a complete commercial bundle `Client_Name_ChatFlow_Handover.zip` dynamically containing:

1. **`Source-Code.zip`**: A modular, independent Next.js standalone folder containing scripts, configurations (`tailwind.config.js`), and serverless endpoints.
2. **`Widget-Code.txt`**: Integration instructions and your customized `<script>` embed tag.
3. **`Database-Export.sql`**: Complete CREATE TABLE script & custom INSERT commands containing the client's actual chatbot settings, FAQs, and logged customer leads.
4. **`Setup-Guide.pdf`**: Detailed system deployment instructions for local, Vercel, and AWS clouds.
5. **`Documentation.pdf`**: In-depth architecture manual detailing widget triggers and prompt context windows.
6. **`Ownership-Agreement.pdf`**: Legally-binding copyright and intellectual property transfer form with digital sign-offs.

---

## 🧑‍💻 Quick Start & Testing Guide

### 1. Installation

Install all required packages:
```bash
npm install
```

### 2. Configure Environment Keys
Add custom secret keys to `.env.local` to override the neural-simulated fallback:
```env
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-key
CLAUDE_API_KEY=your-claude-key
```

### 3. Run Development Server
Spin up the local developer preview:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to experience the platform!

---

## 🏆 Premium Experience Accelerators

We have loaded the login dashboard with **Quick Demo Accelerators**:
- **Alex Rivera (Apex Software)**: Preloaded with cloud server specifications, SOC2 compliance guides, 3 custom FAQs, active messaging logs, and captured client contacts.
- **Sophia Sterling (Luxe Spa)**: Customized in pink-accented branding, loaded with wellness spa menus, Tesla chauffeur configurations, and reservation transcripts.
- **Super-Admin Control**: Promote yourself to Super-Admin with 1 click to manage payments, toggle subscriptions, and execute handovers in the Admin Control Panel.

---

## 🛠️ Production Build Check

Verify that the project compiles with zero warnings or type errors:
```bash
npm run build
```
This will compile successfully, preparing the code for Vercel, AWS, or local standalone hosting.
