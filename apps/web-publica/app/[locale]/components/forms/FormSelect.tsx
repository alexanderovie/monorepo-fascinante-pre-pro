/**
 * FormSelect Component
 * Select reutilizable con estilos consistentes
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

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string | React.ReactNode;
  options: FormSelectOption[];
  labelClassName?: string;
  containerClassName?: string;
  className?: string;
  error?: string;
  helperText?: string;
}

const baseSelectClasses =
  'block w-full rounded-lg border border-gray-200 px-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-600';

const baseLabelClasses =
  'mb-2.5 text-sm font-medium text-gray-800 dark:text-neutral-200';

/**
 * FormSelect - Select reutilizable con estilos consistentes
 *
 * @example
 * ```tsx
 * <FormSelect
 *   id="country"
 *   name="country"
 *   label="País"
 *   options={[
 *     { value: 'us', label: 'Estados Unidos' },
 *     { value: 've', label: 'Venezuela' },
 *   ]}
 *   required
 * />
 * ```
 */
export default function FormSelect({
  label,
  options,
  labelClassName,
  containerClassName,
  className,
  error,
  helperText,
  id,
  ...selectProps
}: FormSelectProps) {
  const selectId = id || selectProps.name;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className={cn(baseLabelClasses, labelClassName)}>
          {typeof label === 'string' ? label : label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(baseSelectClasses, error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || helperText ? `${selectId}-help` : undefined}
        {...selectProps}
      >
        {options.map((option, index) => (
          <option
            key={option.value || `option-${index}`}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p
          id={`${selectId}-help`}
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
