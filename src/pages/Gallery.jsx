import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import CakeCard from '../components/CakeCard';
import { db, isFirebaseConfigured } from '../firebase';
import { DEFAULT_CATEGORIES } from '../config';

const demo = [
  ['Wedding Cakes', 'https://images.unsplash.com/photo-1622621746668-59fb299bc4d7?auto=format&fit=crop&w=900&q=80'],
  ['Party Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80'],
  ['Cupcakes', 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=80'],
].map((item, index) => ({ id: String(index), category: item[0], image_url: item[1], title: item[0] }));

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      if (!isFirebaseConfigured) {
        setItems(demo);
        setLoading(false);
        return;
      }

      try {
        const [gallerySnapshot, categorySnapshot] = await Promise.all([
          getDocs(query(collection(db, 'gallery'), orderBy('created_at', 'desc'))),
          getDocs(query(collection(db, 'categories'), orderBy('sort_order', 'asc'))),
        ]);

        setItems(gallerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        const names = categorySnapshot.docs.map((doc) => doc.data().name).filter(Boolean);
        if (names.length) setCategories(names);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const shown = useMemo(() => active === 'All' ? items : items.filter((item) => item.category === active), [items, active]);

  return (
    <div className="page section">
      <div className="page-head"><p className="eyebrow">Our work</p><h1>Cake gallery</h1><p>Browse by category, then tap any cake to enquire on WhatsApp.</p></div>
      <div className="chips">
        <button className={active === 'All' ? 'active' : ''} onClick={() => setActive('All')}>All</button>
        {categories.map((category) => <button key={category} className={active === category ? 'active' : ''} onClick={() => setActive(category)}>{category}</button>)}
      </div>
      {loading ? <p>Loading cakes…</p> : shown.length ? <div className="masonry">{shown.map((item) => <CakeCard key={item.id} item={item} />)}</div> : <div className="empty"><h3>No cakes in this category yet.</h3><p>New creations will be added soon.</p></div>}
    </div>
  );
}
