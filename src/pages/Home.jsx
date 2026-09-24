import React from 'react';

import {
  ArrowRight,
  MessageCircle,
  Star,
  CakeSlice,
  Heart,
  PartyPopper,
  Gift,
  Percent,
} from 'lucide-react';

import { waLink } from '../utils';

const samples = [
  {
    icon: CakeSlice,
    title: 'Made to order',
    text: 'Custom cakes designed around your event, theme and inspiration.',
  },
  {
    icon: Heart,
    title: 'Made with care',
    text: 'Thoughtful details and finishes for birthdays, weddings and milestones.',
  },
  {
    icon: PartyPopper,
    title: 'For every celebration',
    text: 'From bento boxes to statement cakes and cupcake bouquets.',
  },
];

export default function Home() {
  const openWhatsApp = () => {
    window.open(
      waLink(
        'Hi MJ Bakery Delights 👋 I would like to request a cake quote.'
      ),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      {/* =====================================
          HERO
      ===================================== */}

      <section className="hero">
        <div className="hero-glow" />

        <div className="hero-copy">
          <p className="eyebrow">
            Custom cakes • Cupcakes • Bento boxes
          </p>

          <h1>
            Sweet moments,
            <br />
            <em>beautifully made.</em>
          </h1>

          <p className="lead">
            Bespoke bakes for birthdays, weddings,
            celebrations and every little reason to
            make life sweeter.
          </p>

          <div className="hero-buttons">
            <a
              className="btn"
              href="/cakes"
            >
              Explore cakes
              <ArrowRight size={18} />
            </a>

            <button
              type="button"
              className="btn secondary"
              onClick={openWhatsApp}
            >
              <MessageCircle size={18} />
              WhatsApp us
            </button>
          </div>
        </div>

        <div className="hero-art">
          <div className="cake-illustration">
            <span>MJ</span>

            <b>
              Bakery Delights
            </b>

            <small>
              made for your moment
            </small>
          </div>
        </div>
      </section>

      {/* =====================================
          CAKE TYPES STRIP
      ===================================== */}

      <section className="trust-strip">
        <span>
          Wedding Cakes
        </span>

        <i>✦</i>

        <span>
          Character Cakes
        </span>

        <i>✦</i>

        <span>
          Bento Boxes
        </span>

        <i>✦</i>

        <span>
          Cupcake Bouquets
        </span>
      </section>

      {/* =====================================
          INTRODUCTION
      ===================================== */}

      <section className="section intro">
        <div>
          <p className="eyebrow">
            What we create
          </p>

          <h2>
            Every cake tells
            <br />
            your story.
          </h2>
        </div>

        <p>
          Bring your idea, colours, theme or
          inspiration picture. MJ Bakery Delights
          turns it into an edible centrepiece made
          especially for your occasion.
        </p>
      </section>

      {/* =====================================
          FEATURES
      ===================================== */}

      <section className="features">
        {samples.map(
          ({
            icon: Icon,
            title,
            text,
          }) => (
            <article key={title}>
              <Icon />

              <h3>
                {title}
              </h3>

              <p>
                {text}
              </p>
            </article>
          )
        )}
      </section>

      {/* =====================================
          CUSTOMER THANK YOU
      ===================================== */}

      <section className="thank-you-section">
        <div className="section">
          <div className="thank-you-heading">
            <p className="eyebrow">
              Our way of saying thank you
            </p>

            <h2>
              A little something
              <br />
              <em>for our customers.</em>
            </h2>

            <p>
              Thank you for choosing MJ Bakery
              Delights and allowing us to be part
              of your special moments.
            </p>
          </div>

          <div className="thank-you-grid">
            {/* Returning Clients */}

            <article className="reward-card">
              <div className="reward-icon">
                <Gift size={28} />
              </div>

              <small>
                Returning Clients
              </small>

              <h3>
                6 Complimentary
                <br />
                Cupcakes
              </h3>

              <p>
                As a thank you, all clients receive
                6 complimentary cupcakes on their
                2nd order.
              </p>

              <span className="reward-note">
                T&apos;s and C&apos;s apply.
              </span>
            </article>

            {/* Monthly Special */}

            <article className="reward-card featured">
              <div className="reward-icon">
                <Percent size={28} />
              </div>

              <small>
                Monthly Special
              </small>

              <h3>
                10% Off
                <br />
                Monthly Special
              </h3>

              <p>
                Each month we select 2 flavours on
                special as gratitude to you.
              </p>

              <p>
                You choose 1 flavour and enjoy the
                10% OFF special.
              </p>

              <p>
                The special only applies on cakes
                and cupcakes.
              </p>

              <span className="reward-note">
                Flavours differ every month.
              </span>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================
          CAKE SERVINGS PROMO
      ===================================== */}

      <section className="section intro">
        <div>
          <p className="eyebrow">
            Cake Servings
          </p>

          <h2>
            Not sure what
            <br />
            size you need?
          </h2>
        </div>

        <div>
          <p>
            Learn about our Bento Cakes, Mini Cakes
            and tiered cake serving estimates to
            help you choose the right cake for your
            celebration.
          </p>

          <a
            className="btn"
            href="/cake-servings"
          >
            View Cake Servings
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* =====================================
          POLICIES PROMO
      ===================================== */}

      <section className="cta">
        <p className="eyebrow">
          Before you order
        </p>

        <h2>
          Planning your cake?
        </h2>

        <p>
          Please read our ordering notice,
          collection and rush-order policies
          before placing your order.
        </p>

        <a
          className="btn light"
          href="/policies"
        >
          Read Our Policies
          <ArrowRight size={18} />
        </a>
      </section>

      {/* =====================================
          GOOGLE REVIEWS
      ===================================== */}

      <section className="reviews section">
        <div>
          <p className="eyebrow">
            Customer love
          </p>

          <h2>
            Google Reviews
          </h2>

          <p>
            See what our customers have to say
            about their MJ Bakery Delights
            experience.
          </p>
        </div>

        <div className="review-placeholder">
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  fill="currentColor"
                  size={22}
                />
              )
            )}
          </div>

          <b>
            What our customers say
          </b>

          {/* Elfsight Google Reviews */}

          <div
            className="elfsight-app-43fee541-f364-4dfb-930d-08b422083a5a"
            data-elfsight-app-lazy
          />
        </div>
      </section>

      {/* =====================================
          FINAL CTA
      ===================================== */}

      <section className="cta">
        <p className="eyebrow">
          Planning something special?
        </p>

        <h2>
          Tell us what you&apos;re imagining.
        </h2>

        <p>
          Tell us about your event, cake size,
          flavour, colours and design inspiration
          and we&apos;ll help bring your idea to
          life.
        </p>

        <a
          className="btn light"
          href="/contact"
        >
          Request a Quote
          <ArrowRight size={18} />
        </a>
      </section>
    </>
  );
}