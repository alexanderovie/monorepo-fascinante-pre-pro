import Header from '../components/Header';
import FeaturesHero from '../components/FeaturesHero';
import CustomerCard from '../components/CustomerCard';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { defaultCustomers } from '../lib/customers-data';
import { defaultFooterData } from '../lib/footer-data';

export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <FeaturesHero
          badge="Our Customers"
          title="Trusted by industry leaders"
          description="See how companies worldwide are using our platform to achieve remarkable results."
        />
        <div className="py-20">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {defaultCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          </div>
        </div>
        <CTA
          badge="Join them"
          title={
            <>
              Ready to join our customers?
              <br />
              Start your journey today.
            </>
          }
          primaryButton={{
            label: 'Get started',
            href: '#',
          }}
          secondaryButton={{
            label: 'Contact sales',
            href: '/contact',
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
