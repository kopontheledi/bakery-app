import React, { useEffect, useState } from 'react';

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
  Images,
  Tags,
  BadgePercent,
  X,
  Save,
} from 'lucide-react';

import {
  auth,
  db,
  storage,
  isFirebaseConfigured,
} from '../firebase';

import { DEFAULT_CATEGORIES } from '../config';
import { money, fmtDate } from '../utils';

/* =========================================
   IMAGE FUNCTIONS
========================================= */

async function uploadImage(file, folder) {
  if (!file) {
    return null;
  }

  const ext =
    file.name.split('.').pop() || 'jpg';

  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const storageRef = ref(
    storage,
    path
  );

  await uploadBytes(
    storageRef,
    file
  );

  return {
    image_url:
      await getDownloadURL(storageRef),

    image_path: path,
  };
}

async function removeImage(path) {
  if (!path) {
    return;
  }

  try {
    await deleteObject(
      ref(storage, path)
    );
  } catch (error) {
    console.warn(
      'Could not delete image from storage:',
      error
    );
  }
}

/* =========================================
   ADMIN
========================================= */

export default function Admin() {
  /* Authentication */

  const [user, setUser] =
    useState(null);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  /* Admin UI */

  const [tab, setTab] =
    useState('gallery');

  const [msg, setMsg] =
    useState('');

  const [busy, setBusy] =
    useState(false);

  /* Firebase Data */

  const [gallery, setGallery] =
    useState([]);

  const [specials, setSpecials] =
    useState([]);

  const [categories, setCategories] =
    useState(DEFAULT_CATEGORIES);

  const [categoryDocs, setCategoryDocs] =
    useState([]);

  /* Editing */

  const [editCake, setEditCake] =
    useState(null);

  const [editSpecial, setEditSpecial] =
    useState(null);

  const [editCategory, setEditCategory] =
    useState(null);

  /* Forms */

  const [cakeForm, setCakeForm] =
    useState({
      title: '',
      category:
        DEFAULT_CATEGORIES[0],
      file: null,
    });

  const [specialForm, setSpecialForm] =
    useState({
      title: '',
      price: '',
      flavour: '',
      ends_at: '',
      file: null,
    });

  const [categoryName, setCategoryName] =
    useState('');

  /* =========================================
     AUTH
  ========================================= */

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
        }
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  /* =========================================
     LOAD FIREBASE DATA
  ========================================= */

  const load = async () => {
    try {
      const [
        gallerySnapshot,
        specialsSnapshot,
        categoriesSnapshot,
      ] = await Promise.all([
        getDocs(
          query(
            collection(
              db,
              'gallery'
            ),
            orderBy(
              'created_at',
              'desc'
            )
          )
        ),

        getDocs(
          query(
            collection(
              db,
              'specials'
            ),
            orderBy(
              'created_at',
              'desc'
            )
          )
        ),

        getDocs(
          query(
            collection(
              db,
              'categories'
            ),
            orderBy(
              'sort_order',
              'asc'
            )
          )
        ),
      ]);

      const galleryData =
        gallerySnapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

      const specialsData =
        specialsSnapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

      const categoriesData =
        categoriesSnapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (item) => item.name
          );

      setGallery(galleryData);

      setSpecials(specialsData);

      setCategoryDocs(
        categoriesData
      );

      if (categoriesData.length) {
        const names =
          categoriesData.map(
            (item) => item.name
          );

        setCategories(names);

        setCakeForm(
          (current) => ({
            ...current,

            category:
              names.includes(
                current.category
              )
                ? current.category
                : names[0],
          })
        );
      } else {
        setCategories(
          DEFAULT_CATEGORIES
        );
      }
    } catch (error) {
      setMsg(error.message);
    }
  };

  /* =========================================
     LOGIN
  ========================================= */

  const login = async (e) => {
    e.preventDefault();

    setBusy(true);
    setMsg('');

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  /* =========================================
     CAKES
  ========================================= */

  const saveCake = async (e) => {
    e.preventDefault();

    if (
      !editCake &&
      !cakeForm.file
    ) {
      setMsg(
        'Please choose a cake image.'
      );

      return;
    }

    if (!cakeForm.category) {
      setMsg(
        'Please choose a category.'
      );

      return;
    }

    setBusy(true);
    setMsg('');

    try {
      let image_url =
        editCake?.image_url || '';

      let image_path =
        editCake?.image_path || '';

      /* New image selected */

      if (cakeForm.file) {
        const image =
          await uploadImage(
            cakeForm.file,
            'gallery'
          );

        if (
          editCake?.image_path
        ) {
          await removeImage(
            editCake.image_path
          );
        }

        image_url =
          image.image_url;

        image_path =
          image.image_path;
      }

      if (!image_url) {
        throw new Error(
          'Please choose a cake image.'
        );
      }

      const payload = {
        title:
          cakeForm.title.trim(),

        category:
          cakeForm.category,

        image_url,

        image_path,

        updated_at:
          serverTimestamp(),
      };

      if (editCake) {
        await updateDoc(
          doc(
            db,
            'gallery',
            editCake.id
          ),
          payload
        );

        setMsg(
          'Cake updated successfully.'
        );
      } else {
        await addDoc(
          collection(
            db,
            'gallery'
          ),
          {
            ...payload,

            created_at:
              serverTimestamp(),
          }
        );

        setMsg(
          'Cake added successfully.'
        );
      }

      cancelCakeEdit();

      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const startCakeEdit = (item) => {
    setEditCake(item);

    setCakeForm({
      title:
        item.title || '',

      category:
        item.category ||
        categories[0] ||
        '',

      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const cancelCakeEdit = () => {
    setEditCake(null);

    setCakeForm({
      title: '',

      category:
        categories[0] ||
        DEFAULT_CATEGORIES[0],

      file: null,
    });
  };

  const deleteCake = async (
    item
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${
          item.title ||
          'this cake'
        }"?`
      );

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setMsg('');

    try {
      await deleteDoc(
        doc(
          db,
          'gallery',
          item.id
        )
      );

      await removeImage(
        item.image_path
      );

      setMsg(
        'Cake deleted successfully.'
      );

      if (
        editCake?.id === item.id
      ) {
        cancelCakeEdit();
      }

      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  /* =========================================
     CATEGORIES
  ========================================= */

  const saveCategory = async (
    e
  ) => {
    e.preventDefault();

    const name =
      categoryName.trim();

    if (!name) {
      setMsg(
        'Please enter a category name.'
      );

      return;
    }

    const duplicate =
      categoryDocs.some(
        (category) =>
          category.name
            ?.toLowerCase() ===
            name.toLowerCase() &&
          category.id !==
            editCategory?.id
      );

    if (duplicate) {
      setMsg(
        'That category already exists.'
      );

      return;
    }

    setBusy(true);
    setMsg('');

    try {
      if (editCategory) {
        const oldName =
          editCategory.name;

        /*
         Update category itself.
        */

        await updateDoc(
          doc(
            db,
            'categories',
            editCategory.id
          ),
          {
            name,

            updated_at:
              serverTimestamp(),
          }
        );

        /*
         Update cakes using old
         category name.
        */

        const affectedCakes =
          gallery.filter(
            (cake) =>
              cake.category ===
              oldName
          );

        await Promise.all(
          affectedCakes.map(
            (cake) =>
              updateDoc(
                doc(
                  db,
                  'gallery',
                  cake.id
                ),
                {
                  category: name,

                  updated_at:
                    serverTimestamp(),
                }
              )
          )
        );

        setMsg(
          `Category renamed to "${name}".`
        );
      } else {
        const maxSortOrder =
          categoryDocs.reduce(
            (
              highest,
              category
            ) =>
              Math.max(
                highest,
                Number(
                  category.sort_order ||
                    0
                )
              ),
            0
          );

        await addDoc(
          collection(
            db,
            'categories'
          ),
          {
            name,

            sort_order:
              maxSortOrder + 1,

            created_at:
              serverTimestamp(),
          }
        );

        setMsg(
          `Category "${name}" added successfully.`
        );
      }

      cancelCategoryEdit();

      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const startCategoryEdit = (
    category
  ) => {
    setEditCategory(category);

    setCategoryName(
      category.name
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const cancelCategoryEdit = () => {
    setEditCategory(null);
    setCategoryName('');
  };

  const deleteCategory = async (
    category
  ) => {
    const cakesUsingCategory =
      gallery.filter(
        (cake) =>
          cake.category ===
          category.name
      );

    /*
     Prevent deleting a category
     that still contains cakes.
    */

    if (
      cakesUsingCategory.length
    ) {
      setMsg(
        `Cannot delete "${category.name}". ` +
          `${cakesUsingCategory.length} cake${
            cakesUsingCategory.length ===
            1
              ? ''
              : 's'
          } currently ${
            cakesUsingCategory.length ===
            1
              ? 'uses'
              : 'use'
          } this category. ` +
          'Move the cakes to another category first.'
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Delete the category "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setMsg('');

    try {
      await deleteDoc(
        doc(
          db,
          'categories',
          category.id
        )
      );

      setMsg(
        'Category deleted successfully.'
      );

      if (
        editCategory?.id ===
        category.id
      ) {
        cancelCategoryEdit();
      }

      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  /* =========================================
     SPECIALS
  ========================================= */

  const saveSpecial = async (
    e
  ) => {
    e.preventDefault();

    setBusy(true);
    setMsg('');

    try {
      let image_url =
        editSpecial?.image_url ||
        '';

      let image_path =
        editSpecial?.image_path ||
        '';

      if (specialForm.file) {
        const image =
          await uploadImage(
            specialForm.file,
            'specials'
          );

        if (
          editSpecial?.image_path
        ) {
          await removeImage(
            editSpecial.image_path
          );
        }

        image_url =
          image.image_url;

        image_path =
          image.image_path;
      }

      if (!image_url) {
        throw new Error(
          'Please choose an image.'
        );
      }

      const payload = {
        title:
          specialForm.title.trim(),

        price: Number(
          specialForm.price
        ),

        flavour:
          specialForm.flavour.trim(),

        ends_at:
          specialForm.ends_at ||
          '',

        image_url,

        image_path,

        updated_at:
          serverTimestamp(),
      };

      if (editSpecial) {
        await updateDoc(
          doc(
            db,
            'specials',
            editSpecial.id
          ),
          payload
        );

        setMsg(
          'Special updated successfully.'
        );
      } else {
        await addDoc(
          collection(
            db,
            'specials'
          ),
          {
            ...payload,

            created_at:
              serverTimestamp(),
          }
        );

        setMsg(
          'Special added successfully.'
        );
      }

      cancelSpecialEdit();

      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  const startSpecialEdit = (
    item
  ) => {
    setEditSpecial(item);

    setSpecialForm({
      title:
        item.title || '',

      price:
        item.price || '',

      flavour:
        item.flavour || '',

      ends_at:
        item.ends_at || '',

      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const cancelSpecialEdit = () => {
    setEditSpecial(null);

    setSpecialForm({
      title: '',
      price: '',
      flavour: '',
      ends_at: '',
      file: null,
    });
  };

  const deleteSpecial = async (
    item
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${item.title}"?`
      );

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setMsg('');

    try {
      await deleteDoc(
        doc(
          db,
          'specials',
          item.id
        )
      );

      await removeImage(
        item.image_path
      );

      setMsg(
        'Special deleted successfully.'
      );

      if (
        editSpecial?.id ===
        item.id
      ) {
        cancelSpecialEdit();
      }

      await load();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  };

  /* =========================================
     FIREBASE NOT CONFIGURED
  ========================================= */

  if (!isFirebaseConfigured) {
    return (
      <div className="center-page admin-setup">
        <h1>
          Firebase setup required
        </h1>

        <p>
          Add your Firebase web app
          configuration to your{' '}
          <code>.env</code> file.
        </p>
      </div>
    );
  }

  /* =========================================
     LOGIN PAGE
  ========================================= */

  if (!user) {
    return (
      <div className="admin-login-wrap">
        <form
          className="admin-login"
          onSubmit={login}
        >
          <div className="brand">
            <span>MJ</span>

            <div>
              <b>Bakery</b>
              <small>Admin</small>
            </div>
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in with the bakery
            owner account.
          </p>

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />
          </label>

          {msg && (
            <p className="admin-message">
              {msg}
            </p>
          )}

          <button
            className="btn full"
            disabled={busy}
          >
            <LogIn size={18} />

            {busy
              ? 'Signing in...'
              : 'Sign in'}
          </button>

          <a href="/">
            Back to website
          </a>
        </form>
      </div>
    );
  }

  /* =========================================
     ADMIN DASHBOARD
  ========================================= */

  return (
    <div className="admin-shell">
      {/* Sidebar */}

      <aside className="admin-sidebar">
        <div className="brand">
          <span>MJ</span>

          <div>
            <b>Bakery</b>
            <small>Admin</small>
          </div>
        </div>

        <button
          className={
            tab === 'gallery'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('gallery')
          }
        >
          <Images size={17} />
          Cakes
        </button>

        <button
          className={
            tab === 'categories'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('categories')
          }
        >
          <Tags size={17} />
          Categories
        </button>

        <button
          className={
            tab === 'specials'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('specials')
          }
        >
          <BadgePercent size={17} />
          Specials
        </button>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink
            size={16}
          />
          View website
        </a>

        <button
          className="logout"
          onClick={() =>
            signOut(auth)
          }
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      {/* Main */}

      <main className="admin-main">
        <div className="admin-top">
          <div>
            <p className="eyebrow">
              MJ Bakery Delights
            </p>

            <h1>
              {tab === 'gallery' &&
                'Cake Gallery'}

              {tab ===
                'categories' &&
                'Categories'}

              {tab === 'specials' &&
                'Specials'}
            </h1>
          </div>

          <small>
            {user.email}
          </small>
        </div>

        {msg && (
          <p className="admin-message">
            {msg}
          </p>
        )}

        {/* =================================
            CAKES
        ================================= */}

        {tab === 'gallery' && (
          <>
            <form
              className="admin-form"
              onSubmit={saveCake}
            >
              <div className="admin-form-heading">
                <div>
                  <h2>
                    {editCake
                      ? 'Edit cake'
                      : 'Add a cake'}
                  </h2>

                  <p>
                    Add cakes to your
                    public gallery.
                  </p>
                </div>

                {editCake && (
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={
                      cancelCakeEdit
                    }
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="admin-form-grid">
                <label>
                  Cake title

                  <input
                    value={
                      cakeForm.title
                    }
                    onChange={(e) =>
                      setCakeForm({
                        ...cakeForm,
                        title:
                          e.target
                            .value,
                      })
                    }
                    placeholder="e.g. Pink floral birthday cake"
                  />
                </label>

                <label>
                  Category

                  <select
                    value={
                      cakeForm.category
                    }
                    onChange={(e) =>
                      setCakeForm({
                        ...cakeForm,
                        category:
                          e.target
                            .value,
                      })
                    }
                    required
                  >
                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="wide">
                  Cake image

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setCakeForm({
                        ...cakeForm,

                        file:
                          e.target
                            .files?.[0] ||
                          null,
                      })
                    }
                    required={
                      !editCake
                    }
                  />

                  {editCake && (
                    <small>
                      Leave empty to
                      keep the current
                      image.
                    </small>
                  )}
                </label>
              </div>

              <div className="admin-actions">
                <button
                  className="btn"
                  disabled={busy}
                >
                  {editCake ? (
                    <Save
                      size={18}
                    />
                  ) : (
                    <ImagePlus
                      size={18}
                    />
                  )}

                  {busy
                    ? 'Saving...'
                    : editCake
                      ? 'Update cake'
                      : 'Add cake'}
                </button>

                {editCake && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={
                      cancelCakeEdit
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {gallery.map(
                (item) => (
                  <article
                    key={item.id}
                    className="admin-row"
                  >
                    <img
                      src={
                        item.image_url
                      }
                      alt={
                        item.title ||
                        item.category
                      }
                    />

                    <div>
                      <small>
                        {
                          item.category
                        }
                      </small>

                      <h3>
                        {item.title ||
                          'Custom creation'}
                      </h3>
                    </div>

                    <div className="admin-actions">
                      <button
                        onClick={() =>
                          startCakeEdit(
                            item
                          )
                        }
                      >
                        <Pencil
                          size={17}
                        />
                        Edit
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          deleteCake(
                            item
                          )
                        }
                      >
                        <Trash2
                          size={17}
                        />
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}

              {!gallery.length && (
                <div className="empty">
                  <p>
                    No cakes have
                    been added yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* =================================
            CATEGORIES
        ================================= */}

        {tab === 'categories' && (
          <>
            <form
              className="admin-form"
              onSubmit={
                saveCategory
              }
            >
              <div className="admin-form-heading">
                <div>
                  <h2>
                    {editCategory
                      ? 'Rename category'
                      : 'Add category'}
                  </h2>

                  <p>
                    Categories appear
                    as filters on the
                    cake gallery.
                  </p>
                </div>
              </div>

              <div className="admin-form-grid">
                <label className="wide">
                  Category name

                  <input
                    value={
                      categoryName
                    }
                    onChange={(e) =>
                      setCategoryName(
                        e.target
                          .value
                      )
                    }
                    placeholder="e.g. Baby Shower Cakes"
                    required
                  />
                </label>
              </div>

              <div className="admin-actions">
                <button
                  className="btn"
                  disabled={busy}
                >
                  {editCategory ? (
                    <Save
                      size={18}
                    />
                  ) : (
                    <Plus
                      size={18}
                    />
                  )}

                  {busy
                    ? 'Saving...'
                    : editCategory
                      ? 'Save category'
                      : 'Add category'}
                </button>

                {editCategory && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={
                      cancelCategoryEdit
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {categoryDocs.map(
                (category) => {
                  const cakeCount =
                    gallery.filter(
                      (cake) =>
                        cake.category ===
                        category.name
                    ).length;

                  return (
                    <article
                      key={
                        category.id
                      }
                      className="admin-row category-row"
                    >
                      <div className="category-icon">
                        <Tags
                          size={20}
                        />
                      </div>

                      <div>
                        <h3>
                          {
                            category.name
                          }
                        </h3>

                        <small>
                          {cakeCount}{' '}
                          {cakeCount ===
                          1
                            ? 'cake'
                            : 'cakes'}
                        </small>
                      </div>

                      <div className="admin-actions">
                        <button
                          onClick={() =>
                            startCategoryEdit(
                              category
                            )
                          }
                        >
                          <Pencil
                            size={17}
                          />
                          Rename
                        </button>

                        <button
                          className="danger"
                          onClick={() =>
                            deleteCategory(
                              category
                            )
                          }
                        >
                          <Trash2
                            size={17}
                          />
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                }
              )}

              {!categoryDocs.length && (
                <div className="empty">
                  <h3>
                    No Firebase
                    categories yet.
                  </h3>

                  <p>
                    Add your first
                    category above.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* =================================
            SPECIALS
        ================================= */}

        {tab === 'specials' && (
          <>
            <form
              className="admin-form"
              onSubmit={
                saveSpecial
              }
            >
              <div className="admin-form-heading">
                <div>
                  <h2>
                    {editSpecial
                      ? 'Edit special'
                      : 'Add a special'}
                  </h2>

                  <p>
                    Add limited-time
                    bakery offers.
                  </p>
                </div>
              </div>

              <div className="admin-form-grid">
                <label>
                  Title

                  <input
                    required
                    value={
                      specialForm.title
                    }
                    onChange={(e) =>
                      setSpecialForm({
                        ...specialForm,

                        title:
                          e.target
                            .value,
                      })
                    }
                  />
                </label>

                <label>
                  Price

                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={
                      specialForm.price
                    }
                    onChange={(e) =>
                      setSpecialForm({
                        ...specialForm,

                        price:
                          e.target
                            .value,
                      })
                    }
                  />
                </label>

                <label>
                  Flavour

                  <input
                    value={
                      specialForm.flavour
                    }
                    onChange={(e) =>
                      setSpecialForm({
                        ...specialForm,

                        flavour:
                          e.target
                            .value,
                      })
                    }
                  />
                </label>

                <label>
                  End date

                  <input
                    type="date"
                    value={
                      specialForm.ends_at
                    }
                    onChange={(e) =>
                      setSpecialForm({
                        ...specialForm,

                        ends_at:
                          e.target
                            .value,
                      })
                    }
                  />
                </label>

                <label className="wide">
                  Image{' '}

                  {editSpecial &&
                    '(leave empty to keep current image)'}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setSpecialForm({
                        ...specialForm,

                        file:
                          e.target
                            .files?.[0] ||
                          null,
                      })
                    }
                    required={
                      !editSpecial
                    }
                  />
                </label>
              </div>

              <div className="admin-actions">
                <button
                  className="btn"
                  disabled={busy}
                >
                  {editSpecial ? (
                    <Save
                      size={18}
                    />
                  ) : (
                    <Plus
                      size={18}
                    />
                  )}

                  {busy
                    ? 'Saving...'
                    : editSpecial
                      ? 'Update special'
                      : 'Add special'}
                </button>

                {editSpecial && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={
                      cancelSpecialEdit
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {specials.map(
                (item) => (
                  <article
                    key={item.id}
                    className="admin-row"
                  >
                    <img
                      src={
                        item.image_url
                      }
                      alt={
                        item.title
                      }
                    />

                    <div>
                      <small>
                        {item.flavour ||
                          'Custom flavour'}

                        {' • '}

                        {money(
                          item.price
                        )}

                        {item.ends_at
                          ? ` • Ends ${fmtDate(
                              item.ends_at
                            )}`
                          : ''}
                      </small>

                      <h3>
                        {item.title}
                      </h3>
                    </div>

                    <div className="admin-actions">
                      <button
                        onClick={() =>
                          startSpecialEdit(
                            item
                          )
                        }
                      >
                        <Pencil
                          size={17}
                        />
                        Edit
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          deleteSpecial(
                            item
                          )
                        }
                      >
                        <Trash2
                          size={17}
                        />
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}

              {!specials.length && (
                <div className="empty">
                  <p>
                    No specials yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}