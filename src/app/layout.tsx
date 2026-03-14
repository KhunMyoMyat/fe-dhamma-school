import type { Metadata } from "next";
import { Inter, Padauk } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";

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
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-navy text-cream py-12 border-t-4 border-gold">
              <div className="container mx-auto px-4 text-center">
                <p className="font-myanmar text-xl mb-4 text-gold">သဗ္ဗဒါနံ ဓမ္မဒါနံ ဇိနာတိ</p>
                <div className="h-px w-24 bg-gold/30 mx-auto mb-6" />
                <p className="text-cream/50">&copy; {new Date().getFullYear()} Dhamma School. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
