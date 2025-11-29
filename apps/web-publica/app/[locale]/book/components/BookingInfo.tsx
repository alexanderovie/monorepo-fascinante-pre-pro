/**
 * BookingInfo Component
 *
 * Componente para la columna izquierda que muestra información del servicio.
 * Replicando el estilo de Cal.com con duración, link de reunión, timezone, etc.
 */

'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Clock, Globe } from 'lucide-react';

interface BookingInfoProps {
  locale: string;
  /** Duración de la cita en minutos */
  duration?: number;
  /** Tipo de reunión */
  meetingType?: string;
  /** Link de la reunión (Google Meet, Zoom, etc.) */
  meetingLink?: string;
  /** Timezone del profesional */
  timezone?: string;
  /** Descripción del servicio */
  description?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente de información del servicio para booking
 *
 * Muestra:
 * - Tipo y duración de la reunión
 * - Link de la reunión (Google Meet, Zoom)
 * - Timezone
 * - Descripción opcional
 */
export const BookingInfo = memo(function BookingInfo({
  locale,
  duration = 30,
  meetingType,
  meetingLink,
  timezone = 'America/New_York',
  description,
  className,
}: BookingInfoProps) {
  const isSpanish = locale === 'es';

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Título del servicio */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {meetingType ||
            (isSpanish
              ? 'Reunión de consultoría'
              : 'Consultation Meeting')}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>

      {/* Duración */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="size-4 text-gray-500 dark:text-neutral-400" />
        <span className="text-sm text-gray-700 dark:text-neutral-300">
          {isSpanish ? `${duration} minutos` : `${duration} minutes`}
        </span>
      </div>

      {/* Link de reunión */}
      {meetingLink && (
        <div className="mb-4">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="size-4" />
            <span>
              {isSpanish ? 'Ver link de Google Meet' : 'View Google Meet link'}
            </span>
          </a>
        </div>
      )}

      {/* Timezone */}
      <div className="flex items-start gap-2 mt-auto">
        <Globe className="size-4 text-gray-500 dark:text-neutral-400 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-gray-700 dark:text-neutral-300">
            {isSpanish ? 'Zona horaria' : 'Timezone'}
          </p>
          <p className="text-xs text-gray-600 dark:text-neutral-400">
            {timezone}
          </p>
        </div>
      </div>
    </div>
  );
});

BookingInfo.displayName = 'BookingInfo';
