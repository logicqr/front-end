import Seo, {
  organizationSchema,
  websiteSchema,
  softwareSchema,
  faqSchema,
} from '../../components/common/Seo';
import Hero from '../../components/marketing/sections/Hero';
import { Manifesto, HowItWorks } from '../../components/marketing/sections/HowItWorks';
import Pricing from '../../components/marketing/sections/Pricing';
import { Proof, Who, Lines, Fit, Final } from '../../components/marketing/sections/Close';
import Contact from '../../components/marketing/sections/Contact';
import { PAGE_SEO, PRICING, FAQ } from '../../data/site';

export default function Landing() {
  return (
    <>
      <Seo
        {...PAGE_SEO.home}
        keywords="google reviews, get more google reviews, qr code reviews, review collection, google review link, local seo, customer feedback"
        jsonLd={[
          organizationSchema(),
          websiteSchema(),
          softwareSchema({ firstMonth: PRICING.firstMonthPaise, monthly: PRICING.monthlyPaise }),
          faqSchema(FAQ),
        ]}
      />

      <Hero />
      <Proof />
      <Manifesto />
      <HowItWorks />
      <Pricing />
      <Who />
      <Lines />
      <Fit />
      <Contact />
      <Final />
    </>
  );
}
