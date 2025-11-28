/**
 * FormButton Component
 * Botón reutilizable para formularios
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, React 19, Tailwind CSS 4
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

export interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const baseButtonClasses =
  'inline-flex items-center justify-center gap-x-2 rounded-lg border px-4 py-2.5 text-sm font-semibold focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 transition-colors';

const variantClasses = {
  primary:
    'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600',
  secondary:
    'border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:bg-gray-700 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600',
  outline:
    'border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
};

/**
 * FormButton - Botón reutilizable para formularios
 *
 * @example
 * ```tsx
 * <FormButton type="submit" variant="primary" isLoading={isSubmitting}>
 *   Enviar
 * </FormButton>
 * ```
 */
export default function FormButton({
  variant = 'primary',
  isLoading = false,
  loadingText,
  children,
  className,
  disabled,
  ...buttonProps
}: FormButtonProps) {
  return (
    <button
      className={cn(
        baseButtonClasses,
        variantClasses[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
