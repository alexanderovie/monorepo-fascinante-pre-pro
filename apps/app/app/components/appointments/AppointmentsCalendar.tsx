/**
 * Appointments Calendar Component
 *
 * Componente cliente que muestra el calendario de citas usando FullCalendar.
 * Reutiliza componentes UI existentes (Card) para mantener consistencia.
 * Integrado con CreateAppointmentOffcanvas para crear/editar citas.
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import CreateAppointmentOffcanvas, { type AppointmentFormData } from './CreateAppointmentOffcanvas';

interface AppointmentsCalendarProps {
  userId: string;
}

/**
 * Componente de calendario de citas
 *
 * TODO: Conectar con Supabase para cargar citas reales
 * TODO: Implementar guardado de citas en Supabase
 * TODO: Implementar drag & drop para reagendar
 */
export default function AppointmentsCalendar({ userId }: AppointmentsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

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

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
    setSelectedEventId(null);
    setIsOffcanvasOpen(true);
    selectInfo.view.calendar.unselect(); // Limpiar selección visual
  }, []);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    setSelectedDate(clickInfo.event.start || null);
    setSelectedEventId(clickInfo.event.id);
    setIsOffcanvasOpen(true);
  }, []);

  const handleCloseOffcanvas = useCallback(() => {
    setIsOffcanvasOpen(false);
    setSelectedDate(null);
    setSelectedEventId(null);
  }, []);

  const handleSaveAppointment = useCallback((data: AppointmentFormData) => {
    // TODO: Implementar guardado en Supabase
    console.log('Saving appointment:', data);
    // Aquí iría la lógica para guardar en Supabase
  }, []);

  return (
    <>
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
              eventClick={handleEventClick}
              select={handleDateSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Appointment Offcanvas */}
      <CreateAppointmentOffcanvas
        selectedDate={isOffcanvasOpen ? selectedDate : null}
        selectedEventId={isOffcanvasOpen ? selectedEventId : null}
        onClose={handleCloseOffcanvas}
        onSave={handleSaveAppointment}
      />
    </>
  );
}
