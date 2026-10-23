import { Redis } from '@upstash/redis';

// Vercel can name the variables with a custom prefix (e.g. STORAGE_KV_REST_API_URL), so match by suffix too.
const find = (...patterns) => {
  for (const p of patterns) {
    const k = Object.keys(process.env).find((n) => p.test(n) && process.env[n]);
    if (k) return process.env[k].trim();
  }
  return undefined;
};

const url = find(/^KV_REST_API_URL$/, /^UPSTASH_REDIS_REST_URL$/, /REST_API_URL$/, /REDIS_REST_URL$/);
const token = find(/^KV_REST_API_TOKEN$/, /^UPSTASH_REDIS_REST_TOKEN$/, /REST_API_TOKEN$/, /REDIS_REST_TOKEN$/);

export const redisInfo = { urlFound: !!url, tokenFound: !!token };
export const redis = new Redis({ url, token });

export async function listArticles(includeDrafts = false) {
  try {
    const ids = await redis.zrange('articles', 0, -1, { rev: true });
    if (!ids.length) return [];
    const items = await redis.mget(...ids.map((i) => `article:${i}`));
    return items.filter(Boolean).filter((a) => includeDrafts || a.published);
  } catch (e) {
    console.error('DB error', e);
    return [];
  }
}

export const getArticle = (id) => redis.get(`article:${id}`);
