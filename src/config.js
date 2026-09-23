export const BUSINESS = {
  name: 'MJ Bakery Delights',
  phoneDisplay: '076 9696 703',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '27769696703',
  email: 'mjbakery23@gmail.com',
  facebook: 'https://www.facebook.com/share/1LdsWFVv7k/',
  instagram: '#',
  tiktok: '#',
  whatsappCatalogue: import.meta.env.VITE_WHATSAPP_CATALOGUE_URL || '',
  hours: [
    ['Monday', '08:00 – 17:00'],
    ['Tuesday', '08:00 – 17:00'],
    ['Wednesday', '08:00 – 17:00'],
    ['Thursday', '08:00 – 17:00'],
    ['Friday', '08:00 – 17:00'],
    ['Saturday', '08:00 – 15:00'],
    ['Sunday', 'By appointment'],
  ],
  mapsEmbedUrl:
    import.meta.env.VITE_MAPS_EMBED_URL ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.8025740395137!2d27.259145500000002!3d-25.611475799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebe0b4fa436db17%3A0xfb81c4dd681524c!2sMJ%20Bakery%20Delights!5e0!3m2!1sen!2sza!4v1788248658971!5m2!1sen!2sza',
};

export const DEFAULT_CATEGORIES = [
  'Wedding Cakes',
  'Party Cakes',
  'Character Cakes',
  'Celebration Cakes',
  'Bento Cakes',
  'Cupcakes',
  'Cupcake Bouquets',
  'Bento + Cupcake Boxes',
];

export const ORDER_TYPES = [
  'Birthday Cake',
  'Wedding Cake',
  'Celebration Cake',
  'Character Cake',
  'Bento Cake',
  'Cupcakes',
  'Cupcake Bouquet',
  'Bento Cake + Cupcakes',
  'Other',
];

export const FLAVOURS = [
  'Vanilla',
  'Chocolate',
  'Red Velvet',
  'Carrot',
  'Lemon',
  'Funfetti',
  'Cookies & Cream',
  'Other / Please advise',
];

export const SIZES = [
  'Bento / Mini',
  '6 inch',
  '8 inch',
  '10 inch',
  '12 inch',
  '2-tier',
  '3-tier',
  'Cupcakes only',
  'Custom / Not sure',
];

export const COLLECTION_TIMES = [
  '08:00 – 10:00',
  '10:00 – 12:00',
  '12:00 – 14:00',
  '14:00 – 16:00',
  '16:00 – 17:00',
  'To be arranged',
];
