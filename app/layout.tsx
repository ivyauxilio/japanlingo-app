import type { Metadata } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from './context/AuthContext'
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JapanLingo V1 | Free Space Repetition App",
  description: "For Free Space Repetition App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* <AuthContextProvider> */}
              <Header />
              <main className="flex-grow container mx-auto p-4">
              <Toaster position="top-right" richColors />
              {children}</main>
              <Footer />
            {/* </AuthContextProvider> */}
          </div>
         </Providers>
      </body>
    </html>
  );
}
