import Header from '../components/Header';
import CustomerLogoCard from '../components/CustomerLogoCard';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { customerLogos } from '../lib/customers-logo-data';
import { defaultFooterData } from '../lib/footer-data';
import { URLS } from '../../lib/constants';

/**
 * Customers Page - Server Component
 * Página idéntica al template original de Preline
 * Basado en: https://preline.co/pro/startup/customers.html
 */
export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-20 sm:py-24 lg:py-28 before:absolute before:inset-0 before:-z-1 before:mx-3 lg:before:mx-6 2xl:before:mx-10 before:bg-linear-to-b before:from-gray-100 before:to-transparent before:rounded-2xl dark:before:from-neutral-800">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <p className="mb-3 font-mono text-sm text-gray-500 dark:text-neutral-400">
                Customers
              </p>

              <h1 className="mb-4 font-bold text-gray-800 text-4xl sm:text-5xl lg:text-6xl dark:text-white">
                How the world&apos;s top techs are using Preline
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-200">
                Discover how leading tech companies streamline development and design with Preline&apos;s powerful UI tools and components.
              </p>
            </div>
          </div>
        </div>
        {/* End Hero Section */}

        {/* Customers Grid */}
        <div className="py-10 sm:py-12 lg:py-16">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {customerLogos.map((customer) => (
                <CustomerLogoCard
                  key={customer.id}
                  title={customer.title}
                  logoSvg={customer.logoSvg}
                  href={customer.href}
                />
              ))}
            </div>
          </div>
        </div>
        {/* End Customers Grid */}

        {/* CTA Section */}
        <div className="pb-10 sm:pb-12 lg:pb-16">
          <CTA
            badge="Get started"
            title={
              <>
                The Web App powering
                <br />
                thousands of companies.
              </>
            }
            primaryButton={{
              label: 'Try it free',
              href: URLS.tryItFree,
            }}
            secondaryButton={{
              label: 'Get a demo',
              href: URLS.getDemo,
            }}
          />
        </div>
        {/* End CTA Section */}
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
