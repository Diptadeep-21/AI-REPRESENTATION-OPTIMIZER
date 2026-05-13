import "./globals.css";

export const metadata = {
  title: "AI Representation Optimizer",
  description: "Understand how AI shopping agents perceive your store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}