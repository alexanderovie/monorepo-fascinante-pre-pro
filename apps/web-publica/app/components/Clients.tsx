/**
 * Clients Component - Trusted by fast-growing companies worldwide
 * Server Component para mostrar logos de empresas en marquee animado
 */
export default function Clients() {
  return (
    <div className="pt-10 pb-20">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-8 text-center">
          <p className="font-mono text-sm text-gray-500 dark:text-neutral-400">
            Trusted by fast-growing companies worldwide
          </p>
        </div>

        {/* Grid */}
        <div className="relative overflow-hidden before:absolute before:inset-y-0 before:start-0 before:z-1 before:w-20 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:inset-y-0 after:end-0 after:z-1 after:w-20 after:h-full after:bg-gradient-to-l after:from-white after:to-transparent dark:before:from-neutral-900 dark:after:from-neutral-900">
          <div className="flex items-center animate-marquee">
            {/* Brands - Se repetirán para efecto infinito */}
            <div className="flex items-center justify-around">
              {/* Logos se agregarán aquí */}
            </div>
            {/* End Brands */}
          </div>
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
}
