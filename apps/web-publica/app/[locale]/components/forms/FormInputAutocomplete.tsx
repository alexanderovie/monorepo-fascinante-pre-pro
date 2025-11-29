'use client';

/**
 * FormInputAutocomplete Component
 * Input con autocompletado de Google Places API (New) usando REST API
 *
 * Actualizado: Enero 2025
 * Compatible con: Next.js 15.5.6, React 19, Google Places API (New)
 *
 * IMPORTANTE: Usa la REST API de Places (New) desde el backend
 * Esto evita problemas con Web Components y es más compatible con React
 *
 * Características:
 * - Autocompletado de negocios usando Places API (New) REST
 * - Integración con react-hook-form
 * - Captura place_id al seleccionar
 * - Manejo de errores robusto
 * - Debounce para optimizar requests
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useController, Control, FieldPath, FieldValues } from 'react-hook-form';
import FormInput, { type FormInputProps } from './FormInput';

interface PlacePrediction {
  placeId: string;
  text: {
    text: string;
  };
  structuredFormat: {
    mainText: {
      text: string;
    };
    secondaryText: {
      text: string;
    };
  };
  types: string[];
}

interface AutocompleteResponse {
  suggestions: Array<{
    placePrediction: PlacePrediction;
  }>;
}

export interface FormInputAutocompleteProps<TFieldValues extends FieldValues = FieldValues> extends Omit<FormInputProps, 'onChange' | 'value'> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  onPlaceSelect?: (place: { place_id: string; name: string; address?: string }) => void;
  countryRestriction?: string | string[];
}

/**
 * FormInputAutocomplete - Input con autocompletado de Google Places (Nueva API REST)
 *
 * Usa la REST API de Places (New) desde el backend para evitar problemas con Web Components
 *
 * @example
 * ```tsx
 * <FormInputAutocomplete
 *   control={control}
 *   name="businessName"
 *   label="Nombre del negocio"
 *   placeholder="Escribe el nombre..."
 *   onPlaceSelect={(place) => console.log(place.place_id)}
 * />
 * ```
 */
export default function FormInputAutocomplete<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  onPlaceSelect,
  countryRestriction,
  ...inputProps
}: FormInputAutocompleteProps<TFieldValues>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  // Función para buscar sugerencias
  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (!input || input.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/places/autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input,
            includedRegionCodes: countryRestriction
              ? Array.isArray(countryRestriction)
                ? countryRestriction
                : [countryRestriction]
              : undefined,
            includedPrimaryTypes: ['establishment'], // Solo negocios
          }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener sugerencias');
        }

        const data: AutocompleteResponse = await response.json();
        const predictions = data.suggestions?.map((s) => s.placePrediction) || [];

        setSuggestions(predictions);
        setShowSuggestions(predictions.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('[FormInputAutocomplete] Error obteniendo sugerencias:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    },
    [countryRestriction]
  );

  // Debounce para optimizar requests
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      field.onChange(value);

      // Limpiar timer anterior
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Nuevo timer con debounce de 300ms
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    },
    [field, fetchSuggestions]
  );

  // Manejar selección de sugerencia
  const handleSelectSuggestion = useCallback(
    (prediction: PlacePrediction) => {
      const placeName = prediction.structuredFormat.mainText.text;
      field.onChange(placeName);
      setShowSuggestions(false);
      setSuggestions([]);

      // Llamar callback con place_id
      if (onPlaceSelect) {
        onPlaceSelect({
          place_id: prediction.placeId,
          name: placeName,
          address: prediction.structuredFormat.secondaryText.text,
        });
      }
    },
    [field, onPlaceSelect]
  );

  // Manejar teclado (flechas arriba/abajo, Enter, Escape)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelectSuggestion(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSelectSuggestion]
  );

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <FormInput
        {...inputProps}
        id={inputProps.id || name}
        label={label}
        error={error?.message}
        value={field.value}
        onChange={handleInputChange}
        onBlur={field.onBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        autoComplete="off"
      />

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute right-3 top-[2.75rem] text-gray-400">
          <svg
            className="h-4 w-4 animate-spin"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Lista de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        >
          <ul className="max-h-60 overflow-auto py-1">
            {suggestions.map((prediction, index) => (
              <li
                key={prediction.placeId}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  index === selectedIndex ? 'bg-gray-100 dark:bg-neutral-700' : ''
                }`}
                onClick={() => handleSelectSuggestion(prediction)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium text-gray-900 dark:text-neutral-200">
                  {prediction.structuredFormat.mainText.text}
                </div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">
                  {prediction.structuredFormat.secondaryText.text}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indicador de estado (opcional, para debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-1 text-xs text-gray-400">
          {suggestions.length > 0 ? `✅ ${suggestions.length} sugerencias` : '⏳ Escribe para buscar...'}
        </div>
      )}
    </div>
  );
}
