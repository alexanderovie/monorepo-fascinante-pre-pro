/**
 * Welcome Page - Fascinante Digital
 *
 * Página de bienvenida del dashboard basada en el template de Preline.
 * Esta página está protegida por autenticación. Solo usuarios autenticados pueden acceder.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import ActivityOffcanvas from './components/layout/ActivityOffcanvas'
import SearchModal from './components/layout/SearchModal'
import WelcomeContent from './components/welcome/WelcomeContent'

/**
 * Página protegida de bienvenida.
 * Verifica que el usuario esté autenticado antes de mostrar el contenido.
 */
export default async function WelcomePage() {
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
          <WelcomeContent />
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
