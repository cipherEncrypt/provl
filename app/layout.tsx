import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Provl",
  description: "Web tasks with proof",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}