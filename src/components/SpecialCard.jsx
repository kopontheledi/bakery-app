import { MessageCircle, Clock } from 'lucide-react';
import { waLink, money, fmtDate } from '../utils';

export default function SpecialCard({ item }) {
  const ask = () => {
    window.open(
      waLink(`Hi MJ Bakery Delights 👋\n\nI'd like to enquire about your special:\n${item.title}\n\nPrice: ${money(item.price)}\nFlavour: ${item.flavour || 'Please advise'}\nEnds: ${fmtDate(item.ends_at)}`),
      '_blank'
    );
  };

  return (
    <article className="special-card">
      <div className="special-img">
        <img src={item.image_url} alt={item.title} />
        <span>{money(item.price)}</span>
      </div>
      <div className="special-body">
        <small>{item.flavour || 'Custom flavour'}</small>
        <h3>{item.title}</h3>
        {item.ends_at && (
          <p>
            <Clock size={15} /> Ends {fmtDate(item.ends_at)}
          </p>
        )}
        <button className="btn full" onClick={ask}>
          <MessageCircle size={18} /> Enquire on WhatsApp
        </button>
      </div>
    </article>
  );
}
