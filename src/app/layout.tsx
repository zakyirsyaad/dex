import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/config/Web3Provider";
import Menu from "@/components/layout/home/Menu";
import CardBalance from "@/components/CardBalance";
import { Toaster } from "sonner";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jeky Dex dApps",
  description: "Dex dApps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased `}>
        <Web3Provider>
          <div className="max-w-md mx-auto py-5 px-5 sm:px-0 space-y-5">
            <CardBalance />
            <Menu />
          </div>
          {children}
        </Web3Provider>
        <Toaster />
      </body>
    </html>
  );
}
