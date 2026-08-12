export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  return isLocal ? 'http://localhost:8080' : 'https://api.ariadneg.com';
};

export const API_URL = getApiUrl();
