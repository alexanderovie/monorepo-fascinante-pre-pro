'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import CustomerDetails from '../components/CustomerDetails';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { defaultCustomers } from '../lib/customers-data';
import { defaultFooterData } from '../lib/footer-data';

function CustomerDetailsContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id') || '1';
  const customer = defaultCustomers.find((c) => c.id === customerId) || defaultCustomers[0];

  return (
    <div className="pt-10 pb-20">
      <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
        <CustomerDetails customer={customer} />
      </div>
    </div>
  );
}

export default function CustomerDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="pt-10 pb-20">
            <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 dark:bg-neutral-700"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-neutral-700"></div>
              </div>
            </div>
          </div>
        }>
          <CustomerDetailsContent />
        </Suspense>
        <CTA
          badge="Get started"
          title={
            <>
              Ready to achieve similar results?
              <br />
              Let&apos;s build something amazing together.
            </>
          }
          primaryButton={{
            label: 'Start free trial',
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
