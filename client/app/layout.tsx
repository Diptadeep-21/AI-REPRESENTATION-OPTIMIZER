import "./globals.css";

import type { Metadata } from "next";

import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "AI Representation Optimizer",
  description:
    "Understand how AI shopping agents perceive and rank your store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}