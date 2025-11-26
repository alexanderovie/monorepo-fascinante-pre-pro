/**
 * Account Profile Page
 *
 * Página de perfil dentro del sistema de tabs de Account.
 * Basada en la plantilla Preline Pro account-profile.html
 */

export default function AccountProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">
        Profile
      </h1>
      <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
        Manage your name, password and account settings.
      </p>

      {/* Placeholder - TODO: Implementar formulario de perfil completo */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs p-6 dark:bg-neutral-800 dark:border-neutral-700">
        <p className="text-gray-600 dark:text-neutral-400">
          Formulario de perfil en desarrollo...
        </p>
      </div>
    </div>
  )
}

