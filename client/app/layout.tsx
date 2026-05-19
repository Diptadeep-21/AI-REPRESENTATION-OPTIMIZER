import "./globals.css";

import type {
  Metadata,
} from "next";

import QueryProvider
from "@/providers/QueryProvider";

import {
  AuthProvider,
}
from "@/providers/AuthProvider";

export const metadata: Metadata = {

  title:
    "AI Representation Optimizer",

  description:
    "Understand how AI shopping agents perceive and rank your store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      className="dark"
    >

      <body>

        <QueryProvider>

          <AuthProvider>

            {children}

          </AuthProvider>

        </QueryProvider>

      </body>

    </html>
  );
}