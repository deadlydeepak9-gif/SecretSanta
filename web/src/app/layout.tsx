import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Secret Santa Generator',
    default: 'Secret Santa Generator - Free, Secure & Fun',
  },
  description: "The easiest way to organize your Secret Santa gift exchange. Create a group, share the link, and let the magic happen. Free, secure, and no sign-up required.",
  keywords: ["secret santa", "gift exchange", "christmas", "holiday", "random name picker", "free secret santa generator"],
  authors: [{ name: "Secret Santa App" }],
  openGraph: {
    title: 'Secret Santa Generator',
    description: 'The easiest way to organize your Secret Santa gift exchange. Free, secure, and instant.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Secret Santa Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secret Santa Generator',
    description: 'The easiest way to organize your Secret Santa gift exchange.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
