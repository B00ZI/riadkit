import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RiadKit — Digital Platform for Moroccan Riads",
  description: "Transform every stay into an unforgettable experience. The all-in-one platform for Moroccan riads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5]">
        {children}
        <Toaster
          position="bottom-right"
          gap={12}
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #EEE6DD',
              color: '#2B2B2B',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '14px 18px',
              fontFamily: 'var(--font-geist-sans)',
              fontSize: '14px',
            },
            className: 'text-sm',
          }}
          visibleToasts={5}
        />
      </body>
    </html>
  );
}