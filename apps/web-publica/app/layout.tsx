import type { Metadata } from "next";
import "./globals.css";
import PrelineScriptWrapper from "./components/PrelineScriptWrapper";

export const metadata: Metadata = {
  title: "Fascinante Digital",
  description: "Fascinante Digital - Web Pública",
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
