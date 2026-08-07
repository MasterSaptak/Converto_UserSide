import type { Metadata, Viewport } from "next";
import { Oswald, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Converto",
  description: "Global Financial, Payment, Shopping, and Booking Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Converto",
  },
  openGraph: {
    title: "Converto",
    description: "Global Financial, Payment, Shopping, and Booking Platform",
    url: "https://converto.saptech.online",
    siteName: "Converto",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 1024,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Converto",
    description: "Global Financial, Payment, Shopping, and Booking Platform",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F7F4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-mono antialiased", spaceMono.variable, oswald.variable)} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/Logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
        </QueryProvider>
        <Toaster position="top-center" toastOptions={{ className: 'font-mono rounded-none border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]' }} />
      </body>
    </html>
  );
}
