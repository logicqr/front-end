import { useState } from 'react';
import { SectionHeader, Pill } from '../ui';
import { http } from '../../../lib/api';
import { attributionPayload, trackClick } from '../../../lib/tracking';
import { SITE, FIRST_MONTH } from '../../../data/site';

const EMPTY = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [notice, setNotice] = useState('');

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setNotice('');
    setStatus('sending');
    trackClick('contact_submitted');

    try {
      const res = await http.post('/send-mail', { ...form, attribution: attributionPayload() });
      setStatus('sent');
      setNotice(res.message || "Thanks — we'll reply within one working day.");
      setForm(EMPTY);
    } catch (err) {
      setStatus('idle');

      // The server names the field it rejected, so point at it rather than
      // showing one generic line above the form.
      if (err.details?.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])));
        setNotice('');
      } else {
        setNotice(err.message);
      }
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-g">
          <div>
            <SectionHeader kicker="Talk to a person" title={<>Not sure it fits? Ask.</>}>
              Tell us what kind of business you run and roughly how many people walk through in a week. We will tell
              you honestly whether this is worth your {FIRST_MONTH} to find out — including when it
              is not.
            </SectionHeader>

            <dl className="contact-facts">
              <div>
                <dt>Email</dt>
                <dd>
                  <a className="tlink" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a className="tlink" href={`tel:${SITE.tel}`}>
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Where we are</dt>
                <dd>
                  {SITE.address.street}
                  <br />
                  {SITE.address.city} {SITE.address.postalCode}
                </dd>
              </div>
              <div>
                <dt>Reply time</dt>
                <dd>One working day, usually sooner</dd>
              </div>
            </dl>
          </div>

          <form className="contact-form ui" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="c-name">Your name</label>
              <input
                id="c-name"
                className="inp"
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'c-name-err' : undefined}
                required
              />
              {errors.name ? (
                <p className="err" id="c-name-err">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="two">
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  className="inp"
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={update('email')}
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'c-email-err' : undefined}
                  required
                />
                {errors.email ? (
                  <p className="err" id="c-email-err">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="c-phone">Mobile</label>
                <input
                  id="c-phone"
                  className="inp"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10 digits"
                  value={form.phone}
                  onChange={update('phone')}
                  autoComplete="tel-national"
                  aria-invalid={errors.phone ? 'true' : undefined}
                  aria-describedby={errors.phone ? 'c-phone-err' : undefined}
                  required
                />
                {errors.phone ? (
                  <p className="err" id="c-phone-err">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="field">
              <label htmlFor="c-msg">What would you like to know?</label>
              <textarea
                id="c-msg"
                className="inp"
                value={form.message}
                onChange={update('message')}
                placeholder="I run a two-chair salon in Adyar, about 40 customers a week…"
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'c-msg-err' : undefined}
                required
              />
              {errors.message ? (
                <p className="err" id="c-msg-err">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {notice ? (
              <p className={`notice ${status === 'sent' ? 'good' : 'bad'}`} role="status">
                {notice}
              </p>
            ) : null}

            <div style={{ marginTop: 18 }}>
              <Pill type="submit" disabled={status === 'sending'} icon={status === 'sending' ? '…' : '→'}>
                {status === 'sending' ? 'Sending' : 'Send message'}
              </Pill>
            </div>

            <p className="fine" style={{ marginTop: 14 }}>
              We use your details to reply to this message and nothing else.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
