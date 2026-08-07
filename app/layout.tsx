import type { Metadata, Viewport } from "next";
import { Oswald, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { UnregisterSW } from "@/components/layout/UnregisterSW";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-heading" });

const SITE_URL = "https://converto.saptech.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Converto — International Payments, Shopping, Buy For Me, Education & Medical Services",
    template: "%s | Converto",
  },
  description: "Send money internationally, shop globally with Buy For Me, pay university tuition, book medical tourism, exchange currencies, and discover credit card offers — all through Converto.",
  keywords: [
    "international payment", "cross border payment", "send money abroad", "money transfer",
    "remittance", "send money to Bangladesh", "send money to India",
    "Bangladesh to India money transfer", "India to Bangladesh remittance",
    "currency exchange", "forex", "exchange rate", "USD to BDT", "USD to INR",
    "buy for me", "shopping concierge", "proxy shopping", "personal shopper India",
    "Amazon offers", "Flipkart offers", "credit card offers", "bank card offers",
    "Amazon Pay ICICI", "Flipkart Axis", "SBI Cashback", "HDFC Millennia",
    "education payment", "tuition payment", "study abroad", "university fees",
    "medical tourism", "hospital booking India", "medical visa",
    "flight booking", "hotel booking", "visa assistance", "travel services",
    "PayPal", "Wise", "Remitly", "bKash", "Nagad",
    "Converto", "global payments", "international financial services",
  ],
  applicationName: "Converto",
  category: "Finance",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Converto",
  },
  openGraph: {
    title: "Converto — International Payments, Shopping & Financial Services",
    description: "Send money globally, shop with Buy For Me, pay tuition abroad, book medical tourism, and exchange currencies at the best rates. Trusted by thousands worldwide.",
    url: SITE_URL,
    siteName: "Converto",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Converto — International Payments, Shopping & Financial Services",
    description: "Send money globally, shop with Buy For Me, pay tuition abroad, book medical tourism, and exchange currencies at the best rates.",
    creator: "@converto",
  },
  alternates: {
    canonical: SITE_URL,
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
  const orgSchema = {
    type: 'Organization' as const,
    name: 'Converto',
    url: SITE_URL,
    logo: `${SITE_URL}/Logo.png`,
    sameAs: []
  };

  const webSchema = {
    type: 'WebSite' as const,
    name: 'Converto',
    url: SITE_URL,
  };

  return (
    <html lang="en" className={cn("font-mono antialiased", spaceMono.variable, oswald.variable)} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/Logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        <UnregisterSW />
        <JsonLd data={[orgSchema, webSchema]} />
        <QueryProvider>
          <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
        </QueryProvider>
        <Toaster position="top-center" toastOptions={{ className: 'font-mono rounded-none border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]' }} />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
