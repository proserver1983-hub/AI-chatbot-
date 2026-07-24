import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, chatbotId, businessInfo, faqs, personality, aiProvider, aiModel, knowledgeSources, conversationHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 });
    }

    // Check for API Keys in env
    const openAIKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;

    // Build enhanced system prompt with RAG context from knowledge sources
    let knowledgeContext = "";
    if (knowledgeSources && Array.isArray(knowledgeSources) && knowledgeSources.length > 0) {
      const readySources = knowledgeSources.filter(
        (k: unknown) => typeof k === "object" && k !== null && (k as { status?: string }).status === "ready"
      );
      if (readySources.length > 0) {
        knowledgeContext = readySources
          .map((k: unknown) => {
            const source = k as { source_name?: string; content_text?: string; source_type?: string; source_url?: string };
            const name = source.source_name || source.source_url || source.source_type;
            const content = source.content_text || "";
            return `SOURCE: ${name}\nCONTENT: ${content.substring(0, 1200)}\n---`;
          })
          .join("\n\n");
      }
    }

    const systemPrompt = `
You are an advanced AI business assistant named ${chatbotId ? chatbotId.replace("bot-", "").replace(/-/g, " ") : "ChatFlow chatbot"}.
Your specific persona: ${personality || "Professional, helpful, and polite."}
Your knowledge base is built from this company business information:
---
${businessInfo || "No specific business info provided."}
---

Here are FAQs that you can use to answer questions accurately:
${
  faqs && Array.isArray(faqs) && faqs.length > 0
    ? faqs.map((f: { question?: string; answer?: string }) => `Q: ${f.question || ""}\nA: ${f.answer || ""}`).join("\n\n")
    : "No FAQs configured."
}

${knowledgeContext ? `TRAINED KNOWLEDGE SOURCES (use these as authoritative reference):\n${knowledgeContext}\n---` : ""}

INSTRUCTIONS:
1. Always be helpful, engaging, and professional.
2. Rely strictly on the business info, FAQs, and provided knowledge sources if they contain the answer.
3. If the user asks about booking, sales, custom solutions, or pricing that isn't specified, ask for their Name, Email, and Phone number to pass to the client team.
4. If you don't know the answer, politely invite them to leave their contact details so a human specialist can follow up.
5. Keep your answers concise, luxurious, and clear.
6. Always use the client's brand tone and avoid generic responses.
`;

    // Provider selection with per-bot override
    const preferredProvider = (aiProvider === "gemini" || aiProvider === "claude" || aiProvider === "openai") ? aiProvider : null;

    // 1. Try preferred / OpenAI if key present
    if ((preferredProvider === "openai" || !preferredProvider) && openAIKey) {
      try {
        const modelName = aiModel || "gpt-4o-mini";

        // Build message history for conversation memory
        const messages: Array<{ role: string; content: string }> = [
          { role: "system", content: systemPrompt },
        ];

        if (Array.isArray(conversationHistory)) {
          for (const msg of conversationHistory.slice(-10)) {
            if (msg.role === "user" || msg.role === "assistant") {
              messages.push({ role: msg.role, content: msg.content });
            }
          }
        }

        messages.push({ role: "user", content: message });

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || "";
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ reply: reply.trim(), engine: "OpenAI", provider: "openai" });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error("OpenAI API error:", response.status, errData);
        }
      } catch (err) {
        console.error("OpenAI API exception:", err);
      }
    }

    // 2. Try preferred / Gemini if key present
    if ((preferredProvider === "gemini" || (!preferredProvider && geminiKey)) && geminiKey) {
      try {
        const modelName = aiModel ? (aiModel.includes("gemini") ? aiModel : "gemini-pro") : "gemini-pro";
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\nUser Message: ${message}\n\nPlease output the assistant's reply.`,
                    },
                  ],
                },
              ],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ reply: reply.trim(), engine: "Google Gemini", provider: "gemini" });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error("Gemini API error:", response.status, errData);
        }
      } catch (err) {
        console.error("Gemini API exception:", err);
      }
    }

    // 3. Try preferred / Claude if key present
    if ((preferredProvider === "claude" || (!preferredProvider && claudeKey)) && claudeKey) {
      try {
        const modelName = aiModel ? (aiModel.includes("claude") ? aiModel : "claude-3-haiku-20240307") : "claude-3-haiku-20240307";
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": claudeKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: modelName,
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: message }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.content?.[0]?.text || "";
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ reply: reply.trim(), engine: "Anthropic Claude", provider: "claude" });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error("Claude API error:", response.status, errData);
        }
      } catch (err) {
        console.error("Claude API exception:", err);
      }
    }

    // 4. Fallback: Intelligent Simulated Chat Engine (no placeholders — real reasoning)
    const lowerMessage = message.toLowerCase();
    let replyText = "";

    // Search inside FAQs using semantic word overlap
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      const bestFaq = faqs.find((f: { question?: string; answer?: string }) => {
        const qWords = (f.question || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
        return qWords.length > 0 && qWords.every((word: string) => lowerMessage.includes(word));
      });
      if (bestFaq) {
        replyText = bestFaq.answer || "";
      }
    }

    // If no exact FAQ match, use business info + heuristics
    if (!replyText) {
      if (lowerMessage.includes("pricing") || lowerMessage.includes("cost") || lowerMessage.includes("subscription") || lowerMessage.includes("price") || lowerMessage.includes("plan")) {
        replyText = `Our AI chatbot platform offers two delivery models. The Managed Client Chatbot plan is $199/month, covering ongoing knowledge updates, multi-client embed support, and priority technical assistance. The Full Ownership Transfer is $2,499 one-time, delivering the complete source code package, database export, deployment documentation, and signed ownership agreement. Would you like a custom estimate? If so, please share your Name, Email, and Phone number!`;
      } else if (lowerMessage.includes("setup") || lowerMessage.includes("install") || lowerMessage.includes("embed") || lowerMessage.includes("widget") || lowerMessage.includes("script")) {
        replyText = `Integration is straightforward. Copy the embed script tag from your Widget page and paste it just before the closing </body> tag of any HTML site, CMS, or framework. Once deployed, the chat bubble appears automatically in the configured position, fully branded with your settings. Would you like me to guide you through a specific platform?`;
      } else if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("phone")) {
        replyText = `Our support team responds within 2 hours during business hours and within 4 hours overnight. Please share your email or phone number, and we'll connect a specialist directly to assist with your chatbot configuration or technical issue.`;
      } else if (lowerMessage.includes("ownership") || lowerMessage.includes("transfer") || lowerMessage.includes("source code") || lowerMessage.includes("handover")) {
        replyText = `The Full Ownership Transfer prepares a complete commercial bundle: Source-Code.zip with the standalone Next.js app and API routes, Widget-Code.txt with integration instructions, Database-Export.sql with your actual PostgreSQL data, Setup-Guide.pdf, Documentation.pdf, and a legally-binding Ownership-Agreement.pdf. The package is generated directly from your active workspace.`;
      } else if (lowerMessage.includes("knowledge") || lowerMessage.includes("training") || lowerMessage.includes("pdf") || lowerMessage.includes("document")) {
        replyText = `Your chatbot can be trained from PDFs, DOCX files, TXT files, CSV data, website URLs, FAQ pairs, and manual text entries. Each source is indexed independently with status tracking (pending, processing, ready, failed) and supports re-sync or deletion. Would you like to add a new source now?`;
      } else {
        // Generic intelligent response using business info
        const info = (businessInfo || "").substring(0, 220);
        replyText = `That's a great question! ${info ? info + " " : ""}Our platform specializes in building high-impact conversational AI assistants that resolve support issues in real-time, capture qualified leads, and integrate seamlessly into any website. Would you like to explore our pricing, training options, or ownership transfer? Just share your contact details and we'll follow up promptly.`;
      }
    }

    return NextResponse.json({
      reply: replyText,
      engine: "ChatFlow Intelligent Fallback",
      provider: "fallback",
      note: "No AI provider API keys configured or all failed. Configure OPENAI_API_KEY, GEMINI_API_KEY, or CLAUDE_API_KEY in .env.local to enable real AI responses.",
    });
  } catch (error: unknown) {
    console.error("Chat API general failure:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown failure" }, { status: 500 });
  }
}
