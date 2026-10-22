import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
