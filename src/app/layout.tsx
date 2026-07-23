import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "ChatFlow AI - Luxury AI Chatbot Builder & Managed Platform",
  description: "Create custom AI assistants trained on your corporate knowledge base. Choose our Monthly Maintenance managed package or Full Code Ownership Transfer plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
