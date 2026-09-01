# MJ Bakery Delights Website + CMS

A responsive React + Supabase bakery website with a private admin CMS, category-based cake gallery, current specials, WhatsApp quote flow, contact details, Google Maps embed area and an Elfsight reviews placeholder.

## Included

- Home page with premium MJ gold/cream branding, calls to action and Elfsight review section.
- Cakes gallery filtered by categories.
- WhatsApp enquiry button on every cake image.
- Specials page with title, image, price, flavour and end date.
- Contact/quote form that builds a detailed WhatsApp message including customer name + WhatsApp number, order type, flavour, cake size, collection date, inspiration link and description.
- Google Maps embed slot.
- Secure `/admin` login using Supabase Auth.
- Admin can add/delete gallery cakes and add/edit/delete specials.
- Supabase Storage for uploaded cake images.
- Row Level Security based on an `admins` table.

## Setup (about 10 minutes)

1. Create a free Supabase project.
2. Open **SQL Editor**, paste all of `supabase.sql`, and run it.
3. In **Authentication → Users**, create the bakery owner user with email + password.
4. In SQL Editor run:

   `insert into public.admins(email) values ('THE_OWNER_EMAIL');`

5. Copy `.env.example` to `.env` and add the Supabase Project URL + anon key. Put the same owner email in `VITE_ADMIN_EMAIL`.
6. Keep `VITE_WHATSAPP_NUMBER=27769696703` unless the business number changes.
7. On Google Maps, find the bakery, choose **Share → Embed a map**, copy the URL inside `src="..."`, and place it in `VITE_MAPS_EMBED_URL`.
8. For Elfsight Google Reviews, create the widget in Elfsight. You can paste their embed script into `index.html` and replace the placeholder area in `src/pages/Home.jsx`. The project deliberately leaves this as a safe placeholder because the actual Elfsight App ID is unique to the bakery account.
9. Run:

   `npm install`
   `npm run dev`

10. Website routes: `/`, `/cakes`, `/specials`, `/contact`. Admin is `/admin`.

## Deploy

This is Vite/React and can be deployed to Netlify, Vercel or Cloudflare Pages. Build command: `npm run build`. Publish directory: `dist`.

For Netlify SPA routing, add a `_redirects` file under `public` with: `/* /index.html 200`.

## Business details already added

Phone / WhatsApp: 076 9696 703
Email: mjbakery23@gmail.com
Facebook: the link supplied for MJ Bakery Delights.

Working hours are starter values in `src/config.js` and can be changed once the bakery confirms the exact hours. Instagram/TikTok are placeholders until the final profile URLs are supplied.

## Adding more categories later

Add the category in the Supabase `categories` table. It will automatically appear in the gallery filter and admin upload form. You can also add a small category-management form later without changing the database design.
