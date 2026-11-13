/**
 * Site-wide facts: pricing, URLs, contact details, and the copy that appears in
 * more than one place.
 *
 * Pricing lives here and in the API's config. The server is authoritative — it
 * creates the Razorpay subscription — and these values are what the pages
 * display. `GET /v1/pricing` returns the server's numbers, and the pricing page
 * reads them so a mismatch surfaces instead of quietly misleading someone.
 */

export const SITE = {
  name: 'LogicQR',
  domain: 'www.logicqr.com',
  url: 'https://www.logicqr.com',
  tagline: 'Turn happy customers into Google reviews',
  description:
    'LogicQR puts a QR code on your counter. Customers scan, rate, and the happy ones land on your Google review page. The rest reaches you privately so you can fix it.',
  email: 'thelogicqr@gmail.com',
  phone: '+91 98943 77125',
  tel: '+919894377125',
  address: {
    street: 'Pandian Street, Velachery',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600042',
    country: 'IN',
  },
  founded: '2025',
  social: {
    instagram: 'https://www.instagram.com/thelogicqr',
    linkedin: 'https://www.linkedin.com/company/logicqr',
  },
};

/**
 * All amounts in paise, mirroring the API's FIRST_MONTH_AMOUNT,
 * MONTHLY_AMOUNT and ANNUAL_AMOUNT.
 *
 *   ₹49    first month, whichever cycle you pick
 *   ₹299   per month after that
 *   ₹2,388 per year after that — ₹199/month, 33% less
 */
export const PRICING = {
  firstMonthPaise: 4900,
  monthlyPaise: 29900,
  annualPaise: 238800,
  trialDays: 30,
  currency: 'INR',
  symbol: '₹',
};

export const money = (paise, { withSymbol = true } = {}) => {
  const rupees = paise / 100;
  const formatted = Number.isInteger(rupees)
    ? rupees.toLocaleString('en-IN')
    : rupees.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  return withSymbol ? `${PRICING.symbol}${formatted}` : formatted;
};

/** Derived figures, so no page does this arithmetic itself and gets it wrong. */
export const derivePricing = (p = PRICING) => {
  const monthly = p.monthlyPaise ?? p.monthlyPaise;
  const annual = p.annualPaise;
  const twelveMonths = monthly * 12;

  return {
    ...p,
    annualPerMonthPaise: Math.round(annual / 12),
    annualSavingPerYearPaise: twelveMonths - annual,
    annualSavingPercent: Math.round(((twelveMonths - annual) / twelveMonths) * 100),
    firstYearMonthlyPaise: p.firstMonthPaise + monthly * 11,
    firstYearAnnualPaise: p.firstMonthPaise + annual,
  };
};

const D = derivePricing();

export const FIRST_MONTH = money(PRICING.firstMonthPaise);
export const MONTHLY = money(PRICING.monthlyPaise);
export const ANNUAL = money(PRICING.annualPaise);
export const ANNUAL_PER_MONTH = money(D.annualPerMonthPaise);
export const ANNUAL_SAVING = money(D.annualSavingPerYearPaise);
export const ANNUAL_SAVING_PERCENT = D.annualSavingPercent;

/**
 * What a customer gets. Written as plain outcomes rather than feature names —
 * a shop owner does not buy a "review funnel", they buy more reviews and fewer
 * public complaints.
 */
export const INCLUDED = [
  'Your own QR code and review link',
  'Printable table card, counter stand and sticker artwork',
  'Happy customers land straight on your Google review page',
  'Private feedback box so problems reach you first',
  'Dashboard showing every piece of private feedback',
  'Email alerts the moment someone leaves feedback',
  'Unlimited scans and unlimited reviews',
  'Works on any phone — no app for your customers',
];

export const NOT_INCLUDED = [
  'No contract — cancel from your dashboard any time',
  'No setup fee and no hardware to buy',
  'No per-review, per-scan or per-staff charges',
];

