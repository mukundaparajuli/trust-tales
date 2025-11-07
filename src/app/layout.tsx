import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/contexts/Auth-Provider";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "WhisperLink",
  description: "Send and receive anonymous messages effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
          <Analytics />
        </body>
      </AuthProvider>
    </html>
  );
}
