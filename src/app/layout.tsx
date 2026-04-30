import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConciergeWidget from "@/components/ConciergeWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yenege.com | Luxury Events & Travel Experiences",
  description: "Yenege digitizes human vibe into high-fidelity event and travel realities. Explore psychological preference mapping and curated adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ConciergeWidget />
      </body>
    </html>
  );
}
