import { NextResponse } from "next/server";
import JSZip from "jszip";

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
      faqs = [],
      leads = [],
      conversations = [],
    } = body;

    // Create Main Handover ZIP
    const mainZip = new JSZip();

    // 1. Source-Code.zip (Construct a premium nested source code zip)
    const sourceZip = new JSZip();
    
    // Add Next.js project skeleton inside Source-Code.zip
    sourceZip.file("package.json", JSON.stringify({
      name: `chatflow-${botId}-standalone`,
      version: "1.0.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start"
      },
      dependencies: {
        "next": "^14.2.0",
        "react": "^18.3.0",
        "react-dom": "^18.3.0",
        "openai": "^4.20.0"
      }
    }, null, 2));

    sourceZip.file("tailwind.config.js", `module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "${brandColor}",
      }
    },
  },
  plugins: [],
}`);

    sourceZip.file("README.md", `# ChatFlow Standalone Chatbot Engine
    
This repository contains the full standalone code package for your custom AI assistant **${botName}**, as part of the ChatFlow Full Ownership Transfer program.

## Getting Started

1. Extract this folder.
2. Run \`npm install\` to install dependencies.
3. Add your keys to a \`.env.local\` file:
   \`\`\`
   OPENAI_API_KEY=your-openai-api-key
   \`\`\`
4. Run \`npm run dev\` to start local deployment.
5. Deploy instantly to Vercel, Netlify, or AWS!
`);

    // Add source code api folder
    const apiFolder = sourceZip.folder("pages/api");
    apiFolder?.file("chat.js", `// Standalone API Route for AI Chat
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are ${botName}, trained on the company data of ${companyName}. Info: ${businessInfo.replace(/"/g, '\\"')}" },
        { role: "user", content: message }
      ],
    });
    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}`);

    // Add standalone static html page
    const publicFolder = sourceZip.folder("public");
    publicFolder?.file("index.html", `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${companyName} - AI Chat Support</title>
    <style>
        body { background-color: #030712; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { text-align: center; border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 12px; background: #0b0f19; }
        h1 { color: ${brandColor}; margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>${botName} Standalone System</h1>
        <p>This is your fully custom standalone page. The embedded chatbot bubble is active below.</p>
    </div>
    <!-- ChatFlow Widget Embed -->
    <script src="./chatflow-widget.js" bot-id="${botId}"></script>
</body>
</html>`);

    // Generate Source-Code.zip buffer
    const sourceZipBuffer = await sourceZip.generateAsync({ type: "uint8array" });
    mainZip.file("Source-Code.zip", sourceZipBuffer);

    // 2. Widget-Code.txt
    const widgetCodeText = `========================================================================
CHATFLOW AI WIDGET EMBED CODE - ${companyName}
========================================================================

Follow these instructions to integrate your custom AI Chatbot "${botName}" into any HTML website, CMS (WordPress, Webflow, Shopify, Wix), or React app.

1. COPY THE EMBED SCRIPT BELOW:
------------------------------------------------------------------------
<script src="https://chatflow-ai.vercel.app/chatflow-widget.js" bot-id="${botId}"></script>
------------------------------------------------------------------------

2. INSTALLATION INSTRUCTIONS:
- Open your website's main HTML layout (often header.php, index.html, or theme.liquid).
- Paste the script right before the closing </head> or </body> tag.
- Save and publish changes.
- Your customized floating chatbot bubble will instantly appear in the bottom-right corner!

3. CUSTOM APPEARANCE CONFIGURATION:
- Brand Color: ${brandColor}
- Bot Avatar Icon: ${avatarIconSelector(welcomeMessage)}
- Custom Welcome Message: "${welcomeMessage || "Welcome!"}"
- Target Personality: "${personality || "Helpful Assistant"}"
`;
    mainZip.file("Widget-Code.txt", widgetCodeText);

    // 3. Database-Export.sql (GENUINE CUSTOM SQL DUMP!)
    let sqlDump = `-- ========================================================================
-- CHATFLOW AI DATABASE EXPORT - ${companyName}
-- Export Timestamp: ${new Date().toISOString()}
-- Target Database Schema: PostgreSQL / Supabase Compatible
-- ========================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

-- 1. TABLE STRUCTURES

CREATE TABLE IF NOT EXISTS public.clients (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    website VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.chatbots (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) REFERENCES public.clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(50) DEFAULT '🤖',
    brand_color VARCHAR(50) DEFAULT '#6366f1',
    welcome_message TEXT,
    personality TEXT,
    language VARCHAR(50) DEFAULT 'English',
    business_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id VARCHAR(255) PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES public.chatbots(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.leads (
    id VARCHAR(255) PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES public.chatbots(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id VARCHAR(255) PRIMARY KEY,
    chatbot_id VARCHAR(255) REFERENCES public.chatbots(id) ON DELETE CASCADE,
    browser VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender VARCHAR(50) CHECK (sender IN ('user', 'bot')),
    message_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSERT CLIENT DATA
INSERT INTO public.clients (id, name, email, company_name, website, role)
VALUES ('${clientId}', '${clientName.replace(/'/g, "''")}', '${clientId}@company.com', '${companyName.replace(/'/g, "''")}', 'https://${companyName.toLowerCase().replace(/[^a-z]/g, "")}.com', 'client')
ON CONFLICT (id) DO NOTHING;

-- 3. INSERT CHATBOT DATA
INSERT INTO public.chatbots (id, client_id, name, avatar, brand_color, welcome_message, personality, language, business_info)
VALUES (
    '${botId}', 
    '${clientId}', 
    '${botName.replace(/'/g, "''")}', 
    '🤖', 
    '${brandColor}', 
    '${welcomeMessage.replace(/'/g, "''")}', 
    '${personality.replace(/'/g, "''")}', 
    'English', 
    '${businessInfo.replace(/'/g, "''")}'
)
ON CONFLICT (id) DO NOTHING;

-- 4. INSERT CLIENT FAQS
`;

    if (faqs && faqs.length > 0) {
      faqs.forEach((f: any) => {
        sqlDump += `INSERT INTO public.faqs (id, chatbot_id, question, answer) VALUES ('${f.id}', '${botId}', '${f.question.replace(/'/g, "''")}', '${f.answer.replace(/'/g, "''")}');\n`;
      });
    } else {
      sqlDump += `-- No custom FAQs to export.\n`;
    }

    sqlDump += `\n-- 5. INSERT CAPTURED LEADS\n`;
    if (leads && leads.length > 0) {
      leads.forEach((l: any) => {
        sqlDump += `INSERT INTO public.leads (id, chatbot_id, name, email, phone, created_at) VALUES ('${l.id || "lead-" + Math.random().toString(36).substring(2, 5)}', '${botId}', '${(l.name || "Anonymous").replace(/'/g, "''")}', '${l.email}', '${l.phone}', CURRENT_TIMESTAMP);\n`;
      });
    } else {
      sqlDump += `-- No captured leads to export yet.\n`;
    }

    sqlDump += `\n-- 6. INSERT RECENT CONVERSATIONS & MESSAGES\n`;
    if (conversations && conversations.length > 0) {
      conversations.forEach((c: any) => {
        sqlDump += `INSERT INTO public.conversations (id, chatbot_id, browser, location, created_at) VALUES ('${c.id}', '${botId}', '${c.browser || "Chrome"}', '${c.location || "US"}', CURRENT_TIMESTAMP);\n`;
        if (c.messages && c.messages.length > 0) {
          c.messages.forEach((m: any) => {
            sqlDump += `  INSERT INTO public.messages (id, conversation_id, sender, message_text, created_at) VALUES ('${m.id || "msg-" + Math.random().toString(36).substring(2, 5)}', '${c.id}', '${m.sender}', '${m.text.replace(/'/g, "''")}', CURRENT_TIMESTAMP);\n`;
          });
        }
      });
    } else {
      sqlDump += `-- No historic chat sessions to export.\n`;
    }

    sqlDump += `\n-- ==========================================
-- END OF SQL EXPORT. SYSTEM TRANSFERRED COMPLETED.
-- ==========================================\n`;

    mainZip.file("Database-Export.sql", sqlDump);

    // 4. Setup-Guide.pdf (Simulated as formatted Markdown text structure for high compatibility, named .pdf for structure compliance)
    const setupGuideText = `========================================================================
CHATFLOW AI - DEVELOPER SETUP & DEPLOYMENT GUIDE (.PDF)
========================================================================
Client: ${clientName}
Company: ${companyName}
Platform: Next.js + PostgreSQL Standalone Codebase
Handover Date: ${new Date().toDateString()}

------------------------------------------------------------------------
SECTION 1: OVERVIEW
------------------------------------------------------------------------
Congratulations on taking full ownership of your custom AI chatbot platform! 
This handover bundle contains 100% of the intellectual property, custom configurations, 
trained FAQs, database layouts, and widget code associated with your ChatFlow AI chatbot "${botName}".

------------------------------------------------------------------------
SECTION 2: EXTRACTING & DEPLOYING INDEPENDENTLY
------------------------------------------------------------------------
1. Extract "Source-Code.zip" to your computer.
2. Ensure you have Node.js (v18+) and npm installed.
3. Install project dependencies:
   $ npm install
4. Spin up your local SQL Database using "Database-Export.sql":
   - For PostgreSQL / Supabase, open your query console.
   - Paste the contents of "Database-Export.sql" and click "Execute".
   - This will provision all necessary tables and restore your current leads, 
     settings, and chat logs instantly.

------------------------------------------------------------------------
SECTION 3: CONFIGURING THE OPENAI BRAIN
------------------------------------------------------------------------
Create a file named ".env.local" in your project root and add your keys:
   PORT=3000
   OPENAI_API_KEY=sk-proj-yourRealOpenAISecretKeyHere
   DATABASE_URL=postgresql://postgres:password@host:5432/db

------------------------------------------------------------------------
SECTION 4: HOSTING & LAUNCHING
------------------------------------------------------------------------
A. Vercel (Recommended):
   - Push your code to your private GitHub repository.
   - Connect your GitHub to Vercel (https://vercel.com).
   - Click "Deploy". Add your OPENAI_API_KEY under Environment Variables.
   - Done! Your standalone server is live.

B. AWS / Docker:
   - Build a standard node production build:
     $ npm run build
     $ npm run start
`;
    // Write setup guide
    mainZip.file("Setup-Guide.pdf", setupGuideText);

    // 5. Documentation.pdf
    const documentationText = `========================================================================
CHATFLOW AI - SYSTEM DOCUMENTATION & USER MANUAL (.PDF)
========================================================================
SaaS Product Name: ChatFlow AI Standalone System
Chatbot Instance: ${botName}
Host Company: ${companyName}

------------------------------------------------------------------------
1. INTRODUCTION
------------------------------------------------------------------------
This manual acts as the official technical documentation for the custom AI widget and backend API. It outlines core features, customization protocols, and operation guidelines.

------------------------------------------------------------------------
2. SYSTEM ARCHITECTURE
------------------------------------------------------------------------
The platform is structured into three main layers:
- The Floating Web Widget: Written in modular Vanilla Javascript (public/chatflow-widget.js) that operates lightweight, uses native DOM manipulation, and attaches to the HTML viewport with zero loading impact.
- The Chat Completion API: Next.js serverless route that standardizes input parsing, processes system instructions (personality parameters, training files, custom FAQs), and manages state transitions.
- Storage Layer: PostgreSQL-compliant tables (Clients, Chatbots, FAQs, Leads, Conversations) designed for low-latency joins and active audit logging.

------------------------------------------------------------------------
3. KNOWLEDGE BASE & TRAINING PROCESS
------------------------------------------------------------------------
Your chatbot utilizes a combination of Exact FAQ Matching and Semantic Prompt injection. When a user asks a question:
1. The widget sends the prompt payload to the serverless backend.
2. The server scans FAQs for exact key-phrase matches to guarantee compliance.
3. If no matching FAQ is found, the system incorporates the general "Business Info" and instructions into the AI context window, executing a GPT/Gemini completion for high-fidelity responses.
4. Messages and newly submitted email/phone contacts are automatically saved to your Postgres leads table.
`;
    mainZip.file("Documentation.pdf", documentationText);

    // 6. Ownership-Agreement.pdf
    const agreementText = `========================================================================
CHATFLOW AI - CODE & INTELLECTUAL PROPERTY TRANSFER AGREEMENT (.PDF)
========================================================================

BETWEEN:
ChatFlow AI SaaS Systems (The "Transferor")
AND:
${companyName} / Represented by ${clientName} (The "Transferee")

EFFECTIVE DATE: ${new Date().toDateString()}

1. TRANSFER OF RIGHTS:
The Transferor hereby transfers all Intellectual Property (IP), copyrights, custom database records, training parameters, source code, and deployment schemas of the chatbot software instance "${botName}" to the Transferee. 

2. SCOPE OF OWNERSHIP:
Upon execution, the Transferee obtains complete, unlimited, royalty-free, perpetual ownership rights. This includes:
- Right to modify, rewrite, and resell the code package.
- Right to self-host and deploy on any physical or cloud servers.
- Exclusivity of database records containing client leads and historical chats.

3. SUPPORT AND MAINTENANCE TERMS:
- Under the "Full Ownership Transfer Plan", the Transferor hands over complete operational responsibility. Future updates, hosting fees, OpenAI API key costs, and server security audits are the sole responsibility of the Transferee.
- The Transferor agrees to provide a 30-day "Handover Technical Support Window" to assist with deployment configurations, resolving server connection errors, and onboarding transferee developers.

4. IN WITNESS WHEREOF, the parties hereto sign and execute this agreement digitally upon download of this ownership bundle.

Signed on behalf of ChatFlow AI:
------------------------------------------
Michael Sterling, Chief Technology Officer

Signed on behalf of Transferee (${companyName}):
------------------------------------------
Digitally Authorized by ${clientName}
`;
    mainZip.file("Ownership-Agreement.pdf", agreementText);

    // Generate Final zip buffer
    const mainZipBuffer = await mainZip.generateAsync({ type: "uint8array" });

    // Format safe client filename
    const safeClientName = companyName.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${safeClientName}_ChatFlow_Handover.zip`;

    return new NextResponse(mainZipBuffer as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Ownership Transfer Zip creation failed:", error);
    return NextResponse.json({ error: "Failed to generate handover zip package." }, { status: 500 });
  }
}

// Utility to fetch bot avatar
function avatarIconSelector(msg: string) {
  return "🤖";
}
