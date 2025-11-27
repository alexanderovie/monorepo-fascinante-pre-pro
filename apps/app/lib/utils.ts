import type { Metadata } from "next";

/**
 * Combina clases de Tailwind CSS de forma segura
 * Versión simplificada sin dependencias externas
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Genera metadata para páginas de Next.js
 */
export function generateMeta({
  title,
  description,
  canonical,
}: {
  title: string;
  description: string;
  canonical?: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
