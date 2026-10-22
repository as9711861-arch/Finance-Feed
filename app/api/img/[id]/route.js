import { redis } from '@/lib/db';

export async function GET(_req, { params }) {
  const { id } = await params;
  const d = await redis.get(`img:${id}`);
  if (!d) return new Response('Not found', { status: 404 });
  const [head, b64] = String(d).split(',');
  return new Response(Buffer.from(b64, 'base64'), {
    headers: {
      'Content-Type': head.match(/data:(.*?);/)[1],
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
