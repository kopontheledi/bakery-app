export const BUSINESS = {
  name: 'MJ Bakery Delights',
  phoneDisplay: '076 9696 703',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '27769696703',
  email: 'mjbakery23@gmail.com',
  facebook: 'https://www.facebook.com/share/1LdsWFVv7k/',
  instagram: '#',
  tiktok: '#',
  hours: [
    ['Monday – Friday', '08:00 – 17:00'],
    ['Saturday', '08:00 – 15:00'],
    ['Sunday', 'By appointment']
  ],
  mapsEmbedUrl: import.meta.env.VITE_MAPS_EMBED_URL || ''
};
export const DEFAULT_CATEGORIES = ['Wedding Cakes','Party Cakes','Character Cakes','Celebration Cakes','Bento Cakes','Cupcakes','Cupcake Bouquets','Bento + Cupcake Boxes'];
export const FLAVOURS = ['Vanilla','Chocolate','Red Velvet','Carrot','Lemon','Funfetti','Cookies & Cream','Other / Please advise'];
export const SIZES = ['Bento / Mini','6 inch','8 inch','10 inch','12 inch','2-tier','3-tier','Cupcakes only','Custom / Not sure'];
