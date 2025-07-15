import type { Metadata } from "next";
import "./globals.css";
import LogView from '@/components/LogView';
import ClientOnly from '@/components/ClientOnly';

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased relative" suppressHydrationWarning>
        <div className="transition-all duration-300" suppressHydrationWarning>
          {children}
        </div>
        <ClientOnly>
          <LogView />
        </ClientOnly>
      </body>
    </html>
  );
}