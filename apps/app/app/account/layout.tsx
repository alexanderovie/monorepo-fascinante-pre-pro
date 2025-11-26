/**
 * Account Layout
 *
 * Layout compartido para todas las páginas de Account.
 * Incluye el sistema de tabs horizontales que se ve en la plantilla Preline Pro.
 *
 * Estructura según plantilla:
 * - Breadcrumb: "Account" → "Tab Name"
 * - Tabs horizontales: Profile | Notifications | Integrations | Preferences | Workspace | Plan & Billing | Members
 * - Contenido específico de cada tab
 */

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
import AccountTabs from '../components/account/AccountTabs'
import AccountBreadcrumb from '../components/account/AccountBreadcrumb'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <AccountBreadcrumb />
        {/* End Breadcrumb */}

        <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
          {/* Account Tabs Navigation */}
          <AccountTabs />

          {/* Tab Content */}
          <div className="mt-5">{children}</div>
        </div>
      </main>
      {/* End Main Content */}

      <Footer />
    </div>
  )
}

