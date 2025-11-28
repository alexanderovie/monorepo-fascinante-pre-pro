/**
 * FormContainer Component
 * Container reutilizable para formularios con layouts configurables
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, React 19, Tailwind CSS 4
 *
 * Layouts disponibles:
 * - centered: Formulario centrado (para Audit)
 * - two-column: Dos columnas con beneficios (para Contact)
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

export type FormLayout = 'centered' | 'two-column';

export interface FormContainerProps {
  children: React.ReactNode;
  layout?: FormLayout;
  className?: string;
  formClassName?: string;
  showGradients?: boolean;
}

const baseContainerClasses =
  'container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-[480px]:px-0 max-[480px]:max-w-full max-[480px]:w-full';

const baseFormWrapperClasses =
  'relative flex w-full min-w-[20rem] max-w-[30rem] flex-col items-center overflow-visible md:min-w-[24rem] max-[480px]:max-w-none max-[480px]:min-w-0 max-[480px]:w-full';

const formContainerClasses =
  'w-full space-y-6 rounded-xl border border-gray-200 bg-white px-6 py-10 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 max-[480px]:border-0 max-[480px]:rounded-none max-[480px]:px-4 max-[480px]:w-full';

// Variante compacta para formularios simples (1-2 campos)
const formContainerCompactClasses =
  'w-full space-y-5 rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 max-[480px]:border-0 max-[480px]:rounded-none max-[480px]:px-4 max-[480px]:w-full';

/**
 * FormContainer - Container reutilizable para formularios
 *
 * @example
 * ```tsx
 * // Layout centered (Audit)
 * <FormContainer layout="centered">
 *   <form>...</form>
 * </FormContainer>
 *
 * // Layout two-column (Contact)
 * <FormContainer layout="two-column">
 *   <Benefits />
 *   <form>...</form>
 * </FormContainer>
 * ```
 */
export default function FormContainer({
  children,
  layout = 'centered',
  className,
  formClassName,
  showGradients = true,
}: FormContainerProps) {
  return (
    <>
      {/* Background gradients */}
      {showGradients && (
        <>
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,rgba(37,99,235,0.1)_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,rgba(37,99,235,0.1)_0%,transparent_100%)]"></div>
          <div className="pointer-events-none absolute inset-x-0 -bottom-20 -top-20 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,rgba(37,99,235,0.08)_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,rgba(37,99,235,0.08)_0%,transparent_80%)]"></div>
        </>
      )}

      <div className={cn(baseContainerClasses, className)}>
        {layout === 'centered' ? (
          <div className="flex w-full justify-center">
            <div className={baseFormWrapperClasses}>
              <div className={cn('z-10 w-full max-[480px]:w-full', formClassName)}>
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-x-8 lg:grid-cols-2 lg:gap-x-16 max-[480px]:gap-0">
            {children}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * FormWrapper - Wrapper para el formulario en layout two-column
 */
export function FormWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex w-full justify-center lg:mt-2.5 max-[480px]:col-span-1 max-[480px]:w-full order-2 md:order-1 lg:order-2', className)}>
      <div className={baseFormWrapperClasses}>
        <div className={cn('z-10 w-full space-y-6 max-[480px]:w-full')}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * FormCard - Card contenedor del formulario
 *
 * @param variant - 'default' para formularios normales, 'compact' para formularios simples (1-2 campos)
 */
export function FormCard({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}) {
  const baseClasses = variant === 'compact' ? formContainerCompactClasses : formContainerClasses;

  return (
    <div className={cn(baseClasses, className)}>
      {children}
    </div>
  );
}
