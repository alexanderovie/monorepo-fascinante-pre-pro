/**
 * FormInput Component
 * Input reutilizable con estilos consistentes
 *
 * Actualizado: Noviembre 2025
 * Compatible con: Next.js 15.5.6, React 19, Tailwind CSS 4
 *
 * Mejores Prácticas:
 * - Componente reutilizable con estilos base
 * - Type-safe con TypeScript
 * - Soporte para todas las props nativas de input
 * - Accesible (labels asociados)
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  className?: string;
  error?: string;
  helperText?: string;
}

const baseInputClasses =
  'block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600';

const baseLabelClasses =
  'mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200';

/**
 * FormInput - Input reutilizable con estilos consistentes
 *
 * @example
 * ```tsx
 * <FormInput
 *   id="email"
 *   name="email"
 *   type="email"
 *   label="Email"
 *   placeholder="nombre@empresa.com"
 *   required
 * />
 * ```
 *
 * FUTURE EXTENSION: Para autocompletado con Google Places API
 * -----------------------------------------------------------
 * Crear FormInputAutocomplete que:
 * 1. Use useController de react-hook-form para integración
 * 2. Envuelva este FormInput internamente
 * 3. Integre PlaceAutocompleteElement de Google Maps JavaScript API (Nueva API 2024-2025)
 * 4. Maneje session tokens para optimizar costo
 * 5. Ejemplo de estructura futura:
 *
 * ```tsx
 * // FormInputAutocomplete.tsx (futuro)
 * import { useController } from 'react-hook-form';
 * import FormInput from './FormInput';
 *
 * export function FormInputAutocomplete({ control, name, ...props }) {
 *   const { field, fieldState } = useController({ control, name });
 *   // Integrar PlaceAutocompleteElement con FormInput base
 *   return <FormInput {...props} {...field} error={fieldState.error?.message} />;
 * }
 * ```
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      labelClassName,
      containerClassName,
      className,
      error,
      helperText,
      id,
      ...inputProps
    },
    ref
  ) => {
    const inputId = id || inputProps.name;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className={cn(baseLabelClasses, labelClassName)}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseInputClasses, error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || helperText ? `${inputId}-help` : undefined}
          {...inputProps}
        />
        {(error || helperText) && (
          <p
            id={`${inputId}-help`}
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

FormInput.displayName = 'FormInput';

export default FormInput;
