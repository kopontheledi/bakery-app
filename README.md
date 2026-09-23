# MJ Bakery Delights — Firebase version

React + Vite website using Firebase Authentication, Cloud Firestore and Firebase Storage. No Supabase code or package is included.

## 1. Remove Supabase from your existing project

Run:

```bash
npm uninstall @supabase/supabase-js
```

Then delete `src/supabase.js` and `supabase.sql` if they still exist.

## 2. Install Firebase

```bash
npm install firebase
```

Or use this clean project and run:

```bash
npm install
npm run dev
```

## 3. Create Firebase project

In Firebase Console:
1. Create a project.
2. Add a Web App.
3. Enable Authentication > Sign-in method > Email/Password.
4. Create the bakery owner's Auth user.
5. Create a Cloud Firestore database.
6. Create Firebase Storage.
7. Copy the Web App config values into `.env` using `.env.example`.

## 4. Make the owner the only admin

After creating the owner's Firebase Authentication user, copy their UID.

In Firestore create:

```text
admins
  └── OWNER_FIREBASE_UID
      └── email: mjbakery23@gmail.com
```

The document ID must be the exact Firebase Auth UID.

## 5. Categories

Create the `categories` collection with documents containing:

```text
name: Wedding Cakes
sort_order: 1
```

Suggested values are in `src/config.js`.

## 6. Security rules

Copy `firestore.rules` into Firestore Rules and publish.
Copy `storage.rules` into Storage Rules and publish.

## 7. Environment

Copy `.env.example` to `.env` and fill in the Firebase Web App values.

## 8. Admin

Open `/admin`, sign in with the Firebase owner account, and add cakes/specials.
