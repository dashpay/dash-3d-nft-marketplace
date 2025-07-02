import type { Metadata } from "next";
import "./globals.css";
import LogView from '@/components/LogView';

export const metadata: Metadata = {
  title: "Dash 3D NFT Marketplace",
  description: "A decentralized 3D NFT marketplace powered by Dash Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <div className="transition-all duration-300">
          {children}
        </div>
        <LogView />
      </body>
    </html>
  );
}