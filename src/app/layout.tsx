import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavLayout from "@layouts/l-nav-layout";
import URQLProvider from "@/components/providers/urql";
import JotaiProvider from "@/components/providers/jotai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <JotaiProvider>
        <URQLProvider>
          <body className={`${inter.className} h-screen overflow-y-hidden`}>
            <NavLayout>{children}</NavLayout>
          </body>
        </URQLProvider>
      </JotaiProvider>
    </html>
  );
}
