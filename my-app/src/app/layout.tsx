import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/global.css";
// Import the updated Figma layout component
import FigmaLayout from "./components/Layout"; 

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
  description: "This is a Endorsement System for our OJT Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Wrap the children with the Figma layout */}
        <FigmaLayout>
          {children}
        </FigmaLayout>
      </body>
    </html>
  );
}