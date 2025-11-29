/**
 * FormTextarea Component
 * Textarea reutilizable con estilos consistentes
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, React 19, Tailwind CSS 4
 *
 * Mejores Prácticas:
 * - Componente reutilizable con estilos base
 * - Type-safe con TypeScript
 * - Soporte para todas las props nativas de textarea
 * - Accesible (labels asociados)
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  className?: string;
  error?: string;
  helperText?: string;
}

const baseTextareaClasses =
  'block w-full rounded-lg border border-gray-200 px-4 py-2.5 sm:py-3 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600';

const baseLabelClasses =
  'mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200';

/**
 * FormTextarea - Textarea reutilizable con estilos consistentes
 *
 * @example
 * ```tsx
 * <FormTextarea
 *   id="message"
 *   name="message"
 *   label="Mensaje"
 *   placeholder="Escribe tu mensaje aquí..."
 *   rows={4}
 *   required
 * />
 * ```
 */
const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      labelClassName,
      containerClassName,
      className,
      error,
      helperText,
      id,
      ...textareaProps
    },
    ref
  ) => {
    const textareaId = id || textareaProps.name;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className={cn(baseLabelClasses, labelClassName)}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            baseTextareaClasses,
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || helperText ? `${textareaId}-help` : undefined}
          aria-required={textareaProps.required ? 'true' : undefined}
          {...textareaProps}
        />
        {(error || helperText) && (
          <p
            id={`${textareaId}-help`}
            className={cn(
              'mt-1 text-xs',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-neutral-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
