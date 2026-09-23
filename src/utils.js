import { BUSINESS } from './config';

export const waLink = (message) => {
  const number = BUSINESS.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const money = (value) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const fmtDate = (date) => {
  if (!date) return '';
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
