/**
 * Account Plan & Billing Page
 *
 * Página de plan y facturación dentro del sistema de tabs de Account.
 * Basada en la plantilla Preline Pro account-plan-and-billing.html
 */

export default function AccountPlanAndBillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">
        Plan & Billing
      </h1>
      <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
        Manage your subscription plan and billing information.
      </p>

      {/* Placeholder - TODO: Implementar configuración de plan y facturación */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs p-6 dark:bg-neutral-800 dark:border-neutral-700">
        <p className="text-gray-600 dark:text-neutral-400">
          Configuración de plan y facturación en desarrollo...
        </p>
      </div>
    </div>
  )
}

