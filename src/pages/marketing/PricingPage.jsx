import Seo, {
  breadcrumbSchema,
  faqSchema,
  organizationSchema,
  softwareSchema,
} from '../../components/common/Seo';
import Pricing from '../../components/marketing/sections/Pricing';
import { Faq, SectionHeader, Eyebrow, Pill } from '../../components/marketing/ui';
import { Table } from '../../components/blog/prose';
import { PAGE_SEO, PRICING, FAQ, FIRST_MONTH, MONTHLY, money } from '../../data/site';

/** Billing questions that belong here rather than on the landing page. */
const BILLING_FAQ = [
  {
    q: 'What payment methods can I use?',
    a: 'UPI autopay, debit card, credit card and net-banking mandates, all through Razorpay. You set it up once at signup and the monthly charge happens automatically after that. We never see or store your card details.',
  },
  {
    q: 'What if a monthly payment fails?',
    a: 'Your page keeps working. We email you, and Razorpay retries over the following few days. If every retry fails we pause the page rather than quietly leaving it broken, and restarting takes one click once your payment method is sorted.',
  },
  {
    q: 'Do I get a refund if I cancel?',
    a: `Cancelling stops all future charges and your page stays live until the end of the month you have paid for, so there is nothing left over to refund. We do not pro-rate part-months. If something went wrong at our end — the page was down, the code never worked — email us and we will refund it properly.`,
  },
  {
    q: 'Is GST included?',
    a: 'Yes. The prices shown are what you pay. If you need a GST invoice with your business details on it, email us your GSTIN and we will issue one for every charge.',
  },
  {
    q: 'Will the price go up?',
    a: `Not for you. If we raise the price later, existing subscriptions stay on the rate they signed up at — that is how the billing is set up, not just a promise. A new price would only apply to new signups.`,
  },
  {
    q: `Why not a free plan?`,
    a: `Because a free review tool has to make money somewhere, and the usual answers are selling your customer data or upselling you constantly. ${FIRST_MONTH} is low enough to be a genuine trial and high enough that we can just run the product.`,
  },
];

export default function PricingPage() {
  const annual = money(PRICING.firstMonthPaise + PRICING.monthlyPaise * 11);

  return (
    <>
      <Seo
        {...PAGE_SEO.pricing}
        keywords="logicqr pricing, google review tool price, review qr code cost, review management pricing india"
        jsonLd={[
          organizationSchema(),
          softwareSchema({ firstMonth: PRICING.firstMonthPaise, monthly: PRICING.monthlyPaise }),
          faqSchema([...FAQ, ...BILLING_FAQ]),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
        ]}
      />

      <section className="blog-hero">
        <div className="wrap">
          <Eyebrow>One plan, one price</Eyebrow>
          <h1 className="display xl" style={{ marginTop: 26, maxWidth: '20ch' }}>
            {FIRST_MONTH} to find out. <em>{MONTHLY}</em> to keep it.
          </h1>
          <p className="lede" style={{ marginTop: 24, maxWidth: '50ch' }}>
            No tiers to compare, no per-review charges, no setup fee. The only decision is whether a QR code on your
            counter is worth {MONTHLY} a month, and the first month is cheap enough to answer that honestly.
          </p>
        </div>
      </section>

      <Pricing full />

      <section className="wrap" style={{ paddingBottom: 'clamp(60px,8vw,100px)' }}>
        <SectionHeader kicker="The arithmetic" title={<>What it costs over a year</>}>
          Spelled out, because a two-step price is easy to misread and we would rather you worked it out now than
          queried a charge later.
        </SectionHeader>

        <Table
          head={['When', 'What you pay', 'Running total']}
          rows={[
            ['Today', FIRST_MONTH, FIRST_MONTH],
            ['Month 2', MONTHLY, money(PRICING.firstMonthPaise + PRICING.monthlyPaise)],
            ['Month 3', MONTHLY, money(PRICING.firstMonthPaise + PRICING.monthlyPaise * 2)],
            ['…', '…', '…'],
            ['Month 12', MONTHLY, annual],
          ]}
          caption={`Twelve months on monthly billing is ${annual}. Paying yearly instead costs ${money(PRICING.firstMonthPaise + PRICING.annualPaise)} for the first 13 months (the ${FIRST_MONTH} month plus one yearly charge). Cancel at any point and the charges stop.`}
        />

        <div className="notice info" style={{ marginTop: 24 }}>
          <strong>For comparison:</strong> one lost customer who chose the place with 4.6 stars instead of your 4.1
          costs more than a year of this. That is the whole business case — we are not going to dress it up with
          statistics we cannot stand behind.
        </div>
      </section>

      <section className="fit">
        <div className="wrap">
          <div className="faq-g" style={{ marginTop: 0 }}>
            <h2 className="display">Billing questions</h2>
            <div>
              <Faq items={BILLING_FAQ} idPrefix="billing-faq" />
            </div>
          </div>

          <div className="faq-g">
            <h2 className="display">Everything else</h2>
            <div>
              <Faq items={FAQ} idPrefix="general-faq" />
            </div>
          </div>
        </div>
      </section>

      <section className="dark" style={{ borderRadius: '40px 40px 0 0', padding: 'clamp(64px,8vw,110px) 0' }}>
        <div className="wrap center">
          <h2 className="display md" style={{ maxWidth: '22ch', margin: '0 auto 20px' }}>
            Still cheaper than <em>one lost table.</em>
          </h2>
          <div className="cta center" style={{ marginTop: 28 }}>
            <Pill variant="light lg" to="/register" event="cta_pricing_page_start">
              Start for {FIRST_MONTH}
            </Pill>
            <a className="tlink" href="/#contact" style={{ color: '#fff' }}>
              Ask us something first
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
