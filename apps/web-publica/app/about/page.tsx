import Header from '../components/Header';
import FeaturesHero from '../components/FeaturesHero';
import StatsGrid from '../components/StatsGrid';
import ValuesGrid from '../components/ValuesGrid';
import TeamGrid from '../components/TeamGrid';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { defaultStats, defaultValues, defaultTeamMembers } from '../lib/about-data';
import { defaultFooterData } from '../lib/footer-data';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <FeaturesHero
          badge="About Us"
          title="Building the future of digital experiences"
          description="We're a team of passionate professionals dedicated to creating innovative solutions that help businesses thrive in the digital age."
        />
        <StatsGrid items={defaultStats} />
        <div className="py-10">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-semibold text-2xl sm:text-3xl text-gray-800 dark:text-neutral-200">
                Our Values
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-neutral-500">
                The principles that guide everything we do
              </p>
            </div>
          </div>
        </div>
        <ValuesGrid items={defaultValues} />
        <div className="py-10">
          <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-semibold text-2xl sm:text-3xl text-gray-800 dark:text-neutral-200">
                Our Team
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-neutral-500">
                Meet the people behind our success
              </p>
            </div>
          </div>
        </div>
        <TeamGrid members={defaultTeamMembers} />
        <CTA
          badge="Join us"
          title={
            <>
              Ready to be part of our team?
              <br />
              We&apos;re always looking for talented people.
            </>
          }
          primaryButton={{
            label: 'View open positions',
            href: '#',
          }}
          secondaryButton={{
            label: 'Learn more',
            href: '#',
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}

