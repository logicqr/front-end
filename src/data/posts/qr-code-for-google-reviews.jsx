import { Table, Note, Steps, Script, Guide, DoDont, Toc, H2, H3 } from '../../components/blog/prose';

export const toc = [
  { id: 'why-qr', label: 'Why a code beats a campaign' },
  { id: 'make-one', label: 'Making one that works' },
  { id: 'size', label: 'Size, contrast and printing' },
  { id: 'words', label: 'What the card should say' },
  { id: 'placement', label: 'Placement, by business type' },
  { id: 'fails', label: 'Why most review QR codes collect nothing' },
  { id: 'nfc', label: 'NFC stands and whether they are worth it' },
];

export default function Body() {
  return (
    <>
      <p>
        A QR code on a counter is the highest-return review tactic we have seen, and also the one most often done
        badly. The failures are consistent and all fixable: the code is in the wrong place, the card asks for the wrong
        thing, or it is printed too small to scan from where a person is standing.
      </p>

      <Toc items={toc} />

      <H2 id="why-qr">Why a code beats a campaign</H2>

      <p>
        Timing. An email arrives hours or days later, when the customer has moved on and your service is a vague
        memory. A code on the bill tray reaches them during the good bit, while they are sitting still with a phone
        already in their hand.
      </p>

      <p>
        It also removes the staff-memory problem. Asking at the till works well, but it depends on whoever is on shift
        remembering to do it, every time, including on a Saturday when there is a queue. A card does not get tired or
        leave for a better job.
      </p>

      <Note kind="info" title="The real comparison">
        <p>
          The useful question is not &ldquo;do QR codes work&rdquo; but &ldquo;how many people pass this spot per
          week&rdquo;. A code on a counter that forty people a day pay at is a different proposition from the same code
          in a window nobody looks at. Place it where the footfall already is.
        </p>
      </Note>

      <H2 id="make-one">Making one that works</H2>

      <Steps
        items={[
          {
            name: 'Get your review link first',
            text: 'The code is only a container for a URL, and that URL has to be your direct review link — not your website, not your Maps listing. A code pointing at your homepage asks the customer to do the navigating, which is the thing you were trying to avoid.',
          },
          {
            name: 'Generate a static code, not a dynamic one',
            text: 'Free generators often produce a "dynamic" code that routes through their own domain so they can charge later or show ads. If their service goes away or starts charging, every card you printed stops working. A static code encodes your URL directly and works forever.',
          },
          {
            name: 'Export as SVG or PDF, not PNG',
            text: 'A print shop needs vector art. A 300-pixel PNG stretched onto an A5 card is a blurry code that phones struggle with — which is the single most common reason a code does not scan.',
          },
          {
            name: 'Test it from a standing distance',
            text: 'Print it at the size you will actually use, put it where it will live, and scan it from where a customer will be standing — not from six inches away at your desk.',
          },
        ]}
      />

      <p>
        If you would rather not assemble this yourself, that artwork is what LogicQR hands you at signup: a
        print-ready table card, counter stand and sticker, all pointing at your own review link.{' '}
        <Guide to="google-review-link">How to find the link itself</Guide>
      </p>

      <H2 id="size">Size, contrast and printing</H2>

      <p>
        The rule of thumb for scanning distance is that a code needs to be roughly a tenth of the distance it is
        scanned from. A code read from arm&apos;s length — about 50cm — wants to be at least 5cm across. One on a wall
        people read from two metres away needs to be 20cm.
      </p>

      <Table
        head={['Placement', 'Scan distance', 'Minimum code size']}
        rows={[
          ['Bill tray or table card', '30–40cm', '3–4cm'],
          ['Counter or reception desk', '40–60cm', '5–6cm'],
          ['Mirror sticker at a salon station', '50–70cm', '6–7cm'],
          ['Wall by the exit', '1–2m', '12–20cm'],
          ['Window, read from outside', '1.5–3m', '20–30cm'],
        ]}
        caption="Err generously. A code that is too big is mildly ugly; one that is too small collects nothing."
      />

      <H3 id="contrast">Contrast and colour</H3>

      <p>
        Dark code on a light background, always. Inverted codes — light on dark — fail on a good proportion of phone
        cameras. Brand-coloured codes are fine if the contrast is genuinely strong, and a disaster in mid-tones.
        Leave the quiet margin around the edge of the code intact; designers often crop it and that alone breaks
        scanning.
      </p>

      <H3 id="laminate">Laminate anything near food or water</H3>

      <p>
        A card on a café table lasts about three weeks before it is unreadable. Laminate it, or print on something
        wipeable. An acrylic standing holder costs very little and makes the difference between a code that works for
        two years and one you reprint monthly.
      </p>

      <H2 id="words">What the card should say</H2>

      <p>
        The words do more work than the design. Three things matter: say what will happen, make it sound brief, and
        ask for something specific.
      </p>

      <DoDont
        doTitle="Cards that get scanned"
        dontTitle="Cards that get ignored"
        doItems={[
          '"How was your coffee today?" — a question invites an answer',
          '"Takes 10 seconds" — removes the main objection',
          '"Tell us what you ordered" — produces a specific, useful review',
          'Your business name on the card, so it is obviously yours',
        ]}
        dontItems={[
          '"Scan here" with no reason given',
          '"Leave us a 5-star review" — against Google policy and off-putting',
          '"Follow us on social media" sharing the same card',
          'A code with no words at all',
        ]}
      />

      <Script label="A card that works">
        How was your visit today?
        <br />
        <strong>Scan to tell us — takes 10 seconds.</strong>
      </Script>

      <p>
        Avoid asking for a star rating by number. &ldquo;Leave us 5 stars&rdquo; is soliciting a specific rating, which
        Google treats as prohibited. &ldquo;How was your visit&rdquo; asks the same person the same question without
        the problem.
      </p>

      <H2 id="placement">Placement, by business type</H2>

      <Table
        head={['Business', 'Best spot', 'Second best']}
        rows={[
          ['Café / restaurant', 'Bill tray or folded table card', 'Sticker by the card machine'],
          ['Takeaway', 'Printed slip in the bag', 'Sticker on the counter edge'],
          ['Salon / barber', 'Sticker on each mirror', 'Standing card at reception'],
          ['Dental / medical clinic', 'Standing card at reception', 'Card handed with the next appointment slip'],
          ['Gym', 'Sticker at the front desk', 'Poster by the exit'],
          ['Car workshop', 'On the invoice, plus a card with the keys', 'WhatsApp message on collection'],
          ['Retail', 'Beside the card machine', 'Printed on the receipt'],
          ['Hotel', 'Checkout desk card', 'Room folder and key card sleeve'],
          ['Trades / home visits', 'Card left with the invoice', 'WhatsApp from the van before leaving'],
        ]}
      />

      <Note kind="info" title="Put it at eye level, not flat on a surface">
        <p>
          A code lying flat on a counter has to be scanned at an angle, which phone cameras handle poorly, and it
          disappears under receipts and card machines within a day. An upright holder at a slight tilt scans better and
          stays visible.
        </p>
      </Note>

      <H2 id="fails">Why most review QR codes collect nothing</H2>

      <p>Six reasons, in the order we see them.</p>

      <Steps
        items={[
          {
            name: 'It points at the wrong page',
            text: 'A code opening your website or your Maps listing makes the customer navigate to the review box themselves. Most do not. It must open the review form directly.',
          },
          {
            name: 'It is somewhere nobody stands',
            text: 'Window displays, noticeboards, the back of a door. If a person is walking past it, they will not stop to scan it.',
          },
          {
            name: 'It is printed too small',
            text: 'A 2cm code on a table card read from 40cm away scans inconsistently, and an inconsistent code trains staff to stop mentioning it.',
          },
          {
            name: 'The card asks for nothing',
            text: 'A bare code with "Scan me" gives no reason. A question gives a reason.',
          },
          {
            name: 'It is damaged or obscured',
            text: 'Coffee rings, a menu placed on top, a receipt spike. Check it weekly for the first month.',
          },
          {
            name: 'Nobody ever mentions it',
            text: 'The card doubles whatever staff asking produces, and staff asking doubles whatever the card produces. They multiply; they are not alternatives.',
          },
        ]}
      />

      <H2 id="nfc">NFC stands and whether they are worth it</H2>

      <p>
        An NFC stand opens the review page when a phone is tapped against it — no camera, no scanning. They work well,
        they look modern, and they cost meaningfully more than a laminated card.
      </p>

      <p>
        Honest assessment: the tap is slightly faster than the scan, and that is the whole advantage. Older phones and
        some Android handsets with NFC switched off will not respond, so you need a printed code on the same stand as a
        fallback — at which point you own both. Start with the card. If it is producing reviews and you want to spend
        money to produce slightly more, the stand is a reasonable upgrade; it is not the thing that makes this work.
      </p>

      <Note kind="good" title="The short version">
        <p>
          Static code, pointing at your direct review link, 5cm or bigger, dark on light, laminated, in an upright
          holder where people pay, on a card that asks a question. Then have staff mention it. That is the whole
          tactic, and it outperforms every email campaign we have seen.
        </p>
      </Note>

      <p>
        Full context: <Guide to="how-to-get-more-google-reviews">how to get more Google reviews</Guide>. And before
        you set up any flow that filters who gets asked,{' '}
        <Guide to="review-gating-google-policy">read what Google prohibits</Guide>.
      </p>
    </>
  );
}
