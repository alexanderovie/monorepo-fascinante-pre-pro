import type { Metadata } from "next";
import "./globals.css";
import PrelineScriptWrapper from "./components/PrelineScriptWrapper";

export const metadata: Metadata = {
  title: "Dashboard - Fascinante Digital",
  description: "Dashboard de Fascinante Digital",
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
