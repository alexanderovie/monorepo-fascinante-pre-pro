import Header from '../components/Header';
import FeaturesHero from '../components/FeaturesHero';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { defaultContactInfo } from '../lib/contact-data';
import { defaultFooterData } from '../lib/footer-data';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <FeaturesHero
          badge="Contact"
          title="Get in touch"
          description="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        />
        <div className="py-20">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h2 className="mb-6 font-semibold text-2xl text-gray-800 dark:text-neutral-200">
                  Contact Information
                </h2>
                <ContactInfo items={defaultContactInfo} />
              </div>
              <div>
                <h2 className="mb-6 font-semibold text-2xl text-gray-800 dark:text-neutral-200">
                  Send us a message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
        <CTA
          badge="Need help?"
          title={
            <>
              Have questions? We&apos;re here to help.
              <br />
              Get in touch with our support team.
            </>
          }
          primaryButton={{
            label: 'Visit help center',
            href: '#',
          }}
          secondaryButton={{
            label: 'Schedule a call',
            href: '#',
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}

