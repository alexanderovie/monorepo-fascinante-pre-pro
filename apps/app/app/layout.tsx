import type { Metadata } from "next";
import "./globals.css";
import PrelineScriptWrapper from "./components/PrelineScriptWrapper";

export const metadata: Metadata = {
  title: "Dashboard - Fascinante Digital",
  description: "Dashboard de Fascinante Digital",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
      <PrelineScriptWrapper />
    </html>
  );
}
