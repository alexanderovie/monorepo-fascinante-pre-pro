/**
 * Dashboard Page - Fascinante Digital
 *
 * Página principal del dashboard con Stats Cards.
 * Todos los componentes son Server Components excepto los que requieren interactividad del cliente.
 *
 * Esta página está protegida por autenticación. Solo usuarios autenticados pueden acceder.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ActivityOffcanvas from './components/layout/ActivityOffcanvas';
import SearchModal from './components/layout/SearchModal';
import BrowsersCard from './components/dashboard/BrowsersCard';
import ReferralTrafficCard from './components/dashboard/ReferralTrafficCard';
import SalesStatsCard from './components/dashboard/SalesStatsCard';
import DoubleAreaChartCard from './components/dashboard/DoubleAreaChartCard';
import ProjectCard from './components/dashboard/ProjectCard';
import AddProjectModal from './components/dashboard/AddProjectModal';

/**
 * Página protegida del dashboard.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 *
 * IMPORTANTE: Siempre usa `getUser()` en el servidor, nunca `getSession()`,
 * ya que `getUser()` valida el token con el servidor de Auth.
 */
export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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
            Dashboard
            <svg className="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
            </svg>
          </li>
          <li className="ps-1.5 flex items-center truncate font-semibold text-gray-800 dark:text-neutral-200 text-sm truncate">
            <span className="truncate">Overview</span>
          </li>
        </ol>
        {/* End Breadcrumb */}

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mx-auto lg:mx-0 max-w-fit">
            <BrowsersCard />
            <ReferralTrafficCard />
            <SalesStatsCard />
          </div>
          {/* End Cards Grid */}

          {/* Double Area Chart Card */}
          <DoubleAreaChartCard />
          {/* End Double Area Chart Card */}

          {/* Project Card */}
          <ProjectCard />
          {/* End Project Card */}
        </div>
      </main>
      {/* End Main Content */}

      <Footer />

      {/* Activity Offcanvas */}
      <ActivityOffcanvas />

      {/* Search Modal */}
      <SearchModal />

      {/* Add Project Modal */}
      <AddProjectModal />
    </div>
  );
}
