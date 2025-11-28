'use client';

/**
 * Create Appointment Offcanvas Component
 *
 * Offcanvas lateral estilo Preline UI para crear/editar citas.
 * Se abre desde el calendario cuando se hace clic en un evento o se selecciona una fecha.
 */

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CreateAppointmentOffcanvasProps {
  selectedDate?: Date | null;
  selectedEventId?: string | null;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => void;
}

export interface AppointmentFormData {
  title: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  timezone: string;
  location: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

const TIME_SLOTS = [
  '12:00AM', '12:15AM', '12:30AM', '12:45AM',
  '1:00AM', '1:15AM', '1:30AM', '1:45AM',
  '2:00AM', '2:15AM', '2:30AM', '2:45AM',
  '3:00AM', '3:15AM', '3:30AM', '3:45AM',
  '4:00AM', '4:15AM', '4:30AM', '4:45AM',
  '5:00AM', '5:15AM', '5:30AM', '5:45AM',
  '6:00AM', '6:15AM', '6:30AM', '6:45AM',
  '7:00AM', '7:15AM', '7:30AM', '7:45AM',
  '8:00AM', '8:15AM', '8:30AM', '8:45AM',
  '9:00AM', '9:15AM', '9:30AM', '9:45AM',
  '10:00AM', '10:15AM', '10:30AM', '10:45AM',
  '11:00AM', '11:15AM', '11:30AM', '11:45AM',
  '12:00PM', '12:15PM', '12:30PM', '12:45PM',
  '1:00PM', '1:15PM', '1:30PM', '1:45PM',
  '2:00PM', '2:15PM', '2:30PM', '2:45PM',
  '3:00PM', '3:15PM', '3:30PM', '3:45PM',
  '4:00PM', '4:15PM', '4:30PM', '4:45PM',
  '5:00PM', '5:15PM', '5:30PM', '5:45PM',
  '6:00PM', '6:15PM', '6:30PM', '6:45PM',
  '7:00PM', '7:15PM', '7:30PM', '7:45PM',
  '8:00PM', '8:15PM', '8:30PM', '8:45PM',
  '9:00PM', '9:15PM', '9:30PM', '9:45PM',
  '10:00PM', '10:15PM', '10:30PM', '10:45PM',
  '11:00PM', '11:15PM', '11:30PM', '11:45PM',
];

export default function CreateAppointmentOffcanvas({
  selectedDate,
  selectedEventId,
  onClose,
  onSave,
}: CreateAppointmentOffcanvasProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    startTime: '10:00AM',
    endTime: '10:30AM',
    startDate: selectedDate ? format(selectedDate, 'EEE, MMM dd yyyy', { locale: es }) : format(new Date(), 'EEE, MMM dd yyyy', { locale: es }),
    endDate: selectedDate ? format(selectedDate, 'EEE, MMM dd yyyy', { locale: es }) : format(new Date(), 'EEE, MMM dd yyyy', { locale: es }),
    allDay: false,
    timezone: 'America/New_York',
    location: '',
    description: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        startDate: format(selectedDate, 'EEE, MMM dd yyyy', { locale: es }),
        endDate: format(selectedDate, 'EEE, MMM dd yyyy', { locale: es }),
      }));
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isOpen = selectedDate !== null || selectedEventId !== null;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-70 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Offcanvas */}
      <div
        id="hs-pro-cceo"
        className="hs-overlay hs-overlay-open:translate-x-0 translate-x-0 fixed top-0 end-0 transition-all duration-300 transform size-full sm:w-100 z-80 flex flex-col bg-white border-s dark:bg-neutral-800 dark:border-neutral-700"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-pro-cceo-label"
      >
      {/* Header */}
      <div className="py-2.5 px-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
        <h3 id="hs-pro-cceo-label" className="font-medium text-gray-800 dark:text-neutral-200">
          {selectedEventId ? 'Edit event' : 'Create event'}
        </h3>
        <button
          type="button"
          className="size-8 shrink-0 flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      {/* End Header */}

      {/* Body */}
      <div
        id="hs-modal-create-event"
        className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-3">
            {/* Event List */}
            <div className="grid grid-cols-12 gap-2">
              {/* Title */}
              <div className="col-span-1">
                <label
                  htmlFor="hs-create-event-title-autoheight-textarea"
                  className="mt-[11px] flex justify-center items-center gap-x-1 text-[13px] text-gray-400 dark:text-neutral-500"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" x2="15" y1="20" y2="20" />
                    <line x1="12" x2="12" y1="4" y2="20" />
                  </svg>
                  <span className="sr-only">Title</span>
                </label>
              </div>
              <div className="col-span-11">
                <textarea
                  id="hs-create-event-title-autoheight-textarea"
                  className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] hover:border-gray-200 placeholder:text-gray-400 resize-none disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                  rows={1}
                  placeholder="Add title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              {/* End Title */}

              {/* Date & Time */}
              <div className="col-span-1">
                <label className="mt-[9px] flex justify-center items-center gap-x-1 text-[13px] text-gray-400 dark:text-neutral-500">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="sr-only">Date & Time:</span>
                </label>
              </div>
              <div className="col-span-11">
                <div className="space-y-1">
                  {/* Time Grid */}
                  <div className="flex sm:grid sm:grid-cols-7 items-center gap-1 sm:gap-2">
                    <div className="w-full sm:col-span-3">
                      <select
                        className="py-1 sm:py-1.5 ps-2 pe-7 w-full flex gap-x-2 text-nowrap text-gray-800 cursor-pointer bg-white border border-transparent rounded-md text-start sm:text-[13px] hover:border-gray-200 hover:focus:border-transparent focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:focus:outline-hidden dark:focus:bg-neutral-700"
                        value={formData.startTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                        disabled={formData.allDay}
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <svg
                        className="shrink-0 size-3 mx-auto text-gray-400 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>

                    <div className="w-full sm:col-span-3">
                      <select
                        className="py-1 sm:py-1.5 ps-2 pe-7 w-full flex gap-x-2 text-nowrap text-gray-800 cursor-pointer bg-white border border-transparent rounded-md text-start sm:text-[13px] hover:border-gray-200 hover:focus:border-transparent focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:focus:outline-hidden dark:focus:bg-neutral-700"
                        value={formData.endTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                        disabled={formData.allDay}
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* End Time Grid */}

                  {/* Date Grid */}
                  <div className="flex sm:grid sm:grid-cols-7 items-center gap-1 sm:gap-2">
                    <div className="w-full sm:col-span-3">
                      <input
                        type="text"
                        className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] text-gray-800 hover:border-gray-200 placeholder:text-gray-400 disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                        value={formData.startDate}
                        readOnly
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <svg
                        className="shrink-0 size-3 mx-auto text-gray-400 dark:text-neutral-600"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>

                    <div className="w-full sm:col-span-3">
                      <input
                        type="text"
                        className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] text-gray-800 hover:border-gray-200 placeholder:text-gray-400 disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                        value={formData.endDate}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* End Date Grid */}

                  {/* All-Day Switch */}
                  <div className="flex sm:grid sm:grid-cols-7 items-center gap-1 sm:gap-2">
                    <div className="w-full sm:col-span-3">
                      <div className="flex items-center gap-x-2 ms-2.5">
                        <label htmlFor="hs-pro-crcemad" className="flex items-center gap-x-1 sm:text-[13px] text-nowrap text-gray-800 dark:text-neutral-200">
                          All-Day:
                        </label>
                        <label htmlFor="hs-pro-crcemad" className="relative inline-block w-9 h-5 cursor-pointer">
                          <input
                            type="checkbox"
                            id="hs-pro-crcemad"
                            className="peer sr-only"
                            checked={formData.allDay}
                            onChange={(e) => setFormData((prev) => ({ ...prev, allDay: e.target.checked }))}
                          />
                          <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                          <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* End All-Day Switch */}
                </div>
              </div>
              {/* End Date & Time */}

              {/* Client Name */}
              <div className="col-span-1">
                <label className="mt-[17px] flex justify-center items-center gap-x-1 text-[13px] text-gray-400 dark:text-neutral-500">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="sr-only">Client:</span>
                </label>
              </div>
              <div className="col-span-11 relative pt-2 before:ms-2 before:absolute before:top-0 before:inset-x-0 before:w-[calc(100%-8px)] before:h-px before:bg-gray-100 dark:before:bg-white/10">
                <input
                  type="text"
                  className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] text-gray-800 leading-5 hover:border-gray-200 placeholder:text-gray-400 disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:text-neutral-200 dark:bg-neutral-800 dark:hover:border-neutral-700 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                  placeholder="Client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                  required
                />
              </div>
              {/* End Client Name */}

              {/* Client Email */}
              <div className="col-span-1">
                <label className="mt-[17px] flex justify-center items-center gap-x-1 text-[13px] text-gray-400 dark:text-neutral-500">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="sr-only">Email:</span>
                </label>
              </div>
              <div className="col-span-11 relative pt-2 before:ms-2 before:absolute before:top-0 before:inset-x-0 before:w-[calc(100%-8px)] before:h-px before:bg-gray-100 dark:before:bg-white/10">
                <input
                  type="email"
                  className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] text-gray-800 leading-5 hover:border-gray-200 placeholder:text-gray-400 disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:text-neutral-200 dark:bg-neutral-800 dark:hover:border-neutral-700 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                  placeholder="client@example.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                  required
                />
              </div>
              {/* End Client Email */}

              {/* Location */}
              <div className="col-span-1">
                <label
                  htmlFor="hs-create-event-location-autoheight-textarea"
                  className="mt-[17px] flex justify-center items-center gap-x-1 text-[13px] text-gray-400 dark:text-neutral-500"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="sr-only">Location:</span>
                </label>
              </div>
              <div className="col-span-11 relative pt-2 before:ms-2 before:absolute before:top-0 before:inset-x-0 before:w-[calc(100%-8px)] before:h-px before:bg-gray-100 dark:before:bg-white/10">
                <textarea
                  id="hs-create-event-location-autoheight-textarea"
                  className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] text-gray-800 hover:border-gray-200 placeholder:text-gray-400 resize-none disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                  rows={1}
                  placeholder="Add Location (virtual or office address)"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              {/* End Location */}

              {/* Description */}
              <div className="col-span-1">
                <label className="mt-[17px] flex justify-center items-center gap-x-1 text-[13px] text-gray-400 dark:text-neutral-500">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="21" x2="3" y1="6" y2="6" />
                    <line x1="15" x2="3" y1="12" y2="12" />
                    <line x1="17" x2="3" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Description:</span>
                </label>
              </div>
              <div className="col-span-11 relative pt-2 before:ms-2 before:absolute before:top-0 before:inset-x-0 before:w-[calc(100%-8px)] before:h-px before:bg-gray-100 dark:before:bg-white/10">
                <textarea
                  className="py-1 sm:py-1.5 px-2 block w-full border-transparent rounded-md sm:text-[13px] hover:border-gray-200 placeholder:text-gray-400 resize-none disabled:opacity-50 disabled:pointer-events-none focus:bg-gray-100 focus:border-transparent focus:ring-transparent dark:bg-neutral-800 dark:hover:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
                  rows={3}
                  placeholder="Add Description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              {/* End Description */}
            </div>
            {/* End Event List */}
          </div>

          {/* Footer */}
          <div className="mt-auto py-2 px-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex-1 flex justify-end items-center gap-2">
              <button
                type="button"
                className="py-2 px-3 text-nowrap inline-flex justify-center items-center text-start whitespace-nowrap bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="py-2 px-3 text-nowrap inline-flex justify-center items-center gap-x-2 text-start whitespace-nowrap bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500"
              >
                {selectedEventId ? 'Update event' : 'Create event'}
              </button>
            </div>
          </div>
          {/* End Footer */}
        </form>
      </div>
      {/* End Body */}
    </div>
    </>
  );
}
