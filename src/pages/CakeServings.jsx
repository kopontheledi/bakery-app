import React from 'react';
import {
  CakeSlice,
  Users,
  Heart,
  Info,
} from 'lucide-react';

const tieredCakes = [
  {
    top: '15cm • 2 layers',
    bottom: '20cm • 3 layers',
    servings: '36 – 44 Servings',
  },
  {
    top: '15cm • 3 layers',
    bottom: '20cm • 3 layers',
    servings: '44 – 56 Servings',
  },
  {
    top: '20cm • 3 layers',
    bottom: '25cm • 2 layers',
    servings: '60 – 80 Servings',
  },
  {
    top: '15cm • 2 layers',
    middle: '20cm • 3 layers',
    bottom: '25cm • 2 layers',
    servings: '82 – 120 Servings',
  },
];

export default function CakeServings() {
  return (
    <div className="servings-page">
      {/* Hero */}
      <section className="page-hero servings-hero">
        <div className="section">
          <p className="eyebrow">
            Find the right size
          </p>

          <h1>
            Cake
            <br />
            <em>Servings.</em>
          </h1>

          <p className="lead">
            Not sure which cake size is right for your
            celebration? Use our guide to help you
            choose.
          </p>
        </div>
      </section>

      {/* Bento */}
      <section className="section cake-guide-section">
        <div className="cake-guide-number">
          01
        </div>

        <div className="cake-guide-content">
          <p className="eyebrow">
            Cake Guide
          </p>

          <h2>
            What is a Bento Cake?
          </h2>

          <p>
            A bento cake, also known as a lunchbox
            cake, is a small, single-serving cake or
            can be shared by very few people (5-6).
          </p>

          <p>
            Bento cakes are typically small, about
            13cm in diameter. They are the perfect
            cakes to let someone know you are thinking
            of them and a great way to personalise
            your cakes with a little message on the
            top.
          </p>

          <div className="cake-guide-note">
            <Heart size={20} />

            <span>
              Small, personal and perfect for intimate
              celebrations.
            </span>
          </div>
        </div>

        <div className="cake-size-visual bento-visual">
          <CakeSlice size={55} />

          <strong>
            ± 13cm
          </strong>

          <span>
            Bento Cake
          </span>
        </div>
      </section>

      {/* Mini */}
      <section className="cake-guide-alt">
        <div className="section cake-guide-section">
          <div className="cake-guide-number">
            02
          </div>

          <div className="cake-guide-content">
            <p className="eyebrow">
              Cake Guide
            </p>

            <h2>
              What is a Mini Cake?
            </h2>

            <p>
              A Mini Cake is a budget friendly cake,
              with a simple design, perfect for
              intimate celebrations.
            </p>

            <p>
              Mini cakes come in 15cm, 2 layers, in a
              heart or round shape.
            </p>

            <p>
              They serve approximately 8 – 12 people.
              You are welcome to customise it anyhow
              you'd like; extra charges will apply.
            </p>

            <div className="cake-guide-note">
              <Users size={20} />

              <span>
                Approximately 8 – 12 servings.
              </span>
            </div>
          </div>

          <div className="cake-size-visual">
            <CakeSlice size={55} />

            <strong>
              15cm
            </strong>

            <span>
              2 Layers
            </span>
          </div>
        </div>
      </section>

      {/* Tiered Cakes */}
      <section className="section tiered-section">
        <div className="section-heading">
          <p className="eyebrow">
            Cake Servings
          </p>

          <h2>
            Tiered Cakes
          </h2>

          <p>
            Please note these are estimations.
          </p>
        </div>

        <div className="tiered-grid">
          {tieredCakes.map(
            (cake, index) => (
              <article
                className="tier-card"
                key={cake.servings}
              >
                <div className="tier-cake">
                  {cake.middle && (
                    <div className="cake-tier cake-tier-small">
                      {cake.top}
                    </div>
                  )}

                  <div
                    className={
                      cake.middle
                        ? 'cake-tier cake-tier-medium'
                        : 'cake-tier cake-tier-small'
                    }
                  >
                    {cake.middle ||
                      cake.top}
                  </div>

                  <div className="cake-tier cake-tier-large">
                    {cake.bottom}
                  </div>
                </div>

                <div className="tier-info">
                  <small>
                    Option {index + 1}
                  </small>

                  <h3>
                    {cake.servings}
                  </h3>
                </div>
              </article>
            )
          )}
        </div>

        <div className="serving-disclaimer">
          <Info size={18} />

          <p>
            Serving amounts are estimates and may vary
            depending on how the cake is cut.
          </p>
        </div>
      </section>
    </div>
  );
}