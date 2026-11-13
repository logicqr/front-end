import { Table, Note, Steps, Guide, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'what-it-is', label: 'What the review link is' },
  { id: 'find-it', label: 'Finding it in your profile' },
  { id: 'no-access', label: 'If you cannot get into the profile' },
  { id: 'place-id', label: 'Building it by hand from a Place ID' },
  { id: 'where', label: 'Eight places worth putting it' },
  { id: 'shorten', label: 'Shortening it, and when not to' },
];

export default function Body() {
  return (
    <>
      <p>
        Your Google review link opens the review box on your listing directly. No search, no scrolling past the photos,
        no finding the right button. Someone taps it, the star selector is already there, and they type.
      </p>

      <p>
        It is the most useful URL your business has, and the majority of owners we speak to have never found it. Here
        is where it lives, how to rebuild it if you cannot reach your profile, and what to do with it once you have it.
      </p>

      <Toc items={toc} />

      <H2 id="what-it-is">What the review link is</H2>

      <p>
        Google generates a short link for every verified Business Profile. It looks roughly like{' '}
        <code>g.page/r/XXXXXXXXXXXX/review</code>. Opened on a phone it goes straight to the review form inside the
        Google app or browser; on a desktop it opens the write-a-review dialog on your listing.
      </p>

      <p>
        What makes it valuable is the steps it removes. Every step between &ldquo;I would leave a review&rdquo; and the
        keyboard appearing loses a share of people, and the normal route — open Google, search the business name, pick
        the right one of three similarly named places, scroll to reviews, tap write — loses most of them.
      </p>

      <H2 id="find-it">Finding it in your profile</H2>

      <p>
        Google has moved this control several times and will again, so the labels below may differ slightly from what
        you see. The thing you are looking for is always called something like &ldquo;Ask for reviews&rdquo; or
        &ldquo;Get more reviews&rdquo;.
      </p>

      <Steps
        items={[
          {
            name: 'Sign in as the business',
            text: 'Use the Google account that manages the listing. Search your own business name while signed in, or go to business.google.com. Your profile controls appear directly in the search results these days rather than in a separate dashboard.',
          },
          {
            name: 'Find the "Ask for reviews" control',
            text: 'In the profile panel look for a button or card labelled "Ask for reviews", "Get more reviews" or "Share review form". On mobile it is often behind a "Promote" or "More" menu.',
          },
          {
            name: 'Copy the link it offers',
            text: 'Google shows the short g.page link with a copy button, and usually offers to share it by email or WhatsApp. Copy it rather than using the share buttons — you want the raw URL.',
          },
          {
            name: 'Test it on a different phone',
            text: 'Open it on a phone that is not signed in as the business. You should land on the review box for your listing, not on your profile or a search page. If it lands anywhere else, you have the wrong link.',
          },
        ]}
      />

      <Note kind="warn" title="Check it with someone else's phone">
        <p>
          Signed in as the business owner, Google often shows you your own profile dashboard instead of a review form —
          so the link looks broken when it is fine. Always test with a phone that is signed in as someone else, or in a
          private window.
        </p>
      </Note>

      <H2 id="no-access">If you cannot get into the profile</H2>

      <p>
        Very common: the listing was set up years ago by an agency, a previous manager, or a relative, and nobody knows
        which account owns it. Two options.
      </p>

      <p>
        <strong>Claim it.</strong> Search your business, open the listing, and look for &ldquo;Own this
        business?&rdquo; or &ldquo;Claim this business&rdquo;. Google will run a verification — postcard, phone call,
        or video of the premises — and if the current owner does not respond within a week or two, control transfers to
        you. Worth starting today even if you do nothing else, because an unclaimed listing is also one you cannot
        reply to reviews from.
      </p>

      <p>
        <strong>Or build the link by hand</strong>, which works without any access at all.
      </p>

      <H2 id="place-id">Building it by hand from a Place ID</H2>

      <p>
        Every place on Google Maps has a public Place ID. With it you can construct a review URL that needs no
        dashboard access.
      </p>

      <Steps
        items={[
          {
            name: 'Get your Place ID',
            text: 'Search for "Google Place ID finder" and use Google\'s own tool on developers.google.com. Type your business name and address; it returns a string starting ChIJ.',
          },
          {
            name: 'Build the URL',
            text: 'Take https://search.google.com/local/writereview?placeid= and append your Place ID. That is the whole link.',
          },
          {
            name: 'Test it the same way',
            text: 'Open it on a phone not signed in as the business. It should show the review box with your business name at the top.',
          },
        ]}
      />

      <Note kind="example" title="What it looks like assembled">
        <p>
          <code>https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4</code>
        </p>
        <p>
          Longer and uglier than the <code>g.page</code> version, which matters if a human will type it, and does not
          matter at all behind a QR code or a hyperlink.
        </p>
      </Note>

      <p>
        This is the form LogicQR uses internally, which is why setup asks you to pick your business from a list — it is
        capturing the Place ID so the redirect works without needing access to your profile.
      </p>

      <H2 id="where">Eight places worth putting it</H2>

      <Table
        head={['Where', 'How', 'Worth it?']}
        rows={[
          ['On the counter or bill tray', 'Printed QR code card', 'Highest return of anything on this list'],
          ['Email signature', 'One line: "Happy with our work? Review us on Google"', 'Five minutes, permanent'],
          ['Printed receipt', 'Short link or QR at the bottom', 'Steady, no staff effort'],
          ['WhatsApp after a job', 'Paste the link with one sentence', 'Very strong for trades and services'],
          ['Website footer and contact page', 'Text link', 'Catches people already looking you up'],
          ['Instagram and WhatsApp bio', 'In the link list', 'Modest, costs nothing'],
          ['Invoice template', 'Footer line', 'Good for B2B and workshops'],
          ['Thank-you card in the bag', 'Printed QR', 'Good for takeaway and retail'],
        ]}
      />

      <p>
        One caution on the two that involve sending a message: send them to everyone you served, not only the people
        you expect to be pleased. Filtering first is{' '}
        <Guide to="review-gating-google-policy">review gating, which Google prohibits</Guide>.
      </p>

      <H2 id="shorten">Shortening it, and when not to</H2>

      <p>
        The <code>g.page</code> link is already short. The hand-built <code>writereview?placeid=</code> version is not,
        and if a person has to read it off a card and type it, that is a problem.
      </p>

      <H3 id="shorten-when">Shorten it when</H3>
      <p>
        a human will read it aloud or type it, or it is going on a printed card with no QR code. A branded short link
        on your own domain — <code>yourshop.com/review</code> redirecting to the Google URL — is better than a generic
        shortener: it survives the shortener going out of business, and people trust a domain they recognise.
      </p>

      <H3 id="shorten-not">Do not bother when</H3>
      <p>
        it sits behind a QR code or a hyperlink, because nobody ever sees it. Adding a shortener there only introduces
        something else that can break, and some shorteners get flagged by security software or blocked on corporate
        networks.
      </p>

      <Note kind="good" title="The two-minute version">
        <p>
          Get the link from &ldquo;Ask for reviews&rdquo; in your Business Profile, or build it from your Place ID if
          you cannot get in. Test it on someone else&apos;s phone. Then put it on a card where people pay — that one
          placement outperforms the other seven combined.
        </p>
      </Note>

      <p>
        Next: <Guide to="qr-code-for-google-reviews">turning it into a QR code people actually scan</Guide>, or the
        full picture in <Guide to="how-to-get-more-google-reviews">how to get more Google reviews</Guide>.
      </p>
    </>
  );
}
