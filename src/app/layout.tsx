import type { Metadata } from "next";
import { Inter, Padauk } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const padauk = Padauk({
  variable: "--font-myanmar",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhamma School - ဓမ္မစာသင်ကျောင်း",
  description: "Learn Buddhist teachings and meditation in Myanmar style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${padauk.variable} antialiased selection:bg-gold selection:text-white`}>
        <LanguageProvider>
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="grow">
                {children}
              </main>
              <Footer />
            </div>
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
