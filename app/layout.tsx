import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export const metadata: Metadata = {
  title: "Provl: Get proof it was actually done",
  description:
    "Tell Provl a web task in plain English. It runs in a real browser and returns a verdict you can replay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-paper font-sans">{children}</body>
    </html>
  );
}