/**
 * BookingConfirmationDialog Component
 * Modal de confirmación de booking usando Radix UI Dialog
 *
 * Basado en estándares de la industria (Nov 2025):
 * - Radix UI Dialog para accesibilidad y robustez
 * - react-hook-form + zod para validación type-safe
 * - Manejo de errores robusto y escalable
 * - Integración con useToast para feedback
 * - Componentes reutilizables del proyecto
 *
 * Características:
 * - Accesible por defecto (ARIA, focus trap, keyboard navigation)
 * - Validación robusta en cliente y servidor
 * - Manejo de errores completo
 * - Type-safe con TypeScript
 * - Escalable para futuras extensiones
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { Calendar, Clock, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { FormInput, FormButton } from '../../components/forms';
import {
  bookingConfirmationSchema,
  type BookingConfirmationData,
} from '../../lib/validations/booking-schema';
import { useToast } from '../../lib/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BookingConfirmationDialogProps {
  /** Si el dialog está abierto */
  open: boolean;
  /** Callback cuando se cierra el dialog */
  onOpenChange: (open: boolean) => void;
  /** Fecha seleccionada */
  selectedDate: Date;
  /** Hora seleccionada (formato HH:MM) */
  selectedTime: string;
  /** Duración de la reunión en minutos */
  duration?: number;
  /** Locale para internacionalización */
  locale: string;
  /** Callback cuando se confirma el booking */
  onConfirm?: (data: BookingConfirmationData) => Promise<void> | void;
}

/**
 * Componente de modal de confirmación de booking
 *
 * Muestra un formulario para confirmar los datos del usuario
 * antes de completar la reserva.
 */
export default function BookingConfirmationDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  duration = 30,
  locale,
  onConfirm,
}: BookingConfirmationDialogProps) {
  const isSpanish = locale === 'es';
  const toast = useToast('book');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingConfirmationData>({
    resolver: zodResolver(bookingConfirmationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      notes: '',
    },
  });

  // Formatear fecha para mostrar
  const formattedDate = format(selectedDate, "EEEE, d 'de' MMMM, yyyy", {
    locale: isSpanish ? es : enUS,
  });

  // Formatear hora para mostrar
  const [hours, minutes] = selectedTime.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const formattedTime = `${hour12}:${minutes} ${ampm}`;

  const onSubmit = async (data: BookingConfirmationData) => {
    setIsSubmitting(true);

    try {
      // Si hay un callback personalizado, usarlo
      if (onConfirm) {
        await onConfirm(data);
      } else {
        // Por defecto, simular envío (aquí iría la llamada a la API)
        // TODO: Implementar llamada a API real
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Éxito
      toast.success('confirmation.success', {
        description: isSpanish
          ? 'Tu reserva ha sido confirmada. Te enviaremos un email con los detalles.'
          : 'Your booking has been confirmed. We will send you an email with the details.',
      });

      // Cerrar dialog y resetear formulario
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error
      console.error('Error confirming booking:', error);
      toast.error('confirmation.error', {
        description:
          error instanceof Error
            ? error.message
            : isSpanish
              ? 'Error al confirmar la reserva. Por favor, intenta de nuevo.'
              : 'Error confirming booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" preventMobileAutoFocus={true}>
        <DialogHeader>
          <DialogTitle>
            {isSpanish ? 'Confirme sus datos' : 'Confirm your data'}
          </DialogTitle>
          <DialogDescription>
            {isSpanish
              ? 'Por favor, confirma tus datos para completar la reserva.'
              : 'Please confirm your details to complete the booking.'}
          </DialogDescription>
        </DialogHeader>

        {/* Detalles de la reunión */}
        <div className="space-y-2 py-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
            <Calendar className="size-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
            <Clock className="size-4" />
            <span>
              {formattedTime} ({duration}
              {isSpanish ? ' minutos' : ' minutes'})
            </span>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <FormInput
            id="name"
            label={isSpanish ? 'Tu nombre *' : 'Your name *'}
            placeholder={isSpanish ? 'Juan Pérez' : 'John Doe'}
            error={errors.name?.message}
            required
            {...register('name')}
          />

          {/* Email */}
          <FormInput
            id="email"
            type="email"
            label={isSpanish ? 'Correo electrónico *' : 'Email address *'}
            placeholder={
              isSpanish
                ? 'tu@email.com'
                : 'your@email.com'
            }
            error={errors.email?.message}
            required
            {...register('email')}
          />

          {/* Notas adicionales */}
          <div className="w-full">
            <label
              htmlFor="notes"
              className="mb-2.5 block text-sm font-medium text-gray-800 dark:text-neutral-200"
            >
              {isSpanish ? 'Notas adicionales' : 'Additional notes'}
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder={
                isSpanish
                  ? 'Por favor, comparte cualquier información que ayude a prepararnos para nuestra reunión.'
                  : 'Please share any information that helps us prepare for our meeting.'
              }
              className={cn(
                'block w-full rounded-lg border border-gray-200 px-3 py-2 text-base sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                errors.notes && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              aria-invalid={errors.notes ? 'true' : undefined}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Agregar invitados (placeholder para futuro) */}
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          >
            <Users className="size-4" />
            <span>{isSpanish ? 'Agregar invitados' : 'Add guests'}</span>
          </button>

          {/* Términos y condiciones */}
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            {isSpanish ? (
              <>
                Al continuar, aceptas nuestros{' '}
                <Link
                  href="/privacy"
                  className="underline hover:text-gray-700 dark:hover:text-neutral-300"
                >
                  Términos
                </Link>{' '}
                y{' '}
                <Link
                  href="/privacy"
                  className="underline hover:text-gray-700 dark:hover:text-neutral-300"
                >
                  Política de privacidad
                </Link>
                .
              </>
            ) : (
              <>
                By continuing, you accept our{' '}
                <Link
                  href="/privacy"
                  className="underline hover:text-gray-700 dark:hover:text-neutral-300"
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="underline hover:text-gray-700 dark:hover:text-neutral-300"
                >
                  Privacy Policy
                </Link>
                .
              </>
            )}
          </p>

          {/* Botones */}
          <DialogFooter>
            <FormButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {isSpanish ? 'Atrás' : 'Back'}
            </FormButton>
            <FormButton
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText={isSpanish ? 'Confirmando...' : 'Confirming...'}
            >
              {isSpanish ? 'Confirmar' : 'Confirm'}
            </FormButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
