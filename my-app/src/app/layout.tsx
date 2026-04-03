import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/global.css";
import FigmaLayout from "./components/Layout"; 
import AuthProvider from "./components/AuthProvider";
import { Toaster } from "sonner"; // 1. Import the Toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Endorsement System",
  description: "This is an Endorsement System for our OJT Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <FigmaLayout>
            {children}
          </FigmaLayout>
          {/* 2. Add the Toaster here so it sits on top of your whole app */}
          <Toaster position="top-right" richColors /> 
        </AuthProvider>
      </body>
    </html>
  );
}