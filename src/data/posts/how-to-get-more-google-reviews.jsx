import { Table, Note, Steps, Script, Guide, DoDont, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'why-nobody-reviews', label: 'Why almost nobody reviews you' },
  { id: 'the-link', label: 'Start with the link' },
  { id: 'the-moment', label: 'Ask at the right moment' },
  { id: 'the-words', label: 'What to actually say' },
  { id: 'ranked', label: 'Thirteen tactics, ranked by effort' },
  { id: 'velocity', label: 'Steady beats a burst' },
  { id: 'mistakes', label: 'Three things that get listings penalised' },
  { id: 'measure', label: 'How to tell if it is working' },
];

export default function Body() {
  return (
    <>
      <p>
        There is a specific kind of frustration in running a business people genuinely like and watching your Google
        rating sit at 4.1. The customers who had a good time walk out and get on with their day. The one whose order
        was wrong goes home, sits down, and writes three paragraphs.
      </p>

      <p>
        That asymmetry is the whole problem, and it is not a reflection of your business. Fixing it is mostly
        mechanical: make reviewing take ten seconds, ask at the one moment people are willing, and ask every single
        time rather than when someone remembers to.
      </p>

      <Toc items={toc} />

      <H2 id="why-nobody-reviews">Why almost nobody reviews you</H2>

      <p>
        Leaving a review is a favour with no payoff for the person doing it. They have to remember your name, find you
        on Google, be signed in, think of something to say, and type it on a phone keyboard. Each of those steps loses
        people. By the time they are home, the moment has gone.
      </p>

      <p>
        Unhappy customers push through all of it, because annoyance is a much stronger motivator than mild
        satisfaction. So the reviews you get are not a sample of your customers — they are a sample of your customers
        who felt something strongly, which skews negative no matter how good you are.
      </p>

      <Note kind="info" title="The one number worth knowing">
        <p>
          Ask someone to review you later and you lose almost everyone. Hand them something to scan while they are
          still standing in front of you and a meaningful share will finish it before they leave. Everything below is
          a variation on that single idea: shorten the gap between the good experience and the ask to zero.
        </p>
      </Note>

      <H2 id="the-link">Start with the link</H2>

      <p>
        Before any tactic, get your direct review link. It opens the review box on your listing immediately, with no
        searching and no navigating. Most businesses have never found it, which means every review they do get came
        from someone willing to hunt.
      </p>

      <p>
        It lives in your Google Business Profile, and Google moves it every so often, so it is worth following the
        current click path rather than a screenshot from two years ago.{' '}
        <Guide to="google-review-link">Where to find your Google review link</Guide>
      </p>

      <p>
        Once you have it, that one URL powers everything else: the QR code on your counter, the line in your email
        signature, the WhatsApp message after a job, the text on the receipt.
      </p>

      <H2 id="the-moment">Ask at the right moment</H2>

      <p>
        There is usually exactly one good moment per customer, and it is narrower than people expect. It is the point
        where they have had the good bit and are not yet gone — paying, waiting for a card machine, being handed a bag,
        sitting in the chair after a haircut has gone well.
      </p>

      <Table
        head={['Business', 'The moment', 'Where the ask lives']}
        rows={[
          ['Café or restaurant', 'Bill arrives, before they stand up', 'Card on the bill tray or table'],
          ['Salon or barber', 'Chair spun round, they like it', 'Sticker on the mirror'],
          ['Dental or medical clinic', 'At reception, paying or booking the next visit', 'Standing card on the desk'],
          ['Car workshop', 'Handing over the keys', 'On the invoice and a WhatsApp follow-up'],
          ['Retail', 'At the till while the card processes', 'Sticker beside the card machine'],
          ['Hotel', 'Checkout, bags already down', 'Card at the desk and in the room folder'],
          ['Trades and home visits', 'Job finished, before you pack up', 'Message sent from the van'],
        ]}
        caption="The pattern is the same everywhere: the ask belongs where the customer is already standing still."
      />

      <p>
        The moments that do not work: a day later by email, a week later by SMS, anything that arrives when they have
        forgotten the visit. Those campaigns are not useless, but they convert in the low single digits and they wear
        out your goodwill.
      </p>

      <H2 id="the-words">What to actually say</H2>

      <p>
        If a person is involved, the words matter. Two things make the difference: asking for a specific thing, and
        giving them something to say.
      </p>

      <DoDont
        doItems={[
          '"Would you mind leaving us a quick review? There is a code on the bill."',
          '"If you have ten seconds, scanning that helps us a lot."',
          '"What did you have today? Mentioning the dish really helps us."',
        ]}
        dontItems={[
          '"Please give us five stars."',
          '"We need reviews to hit our target this month."',
          '"Leave a review and get 10% off next time."',
        ]}
      />

      <p>
        The third item in each column is the important pair. Asking what they had produces a review that mentions the
        dish, the treatment or the service — and those words are part of why the listing shows up for searches about
        that thing. Offering a discount for a review breaks Google&apos;s rules and, in the US, consumer protection
        rules as well.
      </p>

      <Script label="A line that works out loud">
        &ldquo;Thanks — if you have a few seconds, there&apos;s a code on the tray that goes straight to our Google
        page. Mentioning what you ordered helps more than you&apos;d think.&rdquo;
      </Script>

      <p>
        Write that on a card and stick it by the till. Staff turnover will otherwise erode it within a month.
      </p>

      <H2 id="ranked">Thirteen tactics, ranked by effort</H2>

      <p>
        Ordered by how much review volume you get per unit of effort. The first four are worth doing this week; the
        last few are only worth it once the earlier ones are running.
      </p>

      <Table
        head={['#', 'Tactic', 'Effort', 'Typical effect']}
        rows={[
          ['1', 'QR code card where customers pay', 'One afternoon', 'Largest single jump most businesses see'],
          ['2', 'Review link in your email signature', 'Five minutes', 'Small but permanent and free'],
          ['3', 'Staff asking at the till, with a script', 'Ongoing', 'Doubles whatever the card alone gets'],
          ['4', 'Review link on the printed receipt', 'One print run', 'Steady trickle, no staff effort'],
          ['5', 'WhatsApp message after a job or delivery', 'Per customer', 'Strong for trades and services'],
          ['6', 'Replying to every existing review', 'An hour a week', 'Encourages more, and shows you are present'],
          ['7', 'Link on your website footer and contact page', 'Thirty minutes', 'Catches people already looking you up'],
          ['8', 'Sticker at eye level by the exit', 'One afternoon', 'Works where there is no counter'],
          ['9', 'Link in your Instagram and WhatsApp bio', 'Ten minutes', 'Modest, but costs nothing'],
          ['10', 'Printed card in the bag or with the invoice', 'Per order', 'Good for takeaway and retail'],
          ['11', 'SMS follow-up within an hour of the visit', 'Setup plus per-message cost', 'Works if it is genuinely within the hour'],
          ['12', 'Email campaign to past customers', 'A day', 'One-off bump, then nothing'],
          ['13', 'Asking on the phone during a support call', 'Ongoing', 'Awkward, but converts well when natural'],
        ]}
      />

      <p>
        Number one does most of the work, which is why it is worth getting right rather than printing something in
        five minutes.{' '}
        <Guide to="qr-code-for-google-reviews">How to make a review QR code people actually scan</Guide>
      </p>

      <H2 id="velocity">Steady beats a burst</H2>

      <p>
        A common instinct is to email your whole customer list and get forty reviews in a week. It feels like progress
        and it is the wrong shape. Forty reviews appearing on a listing that averaged one a month looks exactly like
        bought reviews, and the pattern that looks organic — a few every week, indefinitely — is also the pattern that
        keeps your listing looking current.
      </p>

      <p>
        Practitioners call this review velocity, and the useful version of the idea is simple: a mechanism that
        produces three reviews every week forever beats a campaign that produces sixty once. A QR code on a counter is
        a mechanism. An email blast is a campaign.
      </p>

      <Note kind="info" title="Why recency matters to a reader, never mind Google">
        <p>
          Someone comparing two restaurants looks at the dates. A 4.8 whose newest review is from fourteen months ago
          reads as a business that might have changed hands. A 4.5 with three reviews this month reads as open,
          busy and current. The second one gets the booking.
        </p>
      </Note>

      <p>
        More on which parts of this Google says it uses:{' '}
        <Guide to="google-reviews-local-seo">How reviews affect local search ranking</Guide>
      </p>

      <H2 id="mistakes">Three things that get listings penalised</H2>

      <H3 id="mistake-incentives">Offering anything in exchange</H3>

      <p>
        A discount, a free coffee, entry into a draw, a loyalty stamp. Google prohibits incentivised reviews outright,
        and in the United States the Federal Trade Commission has a rule on fake and incentivised reviews carrying
        civil penalties per violation. Published figures for the per-violation maximum vary between sources and are
        adjusted over time, so treat any specific number you read as approximate — the relevant point is that it is
        large and it is per review.
      </p>

      <H3 id="mistake-gating">Only asking the happy ones</H3>

      <p>
        Showing a survey first and only sending the people who rated you well on to Google is called review gating.
        It is explicitly against Google&apos;s policy, and it is the single most common thing review software does.
      </p>

      <p>
        We are unusually direct about this because our own product can be configured either way, and getting it wrong
        is your listing at risk, not ours.{' '}
        <Guide to="review-gating-google-policy">What Google&apos;s policy actually says about gating</Guide>
      </p>

      <H3 id="mistake-buying">Buying them</H3>

      <p>
        Bought reviews come from accounts with no history, in bursts, often with similar phrasing, and they get
        removed. The listing they were pointed at can be suspended. Any supplier promising fifty reviews for a flat
        fee is selling you the risk, not the reviews.
      </p>

      <Note kind="warn" title="What a penalty actually looks like">
        <p>
          Reviews disappearing in a batch. A warning in your Business Profile dashboard. In the worst case the profile
          is suspended, which removes you from Maps and the local results entirely until you appeal — and appeals take
          weeks. For a business that gets most of its walk-ins from &ldquo;near me&rdquo; searches, that is a closed
          shop with the lights on.
        </p>
      </Note>

      <H2 id="measure">How to tell if it is working</H2>

      <p>
        Two numbers, checked monthly. Everything else is noise.
      </p>

      <Steps
        items={[
          {
            name: 'New reviews per month',
            text: 'Count them on the first of each month and write the number down. This is the only measure of whether your asking mechanism works. A business that has gone from two a month to nine a month is winning, whatever the average says.',
          },
          {
            name: 'Where you sit against the three above you',
            text: 'Search the term you want to win — "dentist in Velachery", "coffee near me" — and note the review count and rating of whoever appears above you. That is your actual target, and it is a much more useful goal than a round number.',
          },
        ]}
      />

      <p>
        Work out what that target is for your own street:{' '}
        <Guide to="how-many-google-reviews-do-you-need">How many Google reviews do you actually need?</Guide>
      </p>

      <p>
        And when a bad one does arrive — it will, and it should — the reply is read by far more people than the review
        itself. <Guide to="how-to-respond-to-negative-reviews">How to respond to a bad review</Guide>
      </p>

      <Note kind="good" title="If you only do one thing">
        <p>
          Find your review link, turn it into a QR code, print it on a card, and put the card where people pay. That
          single change outperforms every email campaign we have seen, and it keeps working without anyone having to
          remember anything.
        </p>
      </Note>
    </>
  );
}
