import type { Metadata } from "next";
import { Inter, Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/Provider";
import { contructMetadata } from "@/lib/utils";

const rescu = Recursive({ subsets: ["latin"] });

export const metadata = contructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rescu.className}>

        <Navbar />
        <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)] grainy-light">
          <div className="flex-1 flex flex-col h-full">
            <Provider>
              {children}
            </Provider>
          </div>
          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
