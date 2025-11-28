/**
 * Appointments Calendar Component
 *
 * Componente cliente que muestra el calendario de citas usando FullCalendar.
 * Reutiliza componentes UI existentes (Card) para mantener consistencia.
 */

'use client';

import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { EventInput } from '@fullcalendar/core';

interface AppointmentsCalendarProps {
  userId: string;
}

/**
 * Componente de calendario de citas
 *
 * TODO: Conectar con Supabase para cargar citas reales
 * TODO: Implementar creación/edición de citas
 * TODO: Implementar drag & drop para reagendar
 */
export default function AppointmentsCalendar({ userId }: AppointmentsCalendarProps) {
  // Datos de ejemplo - TODO: Reemplazar con datos reales de Supabase
  const events: EventInput[] = useMemo(() => [
    {
      id: '1',
      title: 'Consulta - Juan Pérez',
      start: new Date(),
      end: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
    },
  ], []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
            }}
            // Estilos para dark mode
            themeSystem="standard"
            eventClick={(info) => {
              // TODO: Abrir modal con detalles de la cita
              console.log('Event clicked:', info.event);
            }}
            select={(info) => {
              // TODO: Abrir modal para crear nueva cita
              console.log('Date selected:', info);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
