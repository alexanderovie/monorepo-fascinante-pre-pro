'use client';

/**
 * Componente condicional para CrispChat
 *
 * Solo muestra CrispChat cuando NO estamos en la página de auditoría.
 * En la página de auditoría se usará el chatbot AI SDK en su lugar.
 *
 * @module components/crisp/ConditionalCrispChat
 */

import { usePathname } from 'next/navigation';
import CrispChat from './CrispChat';

interface ConditionalCrispChatProps {
  locale: string;
  hideOnMobile?: boolean;
}

/**
 * Componente que muestra CrispChat condicionalmente
 *
 * @param props - Propiedades del componente
 * @returns CrispChat si no estamos en /audit, null en caso contrario
 */
export default function ConditionalCrispChat({
  locale,
  hideOnMobile = false,
}: ConditionalCrispChatProps) {
  const pathname = usePathname();

  // Ocultar CrispChat en la página de auditoría
  // La ruta puede ser /audit o /es/audit o /en/audit
  const isAuditPage = pathname?.includes('/audit') && !pathname?.includes('/audit/results');

  if (isAuditPage) {
    return null;
  }

  return (
    <CrispChat
      locale={locale}
      hideOnMobile={hideOnMobile}
    />
  );
}
