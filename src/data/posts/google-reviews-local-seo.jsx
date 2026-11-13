import { Table, Note, Steps, Guide, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'three-factors', label: 'The three factors Google names' },
  { id: 'what-counts', label: 'Which parts of a review profile matter' },
  { id: 'keywords', label: 'Why the words inside reviews matter most' },
  { id: 'velocity', label: 'Review velocity, properly defined' },
  { id: 'replies', label: 'Whether replying helps ranking' },
  { id: 'rating-vs-count', label: 'Rating or count — which to chase' },
  { id: 'cant-control', label: 'What you cannot influence' },
];

export default function Body() {
  return (
    <>
      <p>
        Reviews are one of the three things Google says decides which businesses appear in local results. That makes
        them unusual: most ranking factors are inferred by practitioners, while this one is stated.
      </p>

      <p>
        What follows separates what Google publishes from what the industry believes, because the second category is
        much larger and much less reliable.
      </p>

      <Toc items={toc} />

      <H2 id="three-factors">The three factors Google names</H2>

      <p>
        Google&apos;s own guidance on local ranking lists three inputs. Paraphrasing its documentation:
      </p>

      <Table
        head={['Factor', 'What it means', 'Can you influence it?']}
        rows={[
          [
            'Relevance',
            'How well your listing matches what someone searched for — your category, services, description and the language in your reviews.',
            'Yes, substantially',
          ],
          [
            'Distance',
            'How far you are from the searcher, or from the area they named.',
            'No',
          ],
          [
            'Prominence',
            'How well known the business is — which Google says includes review count and review score, alongside links, articles and directory presence.',
            'Yes, this is where reviews sit',
          ],
        ]}
        caption="Google states these three; it does not publish their relative weights or any formula."
      />

      <p>
        So reviews feed prominence directly and relevance indirectly, through the words customers use. Distance is
        fixed, which is why a business two streets further out needs a stronger profile to appear alongside you.
      </p>

      <Note kind="info" title="A sense of proportion">
        <p>
          Reviews are one input among several and they are not a substitute for the basics. A listing in the wrong
          primary category, with no hours, no photos and an unverified address will not rank well with four hundred
          reviews. Get the category and the details right first; they are a single afternoon&apos;s work and they gate
          everything else.
        </p>
      </Note>

      <H2 id="what-counts">Which parts of a review profile matter</H2>

      <p>
        Google names count and score. Practitioners, from correlation studies rather than confirmation, generally also
        point at recency, the keywords inside review text, reviewer credibility, and whether the owner replies. Treat
        the first two as established and the rest as well-supported inference.
      </p>

      <Table
        head={['Signal', 'Status', 'Practical takeaway']}
        rows={[
          ['Total review count', 'Named by Google', 'More is better, with diminishing returns'],
          ['Average star rating', 'Named by Google', 'Stay above about 4.2; perfection is not required'],
          ['Recency of reviews', 'Widely believed', 'A steady trickle beats an old burst'],
          ['Keywords in review text', 'Widely believed, strong evidence', 'Encourage customers to name the service'],
          ['Reviews with photos', 'Believed, weak evidence', 'Nice to have, not worth engineering'],
          ['Owner replies', 'Believed, mixed evidence', 'Do it for readers regardless'],
          ['Reviewer’s own history', 'Believed', 'Nothing you can or should influence'],
        ]}
      />

      <H2 id="keywords">Why the words inside reviews matter most</H2>

      <p>
        This is the part most businesses miss, and it is the highest-leverage thing in this guide.
      </p>

      <p>
        A review saying &ldquo;great place, lovely staff&rdquo; tells Google almost nothing about what you do. A review
        saying &ldquo;best filter coffee in Velachery and they do a proper South Indian breakfast&rdquo; contains your
        service, your dish and your neighbourhood. When someone searches &ldquo;filter coffee near me&rdquo;, the
        second listing has text on its profile matching that query.
      </p>

      <p>
        You cannot write reviews, and you must not ask for specific wording. What you can do is ask a question that
        produces specifics naturally.
      </p>

      <Steps
        items={[
          {
            name: 'Ask what, not how',
            text: '"What did you have today?" produces "the mutton biryani was excellent". "How was everything?" produces "good, thanks". Same effort, completely different review.',
          },
          {
            name: 'Put the question on the card',
            text: 'The prompt a customer reads while deciding what to type is the single biggest influence on what they write. "How was your haircut?" gets you the word haircut.',
          },
          {
            name: 'Never dictate the wording',
            text: 'Handing someone a script, or asking them to mention a particular phrase, is review manipulation. Asking an open question about their visit is not.',
          },
        ]}
      />

      <Note kind="good" title="The one change worth making today">
        <p>
          Change your review card from &ldquo;Leave us a review&rdquo; to &ldquo;What did you have today?&rdquo; — or
          the equivalent for your trade. It costs one print run and it changes the content of every review you receive
          from then on.
        </p>
      </Note>

      <H2 id="velocity">Review velocity, properly defined</H2>

      <p>
        Velocity is simply the rate at which new reviews arrive. The reason it gets attention is that an unusual rate
        is the clearest signal of manipulation available — forty reviews in a week on a listing that averaged one a
        month looks like exactly what it usually is.
      </p>

      <p>
        What that means in practice is less exciting than it sounds, and more useful:
      </p>

      <Steps
        items={[
          {
            name: 'A consistent rate is the goal',
            text: 'Three a week forever beats sixty in one campaign and nothing after. Build a mechanism rather than running a push.',
          },
          {
            name: 'A gap reads as stale',
            text: 'Independent of any algorithm, a human comparing two businesses looks at the dates. A newest review from fourteen months ago suggests a business that may have changed or closed.',
          },
          {
            name: 'Sudden spikes invite scrutiny',
            text: 'If you have just started collecting properly, your rate will jump — that is unavoidable and fine. What matters is that it then stays up rather than spiking and stopping.',
          },
        ]}
      />

      <p>
        A QR code on a counter is a mechanism; an email blast is a campaign. That distinction is most of what this
        factor comes down to.{' '}
        <Guide to="qr-code-for-google-reviews">Setting up the mechanism</Guide>
      </p>

      <H2 id="replies">Whether replying helps ranking</H2>

      <p>
        Google encourages owners to reply and says it values engagement; whether replies lift ranking specifically is
        not something it confirms, and the correlation studies are mixed.
      </p>

      <p>
        Reply anyway, because the conversion case is unambiguous. A reader deciding between two similar businesses is
        materially influenced by seeing one of them answer criticism properly. Ranking a place higher is worth little
        if the profile then loses the click.{' '}
        <Guide to="how-to-respond-to-negative-reviews">How to write the replies</Guide>
      </p>

      <H2 id="rating-vs-count">Rating or count — which to chase</H2>

      <p>
        Count, until you are above roughly 4.2. Then neither, specifically — keep collecting and the rating follows.
      </p>

      <p>
        The reasoning: below about 4.0 the rating itself puts people off, so it needs fixing. Between 4.2 and 4.8 the
        rating is no longer the deciding factor and volume is doing the work, because a 4.5 with 200 reviews is more
        persuasive than a 4.9 with 12. Above 4.9, shoppers start to discount it — a flawless rating with no critical
        reviews reads as filtered, because it frequently is.
      </p>

      <Table
        head={['Where you are', 'What to work on']}
        rows={[
          ['Below 4.0', 'The underlying problem the reviews describe, then volume'],
          ['4.0 – 4.2', 'Volume, hard. New reviews will pull the average up on their own'],
          ['4.2 – 4.8', 'Volume and recency. Stop watching the average'],
          ['Above 4.8 with low volume', 'Volume only — the rating is already not the constraint'],
          ['5.0 with under 20 reviews', 'Volume. A perfect score at low volume reads as suspicious'],
        ]}
      />

      <p>
        Working out the number for your own area:{' '}
        <Guide to="how-many-google-reviews-do-you-need">How many reviews do you actually need?</Guide>
      </p>

      <H2 id="cant-control">What you cannot influence</H2>

      <p>Worth knowing so you stop trying.</p>

      <Steps
        items={[
          {
            name: 'Distance from the searcher',
            text: 'The largest factor in many local searches and completely fixed. A stronger profile is how you compete with someone closer, and there is a limit to how far that stretches.',
          },
          {
            name: 'Which reviews Google displays first',
            text: 'Google chooses, and it is not chronological or rating-ordered. You cannot pin a favourite.',
          },
          {
            name: 'Whether a review survives',
            text: 'Reviews get filtered or removed by automated systems with no notice and occasionally no apparent reason, including genuine ones. Losing a few is normal.',
          },
          {
            name: 'The weighting of any of this',
            text: 'Google does not publish it and it changes. Anyone quoting you a precise percentage breakdown of local ranking factors is reporting a survey of opinions, not a formula.',
          },
        ]}
      />

      <Note kind="good" title="If you do three things">
        <p>
          Get your primary category and listing details right. Put a question-shaped prompt where customers pay, so
          reviews arrive weekly and mention what you actually sell. Reply to all of them. That covers the parts of this
          you control, and it is most of the available benefit.
        </p>
      </Note>

      <p>
        Full guide: <Guide to="how-to-get-more-google-reviews">how to get more Google reviews</Guide>
      </p>
    </>
  );
}
