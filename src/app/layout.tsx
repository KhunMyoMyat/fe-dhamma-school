import type { Metadata } from "next";
import { Inter, Padauk } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from 'react-hot-toast';

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
      <body suppressHydrationWarning className={`${inter.variable} ${padauk.variable} antialiased selection:bg-gold selection:text-white`}>
        <LanguageProvider>
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#1e293b',
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  boxShadow: '0 10px 25px -5px rgba(121, 26, 26, 0.1), 0 8px 10px -6px rgba(121, 26, 26, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  fontFamily: 'var(--font-sans)',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
