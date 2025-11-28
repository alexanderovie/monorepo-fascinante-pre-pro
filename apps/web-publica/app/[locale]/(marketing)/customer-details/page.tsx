import Header from '../../components/Header';
import CustomerDetailsStory from '../../components/CustomerDetailsStory';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';
import { shopifyCustomerDetailsData } from '../../lib/customer-details-data';
import { defaultFooterData } from '../../lib/footer-data';
import { URLS } from '../../../../lib/constants';

export default function CustomerDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <CustomerDetailsStory {...shopifyCustomerDetailsData} />
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
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
