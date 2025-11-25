import type { Metadata } from "next";
import "./globals.css";
import PrelineScriptWrapper from './components/PrelineScriptWrapper';
import ThemeScript from './components/ThemeScript';

export const metadata: Metadata = {
  title: "Startup | Preline Pro | Preline UI, crafted with Tailwind CSS",
  description: "A sleek marketing template for startups, featuring modern design, conversion-focused sections, and seamless user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative min-h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="dark:bg-neutral-900">
        <ThemeScript />
        {children}
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
