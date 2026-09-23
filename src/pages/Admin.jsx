import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  LogIn,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  ImagePlus,
  ExternalLink,
} from 'lucide-react';
import { auth, db, storage, isFirebaseConfigured } from '../firebase';
import { DEFAULT_CATEGORIES } from '../config';
import { money, fmtDate } from '../utils';

async function uploadImage(file, folder) {
  if (!file) return null;
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return {
    image_url: await getDownloadURL(storageRef),
    image_path: path,
  };
}

async function removeImage(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (error) {
    console.warn('Could not delete image from storage:', error);
  }
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('gallery');
  const [gallery, setGallery] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [editSpecial, setEditSpecial] = useState(null);

  const [g, setG] = useState({ title: '', category: DEFAULT_CATEGORIES[0], file: null });
  const [s, setS] = useState({ title: '', price: '', flavour: '', ends_at: '', file: null });

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const load = async () => {
    try {
      const [gallerySnapshot, specialsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'gallery'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'specials'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'categories'), orderBy('sort_order', 'asc'))),
      ]);

      setGallery(gallerySnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      setSpecials(specialsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));

      const categoryNames = categoriesSnapshot.docs.map((item) => item.data().name).filter(Boolean);
      if (categoryNames.length) setCategories(categoryNames);
    } catch (error) {
      setMsg(error.message);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const addGallery = async (e) => {
    e.preventDefault();
    if (!g.file) return setMsg('Please choose an image.');
    setBusy(true);
    setMsg('');
    try {
      const image = await uploadImage(g.file, 'gallery');
      await addDoc(collection(db, 'gallery'), {
        title: g.title.trim(),
        category: g.category,
        image_url: image.image_url,
        image_path: image.image_path,
        created_at: serverTimestamp(),
      });
      setG({ title: '', category: categories[0] || DEFAULT_CATEGORIES[0], file: null });
      setMsg('Cake added successfully.');
      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const saveSpecial = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      let image_url = editSpecial?.image_url || '';
      let image_path = editSpecial?.image_path || '';

      if (s.file) {
        const image = await uploadImage(s.file, 'specials');
        if (editSpecial?.image_path) await removeImage(editSpecial.image_path);
        image_url = image.image_url;
        image_path = image.image_path;
      }

      if (!image_url) throw new Error('Please choose an image.');

      const payload = {
        title: s.title.trim(),
        price: Number(s.price),
        flavour: s.flavour.trim(),
        ends_at: s.ends_at || '',
        image_url,
        image_path,
        updated_at: serverTimestamp(),
      };

      if (editSpecial) {
        await updateDoc(doc(db, 'specials', editSpecial.id), payload);
        setMsg('Special updated successfully.');
      } else {
        await addDoc(collection(db, 'specials'), { ...payload, created_at: serverTimestamp() });
        setMsg('Special added successfully.');
      }

      setEditSpecial(null);
      setS({ title: '', price: '', flavour: '', ends_at: '', file: null });
      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (type, item) => {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true);
    setMsg('');
    try {
      await deleteDoc(doc(db, type, item.id));
      await removeImage(item.image_path);
      setMsg('Deleted successfully.');
      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => {
    setEditSpecial(item);
    setS({
      title: item.title || '',
      price: item.price || '',
      flavour: item.flavour || '',
      ends_at: item.ends_at || '',
      file: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="center-page admin-setup">
        <h1>Firebase setup required</h1>
        <p>Copy <code>.env.example</code> to <code>.env</code> and add your Firebase web app configuration.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-login-wrap">
        <form className="admin-login" onSubmit={login}>
          <div className="brand"><span>MJ</span><div><b>Bakery</b><small>Admin</small></div></div>
          <h1>Admin Login</h1>
          <p>Sign in with the bakery owner account.</p>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {msg && <p className="admin-message">{msg}</p>}
          <button className="btn full" disabled={busy}><LogIn size={18} />{busy ? 'Signing in...' : 'Sign in'}</button>
          <a href="/">Back to website</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand"><span>MJ</span><div><b>Bakery</b><small>Admin</small></div></div>
        <button className={tab === 'gallery' ? 'active' : ''} onClick={() => setTab('gallery')}>Gallery</button>
        <button className={tab === 'specials' ? 'active' : ''} onClick={() => setTab('specials')}>Specials</button>
        <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View website</a>
        <button className="logout" onClick={() => signOut(auth)}><LogOut size={16} /> Sign out</button>
      </aside>

      <main className="admin-main">
        <div className="admin-top"><div><p className="eyebrow">MJ Bakery Delights</p><h1>{tab === 'gallery' ? 'Cake Gallery' : 'Specials'}</h1></div><small>{user.email}</small></div>
        {msg && <p className="admin-message">{msg}</p>}

        {tab === 'gallery' && (
          <>
            <form className="admin-form" onSubmit={addGallery}>
              <h2>Add a cake</h2>
              <div className="admin-form-grid">
                <label>Title<input value={g.title} onChange={(e) => setG({ ...g, title: e.target.value })} placeholder="e.g. Pink floral birthday cake" /></label>
                <label>Category<select value={g.category} onChange={(e) => setG({ ...g, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label className="wide">Cake image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setG({ ...g, file: e.target.files?.[0] || null })} required /></label>
              </div>
              <button className="btn" disabled={busy}><ImagePlus size={18} />{busy ? 'Uploading...' : 'Add cake'}</button>
            </form>

            <div className="admin-list">
              {gallery.map((item) => (
                <article key={item.id} className="admin-row">
                  <img src={item.image_url} alt={item.title || item.category} />
                  <div><small>{item.category}</small><h3>{item.title || 'Custom creation'}</h3></div>
                  <button className="danger" onClick={() => removeItem('gallery', item)}><Trash2 size={17} /> Delete</button>
                </article>
              ))}
              {!gallery.length && <div className="empty"><p>No gallery items yet.</p></div>}
            </div>
          </>
        )}

        {tab === 'specials' && (
          <>
            <form className="admin-form" onSubmit={saveSpecial}>
              <h2>{editSpecial ? 'Edit special' : 'Add a special'}</h2>
              <div className="admin-form-grid">
                <label>Title<input required value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} /></label>
                <label>Price<input required type="number" min="0" step="1" value={s.price} onChange={(e) => setS({ ...s, price: e.target.value })} /></label>
                <label>Flavour<input value={s.flavour} onChange={(e) => setS({ ...s, flavour: e.target.value })} /></label>
                <label>End date<input type="date" value={s.ends_at} onChange={(e) => setS({ ...s, ends_at: e.target.value })} /></label>
                <label className="wide">Image {editSpecial && '(leave empty to keep current image)'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setS({ ...s, file: e.target.files?.[0] || null })} /></label>
              </div>
              <div className="admin-actions">
                <button className="btn" disabled={busy}><Plus size={18} />{busy ? 'Saving...' : editSpecial ? 'Update special' : 'Add special'}</button>
                {editSpecial && <button type="button" className="btn secondary" onClick={() => { setEditSpecial(null); setS({ title: '', price: '', flavour: '', ends_at: '', file: null }); }}>Cancel</button>}
              </div>
            </form>

            <div className="admin-list">
              {specials.map((item) => (
                <article key={item.id} className="admin-row">
                  <img src={item.image_url} alt={item.title} />
                  <div><small>{item.flavour || 'Custom flavour'} • {money(item.price)}{item.ends_at ? ` • Ends ${fmtDate(item.ends_at)}` : ''}</small><h3>{item.title}</h3></div>
                  <div className="admin-actions"><button onClick={() => startEdit(item)}><Pencil size={17} /> Edit</button><button className="danger" onClick={() => removeItem('specials', item)}><Trash2 size={17} /> Delete</button></div>
                </article>
              ))}
              {!specials.length && <div className="empty"><p>No specials yet.</p></div>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
