import { Helmet } from 'react-helmet-async';
import { SITE } from '../../data/site';

/**
 * Per-page metadata.
 *
 * What was missing before: Open Graph and Twitter tags entirely (so a shared
 * link had no preview), a canonical host that matched the sitemap (the sitemap
 * said logicqr.com while the canonical said www.logicqr.com, splitting the
 * ranking signal), and any structured data at all on a product sold on search
 * visibility.
 *
 * `react-helmet` was also unmaintained and warns under React 18 StrictMode;
 * this uses `react-helmet-async`.
 */

const abs = (path = '/') => (/^https?:/.test(path) ? path : `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`);

export default function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
  keywords,
}) {
  const url = abs(path);
  const fullTitle = title?.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const ogImage = abs(image || '/og-default.png');

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article timestamps, when this is a post */}
      {publishedTime ? <meta property="article:published_time" content={publishedTime} /> : null}
      {modifiedTime ? <meta property="article:modified_time" content={modifiedTime} /> : null}
      {author ? <meta property="article:author" content={author} /> : null}

      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      ) : null}
    </Helmet>
  );
}

/* ------------------------------------------------------------------ *
 * Structured data builders
 * ------------------------------------------------------------------ */

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo-512.png`,
  description: SITE.description,
  foundingDate: SITE.founded,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: SITE.email,
    telephone: SITE.phone,
    availableLanguage: ['English', 'Tamil', 'Hindi'],
  },
  sameAs: Object.values(SITE.social),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  publisher: { '@id': `${SITE.url}/#organization` },
  inLanguage: 'en',
});

export const softwareSchema = ({ firstMonth, monthly }) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE.name,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Review management',
  operatingSystem: 'Web',
  description: SITE.description,
  url: SITE.url,
  offers: {
    '@type': 'Offer',
    price: (monthly / 100).toFixed(2),
    priceCurrency: 'INR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: (monthly / 100).toFixed(2),
      priceCurrency: 'INR',
      unitText: 'MONTH',
      billingDuration: 1,
      billingIncrement: 1,
    },
    description: `₹${firstMonth / 100} for the first month, then ₹${monthly / 100} per month`,
    availability: 'https://schema.org/InStock',
  },
  provider: { '@id': `${SITE.url}/#organization` },
});

export const breadcrumbSchema = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
});

export const articleSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  datePublished: post.published,
  dateModified: post.updated || post.published,
  author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  publisher: { '@id': `${SITE.url}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/blog/${post.slug}`) },
  articleSection: post.category,
  keywords: post.keywords?.join(', '),
  inLanguage: 'en',
  wordCount: post.wordCount,
});

export const howToSchema = ({ name, description, steps, totalTime }) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  totalTime,
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
});
