import React from 'react';
import { MessageCircle } from 'lucide-react';
import { waLink } from '../utils';

export default function CakeCard({ item }) {
  const ask = () => {
    window.open(
      waLink(`Hi MJ Bakery Delights 👋\n\nI'm interested in this cake:\n${item.title || item.category}\nCategory: ${item.category}\n\nPlease let me know about availability and a quote.`),
      '_blank'
    );
  };

  return (
    <article className="cake-card">
      <img src={item.image_url} alt={item.title || item.category} />
      <div className="cake-card-info">
        <div>
          <small>{item.category}</small>
          <h3>{item.title || 'Custom creation'}</h3>
        </div>
        <button className="circle" onClick={ask} title="Enquire on WhatsApp">
          <MessageCircle size={19} />
        </button>
      </div>
    </article>
  );
}
