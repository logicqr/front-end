import { Table, Note, Steps, Guide, DoDont, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'what-it-is', label: 'What review gating is' },
  { id: 'policy', label: 'What Google’s policy says' },
  { id: 'ftc', label: 'The US position, which is stricter' },
  { id: 'risk', label: 'What actually happens if you do it' },
  { id: 'why-tools', label: 'Why review software does it anyway' },
  { id: 'compliant', label: 'The compliant way to get the same thing' },
  { id: 'our-product', label: 'How this applies to LogicQR' },
];

export default function Body() {
  return (
    <>
      <p>
        Review gating is asking customers how they feel first, and only sending the happy ones on to Google. It is the
        default behaviour of a large share of review software sold to small businesses, including — configured one
        particular way — ours.
      </p>

      <p>
        It is also against Google&apos;s policy. This piece sets out what the rules say, what the realistic
        consequences are, and how to get almost all of the benefit without the exposure. We would rather you heard
        this from us than from a suspension notice.
      </p>

      <Toc items={toc} />

      <H2 id="what-it-is">What review gating is</H2>

      <p>
        The pattern looks like this: a customer scans a code or opens an email and is asked to rate their experience on
        a private form. If they pick four or five stars they are forwarded to your Google review page. If they pick one
        to three, they get a feedback box that goes only to the owner.
      </p>

      <p>
        The appeal is obvious. Your public rating only ever receives positive reviews, and the complaints arrive
        privately where you can address them. Done at scale it can lift a listing from 4.0 to 4.8 within months.
      </p>

      <p>
        The problem is also the mechanism: you have used the rating to decide who is allowed to review you publicly.
        The resulting public rating no longer describes your customers&apos; experience, it describes a filtered subset
        of it — which is precisely what the rules exist to prevent.
      </p>

      <H2 id="policy">What Google&apos;s policy says</H2>

      <p>
        Google&apos;s prohibited and restricted content policy for Maps covers fake engagement and review
        solicitation. Two provisions matter here:
      </p>

      <Table
        head={['Prohibited', 'What it means for you']}
        rows={[
          [
            'Soliciting reviews selectively',
            'You may not ask only the customers you expect to be positive. The ask has to be offered to everyone served.',
          ],
          [
            'Discouraging or prohibiting negative reviews',
            'You may not set up a process whose purpose is to stop unhappy customers reviewing you publicly.',
          ],
          [
            'Incentivised reviews',
            'No discounts, freebies, loyalty points or prize draws in exchange for a review — positive or otherwise.',
          ],
          [
            'Review content you did not receive',
            'Writing them yourself, buying them, or having staff and family post as customers.',
          ],
        ]}
        caption="Google updates this policy; check the current version of its prohibited content rules for Maps before relying on any summary, including this one."
      />

      <p>
        The important nuance: <strong>asking every customer for a review is encouraged.</strong> Google&apos;s own
        Business Profile interface has an &ldquo;Ask for reviews&rdquo; button for exactly that. What is prohibited is
        the filtering, not the asking.
      </p>

      <H2 id="ftc">The US position, which is stricter</H2>

      <p>
        If you trade in the United States or serve US customers, the Federal Trade Commission has a rule on consumer
        reviews and testimonials that goes further than Google&apos;s terms. It addresses fake reviews, reviews bought
        or incentivised, insider reviews not disclosed as such, and the suppression of negative reviews.
      </p>

      <p>
        The rule carries civil penalties assessed per violation, which for a business with hundreds of reviews is not a
        theoretical figure. Published numbers for the per-violation maximum differ between sources and are adjusted
        annually for inflation, so treat any specific amount you read — including in articles citing a precise figure —
        as approximate. The point that holds regardless is that it is substantial and it multiplies.
      </p>

      <Note kind="warn" title="This is not legal advice">
        <p>
          We are a review-collection tool, not your lawyer, and we are describing published policy rather than
          interpreting it for your situation. If you operate across several countries, or your rating is central to a
          regulated service such as healthcare, it is worth half an hour with someone qualified before you configure
          anything that filters customers.
        </p>
      </Note>

      <H2 id="risk">What actually happens if you do it</H2>

      <p>
        The realistic risk is not a fine arriving in the post. It escalates roughly like this:
      </p>

      <Steps
        items={[
          {
            name: 'Nothing, for a while',
            text: 'Gating is hard for Google to detect from the outside, because what it sees is simply a listing receiving good reviews. Plenty of businesses do this for years with no visible consequence, which is exactly why the practice is so widespread.',
          },
          {
            name: 'A competitor or customer reports it',
            text: 'This is the usual trigger. A customer who was shown a private feedback form after a bad experience, and who notices they were never offered the Google option, has a specific and credible complaint. So does a competitor who signed up to see how your system works.',
          },
          {
            name: 'Reviews are removed in a batch',
            text: 'The most common outcome. Months of accumulated reviews disappear and the rating drops back, often lower than where it started, because the private complaints were never offset by anything public.',
          },
          {
            name: 'The profile is suspended',
            text: 'The serious outcome. The listing stops appearing in Maps and local results until an appeal succeeds, and appeals routinely take weeks. For a business whose walk-ins come from "near me" searches, that is the closed-shop scenario.',
          },
        ]}
      />

      <p>
        The asymmetry is what makes this a bad trade. The upside is a rating a few tenths higher. The downside is
        disappearing from local search during the appeal.
      </p>

      <H2 id="why-tools">Why review software does it anyway</H2>

      <p>
        Because it demos beautifully. &ldquo;Your rating went from 4.1 to 4.8&rdquo; is a far easier sale than
        &ldquo;you will hear about problems sooner&rdquo;, and the risk lands on the customer&apos;s listing rather
        than the vendor&apos;s business.
      </p>

      <p>
        Many tools also describe it in language that sounds compliant — &ldquo;smart routing&rdquo;, &ldquo;sentiment
        filtering&rdquo;, &ldquo;review funnel&rdquo;, &ldquo;protect your reputation&rdquo;. If a tool decides who
        reaches Google based on a rating they gave first, that is gating, whatever it is called in the marketing.
      </p>

      <H2 id="compliant">The compliant way to get the same thing</H2>

      <p>
        Here is the part worth knowing: you can keep nearly all the operational benefit without the filtering. The
        benefit you actually want is hearing about problems quickly and privately. That does not require blocking
        anyone from Google.
      </p>

      <DoDont
        doTitle="Compliant"
        dontTitle="Gating"
        doItems={[
          'Invite every customer to review you on Google, whatever they rated you',
          'Offer a private feedback box as well, open to everyone',
          'Ask "how was your visit?" rather than "were you happy?"',
          'Reply publicly to the criticism you receive',
          'Act on the private feedback so the next review is better',
        ]}
        dontItems={[
          'Show the Google option only to people who rated 4–5',
          'Route 1–3 star ratings into a dead end',
          'Email only the customers you expect to be pleased',
          'Ask staff to request reviews from "good" customers only',
          'Offer anything in exchange for a review',
        ]}
      />

      <H3 id="both">Offering both, to everyone</H3>

      <p>
        The compliant flow is barely different from the gated one. A customer scans and rates. Then —{' '}
        <em>whatever they rated</em> — they see two things: a button to post on Google, and a box to tell you privately.
        Many people who had a mediocre visit will use the private box and skip Google, which is their choice to make.
        Some will do both. A few will post the criticism publicly, which is the point of the system working.
      </p>

      <p>
        Your rating ends up slightly lower than a gated one and genuinely yours. In exchange you get a listing that
        cannot be taken away from you, reviews that mention real specifics, and recent criticism you can act on.
      </p>

      <Note kind="good" title="The argument that persuades most owners">
        <p>
          A 4.6 with 180 reviews and visible replies to the critical ones converts better than a 4.9 with 180 reviews
          and no criticism at all. Shoppers read the one and two star reviews first, specifically to find out what goes
          wrong and whether the owner cares. A flawless rating with no bad reviews reads as filtered, because readers
          have learned that it usually is.
        </p>
      </Note>

      <H2 id="our-product">How this applies to LogicQR</H2>

      <p>
        We will be straight about it. LogicQR&apos;s default flow routes four and five star ratings to your Google
        review page and keeps one to three star feedback private. That is review gating, and the audit of our own
        product says so.
      </p>

      <p>We give you the choice because it is your listing that carries the risk:</p>

      <Table
        head={['Setting', 'What happens', 'Compliance']}
        rows={[
          [
            'Open invite (recommended)',
            'Every customer sees the Google button and the private feedback box, whatever they rated.',
            'Complies with Google policy',
          ],
          [
            'Private-first',
            '1–3 stars opens the private box, with the Google option still offered below it.',
            'Complies, nudges without blocking',
          ],
          [
            'Routed (legacy default)',
            'Only 4–5 stars see Google. 1–3 go to the private box only.',
            'Gating — against Google policy',
          ],
        ]}
        caption="Switch between these in Account settings. New accounts default to Open invite."
      />

      <p>
        If you are already running the routed setting, you are not in trouble today, and switching does not undo
        anything. Your rating will drift slightly down and become durable. We think that is the better business, and
        it is the one we would pick for our own.
      </p>

      <p>
        Related reading:{' '}
        <Guide to="how-to-respond-to-negative-reviews">how to reply to the criticism you will now receive</Guide>, and{' '}
        <Guide to="how-to-get-more-google-reviews">the full guide to getting more reviews</Guide> — where volume, not
        filtering, is what does the work.
      </p>
    </>
  );
}
