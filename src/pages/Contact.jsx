import React from 'react';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ShoppingBag, CakeSlice, ExternalLink } from 'lucide-react';
import { BUSINESS, FLAVOURS, SIZES, ORDER_TYPES, COLLECTION_TIMES } from '../config';
import { waLink } from '../utils';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    type: 'Birthday Cake',
    flavour: 'Vanilla',
    size: '6 inch',
    quantity: '1',
    date: '',
    collectionTime: 'To be arranged',
    event: '',
    messageOnCake: '',
    colours: '',
    inspo: '',
    description: '',
  });
  const [sending, setSending] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSending(true);

    const message = `Hi MJ Bakery Delights 👋\n\n*NEW CAKE QUOTE REQUEST*\n\n👤 *CUSTOMER DETAILS*\nName: ${form.name}\nWhatsApp Number: ${form.whatsapp}\n\n🎂 *ORDER DETAILS*\nOrder Type: ${form.type}\nFlavour: ${form.flavour}\nSize: ${form.size}\nQuantity: ${form.quantity}\n\n📅 *COLLECTION*\nCollection Date: ${form.date}\nPreferred Time: ${form.collectionTime}\n\n🎉 *EVENT DETAILS*\nOccasion / Event: ${form.event || 'Not specified'}\nCake Wording: ${form.messageOnCake || 'None'}\nColours / Theme: ${form.colours || 'Not specified'}\n\n🖼️ *INSPIRATION*\n${form.inspo || 'No inspiration link provided'}\n\n📝 *DESCRIPTION*\n${form.description}\n\nPlease let me know if you are available for this date and send me a quote.\n\nThank you 😊`;

    window.open(waLink(message), '_blank', 'noopener,noreferrer');
    setSending(false);
  };

  const quickWhatsApp = () => window.open(
    waLink('Hi MJ Bakery Delights 👋\n\nI would like to enquire about ordering from you.\n\nPlease send me your available cakes, prices and current specials.'),
    '_blank',
    'noopener,noreferrer'
  );

  const openCatalogue = () => {
    if (BUSINESS.whatsappCatalogue) {
      window.open(BUSINESS.whatsappCatalogue, '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(waLink('Hi MJ Bakery Delights 👋\n\nI would like to see your cake catalogue and available options.\n\nPlease send me your current catalogue.'), '_blank', 'noopener,noreferrer');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="contact-page">
      <section className="contact-hero"><div className="section"><p className="eyebrow">Contact & Quote</p><h1>Let’s create something<br /><em>sweet together.</em></h1><p>Planning a birthday, wedding or special celebration? Tell us what you have in mind and send your request directly to MJ Bakery Delights on WhatsApp.</p></div></section>

      <section className="section contact-intro">
        <div className="contact-info">
          <p className="eyebrow">Get in touch</p>
          <h2>We’d love to bake<br />for your celebration.</h2>
          <p>Use the quote form to send us all the details we need to prepare your quote.</p>

          <div className="contact-details">
            <a className="contact-detail" href={`tel:${BUSINESS.phoneDisplay}`}><span className="contact-icon"><Phone size={20} /></span><div><small>Call / WhatsApp</small><b>{BUSINESS.phoneDisplay}</b></div></a>
            <a className="contact-detail" href={`mailto:${BUSINESS.email}`}><span className="contact-icon"><Mail size={20} /></span><div><small>Email</small><b>{BUSINESS.email}</b></div></a>
            <div className="contact-detail"><span className="contact-icon"><Clock size={20} /></span><div><small>Business hours</small><b>See our hours below</b></div></div>
          </div>

          <div className="working-hours">
            <div className="working-hours-title"><Clock size={20} /><h3>Working Hours</h3></div>
            {BUSINESS.hours.map(([day, hours]) => <div className="hours-row" key={day}><span>{day}</span><b>{hours}</b></div>)}
            <small className="hours-note">Collection times are arranged when your order is confirmed.</small>
          </div>

          <button type="button" className="btn secondary full" onClick={quickWhatsApp}><MessageCircle size={18} /> Chat with us on WhatsApp</button>
        </div>

        <form className="quote-form" onSubmit={submit}>
          <div className="quote-form-head"><span><CakeSlice size={22} /></span><div><small>Custom order</small><h2>Request a Quote</h2></div></div>
          <p className="form-description">Complete the form below and we’ll prepare your request as a WhatsApp message.</p>

          <div className="form-grid">
            <div className="form-section-title wide">Your details</div>
            <label>Your name *<input required type="text" name="name" value={form.name} onChange={change} placeholder="Full name" /></label>
            <label>Your WhatsApp number *<input required type="tel" name="whatsapp" value={form.whatsapp} onChange={change} placeholder="e.g. 076 123 4567" /></label>

            <div className="form-section-title wide">What would you like?</div>
            <label>Order type *<select required name="type" value={form.type} onChange={change}>{ORDER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
            <label>Flavour *<select required name="flavour" value={form.flavour} onChange={change}>{FLAVOURS.map((flavour) => <option key={flavour} value={flavour}>{flavour}</option>)}</select></label>
            <label>Cake size *<select required name="size" value={form.size} onChange={change}>{SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
            <label>Quantity *<input required type="number" min="1" name="quantity" value={form.quantity} onChange={change} /></label>

            <div className="form-section-title wide">Collection</div>
            <label>Collection date *<input required type="date" name="date" min={today} value={form.date} onChange={change} /></label>
            <label>Preferred collection time<select name="collectionTime" value={form.collectionTime} onChange={change}>{COLLECTION_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>

            <div className="form-section-title wide">Design details</div>
            <label>Occasion<input type="text" name="event" value={form.event} onChange={change} placeholder="Birthday, wedding, baby shower..." /></label>
            <label>Message on cake<input type="text" name="messageOnCake" value={form.messageOnCake} onChange={change} placeholder="e.g. Happy Birthday Lerato" /></label>
            <label className="wide">Colours / Theme<input type="text" name="colours" value={form.colours} onChange={change} placeholder="e.g. Pink, gold and white / Barbie theme" /></label>
            <label className="wide">Inspiration image link<input type="url" name="inspo" value={form.inspo} onChange={change} placeholder="Paste Pinterest, Facebook or image link" /><small>You can also send the actual inspiration photo on WhatsApp after submitting the form.</small></label>
            <label className="wide">Describe how you want your order *<textarea required name="description" value={form.description} onChange={change} rows="6" placeholder="Tell us about the design, decorations, colours, age, wording, number of cupcakes, toppers or anything else we should know..." /></label>
          </div>

          <div className="quote-notice"><MessageCircle size={18} /><p>Clicking the button below opens WhatsApp with your quote request already completed. You can review the message before sending.</p></div>
          <button className="btn full quote-submit" type="submit" disabled={sending}><Send size={18} />{sending ? 'Opening WhatsApp...' : 'Send Quote to WhatsApp'}</button>
        </form>
      </section>

      <section className="catalogue-section section"><div className="catalogue-content"><div className="catalogue-icon"><ShoppingBag size={32} /></div><div><p className="eyebrow">Browse our creations</p><h2>WhatsApp Catalogue</h2><p>Browse available cakes, cupcakes, bento cakes and specials directly through WhatsApp.</p><div className="catalogue-actions"><button type="button" className="btn" onClick={openCatalogue}><ShoppingBag size={18} /> View WhatsApp Catalogue <ExternalLink size={16} /></button><a className="btn secondary" href="/cakes"><CakeSlice size={18} /> View Cake Gallery</a></div></div></div></section>

      <section className="map-section">
        <div className="map-title"><MapPin /><div><small>Find us</small><h2>Collection Location</h2></div></div>
        {BUSINESS.mapsEmbedUrl ? <iframe title="MJ Bakery Delights location" src={BUSINESS.mapsEmbedUrl} width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /> : <div className="map-placeholder"><MapPin size={36} /><b>Google Maps location coming soon</b><p>The bakery location will appear here once the Google Maps embed URL has been added.</p></div>}
      </section>
    </div>
  );
}
