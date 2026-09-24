import React from 'react';
import {
  CalendarDays,
  Clock,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

import { waLink } from '../utils';

const pickupSchedule = [
  ['Monday', 'Friday'],
  ['Tuesday', 'Saturday'],
  ['Wednesday', 'Sunday'],
  ['Thursday', 'Monday'],
  ['Friday', 'Tuesday'],
  ['Saturday', 'Wednesday'],
];

export default function Policies() {
  const orderOnWhatsApp = () => {
    window.open(
      waLink(
        `Hi MJ Bakery Delights 👋

I would like to place an order.

Please let me know what information you need from me.`
      ),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="policies-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="section">
          <p className="eyebrow">
            Before placing your order
          </p>

          <h1>
            Our Ordering
            <br />
            <em>Policies.</em>
          </h1>

          <p className="lead">
            Please read through our ordering,
            collection and rush-order policies before
            placing your order.
          </p>
        </div>
      </section>

      {/* Ordering Policy */}
      <section className="section policy-section">
        <div className="policy-heading">
          <span className="policy-icon">
            <CalendarDays size={24} />
          </span>

          <div>
            <p className="eyebrow">
              Ordering Policy
            </p>

            <h2>
              3 days' notice required
              for all orders
            </h2>
          </div>
        </div>

        <p className="policy-intro">
          To ensure the best quality and availability,
          please place orders 3 full days before your
          pick-up date.
        </p>

        <div className="pickup-card">
          <div className="pickup-head">
            <span>Pick-up day</span>
            <span>Order by</span>
          </div>

          {pickupSchedule.map(
            ([pickup, order]) => (
              <div
                className="pickup-row"
                key={pickup}
              >
                <strong>{pickup}</strong>

                <span className="pickup-line">
                  →
                </span>

                <strong>{order}</strong>
              </div>
            )
          )}
        </div>

        <div className="policy-notices">
          <div>
            <Clock size={20} />

            <p>
              <strong>Cut-off time:</strong>{' '}
              7pm on your order day.
            </p>
          </div>

          <div>
            <AlertTriangle size={20} />

            <p>
              <strong>Sundays:</strong>{' '}
              Shop closed.
            </p>
          </div>

          <div>
            <MessageCircle size={20} />

            <p>
              Orders are accepted via
              WhatsApp only.
            </p>
          </div>
        </div>
      </section>

      {/* Rush Orders */}
      <section className="rush-policy">
        <div className="section">
          <div className="rush-grid">
            <div>
              <p className="eyebrow">
                Order Notice
              </p>

              <h2>
                Need your order
                sooner?
              </h2>
            </div>

            <div className="rush-copy">
              <p>
                Our standard notice is 3 days or more
                before your pick-up date. This ensures
                we have enough time to source
                ingredients, bake everything and
                decorate your custom order to the
                highest standard.
              </p>

              <p>
                We always try our best to fit an order
                in if you need it sooner. However,
                orders placed with less than 3 days'
                notice are considered rush orders.
              </p>

              <div className="rush-highlight">
                <AlertTriangle size={24} />

                <div>
                  <strong>
                    20% Rush Fee
                  </strong>

                  <p>
                    Because rush orders require us to
                    quickly shift our schedule and
                    source ingredients just for your
                    custom order, a 20% Rush Fee will
                    be added to your total cake order
                    price.
                  </p>
                </div>
              </div>

              <p>
                <strong>
                  Important Note:
                </strong>{' '}
                Last-minute orders are not always
                guaranteed and will depend on our
                current schedule and ingredient
                availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Note */}
      <section className="section policy-thankyou">
        <CheckCircle2 size={34} />

        <h2>
          Thank you for planning ahead.
        </h2>

        <p>
          Planning ahead helps us give your order the
          time and attention it deserves.
        </p>

        <button
          type="button"
          className="btn"
          onClick={orderOnWhatsApp}
        >
          <MessageCircle size={18} />
          Order via WhatsApp
        </button>
      </section>
    </div>
  );
}