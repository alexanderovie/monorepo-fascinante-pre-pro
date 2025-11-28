/**
 * Appointments Dashboard Page - Fascinante Digital
 *
 * Página principal de gestión de citas con vista de calendario.
 * Server Component que muestra el calendario de citas del profesional.
 *
 * Esta página está protegida por autenticación.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import ActivityOffcanvas from '../../components/layout/ActivityOffcanvas';
import SearchModal from '../../components/layout/SearchModal';
import AppointmentsCalendar from '../../components/appointments/AppointmentsCalendar';

/**
 * Página protegida de appointments.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 */
export default async function AppointmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 relative">
      <Header user={user} />
      <Sidebar user={user} />

      {/* Main Content */}
      <main id="content" className="pt-15 pb-10 sm:pb-16">
        {/* Breadcrumb */}
        <ol className="lg:hidden pt-3 md:pt-5 sm:pb-2 md:pb-0 px-2 sm:px-5 flex items-center whitespace-nowrap">
          <li className="flex items-center text-sm text-gray-600 dark:text-neutral-500">
            <a
              className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
              href="/dashboard"
            >
              Dashboard
            </a>
            <svg
              className="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
            </svg>
          </li>
          <li className="ps-1.5 flex items-center truncate font-semibold text-gray-800 dark:text-neutral-200 text-sm truncate">
            <span className="truncate">Appointments</span>
          </li>
        </ol>
        {/* End Breadcrumb */}

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
          {/* Appointments Calendar */}
          <AppointmentsCalendar userId={user.id} />
        </div>
      </main>
      {/* End Main Content */}

      <Footer />

      {/* Activity Offcanvas */}
      <ActivityOffcanvas />

      {/* Search Modal */}
      <SearchModal />
    </div>
  );
}
