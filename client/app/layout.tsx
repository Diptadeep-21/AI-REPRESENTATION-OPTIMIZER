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
    "Merchanta AI",

  description:
    "Understand how AI shopping agents perceive and rank your store.",

  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.ico",
  },

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