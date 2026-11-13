import { useEffect, useState } from 'react';
import { SectionHeader, Pill } from '../ui';
import { http } from '../../../lib/api';
import { trackClick } from '../../../lib/tracking';
import {
  PRICING,
  derivePricing,
  money,
  FIRST_MONTH,
  INCLUDED,
  NOT_INCLUDED,
} from '../../../data/site';

/**
 * The pricing block, used on both the landing page and /pricing.
 *
 * Pricing is an introductory first month, then a choice of monthly or yearly.
 * Two things the UI has to get right:
 *
 *  1. The step up from the intro price to the standing price is stated at the
 *     same size as the intro price. A two-step price with the second step in
 *     small print is how you earn chargebacks.
 *  2. The numbers come from the server (`GET /v1/pricing`) with the local
 *     constants as the fallback, so the page cannot advertise an amount the
 *     gateway will not charge.
 */
export default function Pricing({ full = false }) {
  const [cycle, setCycle] = useState('monthly');
  const [p, setP] = useState(() => derivePricing());

  useEffect(() => {
    let live = true;
    http
      .get('/pricing')
      .then((server) => {
        if (!live) return;
        setP(
          derivePricing({
            ...PRICING,
            firstMonthPaise: server.firstMonthPaise,
            monthlyPaise: server.monthlyPaise,
            annualPaise: server.annualPaise,
            trialDays: server.trialDays,
            annualAvailable: server.annualAvailable,
          })
        );
      })
      .catch(() => {
        /* keep the local constants */
      });
    return () => {
      live = false;
    };
  }, []);

  const annual = cycle === 'annual';
  const annualAvailable = p.annualAvailable !== false;

  const standingAmount = annual ? p.annualPerMonthPaise : p.monthlyPaise;
  const standingUnit = annual ? '/month, billed yearly' : '/month';
  const firstYear = annual ? p.firstYearAnnualPaise : p.firstYearMonthlyPaise;

  const pick = (next) => {
    setCycle(next);
    trackClick('pricing_cycle_toggled', { cycle: next });
  };

  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <SectionHeader
          kicker="Pricing"
          title={
            <>
              {money(p.firstMonthPaise)} to start. <em>{money(standingAmount)}</em>
              {annual ? ' a month, paid yearly.' : ' a month after.'}
            </>
          }
        >
          One price whatever your business is. Unlimited scans, unlimited reviews, no setup fee, no contract. If it is
          not earning its keep, cancel from your dashboard and the charges stop.
        </SectionHeader>

        {/* The two-step price, stated plainly */}
        <div className="ramp">
          <div>
            <b>{money(p.firstMonthPaise)} today</b>
            <small>
              Your first {p.trialDays} days. Enough to print the code, place it, and see real feedback arrive.
            </small>
          </div>
          <div className="ramp-arrow" aria-hidden="true">
            →
          </div>
          <div>
            <b>
              Then {money(standingAmount)}
              {annual ? '/month' : '/month'}
            </b>
            <small>
              {annual
                ? `Collected as ${money(p.annualPaise)} once a year, starting ${p.trialDays} days from today.`
                : `Collected automatically on the same date each month. Cancel any time in one click.`}
            </small>
          </div>
        </div>

        {/* Monthly / yearly */}
        {annualAvailable ? (
          <div className="cyc" role="group" aria-label="Billing cycle">
            <button
              type="button"
              aria-pressed={!annual}
              className={!annual ? 'on' : undefined}
              onClick={() => pick('monthly')}
            >
              Pay monthly
            </button>
            <button
              type="button"
              aria-pressed={annual}
              className={annual ? 'on' : undefined}
              onClick={() => pick('annual')}
            >
              Pay yearly
              <span className="cyc-save">save {p.annualSavingPercent}%</span>
            </button>
          </div>
        ) : null}

        <div className="tiers">
          {/* What they are replacing */}
          <article className="tier">
            <h3>Asking by hand</h3>
            <p className="amt">
              {money(0)}
              <small>/month</small>
            </p>
            <p className="per">What most businesses do today</p>
            <ul>
              <li>Staff remember to ask — sometimes</li>
              <li>Most customers never follow through</li>
              <li>Bad experiences go straight to Google</li>
              <li>No record of what went wrong</li>
              <li>Nothing to show for a slow month</li>
            </ul>
            <Pill variant="ghost" href="#how" icon="↓" event="cta_pricing_how">
              See the difference
            </Pill>
          </article>

          {/* The offer */}
          <article className="tier hot">
            <span className="pop">Start here</span>
            <h3>LogicQR{annual ? ' · yearly' : ''}</h3>

            <p className="amt">
              {money(p.firstMonthPaise)}
              <small>first month</small>
            </p>
            <p className="per">
              then {money(standingAmount)}
              {standingUnit}
              {annual ? (
                <>
                  {' '}
                  — {money(p.annualSavingPerYearPaise)} less a year
                </>
              ) : null}
            </p>

            <ul>
              {INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {annual ? <li>Four months free compared with paying monthly</li> : null}
            </ul>

            <Pill
              variant="light"
              to={`/register${annual ? '?cycle=annual' : ''}`}
              event="cta_pricing_start"
              eventMeta={{ cycle }}
            >
              Start for {money(p.firstMonthPaise)}
            </Pill>

            <p className="tier-note">
              {annual ? `First 13 months: ${money(firstYear)}` : `First 12 months: ${money(firstYear)}`} · Cancel in one click
            </p>
          </article>

          {/* Several locations */}
          <article className="tier">
            <h3>More than one branch</h3>
            <p className="amt">
              Let&apos;s talk
              <small />
            </p>
            <p className="per">Each location needs its own code and listing</p>
            <ul>
              <li>One dashboard across every branch</li>
              <li>Compare locations side by side</li>
              <li>Per-branch feedback alerts</li>
              <li>Volume pricing rather than full price each</li>
              <li>We set the codes up for you</li>
            </ul>
            <Pill variant="ghost" href="/#contact" event="cta_pricing_multi">
              Talk to us
            </Pill>
          </article>
        </div>

        {annualAvailable && !annual ? (
          <p className="fine" style={{ marginTop: 20, textAlign: 'center' }}>
            Not sure? Start monthly. We will offer you the yearly rate a few days before your first{' '}
            {money(p.monthlyPaise)} charge, once you have seen whether it works.
          </p>
        ) : null}

        {full ? (
          <ul className="fitlist" style={{ borderTop: 'none', marginTop: 36 }}>
            {NOT_INCLUDED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="fine" style={{ marginTop: 20, textAlign: 'center' }}>
            All prices in INR and include GST where applicable.{' '}
            <a className="tlink" href="/pricing">
              Full pricing details
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

export { FIRST_MONTH };
