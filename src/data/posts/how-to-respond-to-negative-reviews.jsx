import { Table, Note, Steps, Script, Guide, DoDont, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'who-for', label: 'Who the reply is really for' },
  { id: 'structure', label: 'The four-sentence structure' },
  { id: 'templates', label: 'Eleven templates' },
  { id: 'worse', label: 'Three replies that make it worse' },
  { id: 'removal', label: 'When a review can actually be removed' },
  { id: 'fake', label: 'Dealing with a fake or malicious review' },
  { id: 'process', label: 'Making it a habit' },
];

export default function Body() {
  return (
    <>
      <p>
        A bad review feels personal, and the instinct is either to explain yourself at length or to say nothing. Both
        are worse than the thing that works, which is four unemotional sentences posted within a day or two.
      </p>

      <Toc items={toc} />

      <H2 id="who-for">Who the reply is really for</H2>

      <p>
        Not the person who complained. They have had their say and most will never read your response.
      </p>

      <p>
        The reply is for the next several dozen people deciding whether to come in. They are reading the one and two
        star reviews deliberately — it is the fastest way to find out what goes wrong somewhere and whether anyone
        cares. Your reply is the only part of that exchange you control, and it is read far more than the review.
      </p>

      <Note kind="info" title="What a reader is checking">
        <p>
          Three things, in this order: is this a problem that would affect me, did the business take it seriously, and
          is this a one-off or the pattern. A good reply answers all three in about fifty words. A defensive one
          answers the third question in the worst possible way.
        </p>
      </Note>

      <H2 id="structure">The four-sentence structure</H2>

      <Steps
        items={[
          {
            name: 'Acknowledge the specific thing',
            text: 'Name what went wrong in their words. "Sorry about the wait on Saturday" shows you read it. "Sorry you had a negative experience" shows you have a template.',
          },
          {
            name: 'Say what happened, briefly and without excuses',
            text: 'One clause. "We were two staff down" is context. Three paragraphs about supplier problems is a defence, and it reads as one.',
          },
          {
            name: 'Say what changed',
            text: 'The sentence that does the most work. "We now have a third person on the counter at lunch" tells the next reader the problem is handled. Without this the reply is just politeness.',
          },
          {
            name: 'Offer to continue it privately',
            text: 'One line with a real contact route. It signals you are not hiding, and it moves any further detail off a public page.',
          },
        ]}
      />

      <Script label="The structure, assembled">
        Thanks for telling us, and sorry about the twenty-minute wait on Saturday — that is not the experience we want
        anyone to have. We were short-staffed at lunch that day, which is on us to plan for. There is now a third
        person on the counter between twelve and two. If you would like to give us another go, email me directly at
        the address on our profile and your coffee is on me.
      </Script>

      <p>
        Fifty-eight words. Specific, non-defensive, and the third sentence is doing the selling.
      </p>

      <H2 id="templates">Eleven templates</H2>

      <p>
        Adapt rather than paste. The specifics are what make a reply work, and a reader can tell a template at a
        glance.
      </p>

      <H3 id="t-wait">Long wait</H3>
      <p>
        &ldquo;Thanks for the honest feedback, and sorry you waited that long — twenty minutes is too long and you were
        right to say so. We were a person short that afternoon. We have changed how we staff the lunch hour since. If
        you come back, ask for [name] and we will look after you.&rdquo;
      </p>

      <H3 id="t-quality">Food or product quality</H3>
      <p>
        &ldquo;Sorry the biryani was dry — that is not how it should leave our kitchen and I would have wanted to
        replace it there and then. I have been through it with the kitchen this week. Please email me if you are
        willing to try us again; I would like to put it right properly.&rdquo;
      </p>

      <H3 id="t-rude">Rude or unhelpful staff</H3>
      <p>
        &ldquo;This one genuinely bothers me and I am sorry. I do not know yet who was on, but I will find out and
        speak to them — not to tell you off in public, just so you know it is being dealt with. Thank you for telling
        me rather than just not coming back.&rdquo;
      </p>

      <H3 id="t-price">Price complaint</H3>
      <p>
        &ldquo;Thanks for the feedback. I understand we are not the cheapest option around, and that is a fair thing to
        weigh up. What you are paying for is [the specific thing]. If that is not what you were after, I completely
        understand — I would rather be clear about it than have anyone feel caught out.&rdquo;
      </p>

      <H3 id="t-wrong">Factually wrong review</H3>
      <p>
        &ldquo;Thanks for writing. I have checked our records and I cannot find a booking under this name for that
        date — I wonder whether this was meant for another business. If I have got that wrong, do email us with the
        date and I will look into it properly.&rdquo;
      </p>

      <H3 id="t-cleanliness">Cleanliness</H3>
      <p>
        &ldquo;That is not acceptable and I am sorry you saw it. The toilets are checked hourly and clearly were not
        that day. I have put a signed check sheet on the door so it cannot be skipped. Thanks for telling us.&rdquo;
      </p>

      <H3 id="t-nostars">One star, no words</H3>
      <p>
        &ldquo;Sorry to see this. I would really like to know what went wrong — there is no detail here for me to act
        on. If you have a moment, our email is on the profile and I read everything that comes in.&rdquo;
      </p>

      <H3 id="t-clinic">Clinical or regulated setting</H3>
      <p>
        &ldquo;Thank you for the feedback. I am not able to discuss any individual&apos;s treatment in a public reply,
        so I will keep this short: please contact the practice directly and we will go through it properly with
        you.&rdquo;
      </p>
      <p>
        If you are in healthcare, legal or financial services, keep every public reply free of anything that confirms
        the person was a client at all. Acknowledge, offer a private route, stop.
      </p>

      <H3 id="t-old">Months-old review you missed</H3>
      <p>
        &ldquo;I am sorry this sat here without a reply, and sorry about the visit itself. For anyone reading now:
        [what changed] since. If you are still around, I would like to make it up to you.&rdquo;
      </p>
      <p>Replying late is better than never. The reader sees a reply, not a timestamp comparison.</p>

      <H3 id="t-competitor">You suspect a competitor</H3>
      <p>
        &ldquo;Thanks for the review. We have no record of a visit matching this, and some of the details do not match
        how we operate. If you are a customer, please get in touch and I will sort it out.&rdquo;
      </p>
      <p>Never accuse anyone publicly. Report it to Google and leave the reply neutral.</p>

      <H3 id="t-fair">A fair criticism you cannot fix</H3>
      <p>
        &ldquo;That is a fair point and I am not going to pretend otherwise — we have six tables and at seven on a
        Friday it is tight. If you would rather not wait, booking ahead or coming before six works much better.
        Thanks for the honest review.&rdquo;
      </p>

      <H2 id="worse">Three replies that make it worse</H2>

      <DoDont
        doTitle="Works"
        dontTitle="Backfires"
        doItems={[
          'Naming the specific complaint',
          'Saying what changed as a result',
          'One short paragraph',
          'Replying within a day or two',
          'The same tone you would use in person',
        ]}
        dontItems={[
          'Arguing the facts point by point',
          'Mentioning how long they stayed or what they spent',
          'Hinting they are lying or a competitor',
          'Copy-pasting the same reply to every review',
          'Replying while still annoyed',
        ]}
      />

      <p>
        The second item deserves emphasis. &ldquo;You seemed happy enough when you were here for two hours&rdquo; feels
        satisfying to type and reads, to everyone else, as a business that will argue with a customer in public. It is
        the single most damaging thing you can write, and it is almost always written within an hour of reading the
        review.
      </p>

      <Note kind="warn" title="The 24-hour rule">
        <p>
          Draft the reply, do not post it, come back tomorrow. Almost every reply a business regrets was posted the
          same hour it read the review.
        </p>
      </Note>

      <H2 id="removal">When a review can actually be removed</H2>

      <p>
        Short answer: much less often than people hope. Google removes reviews that violate its content policies, not
        reviews that are unfair, mistaken or commercially inconvenient.
      </p>

      <Table
        head={['Situation', 'Likely to be removed?']}
        rows={[
          ['Contains abuse, slurs or threats', 'Yes — clear policy violation'],
          ['Contains personal information about staff', 'Yes'],
          ['Obvious spam or advertising', 'Yes'],
          ['Clearly about a different business', 'Often, with evidence'],
          ['Posted by someone who was never a customer', 'Sometimes, and hard to prove'],
          ['Factually wrong but genuinely about you', 'No'],
          ['Unfair, harsh or one-sided', 'No'],
          ['A complaint about something outside your control', 'No'],
        ]}
      />

      <p>
        To report one: open the review on your listing, use the flag or report option, and pick the policy it breaks.
        Be accurate about which policy — reporting a merely unfair review as abuse gets the report dismissed and wastes
        the one route you have.
      </p>

      <H2 id="fake">Dealing with a fake or malicious review</H2>

      <Steps
        items={[
          {
            name: 'Screenshot it',
            text: 'Before anything else. If it is removed later you may still need the record, and if the same account returns you want the history.',
          },
          {
            name: 'Report it, once, with the right policy',
            text: 'Pick the specific violation. Repeatedly reporting the same review does not increase the chance of removal.',
          },
          {
            name: 'Reply neutrally anyway',
            text: 'Assume it stays. A calm "we have no record of this visit" reply protects you with readers whether or not Google acts.',
          },
          {
            name: 'Bury it with volume',
            text: 'The most reliable remedy. One fake review among six is a disaster; among ninety it is invisible, and it stops being the first thing anyone reads.',
          },
        ]}
      />

      <p>
        That last point is the real defence, and it is why volume matters more than perfection.{' '}
        <Guide to="how-to-get-more-google-reviews">How to get more reviews</Guide>
      </p>

      <H2 id="process">Making it a habit</H2>

      <p>
        Reply to everything, not only the bad ones. Two words on a five-star review takes seconds and shows a reader
        the whole profile is attended to.
      </p>

      <Steps
        items={[
          {
            name: 'Turn on review notifications',
            text: 'In your Business Profile settings. Replying three weeks later loses most of the benefit.',
          },
          {
            name: 'Book fifteen minutes a week',
            text: 'Friday morning, same time. Clear everything since the last session rather than reacting to each one as it arrives.',
          },
          {
            name: 'Keep a note of what you changed',
            text: 'The "what changed" sentence is the hard part to write from memory. A running list of fixes makes every future reply easy.',
          },
        ]}
      />

      <Note kind="good" title="The one thing to take away">
        <p>
          Name the specific problem, say what changed, keep it to four sentences, and wait a day before posting.
          Everything else is detail.
        </p>
      </Note>

      <p>
        Hearing complaints privately first makes this much easier — you fix the thing before it becomes a public
        review. That is the legitimate version of what gating tries to do:{' '}
        <Guide to="review-gating-google-policy">the policy-safe way to collect private feedback</Guide>.
      </p>
    </>
  );
}
