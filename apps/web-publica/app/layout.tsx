import type { Metadata, Viewport } from "next";
import "./globals.css";
import PrelineScriptWrapper from "./components/PrelineScriptWrapper";

const baseUrl = "https://fascinantedigital.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Fascinante Digital – Free Google Visibility Audit for Small Businesses",
    template: "%s | Fascinante Digital",
  },
  description:
    "Get a free audit and discover how your business appears on Google. Improve your visibility and attract real customers automatically.",
  keywords: [
    "google business profile",
    "local seo",
    "free audit",
    "digital visibility",
    "small business seo",
    "google maps optimization",
    "business visibility",
    "local search optimization",
  ],
  authors: [{ name: "Fascinante Digital Team" }],
  creator: "Fascinante Digital Team",
  publisher: "Fascinante Digital LLC",
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
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Fascinante Digital",
    title: "Fascinante Digital – Free Google Visibility Audit",
    description:
      "Discover how your business appears on Google. Get your free audit today.",
    images: [
      {
        url: `${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`,
        width: 1200,
        height: 630,
        alt: "Fascinante Digital dashboard showing Google visibility metrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fascinante Digital – Google Visibility Audit",
    description: "Make your business visible on Google and attract real customers.",
    images: [`${baseUrl}/assets/img/pro/startup/dashboard-fascinante.webp`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon0.svg', type: 'image/svg+xml' },
      { url: '/icon1.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Fascinante',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Resource Hints: Optimiza carga de app.fascinantedigital.com */}
        <link rel="dns-prefetch" href="https://app.fascinantedigital.com" />
        <link rel="preconnect" href="https://app.fascinantedigital.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
