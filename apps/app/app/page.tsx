/**
 * Dashboard Home Page - Fascinante Digital
 *
 * Página de inicio del dashboard.
 * Esta página está protegida por autenticación. Solo usuarios autenticados pueden acceder.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import ActivityOffcanvas from './components/layout/ActivityOffcanvas'
import SearchModal from './components/layout/SearchModal'

/**
 * Página protegida de inicio.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 */
export default async function HomePage() {
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
        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          {/* Contenido pendiente de implementación */}
        </div>
      </main>
      {/* End Main Content */}

      <Footer />

      {/* Activity Offcanvas */}
      <ActivityOffcanvas />

      {/* Search Modal */}
      <SearchModal />
    </div>
  )
}
