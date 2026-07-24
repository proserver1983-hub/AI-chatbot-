import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ botId: string }> }) {
  try {
    const { botId } = await params;
    if (!botId) {
      return NextResponse.json({ error: "Bot ID required" }, { status: 400 });
    }

    // In a production setup with Supabase, this would query the database:
    // const { data } = await supabase.from("chatbots").select("*, faqs(*)").eq("id", botId).single();
    // return NextResponse.json(data);

    // For this implementation, we return stored localStorage settings if available on the server,
    // or generate a default response based on initial mock data.
    // Since server doesn't have access to localStorage, we return a structured response
    // that the widget can use, with instructions to configure settings via database.

    return NextResponse.json({
      id: botId,
      name: "ChatFlow Assistant",
      avatar: "🤖",
      brandColor: "#6366f1",
      welcomeMessage: "Hello! How can I help you today?",
      personality: "Professional and polite.",
      businessInfo: "AI Chatbot Platform",
      language: "English",
      faqs: [],
      note: "For full customization, configure the chatbot in the ChatFlow dashboard and store settings in the database (Supabase). The widget reads settings from the server when deployed externally.",
      settingsEndpoint: `/api/bot-settings/${botId}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
