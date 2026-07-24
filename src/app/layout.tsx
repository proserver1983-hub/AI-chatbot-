import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "ChatFlow — AI assistants your customers trust",
  description:
    "Create a helpful AI assistant trained on your business knowledge, embed it on your website, and turn conversations into qualified leads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
