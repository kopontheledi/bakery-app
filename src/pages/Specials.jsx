import React from 'react';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import SpecialCard from '../components/SpecialCard';

export default function Specials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadSpecials = async () => {
      if (!isFirebaseConfigured) return;
      try {
        const snapshot = await getDocs(query(collection(db, 'specials'), orderBy('created_at', 'desc')));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(data.filter((item) => !item.ends_at || new Date(`${item.ends_at}T23:59:59`) >= new Date()));
      } catch (error) {
        console.error(error);
      }
    };
    loadSpecials();
  }, []);

  return (
    <div className="page section">
      <div className="page-head"><p className="eyebrow">Limited time</p><h1>Current specials</h1><p>Seasonal offers, celebration boxes and sweet deals while they last.</p></div>
      {items.length ? <div className="special-grid">{items.map((item) => <SpecialCard key={item.id} item={item} />)}</div> : <div className="empty"><h3>No current specials</h3><p>Follow our social pages or check back soon for the next offer.</p></div>}
    </div>
  );
}
