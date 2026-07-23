import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, chatbotId, businessInfo, faqs, personality } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check for API Keys in env
    const openAIKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;

    const systemPrompt = `
You are an advanced AI business assistant named ChatFlow chatbot.
Your specific persona: ${personality || "Professional, helpful, and polite."}
Your knowledge base is built from this company business information:
---
${businessInfo || "No specific business info provided."}
---

Here are FAQs that you can use to answer questions accurately:
${
  faqs && faqs.length > 0
    ? faqs.map((f: { question: string; answer: string }) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
    : "No FAQs configured."
}

INSTRUCTIONS:
1. Always be helpful, engaging, and professional.
2. Rely strictly on the business info and FAQs if they contain the answer.
3. If the user asks about booking, sales, custom solutions, or pricing that isn't specified, ask for their Name, Email, and Phone number to pass to the client team.
4. If you don't know the answer, politely invite them to leave their contact details so a human specialist can follow up.
5. Keep your answers concise, luxurious, and clear.
`;

    // 1. Try OpenAI if key is present
    if (openAIKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices[0]?.message?.content || "";
          if (reply) return NextResponse.json({ reply, engine: "OpenAI" });
        }
      } catch (err) {
        console.error("OpenAI API error:", err);
      }
    }

    // 2. Try Gemini if key is present
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
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
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (reply) return NextResponse.json({ reply, engine: "Google Gemini" });
        }
      } catch (err) {
        console.error("Gemini API error:", err);
      }
    }

    // 3. Try Claude if key is present (standard Claude API structure)
    if (claudeKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": claudeKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: message }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.content?.[0]?.text || "";
          if (reply) return NextResponse.json({ reply, engine: "Anthropic Claude" });
        }
      } catch (err) {
        console.error("Claude API error:", err);
      }
    }

    // 4. Fallback: Intelligent Simulated Chat Engine
    // Let's create a beautiful, context-aware rule solver
    const lowerMessage = message.toLowerCase();
    let replyText = "";

    // Search inside FAQs
    if (faqs && faqs.length > 0) {
      const bestFaq = faqs.find((f: { question: string; answer: string }) => {
        const qWords = f.question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
        return qWords.length > 0 && qWords.every((word: string) => lowerMessage.includes(word));
      });
      if (bestFaq) {
        replyText = bestFaq.answer;
      }
    }

    // General heuristics
    if (!replyText) {
      if (lowerMessage.includes("pricing") || lowerMessage.includes("cost") || lowerMessage.includes("subscription") || lowerMessage.includes("price")) {
        replyText = `Our premium AI chatbot solutions are highly customized. For SaaS operations, we offer our standard pricing packages which includes the Managed AI Plan and the Full Ownership Handover plan. If you'd like a custom estimate for your website, please tell me your Name, Email, and Phone, and our expert team will deliver a custom plan.`;
      } else if (lowerMessage.includes("setup") || lowerMessage.includes("install") || lowerMessage.includes("embed") || lowerMessage.includes("widget")) {
        replyText = `Integrating ChatFlow AI is extremely effortless. Simply embed our lightweight script widget (chatflow-widget.js) into your website's header or footer. Once added, the chatbot bubble will immediately float in the bottom right corner, synced with your latest training knowledge. Can I help guide you on how to set it up today?`;
      } else if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("contact")) {
        replyText = `We are here to help! Please leave your email address and your core query, and we will get back to you within 2 hours. Our office works around the clock to ensure your AI chatbot operates beautifully!`;
      } else if (lowerMessage.includes("ownership") || lowerMessage.includes("transfer") || lowerMessage.includes("source code")) {
        replyText = `We offer a complete Full Ownership Transfer plan. For a one-time fee, we package the Next.js frontend, Node/SaaS backend API code, full widget script, custom SQL export of your knowledge and settings, plus official developer setup agreements and PDFs. Click the Handover Center on your admin dashboard to generate yours!`;
      } else {
        replyText = `That's an excellent question! Based on our trained knowledge base, we specialize in high-impact conversational AI. ${
          businessInfo ? businessInfo.substring(0, Math.min(businessInfo.length, 250)) + "..." : "We enable businesses to train models on custom PDFs, documents, FAQs, and URLs to resolve support issues in real-time."
        }\n\nWould you like one of our account managers to reach out? Just share your email or phone number!`;
      }
    }

    // Return mock answer with simulated typing delay (handled by client, but returned immediately from API)
    return NextResponse.json({
      reply: replyText,
      engine: "ChatFlow Neural-Simulated Engine",
    });
  } catch (error: unknown) {
    console.error("Chat API general failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
