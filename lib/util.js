export const readTime = (t = '') =>
  Math.max(1, Math.round(String(t).split(/\s+/).filter(Boolean).length / 200));
