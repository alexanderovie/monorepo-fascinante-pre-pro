import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProductsCarousel from './components/ProductsCarousel';
import Features from './components/Features';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { defaultStatsData } from './lib/stats-data';
import { defaultProductsData } from './lib/products-data';
import { defaultFeaturesData } from './lib/features-data';
import { defaultFAQData } from './lib/faq-data';
import { defaultFooterData } from './lib/footer-data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero
          badge="Web App"
          title="Supercharged Preline Experience"
          description="Boost developer efficiency, enhance teamwork, and maximize tech investments with Preline."
          primaryButton={{
            label: 'Try it free',
            href: '#',
          }}
          secondaryButton={{
            label: 'Get a demo',
            href: '#',
          }}
        />
        <Stats items={defaultStatsData} />
        <ProductsCarousel title="Products" items={defaultProductsData} />
        <Features
          badge="What we do"
          title="Since 2007, we have helped 2.5k+ companies launch over 100k incredible products"
          items={defaultFeaturesData}
        />
        <FAQ
          title="Your questions, answered"
          description="Answers to the most frequently asked questions."
          items={defaultFAQData}
        />
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
            href: '#',
          }}
          secondaryButton={{
            label: 'Get a demo',
            href: '#',
          }}
        />
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
