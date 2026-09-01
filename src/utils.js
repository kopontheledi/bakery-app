import { BUSINESS } from './config';
export const waLink = (message) => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
export const money = (n) => new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:0}).format(Number(n||0));
export const fmtDate = (d) => d ? new Date(`${d}T12:00:00`).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'}) : '';
