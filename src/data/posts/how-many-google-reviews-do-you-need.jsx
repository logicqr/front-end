import { Table, Note, Steps, Guide, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'no-number', label: 'There is no universal number' },
  { id: 'find-yours', label: 'Finding the number for your street' },
  { id: 'thresholds', label: 'The thresholds that do matter' },
  { id: 'why-47', label: 'Why 4.7 outperforms 5.0' },
  { id: 'how-long', label: 'How long it takes to get there' },
  { id: 'after', label: 'What to do once you are ahead' },
];

export default function Body() {
  return (
    <>
      <p>
        The honest answer is that it depends entirely on who you are competing with, and that the useful version of
        this question is not &ldquo;how many reviews are good&rdquo; but &ldquo;how many does the business currently
        ranking above me have&rdquo;.
      </p>

      <p>
        That is a number you can find in about ten minutes, and once you have it you have a real target instead of a
        round one.
      </p>

      <Toc items={toc} />

      <H2 id="no-number">There is no universal number</H2>

      <p>
        Published benchmarks for &ldquo;average reviews per local business&rdquo; circulate widely and are close to
        useless, for two reasons. They average across wildly different categories — a city-centre restaurant and a
        suburban accountant are not in the same market — and most come from vendor surveys with undisclosed samples.
      </p>

      <p>
        The variation between categories is enormous. A dentist with 60 reviews may be the best-reviewed practice in
        the district. A café with 60 in a busy high street is mid-table. Same number, opposite situations.
      </p>

      <Note kind="warn" title="On the statistics you will see quoted">
        <p>
          Articles on this topic cite confident figures — &ldquo;customers read 10 reviews before trusting a
          business&rdquo;, &ldquo;93% are influenced by reviews&rdquo;. These come from marketing surveys, often
          published by companies selling review software, with self-reported answers. Directionally they are probably
          right; precisely they are not evidence. We are not going to repeat numbers we cannot stand behind.
        </p>
      </Note>

      <H2 id="find-yours">Finding the number for your street</H2>

      <p>
        Ten minutes, no tools, and the result is the only benchmark that matters to you.
      </p>

      <Steps
        items={[
          {
            name: 'Write down the search you want to win',
            text: 'The exact words a customer would use. "Dentist in Velachery", "coffee near me", "car service Adyar". Pick the one that would actually bring you walk-ins, not the most flattering one.',
          },
          {
            name: 'Search it from your customer\'s position',
            text: 'Use a phone, not your office desktop, and ideally while near your premises — local results are heavily distance-weighted, so searching from elsewhere gives you someone else\'s results. A private window avoids your own history skewing it.',
          },
          {
            name: 'Note the top three in the map pack',
            text: 'For each: review count and star rating. Those three businesses are your actual competition for that search.',
          },
          {
            name: 'Your target is the middle one',
            text: 'Not the top result, which may be winning on distance you cannot change. Matching the second or third listing\'s review count, at a comparable rating, is the realistic goal.',
          },
          {
            name: 'Repeat for two or three more searches',
            text: 'Different phrasings surface different competitors. Take the highest count you see as your stretch number.',
          },
        ]}
      />

      <Note kind="example" title="A worked example">
        <p>
          A salon searches &ldquo;salon in Adyar&rdquo; and sees: 4.8 with 312 reviews, 4.6 with 94, 4.4 with 71. They
          have 23.
        </p>
        <p>
          The target is not 312 — that business has been collecting for years. It is around 90, which is the middle
          listing. At six new reviews a week, which a counter code comfortably produces for a salon, that is about
          three months. Having a number like &ldquo;90 by March&rdquo; is considerably more useful than &ldquo;get more
          reviews&rdquo;.
        </p>
      </Note>

      <H2 id="thresholds">The thresholds that do matter</H2>

      <p>
        While there is no universal target, there are a few points where something changes for the person reading your
        listing.
      </p>

      <Table
        head={['Reviews', 'What a shopper concludes']}
        rows={[
          ['0', 'Possibly closed, possibly brand new, probably risky'],
          ['1–5', 'Too few to mean anything; one bad one dominates the rating'],
          ['10–20', 'The rating starts to look like a real signal rather than chance'],
          ['30–50', 'Credible. Enough that one bad review no longer moves the average much'],
          ['100+', 'Established. Comparable with anyone else on the street'],
          ['250+', 'The count itself becomes a selling point'],
        ]}
        caption="These are about reader psychology, not any ranking formula."
      />

      <p>
        The jump from 5 to 30 is the most valuable stretch, because it is where a rating stops being noise. It is also
        the easiest, since you are starting from nearly nothing.
      </p>

      <H2 id="why-47">Why 4.7 outperforms 5.0</H2>

      <p>
        Counterintuitive and consistent: a perfect rating converts worse than a very good one.
      </p>

      <p>
        A shopper looking at 5.0 across 40 reviews has learned to be suspicious, because they have seen filtered and
        purchased profiles before. More practically, they cannot do the thing they came to do — they read the critical
        reviews specifically to find out what goes wrong and decide whether it matters to them. A listing with no
        criticism gives them nothing to weigh, so they go and read the next business instead.
      </p>

      <p>
        A 4.7 with visible one and two star reviews, each with a sensible owner reply, answers the question honestly
        and demonstrates that problems get handled. That is a stronger position than apparent perfection.
      </p>

      <H3 id="implication">What that means for you</H3>

      <p>
        Stop protecting the average. If you are above roughly 4.2, the rating is not your constraint and chasing a
        higher one by filtering who gets asked is both against{' '}
        <Guide to="review-gating-google-policy">Google&apos;s policy</Guide> and worse for conversion than the honest
        number.
      </p>

      <H2 id="how-long">How long it takes to get there</H2>

      <p>
        Depends almost entirely on footfall and whether the ask is automatic. Rough arithmetic you can do for your own
        business:
      </p>

      <Table
        head={['Customers per week', 'With a counter code', 'Asked by hand, sometimes']}
        rows={[
          ['50', '4–8 reviews/week', '0–1'],
          ['150', '12–25 reviews/week', '1–3'],
          ['400', '30–60 reviews/week', '3–8'],
        ]}
        caption="Based on what we see when a code sits where customers pay, against the same businesses before. Your conversion depends heavily on placement — treat these as a planning range, not a promise."
      />

      <p>
        The gap between the two columns is the whole argument for a mechanism over a reminder. It is not that staff
        asking does not work; it is that it only happens on quiet days.
      </p>

      <H2 id="after">What to do once you are ahead</H2>

      <p>
        Do not stop, and do not start watching the number weekly. Two things once you have passed your target:
      </p>

      <Steps
        items={[
          {
            name: 'Keep the mechanism running',
            text: 'Review counts do not decay, but a listing whose newest review is a year old reads as stale to a human regardless. The code is already on the counter; leave it there.',
          },
          {
            name: 'Shift attention to what the reviews say',
            text: 'Once volume is handled, the remaining gain is in review content — whether they mention the specific services you want to be found for. Change the question on your card and every subsequent review changes with it.',
          },
        ]}
      />

      <p>
        <Guide to="google-reviews-local-seo">Why the words inside reviews matter more than the count</Guide>
      </p>

      <Note kind="good" title="The ten-minute version">
        <p>
          Search the term you want to win, from a phone, near your premises. Note what the second and third listings
          have. That is your target. Then put a code where people pay and check back in a month.
        </p>
      </Note>

      <p>
        <Guide to="how-to-get-more-google-reviews">The full guide to getting there</Guide>
      </p>
    </>
  );
}