export const FAQ = [
  {
    q: `Why is the first month ${FIRST_MONTH} and then ${MONTHLY}?`,
    a: `Because a QR code on a counter takes a few weeks to prove itself, and you should not have to pay full price to find out whether it works for you. ${FIRST_MONTH} covers your first month — enough time to get the code printed, placed and scanned and to see real feedback arriving. After that it is ${MONTHLY} a month, or ${ANNUAL_PER_MONTH} a month if you pay yearly.`,
  },
  {
    q: 'Should I pay monthly or yearly?',
    a: `Start monthly. There is no advantage to committing before you have seen it work. Once reviews are arriving, switching to yearly brings it down to ${ANNUAL_PER_MONTH} a month — ${ANNUAL_SAVING} less over a year — and you can switch from Account settings in one click. We will email you about it a few days before your first ${MONTHLY} charge so the choice is in front of you at the right time.`,
  },
  {
    q: 'When exactly am I charged?',
    a: `${FIRST_MONTH} today. Then, ${PRICING.trialDays} days later, either ${MONTHLY} and monthly after that, or ${ANNUAL} once a year — whichever you picked. It is collected automatically from the payment method you set up, we email a receipt every time, and we send a reminder three days before each renewal so it is never a surprise.`,
  },
  {
    q: 'How do I cancel?',
    a: 'Account settings, one button, no email required. Cancelling stops all future charges straight away and your review page keeps working until the end of the period you have already paid for. Your existing feedback stays in your dashboard.',
  },
  {
    q: 'Do my customers need to install anything?',
    a: 'No. They point their camera at the code and the page opens in their browser. It works on any phone from roughly the last eight years, on any network.',
  },
  {
    q: 'What happens to a bad rating?',
    a: 'It opens a short private feedback form, and what they write comes to you by email and appears in your dashboard. The point is that you hear about the cold food or the long wait while you can still do something about it. You choose whether those customers are also offered your Google page — see the next question.',
  },
  {
    q: 'Is this allowed under Google’s rules?',
    a: 'Asking every customer for a review is allowed and encouraged. What Google prohibits is only soliciting reviews from people you expect to be positive, which is called review gating. We are explicit about this because it matters: new accounts default to inviting every customer to Google regardless of their rating, while still collecting the private detail. Read our guide on what the policy actually says, then set it however you want.',
  },
  {
    q: 'Can I use one code for more than one branch?',
    a: 'Each location needs its own code, because each one has its own Google listing and its own feedback to keep separate. Running several? Email us and we will sort out the pricing properly rather than making you pay full price for each.',
  },
  {
    q: 'What do I actually get on day one?',
    a: 'A dashboard with your QR code in it, ready to download as a print-quality PDF table card, plus your review link to put on receipts, WhatsApp, your website footer and your email signature. Most people are collecting feedback within the hour.',
  },
];

/** Route-level SEO defaults. */
export const PAGE_SEO = {
  home: {
    title: `${SITE.name} — Get more Google reviews from a QR code`,
    description: SITE.description,
    path: '/',
  },
  pricing: {
    title: `Pricing — ${FIRST_MONTH} first month, then ${MONTHLY}/month | ${SITE.name}`,
    description: `${FIRST_MONTH} for your first month, then ${MONTHLY} a month — or ${ANNUAL_PER_MONTH} a month paid yearly. Unlimited scans and reviews, no contract, cancel any time.`,
    path: '/pricing',
  },
  blog: {
    title: `Google reviews guides — ${SITE.name} blog`,
    description:
      'Practical, policy-safe guides to getting more Google reviews: review links, QR codes, review velocity, responding to criticism, and what Google actually prohibits.',
    path: '/blog',
  },
  features: {
    title: `How it works — ${SITE.name}`,
    description:
      'Scan, rate, redirect. See exactly how LogicQR turns a QR code on your counter into Google reviews and private feedback.',
    path: '/features',
  },
  docs: {
    title: `Setup guide — ${SITE.name}`,
    description: 'Get your QR code printed, placed and scanning in under an hour. Step-by-step setup.',
    path: '/docs',
  },
  terms: {
    title: `Terms and privacy — ${SITE.name}`,
    description: 'Terms of service, refund policy and privacy practices for LogicQR.',
    path: '/terms-condition',
  },
};
