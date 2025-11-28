'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import PricingHero from '../../components/PricingHero';
import PricingCard from '../../components/PricingCard';
import FAQ from '../../components/FAQ';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { defaultPricingPlans } from '../../lib/pricing-data';
import { defaultFAQData } from '../../lib/faq-data';
import { defaultFooterData } from '../../lib/footer-data';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PricingHero
          badge="Pricing"
          title="Simple, transparent pricing"
          description="Choose the perfect plan for your needs. All plans include a 14-day free trial."
          billingToggle={{
            monthly: 'Monthly',
            yearly: 'Yearly',
            onToggle: (period) => setBillingPeriod(period),
            period: billingPeriod,
          }}
        />
        <div className="pb-20">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {defaultPricingPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  billingPeriod={billingPeriod}
                />
              ))}
            </div>
          </div>
        </div>
        <FAQ
          title="Pricing questions"
          description="Everything you need to know about our pricing plans."
          items={defaultFAQData}
        />
        <CTA
          badge="Get started"
          title={
            <>
              Ready to get started?
              <br />
              Choose your plan today.
            </>
          }
          primaryButton={{
            label: 'Start free trial',
            href: '#',
          }}
          secondaryButton={{
            label: 'Contact sales',
            href: '#',
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}

