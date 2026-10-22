export function clean(b) {
  const s = (v, n) => String(v ?? '').slice(0, n);
  return {
    title: s(b.title, 200).trim(), dek: s(b.dek, 400), category: s(b.category, 60) || 'Research',
    cover: /^\/api\/img\/[a-z0-9]+$/.test(b.cover || '') ? b.cover : '',
    body: s(b.body, 100000), published: !!b.published,
  };
}
